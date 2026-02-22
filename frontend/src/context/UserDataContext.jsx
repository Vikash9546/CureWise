/**
 * UserDataContext — per-user persistent activity store
 *
 * Data is keyed by userId in localStorage as  nw_ud_<userId>
 * so each user gets their own separate profile.
 *
 * Schema:
 * {
 *   points         : number,
 *   streak         : number,
 *   lastStreakDate : string (ISO date),
 *   badges         : string[],          // earned badge ids
 *   challengesJoined    : number[],     // challenge ids
 *   challengesCompleted : number[],
 *   challengeProgress   : { [id]: number },  // days logged
 *   likedPosts     : (string|number)[],
 *   likedComments  : (string|number)[],
 *   savedPosts     : (string|number)[],
 *   myStories      : object[],          // stories the user submitted
 *   myDiscussions  : object[],          // community posts the user created
 *   myComments     : object[],          // comments the user posted (across all posts)
 * }
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

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

// ── Default empty profile ──────────────────────────────────────
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

// ── Context ───────────────────────────────────────────────────
const UserDataContext = createContext(null);

const storageKey = (userId) => `nw_ud_${userId}`;

export function UserDataProvider({ children }) {
    const { user } = useAuth();
    const userId = user?.id || user?._id || null;

    // Load profile from localStorage whenever userId changes
    const [profile, setProfileState] = useState(DEFAULT_PROFILE);
    const [newBadges, setNewBadges] = useState([]); // badges earned this session (for toast)

    useEffect(() => {
        if (!userId) {
            setProfileState(DEFAULT_PROFILE);
            return;
        }
        try {
            const raw = localStorage.getItem(storageKey(userId));
            setProfileState(raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE);
        } catch {
            setProfileState(DEFAULT_PROFILE);
        }
    }, [userId]);

    // Persist every update
    const persist = useCallback((updater) => {
        if (!userId) return;
        setProfileState(prev => {
            const next = typeof updater === 'function' ? updater(prev) : updater;
            // Auto-award points-based badges
            const earned = [...(next.badges || [])];
            BADGE_DEFS.filter(b => b.auto && !earned.includes(b.id) && next.points >= b.minPoints)
                .forEach(b => {
                    earned.push(b.id);
                    setNewBadges(nb => [...nb, b]);
                    setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== b.id)), 2000);
                });
            const final = { ...next, badges: earned };
            try { localStorage.setItem(storageKey(userId), JSON.stringify(final)); } catch { /* quota */ }
            return final;
        });
    }, [userId]);

    // ── Helper: award a specific badge ──
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

    // ── Daily streak check ──────────────────────────────────────
    const checkStreak = useCallback(() => {
        persist(prev => {
            const today = new Date().toISOString().slice(0, 10);
            if (prev.lastStreakDate === today) return prev; // already checked today
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            const newStreak = prev.lastStreakDate === yesterday ? prev.streak + 1 : 1;
            let pts = prev.points + POINTS.DAILY_STREAK;
            let badges = [...prev.badges];
            if (newStreak >= 7 && !badges.includes('streak7')) { badges.push('streak7'); setNewBadges(nb => [...nb, BADGE_DEFS.find(b => b.id === 'streak7')]); setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== 'streak7')), 2000); }
            if (newStreak >= 30 && !badges.includes('streak30')) { badges.push('streak30'); setNewBadges(nb => [...nb, BADGE_DEFS.find(b => b.id === 'streak30')]); setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== 'streak30')), 2000); }
            return { ...prev, streak: newStreak, lastStreakDate: today, points: pts, badges };
        });
    }, [persist]);

    // ── Post likes ──────────────────────────────────────────────
    const toggleLikePost = useCallback((postId) => {
        persist(prev => {
            const id = String(postId);
            const isLiked = prev.likedPosts.includes(id);
            const likedPosts = isLiked
                ? prev.likedPosts.filter(x => x !== id)
                : [...prev.likedPosts, id];
            const pts = prev.points + (isLiked ? POINTS.UNLIKE_POST : POINTS.LIKE_POST);
            let badges = [...prev.badges];
            if (!isLiked && likedPosts.length >= 10 && !badges.includes('heartgiver')) {
                badges.push('heartgiver');
                setNewBadges(nb => [...nb, BADGE_DEFS.find(b => b.id === 'heartgiver')]);
                setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== 'heartgiver')), 2000);
            }
            return { ...prev, likedPosts, points: pts, badges };
        });
    }, [persist]);

    // ── Comment likes ───────────────────────────────────────────
    const toggleLikeComment = useCallback((commentId) => {
        persist(prev => {
            const id = String(commentId);
            const liked = prev.likedComments.includes(id);
            return {
                ...prev,
                likedComments: liked
                    ? prev.likedComments.filter(x => x !== id)
                    : [...prev.likedComments, id],
            };
        });
    }, [persist]);

    // ── Save posts ──────────────────────────────────────────────
    const toggleSavePost = useCallback((postId) => {
        persist(prev => {
            const id = String(postId);
            const isSaved = prev.savedPosts.includes(id);
            const pts = prev.points + (isSaved ? POINTS.UNSAVE_POST : POINTS.SAVE_POST);
            return {
                ...prev,
                savedPosts: isSaved
                    ? prev.savedPosts.filter(x => x !== id)
                    : [...prev.savedPosts, id],
                points: pts,
            };
        });
    }, [persist]);

    // ── Add comment ─────────────────────────────────────────────
    const addComment = useCallback((postId, text, isStory = false) => {
        persist(prev => {
            const comment = { id: Date.now(), postId: String(postId), text, time: new Date().toISOString(), isStory };
            const myComments = [comment, ...prev.myComments];
            const pts = prev.points + POINTS.POST_COMMENT;
            let badges = [...prev.badges];
            if (myComments.length >= 5 && !badges.includes('helper')) {
                badges.push('helper');
                setNewBadges(nb => [...nb, BADGE_DEFS.find(b => b.id === 'helper')]);
                setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== 'helper')), 2000);
            }
            return { ...prev, myComments, points: pts, badges };
        });
    }, [persist]);

    const deleteComment = useCallback((commentId) => {
        persist(prev => ({
            ...prev,
            myComments: prev.myComments.filter(c => c.id !== commentId)
        }));
    }, [persist]);

    // ── Create discussion ───────────────────────────────────────
    const addDiscussion = useCallback((post) => {
        persist(prev => {
            const myDiscussions = [{ ...post, createdAt: new Date().toISOString() }, ...prev.myDiscussions];
            const pts = prev.points + POINTS.CREATE_DISCUSSION;
            let badges = [...prev.badges];
            if (!badges.includes('connector')) {
                badges.push('connector');
                setNewBadges(nb => [...nb, BADGE_DEFS.find(b => b.id === 'connector')]);
                setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== 'connector')), 2000);
            }
            return { ...prev, myDiscussions, points: pts, badges };
        });
    }, [persist]);

    // ── Share story ─────────────────────────────────────────────
    const addStory = useCallback((story) => {
        persist(prev => {
            const myStories = [{ ...story, createdAt: new Date().toISOString() }, ...prev.myStories];
            const pts = prev.points + POINTS.SHARE_STORY;
            let badges = [...prev.badges];
            if (!badges.includes('storyteller')) {
                badges.push('storyteller');
                setNewBadges(nb => [...nb, BADGE_DEFS.find(b => b.id === 'storyteller')]);
                setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== 'storyteller')), 2000);
            }
            return { ...prev, myStories, points: pts, badges };
        });
    }, [persist]);

    const deleteStory = useCallback((storyId) => {
        persist(prev => ({
            ...prev,
            myStories: prev.myStories.filter(s => s.id !== storyId)
        }));
    }, [persist]);

    const deleteDiscussion = useCallback((postId) => {
        persist(prev => ({
            ...prev,
            myDiscussions: prev.myDiscussions.filter(p => p.id !== postId)
        }));
    }, [persist]);

    // ── Challenges ──────────────────────────────────────────────
    const joinChallenge = useCallback((challengeId) => {
        persist(prev => {
            if (prev.challengesJoined.includes(challengeId)) return prev;
            const pts = prev.points + POINTS.JOIN_CHALLENGE;
            let badges = [...prev.badges];
            if (!badges.includes('challenger')) {
                badges.push('challenger');
                setNewBadges(nb => [...nb, BADGE_DEFS.find(b => b.id === 'challenger')]);
                setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== 'challenger')), 2000);
            }
            return {
                ...prev,
                challengesJoined: [...prev.challengesJoined, challengeId],
                challengeProgress: { ...prev.challengeProgress, [challengeId]: 0 },
                points: pts,
                badges,
            };
        });
    }, [persist]);

    const logChallengeDay = useCallback((challengeId, totalDays) => {
        persist(prev => {
            const current = (prev.challengeProgress[challengeId] || 0) + 1;
            const progress = { ...prev.challengeProgress, [challengeId]: current };
            const isComplete = current >= totalDays;
            const completed = isComplete && !prev.challengesCompleted.includes(challengeId)
                ? [...prev.challengesCompleted, challengeId]
                : prev.challengesCompleted;
            let pts = prev.points + POINTS.LOG_CHALLENGE_DAY;
            if (isComplete && !prev.challengesCompleted.includes(challengeId)) {
                pts += POINTS.COMPLETE_CHALLENGE;
            }
            let badges = [...prev.badges];
            if (isComplete && !badges.includes('overcomer')) {
                badges.push('overcomer');
                setNewBadges(nb => [...nb, BADGE_DEFS.find(b => b.id === 'overcomer')]);
                setTimeout(() => setNewBadges(nb => nb.filter(x => x.id !== 'overcomer')), 2000);
            }
            return { ...prev, challengeProgress: progress, challengesCompleted: completed, points: pts, badges };
        });
    }, [persist]);

    // ── Wellness Plan Actions ───────────────────────────────────
    const saveWellnessPlan = useCallback((assessment, plan) => {
        persist(prev => ({ ...prev, assessment, activePlan: plan }));
    }, [persist]);

    const logDailyActivity = useCallback((date, data) => {
        persist(prev => {
            const current = prev.dailyLogs[date] || {};
            return {
                ...prev,
                dailyLogs: {
                    ...prev.dailyLogs,
                    [date]: { ...current, ...data }
                }
            };
        });
    }, [persist]);

    const addCustomHabit = useCallback((habitName) => {
        persist(prev => ({
            ...prev,
            customHabits: [...prev.customHabits, { id: Date.now(), name: habitName, streak: 0 }]
        }));
    }, [persist]);

    const registerEvent = useCallback((event) => {
        persist(prev => {
            if (prev.registeredEvents.some(e => e.name === event.name)) return prev;
            return {
                ...prev,
                registeredEvents: [...prev.registeredEvents, { ...event, registeredAt: new Date().toISOString() }]
            };
        });
    }, [persist]);

    const toggleHabitTask = useCallback((date, taskId) => {
        persist(prev => {
            const currentLog = { completedTasks: [], ...(prev.dailyLogs[date] || {}) };
            const completed = currentLog.completedTasks.includes(taskId)
                ? currentLog.completedTasks.filter(id => id !== taskId)
                : [...currentLog.completedTasks, taskId];

            return {
                ...prev,
                dailyLogs: {
                    ...prev.dailyLogs,
                    [date]: { ...currentLog, completedTasks: completed }
                }
            };
        });
    }, [persist]);

    // ── Derived: current badge ──────────────────────────────────
    const currentBadge = BADGE_DEFS
        .filter(b => b.auto && profile.badges.includes(b.id))
        .at(-1) || BADGE_DEFS[0];

    const isPostLiked = useCallback((id) => profile.likedPosts.includes(String(id)), [profile.likedPosts]);
    const isPostSaved = useCallback((id) => profile.savedPosts.includes(String(id)), [profile.savedPosts]);
    const isCommentLiked = useCallback((id) => profile.likedComments.includes(String(id)), [profile.likedComments]);
    const isChallengeJoined = useCallback((id) => profile.challengesJoined.includes(id), [profile.challengesJoined]);
    const getChallengeProgress = useCallback((id) => profile.challengeProgress[id] || 0, [profile.challengeProgress]);

    return (
        <UserDataContext.Provider value={{
            profile,
            currentBadge,
            newBadges,
            // actions
            checkStreak,
            toggleLikePost,
            toggleLikeComment,
            toggleSavePost,
            addComment,
            deleteComment,
            addDiscussion,
            addStory,
            deleteStory,
            deleteDiscussion,
            joinChallenge,
            logChallengeDay,
            awardBadge,
            saveWellnessPlan,
            logDailyActivity,
            addCustomHabit,
            toggleHabitTask,
            registerEvent,
            // selectors
            isPostLiked,
            isPostSaved,
            isCommentLiked,
            isChallengeJoined,
            getChallengeProgress,
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
