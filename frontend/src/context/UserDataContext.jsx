import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../api';
import toast from 'react-hot-toast';

const DEFAULT_PROFILE = {
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
    const [appointments, setAppointments] = useState([]);
    const [ambulanceRequests, setAmbulanceRequests] = useState([]);

    // Locks to prevent parallel redundant hits
    const fetchLocks = useRef({
        appointments: false,
        ambulance: false,
        community: false
    });

    // Session trackers to prevent any redundant hits after first success
    const syncedResources = useRef(new Set());

    // Sync profile when user changes
    useEffect(() => {
        if (!user) {
            setProfileState(DEFAULT_PROFILE);
            setAppointments([]);
            setAmbulanceRequests([]);
            syncedResources.current.clear();
            return;
        }

        setProfileState(prev => ({
            ...prev,
            likedPosts: user.likedPostIds || [],
            savedPosts: user.savedPostIds || [],
            registeredEvents: user.registeredEvents || [],
        }));

        // Absolute single-hit logic using Session Tracker
        if (!syncedResources.current.has('appointments')) {
            syncedResources.current.add('appointments');
            fetchAppointments();
        }
        if (!syncedResources.current.has('ambulance')) {
            syncedResources.current.add('ambulance');
            fetchAmbulanceRequests();
        }
    }, [user, userId]); // eslint-disable-line

    const fetchAppointments = useCallback(async () => {
        if (!userId) return;
        try {
            const { data } = await api.get('/doctors/my');
            setAppointments(data);
        } catch (error) {
            console.error("Fetch appointments failed:", error);
        }
    }, [userId]);

    const cancelAppointment = useCallback(async (id) => {
        try {
            await api.patch(`/doctors/${id}/cancel`);
            fetchAppointments();
            toast.success("Appointment cancelled");
        } catch (error) {
            toast.error("Failed to cancel appointment");
        }
    }, [fetchAppointments]);

    const deleteAppointmentRecord = useCallback(async (id) => {
        try {
            await api.delete(`/doctors/${id}`);
            fetchAppointments();
            toast.success("History removed");
        } catch (error) {
            toast.error("Failed to remove history");
        }
    }, [fetchAppointments]);

    const fetchAmbulanceRequests = useCallback(async () => {
        if (!userId) return;
        try {
            const { data } = await api.get('/ambulance/my');
            setAmbulanceRequests(data);
        } catch (error) {
            console.error("Fetch ambulance requests failed:", error);
        }
    }, [userId]);

    const cancelAmbulanceRequest = useCallback(async (id) => {
        try {
            await api.patch(`/ambulance/${id}/cancel`);
            fetchAmbulanceRequests();
            toast.success("Request cancelled");
        } catch (error) {
            toast.error("Failed to cancel request");
        }
    }, [fetchAmbulanceRequests]);

    const deleteAmbulanceRequest = useCallback(async (id) => {
        try {
            await api.delete(`/ambulance/${id}`);
            fetchAmbulanceRequests();
            toast.success("History removed");
        } catch (error) {
            toast.error("Failed to remove history");
        }
    }, [fetchAmbulanceRequests]);

    const bookAppointment = useCallback(async (payload) => {
        try {
            const { data } = await api.post('/doctors', payload);
            fetchAppointments();
            return data;
        } catch (error) {
            console.error("Book appointment failed:", error);
            throw error;
        }
    }, [fetchAppointments]);

    const requestAmbulance = useCallback(async (payload) => {
        try {
            const { data } = await api.post('/ambulance', payload);
            fetchAmbulanceRequests();
            return data;
        } catch (error) {
            console.error("Ambulance request failed:", error);
            throw error;
        }
    }, [fetchAmbulanceRequests]);


    // Persist to backend and update local state
    const persist = useCallback(async (updater) => {
        if (!userId) return;

        const prev = profile;
        const next = typeof updater === 'function' ? updater(prev) : updater;

        // Skip if no changes
        if (next === prev) return;

        setProfileState(next);

        // Sync to backend
        try {
            const { data } = await api.put('/auth/profile', {
                likedPostIds: next.likedPosts,
                savedPostIds: next.savedPosts,
                registeredEvents: next.registeredEvents,
            });
            // Update AuthContext to keep user object in sync
            login(localStorage.getItem('token'), data);
        } catch (error) {
            console.error("Failed to sync profile:", error);
        }
    }, [userId, profile, login]);

    const toggleLikePost = useCallback(async (postId) => {
        const id = String(postId);
        try {
            const { data } = await api.post(`/community/${id}/like`);
            setProfileState(prev => {
                const isLiked = data.liked;
                const likedPosts = isLiked ? [...prev.likedPosts, id] : prev.likedPosts.filter(x => x !== id);
                
                return {
                    ...prev,
                    likedPosts,
                };
            });

            if (data.liked) {
                toast.success("Liked!");
            }
        } catch (error) {
            console.error("Like toggle failed:", error);
            toast.error("Failed to update like");
        }
    }, []);

    const toggleSavePost = useCallback(async (postId) => {
        const id = String(postId);
        try {
            await api.post(`/community/${id}/save`);
            persist(prev => {
                const isSaved = prev.savedPosts.includes(id);
                return {
                    ...prev,
                    savedPosts: isSaved ? prev.savedPosts.filter(x => x !== id) : [...prev.savedPosts, id],
                };
            });
        } catch (error) {
            console.error("Save toggle failed:", error);
        }
    }, [persist]);

    const addComment = useCallback(async (postId, text, isStory = false) => {
        try {
            const { data } = await api.post(`/community/${postId}/comments`, { text, isStory });
            setProfileState(prev => ({
                ...prev,
                myComments: [...prev.myComments, data.comment]
            }));
            toast.success("Comment added!");
        } catch (error) {
            console.error("Add comment failed:", error);
            toast.error("Failed to add comment");
        }
    }, []);

    const addDiscussion = useCallback(async (post) => {
        try {
            const { data } = await api.post('/community', { ...post, type: 'DISCUSSION' });
            return data;
        } catch (error) {
            console.error("Create discussion failed:", error);
        }
    }, []);

    const addStory = useCallback(async (story) => {
        try {
            const { data } = await api.post('/community', { ...story, type: 'STORY' });
            return data;
        } catch (error) {
            console.error("Share story failed:", error);
        }
    }, []);

    const saveWellnessPlan = useCallback(async (assessment, plan) => {
        try {
            await api.post('/wellness', { assessment, plan });
            setProfileState(prev => ({
                ...prev,
                assessment,
                activePlan: plan,
            }));
            toast.success("Wellness plan saved!");
        } catch (error) {
            console.error("Save wellness plan failed:", error);
            toast.error("Failed to save plan");
        }
    }, []);

    const isPostLiked = useCallback((id) => profile.likedPosts.includes(String(id)), [profile.likedPosts]);
    const isPostSaved = useCallback((id) => profile.savedPosts.includes(String(id)), [profile.savedPosts]);
    const isCommentLiked = useCallback((id) => profile.likedComments.includes(String(id)), [profile.likedComments]);

    return (
        <UserDataContext.Provider value={{
            profile,
            toggleLikePost,
            toggleSavePost,
            addComment,
            addDiscussion,
            addStory,
            saveWellnessPlan,
            isPostLiked,
            isPostSaved,
            isCommentLiked,
            registerEvent: (event) => persist(prev => ({ ...prev, registeredEvents: [...prev.registeredEvents, event] })),
            appointments,
            fetchAppointments,
            cancelAppointment,
            deleteAppointmentRecord,
            ambulanceRequests,
            fetchAmbulanceRequests,
            cancelAmbulanceRequest,
            deleteAmbulanceRequest,
            bookAppointment,
            requestAmbulance

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
