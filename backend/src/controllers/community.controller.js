import store from "../models/index.js";
import { addPoints } from "../services/points.service.js";

export const getPosts = async (req, res) => {
    try {
        const userId = req.user?.id;
        const posts = await store.post.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: {
                        username: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        
        let userLikedIds = [];
        if (userId) {
            const user = await store.user.findUnique({
                where: { id: userId },
                select: { likedPostIds: true }
            });
            userLikedIds = Array.isArray(user?.likedPostIds) ? user.likedPostIds : [];
        }

        const postsWithStatus = posts.map(post => {
            const authorData = post.author;
            const mappedPost = {
                ...post,
                authorId: authorData,
            };
            delete mappedPost.author;

            return {
                ...mappedPost,
                id: post.id,
                isLiked: userLikedIds.includes(post.id),
                _count: { 
                    comments: post.commentsCount || 0, 
                    likes: post.likesCount || 0 
                }
            };
        });

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
            data: {
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
            }
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getPostById = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await store.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        username: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });
        
        if (!post) return res.status(404).json({ message: "Post not found" });

        const comments = await store.comment.findMany({
            where: { postId: id },
            include: {
                user: {
                    select: {
                        username: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        const mappedComments = comments.map(c => {
            const userData = c.user;
            const mappedComment = {
                ...c,
                userId: userData
            };
            delete mappedComment.user;
            return mappedComment;
        });

        const authorData = post.author;
        const mappedPost = {
            ...post,
            id: post.id,
            authorId: authorData,
            comments: mappedComments,
            _count: { 
                likes: post.likesCount || 0,
                comments: post.commentsCount || 0
            }
        };
        delete mappedPost.author;

        res.json(mappedPost);
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
            data: {
                text,
                postId,
                userId: userId
            }
        });

        await store.post.update({
            where: { id: postId },
            data: { commentsCount: { increment: 1 } }
        });

        // Add points for commenting
        await addPoints(userId, "COMMENT", comment.id);

        const updatedUser = await store.user.findUnique({ where: { id: userId } });

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
            error: error.message
        });
    }
};

export const toggleLikePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user?.id;

        if (!postId || !userId) {
            return res.status(400).json({ message: "Missing postId or userId" });
        }

        const existingLike = await store.postLike.findUnique({
            where: {
                userId_postId: {
                    userId,
                    postId
                }
            }
        });

        const user = await store.user.findUnique({ where: { id: userId } });
        let likedPostIds = Array.isArray(user?.likedPostIds) ? user.likedPostIds : [];

        if (existingLike) {
            await store.postLike.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId
                    }
                }
            });

            await store.post.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } }
            });
            
            await addPoints(userId, "UNLIKE_POST", postId);

            likedPostIds = likedPostIds.filter(id => id !== postId);
            const updatedUser = await store.user.update({
                where: { id: userId },
                data: { likedPostIds }
            });

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
            await store.postLike.create({
                data: {
                    userId,
                    postId
                }
            });

            await store.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } }
            });
            
            await addPoints(userId, "LIKE_POST", postId);

            if (!likedPostIds.includes(postId)) {
                likedPostIds.push(postId);
            }
            const updatedUser = await store.user.update({
                where: { id: userId },
                data: { likedPostIds }
            });

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
            error: error.message
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

        const user = await store.user.findUnique({ where: { id: userId } });
        let savedPostIds = Array.isArray(user?.savedPostIds) ? user.savedPostIds : [];
        const isSaved = savedPostIds.includes(postId);
        
        if (isSaved) {
            savedPostIds = savedPostIds.filter(id => id !== postId);
        } else {
            savedPostIds.push(postId);
        }
            
        const updatedUser = await store.user.update({
            where: { id: userId },
            data: { savedPostIds }
        });
        
        await addPoints(userId, isSaved ? "UNSAVE_POST" : "SAVE_POST", postId);

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
        const { id } = req.params;
        const userId = req.user?.id;

        if (!id || !userId) return res.status(400).json({ message: "Missing data" });

        const user = await store.user.findUnique({ where: { id: userId } });
        let challengesJoined = Array.isArray(user?.challengesJoined) ? user.challengesJoined : [];

        if (!challengesJoined.includes(id)) {
            challengesJoined.push(id);
        }

        const challenge = await store.challenge.findUnique({ where: { id } });
        if (!challenge) {
            await store.challenge.create({
                data: {
                    id,
                    title: `Challenge #${id}`,
                    description: "Seeded challenge",
                    durationDays: 30,
                    points: 50
                }
            });
        }

        await store.userChallenge.upsert({
            where: {
                userId_challengeId: {
                    userId,
                    challengeId: id
                }
            },
            update: {},
            create: {
                userId,
                challengeId: id
            }
        });

        const updatedUser = await store.user.update({
            where: { id: userId },
            data: { challengesJoined }
        });

        await addPoints(userId, "JOIN_CHALLENGE", id);

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

        const user = await store.user.findUnique({ where: { id: userId } });
        const challengeProgress = (user?.challengeProgress && typeof user.challengeProgress === 'object') ? { ...user.challengeProgress } : {};
        const currentProgress = challengeProgress[id] || 0;
        challengeProgress[id] = currentProgress + 1;

        await store.userChallenge.upsert({
            where: {
                userId_challengeId: {
                    userId,
                    challengeId: id
                }
            },
            update: {
                daysCompleted: currentProgress + 1
            },
            create: {
                userId,
                challengeId: id,
                daysCompleted: currentProgress + 1
            }
        });

        const updatedUser = await store.user.update({
            where: { id: userId },
            data: { challengeProgress }
        });

        await addPoints(userId, "LOG_CHALLENGE_DAY", id);

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
        
        const updatedUser = await store.user.findUnique({ where: { id: userId } });
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
