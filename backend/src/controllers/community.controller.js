import store from "../models/index.js";
import mongoose from "mongoose";
import { addPoints } from "../services/points.service.js";

export const getPosts = async (req, res) => {
    try {
        const userId = req.user?.id;
        const posts = await store.post.find()
            .populate('authorId', 'username firstName lastName email')
            .sort({ createdAt: -1 })
            .lean();
        
        let userLikedIds = [];
        if (userId) {
            const user = await store.user.findById(userId).select('likedPostIds');
            userLikedIds = user?.likedPostIds?.map(id => id.toString()) || [];
        }

        // Add counts and isLiked status
        const postsWithStatus = posts.map(post => ({
            ...post,
            id: post._id,
            isLiked: userLikedIds.includes(post._id.toString()),
            _count: { 
                comments: post.commentsCount || 0, 
                likes: post.likesCount || 0 
            }
        }));

        res.json(postsWithStatus);
    } catch (error) {
        console.error("Get posts error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createPost = async (req, res) => {
    const { type, category, title, content, headline, initialState, currentState, duration, tags, isAnonymous } = req.body;

    try {
        const post = await store.post.create({
            type,
            category,
            title,
            content,
            headline,
            initialState,
            currentState,
            duration,
            tags: tags || [],
            isAnonymous: isAnonymous || false,
            authorId: req.user.id
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await store.post.findById(id)
            .populate('authorId', 'username firstName lastName email')
            .lean();
        
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comments = await store.comment.find({ postId: id })
            .populate('userId', 'username firstName lastName')
            .sort({ createdAt: 1 });
        
        res.json({
            ...post,
            id: post._id,
            comments,
            _count: { 
                likes: post.likesCount || 0,
                comments: post.commentsCount || 0
            }
        });
    } catch (error) {
        console.error("Get post error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addComment = async (req, res) => {
    try {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user?.id;

        if (!postId || !text || !userId) {
            return res.status(400).json({ message: "Missing postId, text, or userId" });
        }

        const comment = await store.comment.create({
            text,
            postId,
            userId: userId
        });

        await store.post.findByIdAndUpdate(postId, { $inc: { commentsCount: 1 } });

        // Add points for commenting
        await addPoints(userId, "COMMENT", comment._id);

        const updatedUser = await store.user.findById(userId);

        return res.status(201).json({
            comment,
            user: updatedUser ? {
                points: updatedUser.points,
                streak: updatedUser.streak,
                badges: updatedUser.badges
            } : null
        });
    } catch (error) {
        console.error("EXPLICIT ERROR in addComment:", error);
        return res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: error.stack 
        });
    }
};

export const toggleLikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        console.log("Toggle Like - Input:", { postId, userId });

        if (!postId || !userId) {
            return res.status(400).json({ message: "Missing postId or userId" });
        }

        if (!mongoose.Types.ObjectId.isValid(postId)) {
            return res.status(400).json({ message: "Invalid postId format" });
        }

        const pId = new mongoose.Types.ObjectId(postId);
        const uId = new mongoose.Types.ObjectId(userId);

        console.log("Checking for existing like...");
        const existingLike = await store.like.findOne({ 
            targetId: pId, 
            userId: uId, 
            targetType: "POST" 
        });

        if (existingLike) {
            console.log("Found existing like:", existingLike._id);
            await store.like.findByIdAndDelete(existingLike._id);
            await store.post.findByIdAndUpdate(pId, { $inc: { likesCount: -1 } });
            
            // Deduct points for unliking
            console.log("Deducting points for unlike");
            await addPoints(uId, "UNLIKE_POST", existingLike._id);

            // Remove from User.likedPostIds
            await store.user.findByIdAndUpdate(uId, { $pull: { likedPostIds: pId } });

            const updatedUser = await store.user.findById(uId);
            console.log("Like removed. User points:", updatedUser?.points);

            return res.json({ 
                liked: false, 
                user: updatedUser ? {
                    points: updatedUser.points,
                    streak: updatedUser.streak,
                    badges: updatedUser.badges,
                    likedPostIds: updatedUser.likedPostIds
                } : null
            });
        } else {
            console.log("Creating new like...");
            const newLike = await store.like.create({ 
                targetId: pId, 
                userId: uId, 
                targetType: "POST" 
            });

            console.log("New like created:", newLike._id);
            await store.post.findByIdAndUpdate(pId, { $inc: { likesCount: 1 } });
            
            // Add points for liking
            console.log("Awarding points for like");
            await addPoints(uId, "LIKE_POST", newLike._id);

            // Add to User.likedPostIds
            await store.user.findByIdAndUpdate(uId, { $addToSet: { likedPostIds: pId } });

            const updatedUser = await store.user.findById(uId);
            console.log("Like added. User points:", updatedUser?.points);

            return res.json({ 
                liked: true, 
                user: updatedUser ? {
                    points: updatedUser.points,
                    streak: updatedUser.streak,
                    badges: updatedUser.badges,
                    likedPostIds: updatedUser.likedPostIds
                } : null
            });
        }
    } catch (error) {
        console.error("EXPLICIT ERROR in toggleLikePost:", error);
        return res.status(500).json({ 
            message: "Internal server error",
            error: error.message,
            stack: error.stack 
        });
    }
};

export const toggleSavePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        if (!postId || !userId) {
            return res.status(400).json({ message: "Missing postId or userId" });
        }

        const user = await store.user.findById(userId);
        const isSaved = user.savedPostIds.includes(postId);
        
        const update = isSaved 
            ? { $pull: { savedPostIds: postId } } 
            : { $addToSet: { savedPostIds: postId } };
            
        await store.user.findByIdAndUpdate(userId, update);
        
        // Award points for saving
        await addPoints(userId, isSaved ? "UNSAVE_POST" : "SAVE_POST", postId);

        const updatedUser = await store.user.findById(userId);
        res.json({ 
            message: "Save status updated", 
            saved: !isSaved,
            user: { points: updatedUser.points, badges: updatedUser.badges }
        });
    } catch (error) {
        console.error("Save toggle error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const joinChallenge = async (req, res) => {
    try {
        const { id } = req.params; // Challenge ID
        const userId = req.user?.id;

        if (!id || !userId) return res.status(400).json({ message: "Missing data" });

        // Update user: add to joined challenges
        await store.user.findByIdAndUpdate(userId, {
            $addToSet: { challengesJoined: id }
        });

        // Award points (+5)
        // Use a deterministic ID for the pointLog reference
        const refId = new mongoose.Types.ObjectId(id.padStart(24, '0').slice(-24));
        await addPoints(userId, "JOIN_CHALLENGE", refId);

        const updatedUser = await store.user.findById(userId);
        res.json({
            message: "Joined challenge",
            user: { 
                points: updatedUser.points, 
                badges: updatedUser.badges,
                challengesJoined: updatedUser.challengesJoined 
            }
        });
    } catch (error) {
        console.error("Join challenge error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logChallengeDay = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!id || !userId) return res.status(400).json({ message: "Missing data" });

        // Increment progress in the Map
        const user = await store.user.findById(userId);
        const currentProgress = user.challengeProgress.get(id) || 0;
        user.challengeProgress.set(id, currentProgress + 1);
        await user.save();

        // Award points (+10)
        const refId = new mongoose.Types.ObjectId(id.padStart(24, '0').slice(-24));
        await addPoints(userId, "LOG_CHALLENGE_DAY", refId);

        const updatedUser = await store.user.findById(userId);
        res.json({
            message: "Day logged",
            user: { 
                points: updatedUser.points, 
                badges: updatedUser.badges,
                challengeProgress: updatedUser.challengeProgress 
            }
        });
    } catch (error) {
        console.error("Log day error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const awardPoints = async (req, res) => {
    try {
        const { actionType, referenceId } = req.body;
        const userId = req.user?.id;

        if (!actionType || !referenceId || !userId) {
            return res.status(400).json({ message: "Missing actionType or referenceId" });
        }

        await addPoints(userId, actionType, referenceId);
        
        const updatedUser = await store.user.findById(userId);
        res.json({
            message: "Points awarded",
            user: { 
                points: updatedUser.points, 
                badges: updatedUser.badges,
                streak: updatedUser.streak
            }
        });
    } catch (error) {
        console.error("Award points error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
