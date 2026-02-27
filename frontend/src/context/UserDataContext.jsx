import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api';

// ── Badge definitions ──────────────────────────────────────────
export const BADGE_DEFS = [
    { id: 'beginner', icon: '🌱', label: 'Beginner', desc: 'Join the community', minPoints: 0, auto: true },
    { id: 'explorer', icon: '🌿', label: 'Wellness Explorer', desc: 'Earn 200+ points', minPoints: 200, auto: true },
    { id: 'mentor', icon: '🌳', label: 'Nature Mentor', desc: 'Earn 800+ points', minPoints: 800, auto: true },
    { id: 'healer', icon: '🏆', label: 'Community Healer', desc: 'Earn 2000+ points', minPoints: 2000, auto: true },
    { id: 'storyteller', icon: '📖', label: 'Storyteller', desc: 'Share your healing path', minPoints: 0, auto: false },
    { id: 'connector', icon: '🤝', label: 'Connector', desc: 'Start 1 community discussion', minPoints: 0, auto: false },
    { id: 'helper', icon: '💬', label: 'Helper', desc: 'Post 5+ comments', minPoints: 0, auto: false },
    { id: 'streak7', icon: '🔥', label: '7-Day Streak', desc: 'Maintain a 7-day streak', minPoints: 0, auto: false },
    { id: 'streak30', icon: '⚡', label: '30-Day Champion', desc: 'Maintain a 30-day streak', minPoints: 0, auto: false },
    { id: 'challenger', icon: '🎯', label: 'Challenger', desc: 'Join your first challenge', minPoints: 0, auto: false },
    { id: 'overcomer', icon: '🥇', label: 'Overcomer', desc: 'Complete a full challenge', minPoints: 0, auto: false },
    { id: 'heartgiver', icon: '❤️', label: 'Heart Giver', desc: 'Like 10+ posts', minPoints: 0, auto: false },
];

// ── Point rewards ──────────────────────────────────────────────
export const POINTS = {
    LIKE_POST: 2,
    UNLIKE_POST: -2,
    SAVE_POST: 3,
    UNSAVE_POST: -3,
    POST_COMMENT: 5,
    CREATE_DISCUSSION: 10,
    SHARE_STORY: 15,
    JOIN_CHALLENGE: 5,
    LOG_CHALLENGE_DAY: 10,
    COMPLETE_CHALLENGE: 50,
    DAILY_STREAK: 5,
};

const DEFAULT_PROFILE = {
    points: 0,
    streak: 0,
    lastStreakDate: null,
    badges: ['beginner'],
    challengesJoined: [],
    challengesCompleted: [],
    challengeProgress: {},
    likedPosts: [],
    likedComments: [],
    savedPosts: [],
    myStories: [],
    myDiscussions: [],
    myComments: [],
    assessment: null,
    activePlan: null,
    dailyLogs: {},
    customHabits: [],
    registeredEvents: [],
};

const UserDataContext = createContext(null);

export function UserDataProvider({ children }) {
    const { user, login } = useAuth();
    const userId = user?.id || user?._id || null;

    const [profile, setProfileState] = useState(DEFAULT_PROFILE);
    const [newBadges, setNewBadges] = useState([]);

    // Sync profile when user changes
    useEffect(() => {
        if (!user) {
            setProfileState(DEFAULT_PROFILE);
            return;
        }
        setProfileState(prev => ({
            ...prev,
            points: user.points || 0,
            streak: user.streak || 0,
            badges: user.badges || ['beginner'],
            lastStreakDate: user.lastStreakDate,
            likedPosts: user.likedPostIds || [],
            savedPosts: user.savedPostIds || [],
            registeredEvents: user.registeredEvents || [],
        }));
    }, [user]);

    // Persist to backend and update local state
    const persist = useCallback(async (updater) => {
        if (!userId) return;

        const prev = profile;
        const next = typeof updater === 'function' ? updater(prev) : updater;

        // Auto-award points-based badges locally (backend should also do this, but for UI feedback)
        const earned = [...(next.badges || [])];
        BADGE_DEFS.filter(b => b.auto && !earned.includes(b.id) && next.points >= b.minPoints)
            .forEach(b => {
                earned.push(b.id);
                setNewBadges(nb => [...nb, b]);
                setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== b.id)), 2000);
            });

        const final = { ...next, badges: earned };
        setProfileState(final);

        // Sync to backend
        try {
            const { data } = await api.put('/auth/profile', {
                points: final.points,
                streak: final.streak,
                badges: final.badges,
                lastStreakDate: final.lastStreakDate,
                likedPostIds: final.likedPosts,
                savedPostIds: final.savedPosts,
                registeredEvents: final.registeredEvents
            });
            // Update AuthContext to keep user object in sync
            login(localStorage.getItem('token'), data);
        } catch (error) {
            console.error("Failed to sync profile:", error);
        }
    }, [userId, profile, login]);

    const awardBadge = useCallback((badgeId) => {
        persist(prev => {
            if (prev.badges.includes(badgeId)) return prev;
            const badge = BADGE_DEFS.find(b => b.id === badgeId);
            if (badge) {
                setNewBadges(nb => [...nb, badge]);
                setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== badgeId)), 2000);
            }
            return { ...prev, badges: [...prev.badges, badgeId] };
        });
    }, [persist]);

    const checkStreak = useCallback(() => {
        persist(prev => {
            const today = new Date().toISOString().slice(0, 10);
            if (prev.lastStreakDate === today) return prev;
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            const newStreak = prev.lastStreakDate === yesterday ? prev.streak + 1 : 1;
            let pts = prev.points + POINTS.DAILY_STREAK;
            let badges = [...prev.badges];
            if (newStreak >= 7 && !badges.includes('streak7')) { badges.push('streak7'); awardBadge('streak7'); }
            if (newStreak >= 30 && !badges.includes('streak30')) { badges.push('streak30'); awardBadge('streak30'); }
            return { ...prev, streak: newStreak, lastStreakDate: today, points: pts, badges };
        });
    }, [persist, awardBadge]);

    const toggleLikePost = useCallback(async (postId) => {
        const id = String(postId);
        try {
            await api.post(`/community/${id}/like`);
            persist(prev => {
                const isLiked = prev.likedPosts.includes(id);
                const likedPosts = isLiked ? prev.likedPosts.filter(x => x !== id) : [...prev.likedPosts, id];
                const pts = prev.points + (isLiked ? POINTS.UNLIKE_POST : POINTS.LIKE_POST);
                let badges = [...prev.badges];
                if (!isLiked && likedPosts.length >= 10 && !badges.includes('heartgiver')) {
                    badges.push('heartgiver');
                    awardBadge('heartgiver');
                }
                return { ...prev, likedPosts, points: pts, badges };
            });
        } catch (error) {
            console.error("Like toggle failed:", error);
        }
    }, [persist, awardBadge]);

    const toggleSavePost = useCallback(async (postId) => {
        const id = String(postId);
        try {
            await api.post(`/community/${id}/save`);
            persist(prev => {
                const isSaved = prev.savedPosts.includes(id);
                const pts = prev.points + (isSaved ? POINTS.UNSAVE_POST : POINTS.SAVE_POST);
                return {
                    ...prev,
                    savedPosts: isSaved ? prev.savedPosts.filter(x => x !== id) : [...prev.savedPosts, id],
                    points: pts,
                };
            });
        } catch (error) {
            console.error("Save toggle failed:", error);
        }
    }, [persist]);

    const addComment = useCallback(async (postId, text, isStory = false) => {
        try {
            await api.post(`/community/${postId}/comments`, { text, isStory });
            persist(prev => {
                const pts = prev.points + POINTS.POST_COMMENT;
                let badges = [...prev.badges];
                if (prev.myComments.length >= 4 && !badges.includes('helper')) {
                    badges.push('helper');
                    awardBadge('helper');
                }
                return { ...prev, points: pts, badges, myComments: [...prev.myComments, { id: Date.now() }] };
            });
        } catch (error) {
            console.error("Add comment failed:", error);
        }
    }, [persist, awardBadge]);

    const addDiscussion = useCallback(async (post) => {
        try {
            const { data } = await api.post('/community', { ...post, type: 'DISCUSSION' });
            persist(prev => {
                const pts = prev.points + POINTS.CREATE_DISCUSSION;
                let badges = [...prev.badges];
                if (!badges.includes('connector')) {
                    badges.push('connector');
                    awardBadge('connector');
                }
                return { ...prev, points: pts, badges };
            });
            return data;
        } catch (error) {
            console.error("Create discussion failed:", error);
        }
    }, [persist, awardBadge]);

    const addStory = useCallback(async (story) => {
        try {
            const { data } = await api.post('/community', { ...story, type: 'STORY' });
            persist(prev => {
                const pts = prev.points + POINTS.SHARE_STORY;
                let badges = [...prev.badges];
                if (!badges.includes('storyteller')) {
                    badges.push('storyteller');
                    awardBadge('storyteller');
                }
                return { ...prev, points: pts, badges };
            });
            return data;
        } catch (error) {
            console.error("Share story failed:", error);
        }
    }, [persist, awardBadge]);

    const saveWellnessPlan = useCallback(async (assessment, plan) => {
        try {
            await api.post('/wellness', { assessment, plan });
            persist(prev => ({ ...prev, assessment, activePlan: plan }));
        } catch (error) {
            console.error("Save wellness plan failed:", error);
        }
    }, [persist]);

    // Derived: current badge
    const currentBadge = BADGE_DEFS
        .filter(b => b.auto && profile.badges.includes(b.id))
        .at(-1) || BADGE_DEFS[0];

    const isPostLiked = useCallback((id) => profile.likedPosts.includes(String(id)), [profile.likedPosts]);
    const isPostSaved = useCallback((id) => profile.savedPosts.includes(String(id)), [profile.savedPosts]);
    const isCommentLiked = useCallback((id) => profile.likedComments.includes(String(id)), [profile.likedComments]);

    return (
        <UserDataContext.Provider value={{
            profile,
            currentBadge,
            newBadges,
            checkStreak,
            toggleLikePost,
            toggleSavePost,
            addComment,
            addDiscussion,
            addStory,
            awardBadge,
            saveWellnessPlan,
            isPostLiked,
            isPostSaved,
            isCommentLiked,
            // Keep some mock selectors for compatibility if needed
            isChallengeJoined: (id) => profile.challengesJoined.includes(id),
            getChallengeProgress: (id) => profile.challengeProgress[id] || 0,
            joinChallenge: (id) => persist(prev => ({ ...prev, challengesJoined: [...prev.challengesJoined, id] })),
            logChallengeDay: (id) => persist(prev => ({ ...prev, challengeProgress: { ...prev.challengeProgress, [id]: (prev.challengeProgress[id] || 0) + 1 } })),
            registerEvent: (event) => persist(prev => ({ ...prev, registeredEvents: [...prev.registeredEvents, event] })),
        }}>
            {children}
        </UserDataContext.Provider>
    );
}

export const useUserData = () => {
    const ctx = useContext(UserDataContext);
    if (!ctx) throw new Error('useUserData must be used inside UserDataProvider');
    return ctx;
};
