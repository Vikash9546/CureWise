import prisma from "../utils/prisma";

export const getPosts = async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                _count: {
                    select: { comments: true, likes: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const createPost = async (req, res) => {
    const { type, category, title, content, headline, initialState, currentState, duration, tags, isAnonymous } = req.body;

    try {
        const post = await prisma.post.create({
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
        const post = await prisma.post.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        username: true,
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                },
                comments: {
                    include: {
                        author: {
                            select: {
                                id: true,
                                username: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                _count: {
                    select: { likes: true }
                }
            }
        });
        if (!post) return res.status(404).json({ message: "Post not found" });
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addComment = async (req, res) => {
    const { postId } = req.params;
    const { text, isStory } = req.body;

    try {
        const comment = await prisma.comment.create({
            data: {
                text,
                isStory: isStory || false,
                postId,
                authorId: req.user.id
            }
        });
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

export const toggleLikePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const existingLike = await prisma.like.findFirst({
            where: { postId, userId }
        });

        if (existingLike) {
            await prisma.like.delete({ where: { id: existingLike.id } });
            await prisma.post.update({
                where: { id: postId },
                data: { likesCount: { decrement: 1 } }
            });
            await prisma.user.update({
                where: { id: userId },
                data: { likedPostIds: { set: (await prisma.user.findUnique({ where: { id: userId } }))?.likedPostIds.filter(id => id !== postId) } }
            });
            res.json({ liked: false });
        } else {
            await prisma.like.create({
                data: { postId, userId }
            });
            await prisma.post.update({
                where: { id: postId },
                data: { likesCount: { increment: 1 } }
            });
            await prisma.user.update({
                where: { id: userId },
                data: { likedPostIds: { push: postId } }
            });
            res.json({ liked: true });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
export const toggleSavePost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isSaved = user.savedPostIds.includes(postId);
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                savedPostIds: isSaved
                    ? { set: user.savedPostIds.filter(id => id !== postId) }
                    : { push: postId }
            }
        });

        res.json({ saved: !isSaved });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};
