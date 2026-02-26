import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserData, BADGE_DEFS } from '../context/UserDataContext';
import {
    User, Mail, Shield, ShieldCheck, Flame, Zap, Award,
    MessageSquare, Heart, Bookmark, History, Target,
    ExternalLink, ChevronRight, Sparkles, Filter,
    Calendar, Video, Leaf, Trash2, AtSign, Edit3, Check, X, Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api';

export default function Profile() {
    const { user, login, token } = useAuth();
    const ud = useUserData();
    const [activeTab, setActiveTab] = useState('overview');

    // Username editing state
    const [editingUsername, setEditingUsername] = useState(false);
    const [usernameInput, setUsernameInput] = useState('');
    const [usernameLoading, setUsernameLoading] = useState(false);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9f4]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">You are not logged in</h2>
                    <Link to="/login" className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold">Log In</Link>
                </div>
            </div>
        );
    }

    const { profile, currentBadge } = ud;

    // Determine the display name: username first, then full name, then email
    const displayName = user.username
        ? user.username
        : (user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email);

    const handleStartEditUsername = () => {
        setUsernameInput(user.username || '');
        setEditingUsername(true);
    };

    const handleCancelEditUsername = () => {
        setEditingUsername(false);
        setUsernameInput('');
    };

    const handleSaveUsername = async () => {
        if (!usernameInput.trim() && !user.username) {
            setEditingUsername(false);
            return;
        }
        setUsernameLoading(true);
        try {
            const { data } = await api.put('/auth/profile', {
                username: usernameInput.trim() || null,
            });
            // Update auth context with new user data
            login(token, data);
            toast.success('Username updated successfully!');
            setEditingUsername(false);
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to update username';
            toast.error(message);
        } finally {
            setUsernameLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 space-y-10 min-h-screen bg-[#f8f9f4]">
            {/* ── Header / Profile Summary ── */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full -mr-48 -mt-48 blur-3xl opacity-60" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-500/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-60" />

                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                    {/* Portrait */}
                    <div className="shrink-0">
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-violet-100 to-indigo-100 rounded-[2.5rem] flex items-center justify-center text-4xl border border-white shadow-inner relative group">
                            <span className="text-6xl">{user.username?.[0]?.toUpperCase() || user.name?.[0] || '🌿'}</span>
                            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-2xl border border-slate-50">
                                {currentBadge.icon}
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
                                {user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email}
                            </h1>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full self-center md:self-auto flex items-center gap-1.5">
                                <ShieldCheck className="w-3.5 h-3.5" /> Verified Account
                            </span>
                        </div>

                        {/* Username Display / Edit */}
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-5">
                            {editingUsername ? (
                                <div className="flex items-center gap-2">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            autoFocus
                                            value={usernameInput}
                                            onChange={(e) => setUsernameInput(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                                            placeholder="set_username"
                                            className="pl-4 pr-3 py-1.5 text-sm border border-violet-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400/30 bg-violet-50 text-slate-800 font-medium w-48"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSaveUsername}
                                        disabled={usernameLoading}
                                        className="p-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                        title="Save username"
                                    >
                                        {usernameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={handleCancelEditUsername}
                                        className="p-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors"
                                        title="Cancel"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    {user.username ? (
                                        <span className="flex items-center gap-1.5 text-violet-600 font-bold text-base">
                                            {user.username}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-sm font-medium italic">No username set</span>
                                    )}
                                    <button
                                        onClick={handleStartEditUsername}
                                        className="p-1.5 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all"
                                        title="Edit username"
                                    >
                                        <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-8 text-slate-500 font-medium">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-violet-500" /> {user.email}
                            </div>
                            <div className="flex items-center gap-2">
                                <History className="w-4 h-4 text-emerald-500" /> Joined Februrary 2026
                            </div>
                        </div>

                        {/* Wellness Row */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="bg-[#f8f9f4] px-6 py-4 rounded-3xl border border-slate-100/50 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-500">
                                    <Flame className="w-5 h-5 fill-orange-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Streak</p>
                                    <p className="font-bold text-slate-900">{profile.streak} Days</p>
                                </div>
                            </div>
                            <div className="bg-[#f8f9f3] px-6 py-4 rounded-3xl border border-slate-100/50 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                                    <Zap className="w-5 h-5 fill-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score</p>
                                    <p className="font-bold text-slate-900">{profile.points} pts</p>
                                </div>
                            </div>
                            <div className="bg-[#f3f5f8] px-6 py-4 rounded-3xl border border-slate-100/50 flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
                                    <Award className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rank</p>
                                    <p className="font-bold text-slate-900">{currentBadge.label}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main Content Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Stats & Badges */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Challenges Progress */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-7">
                        <h3 className="font-bold text-slate-900 mb-6 flex items-center justify-between">
                            Active Challenges
                            <Link to="/challenges" className="text-emerald-600 text-[10px] font-black uppercase">Browse New</Link>
                        </h3>
                        <div className="space-y-6">
                            {profile.challengesJoined.length > 0 ? (
                                profile.challengesJoined.slice(0, 3).map(id => (
                                    <div key={id} className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold text-slate-700">
                                            <span>Challenge #{id}</span>
                                            <span>{profile.challengeProgress[id]} Logged</span>
                                        </div>
                                        <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(profile.challengeProgress[id] || 0) * 10}%` }} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center py-4 text-slate-400 text-sm font-medium italic">No active challenges</p>
                            )}
                        </div>
                    </div>

                    {/* Badges Collection */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-7">
                        <h3 className="font-bold text-slate-900 mb-6">Badges & Achievements</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {BADGE_DEFS.map(b => (
                                <div key={b.id}
                                    title={`${b.label}: ${b.desc}`}
                                    className={`aspect-square flex items-center justify-center rounded-2xl border transition-all ${profile.badges.includes(b.id) ? 'bg-violet-50 border-violet-100 text-2xl grayscale-0' : 'bg-slate-50 border-slate-100 text-xl grayscale opacity-40'}`}>
                                    {b.icon}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Content Tabs */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Tabs Navigation */}
                    <div className="flex gap-2 p-1.5 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-x-auto scrollbar-hide">
                        {[
                            { id: 'overview', label: 'Overview', icon: History },
                            { id: 'events', label: 'Events & Visits', icon: Calendar },
                            { id: 'stories', label: 'My Stories', icon: Sparkles },
                            { id: 'posts', label: 'Discussions', icon: MessageSquare },
                            { id: 'saved', label: 'Saved Content', icon: Bookmark },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    window.scrollTo({ top: 400, behavior: 'smooth' });
                                }}
                                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95' : 'text-slate-500 hover:bg-slate-50'}`}>
                                <tab.icon className="w-4 h-4" /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 p-10 min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {activeTab === 'overview' && (
                            <div className="space-y-10">
                                {/* Bio / Health Goal */}
                                <div className="p-8 bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-[2rem] text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-60">My Health Objective</h4>
                                    <p className="text-xl md:text-2xl font-playfair italic font-medium leading-relaxed">
                                        "Focusing on natural restoration and establishing a consistent meditation routine to manage industrial stress."
                                    </p>
                                    <div className="mt-6 flex gap-3">
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold border border-white/5 italic">#MindfulnessFirst</div>
                                        <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-bold border border-white/5 italic">#HolisticHealing</div>
                                    </div>
                                </div>

                                {/* Activity Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-emerald-500/20 transition-all">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Total Contributions</p>
                                        <p className="text-4xl font-bold text-slate-900">{profile.myStories.length + profile.myDiscussions.length + profile.myComments.length}</p>
                                    </div>
                                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-emerald-500/20 transition-all">
                                        <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Hearts Given</p>
                                        <p className="text-4xl font-bold text-slate-900">{profile.likedPosts.length}</p>
                                    </div>
                                </div>

                                {/* Recent Comments */}
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <History className="w-4 h-4 text-emerald-500" /> Recent Activity
                                    </h4>
                                    <div className="space-y-4">
                                        {profile.myComments.length > 0 ? (
                                            profile.myComments.slice(0, 5).map(c => (
                                                <div key={c.id} className="flex justify-between items-center p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                                                    <div className="flex gap-4">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                                                        <div>
                                                            <p className="text-sm font-medium text-slate-600 line-clamp-1 italic mb-1">"{c.text}"</p>
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                                {c.isStory ? 'Commented on Story' : 'Replied to Discussion'} • {new Date(c.time).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Delete this activity item?')) {
                                                                ud.deleteComment(c.id);
                                                            }
                                                        }}
                                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <History className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                                <p className="text-slate-400 font-bold">No recent activity found</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'events' && (
                            <div className="space-y-8 animate-in fade-in duration-500">
                                <div>
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-6">Registered Wellness Experiences</h4>
                                    <div className="grid grid-cols-1 gap-6">
                                        {(profile.registeredEvents || []).length > 0 ? (
                                            profile.registeredEvents.map((event, idx) => (
                                                <div key={idx} className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-center group hover:border-emerald-500/20 transition-all">
                                                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                                                        {event.type === 'Offline' ? <Leaf className="w-8 h-8" /> : <Video className="w-8 h-8" />}
                                                    </div>
                                                    <div className="flex-1 text-center md:text-left">
                                                        <h5 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors uppercase text-sm tracking-wide">{event.name}</h5>
                                                        <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">{event.date}</p>
                                                        <p className="text-[10px] text-emerald-500 font-black mt-2 uppercase tracking-widest">Confirmed Registration</p>
                                                    </div>
                                                    <button className="px-6 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm">
                                                        Manage Booking
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                                                <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                                <p className="text-slate-500 font-bold mb-4">No events registered</p>
                                                <Link to="/" className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all text-sm">
                                                    Explore Home
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-100">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Past Medical Visits</h4>
                                    <div className="space-y-4">
                                        {[
                                            { dr: 'Dr. Sarah Wilson', type: 'Holistic Consultation', date: 'JAN 15, 2026', status: 'Completed' },
                                            { dr: 'Dr. James Miller', type: 'Nutritional Assessment', date: 'DEC 22, 2025', status: 'Completed' }
                                        ].map((visit, i) => (
                                            <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-slate-200 transition-colors">
                                                <div>
                                                    <p className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors">{visit.dr}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{visit.type}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{visit.date}</p>
                                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">{visit.status}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'stories' && (
                            <div className="space-y-6">
                                {profile.myStories.length > 0 ? (
                                    profile.myStories.map(story => (
                                        <Link to={`/success-stories/${story.id}`} key={story.id} className="block group">
                                            <div className="p-6 bg-white rounded-3xl border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all shadow-sm">
                                                <div className="flex justify-between items-start mb-3">
                                                    <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors uppercase text-sm tracking-wide">{story.title}</h4>
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100 flex items-center gap-1">
                                                            <ShieldCheck className="w-3 h-3" /> Publicly Visible
                                                        </span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                if (window.confirm('Are you sure you want to delete this story?')) {
                                                                    ud.deleteStory(story.id);
                                                                }
                                                            }}
                                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                            title="Delete Story"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium mb-3 line-clamp-2">{story.headline || story.fullStory.slice(0, 100)}...</p>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{story.category}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{story.duration}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                        <Sparkles className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold mb-4">You haven't shared a story yet</p>
                                        <Link to="/success-stories" className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all text-sm">
                                            Start Your Journey
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'posts' && (
                            <div className="space-y-4">
                                {profile.myDiscussions.length > 0 ? (
                                    profile.myDiscussions.map(post => (
                                        <div key={post.id || Math.random()} className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 uppercase text-sm tracking-wide">{post.title}</h4>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Are you sure you want to delete this discussion?')) {
                                                            ud.deleteDiscussion(post.id);
                                                        }
                                                    }}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                                                    title="Delete Discussion"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4">{post.content}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-black uppercase tracking-tighter rounded-md border border-slate-100">{post.category}</span>
                                                <span className="text-[10px] text-slate-400 font-bold">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                        <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold mb-4">No discussions started</p>
                                        <Link to="/community" className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 transition-all text-sm">
                                            Go to Community
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'saved' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {profile.savedPosts.length > 0 ? (
                                    profile.savedPosts.map(id => (
                                        <div key={id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 flex-none">
                                                <Bookmark className="w-5 h-5 fill-amber-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Saved Link</p>
                                                <p className="text-sm font-bold text-slate-800 mb-2">Item ID: {id}</p>
                                                <button className="text-[10px] font-black text-emerald-600 uppercase flex items-center gap-1 group">
                                                    View Item <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                        <Bookmark className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                        <p className="text-slate-500 font-bold mb-2">No saved bookmarks</p>
                                        <p className="text-xs text-slate-400 font-medium">Items you bookmark will appear here</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
