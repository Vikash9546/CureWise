import store from "../models/index.js";
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
                },
                category: true,
                tags: {
                    include: { tag: true }
                },
                comments: {
                    where: { parentId: null },
                    include: {
                        user: { select: { username: true, firstName: true } },
                        replies: {
                            include: {
                                user: { select: { username: true, firstName: true } }
                            }
                        }
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

        return res.status(201).json({
            comment,
            user: null
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

        const post = await store.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
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

            likedPostIds = likedPostIds.filter(id => id !== postId);
            const updatedUser = await store.user.update({
                where: { id: userId },
                data: { likedPostIds }
            });

            return res.json({ 
                liked: false, 
                user: updatedUser ? {
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
                    likedPostIds: updatedUser.likedPostIds
                } : null
            });
        }
    } catch (error) {
        if (error.code === 'P2002') {
            // Unique constraint violation (likely double-clicked)
            // Just return success since the like already exists
            return res.json({ liked: true });
        }
        
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
        
        res.json({ 
            message: "Save status updated", 
            saved: !isSaved,
            user: {}
        });
    } catch (error) {
        console.error("Save toggle error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

