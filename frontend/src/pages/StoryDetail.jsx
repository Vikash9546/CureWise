import { useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    Heart, ChevronLeft, Star, CheckCircle2, Quote, Share2,
    Bookmark, Clock, MapPin, Leaf, Shield, Award, ChevronRight,
    MessageCircle, ThumbsUp, BadgeCheck, Sparkles, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { STORIES_DATA } from './SuccessStories';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';

const categoryColors = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', accent: 'from-emerald-600 to-teal-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500', accent: 'from-blue-600 to-cyan-500' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', badge: 'bg-pink-100 text-pink-700', dot: 'bg-pink-500', accent: 'from-pink-600 to-rose-400' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500', accent: 'from-violet-600 to-purple-500' },
};

export default function StoryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    // Look in hardcoded data first; fall back to localStorage user-submitted stories
    const story = (() => {
        const base = STORIES_DATA.find(s => s.id === parseInt(id));
        if (base) return base;
        try {
            const saved = JSON.parse(localStorage.getItem('nw_user_stories') || '[]');
            return saved.find(s => s.id === parseInt(id)) || null;
        } catch { return null; }
    })();

    const { user } = useAuth();
    const ud = useUserData();

    // Context-driven state
    const isLiked = ud.isPostLiked(story?.id);
    const isSaved = ud.isPostSaved(story?.id);

    const [helpful, setHelpful] = useState(false);
    const [comment, setComment] = useState('');
    // State for local UI list, but real persistence goes to ud.addComment
    const [comments, setComments] = useState(
        story && !story.isPending ? [
            { id: 1, author: 'NatureSoul', text: 'This story gave me hope. I\'ve been struggling for 3 years and reading this made me believe healing is possible. Thank you 🙏', likes: 24, isLiked: false, time: '2 days ago' },
            { id: 2, author: 'WellnessMom', text: 'Can you share the exact brand of Ashwagandha you used? I\'ve tried a few and not seeing results.', likes: 8, isLiked: false, time: '1 day ago' },
            { id: 3, author: 'Anonymous', text: 'I needed to read this today. Month 3 here and feeling discouraged — your month 4 breakthrough gives me so much hope.', likes: 31, isLiked: false, time: '5 hours ago' },
        ] : []
    );

    if (!story) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9f4]">
                <div className="text-center">
                    <div className="text-6xl mb-4">🌿</div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Story Not Found</h2>
                    <p className="text-slate-500 font-medium mb-6">This healing journey may have been moved or deleted.</p>
                    <Link to="/success-stories" className="px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all">
                        ← Back to Stories
                    </Link>
                </div>
            </div>
        );
    }

    const cols = categoryColors[story.categoryColor] || categoryColors.emerald;

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({ title: story.title, text: story.headline, url: window.location.href }).catch(() => { });
        } else {
            navigator.clipboard?.writeText(window.location.href);
        }
    };

    const handleAddComment = () => {
        if (!comment.trim()) return;
        if (!user) { toast.error('Please log in to comment'); return; }
        const newComment = {
            id: Date.now(),
            author: user.username ? `@${user.username}` : (user.name || 'You'),
            text: comment,
            likes: 0,
            isLiked: false,
            time: 'Just now'
        };
        setComments(prev => [...prev, newComment]);
        ud.addComment(story.id, comment, true); // true = isStory
        setComment('');
    };

    const handleLikeComment = (cid) => {
        if (!user) return;
        ud.toggleLikeComment(cid);
        setComments(prev => prev.map(c =>
            c.id === cid ? { ...c, likes: ud.isCommentLiked(cid) ? c.likes - 1 : c.likes + 1 } : c
        ));
    };

    const handleLikeStory = () => {
        if (!user) { toast.error('Please log in to like stories'); return; }
        ud.toggleLikePost(story.id);
    };

    const handleSaveStory = () => {
        if (!user) { toast.error('Please log in to save stories'); return; }
        ud.toggleSavePost(story.id);
    };

    const otherStories = STORIES_DATA.filter(s => s.id !== story.id).slice(0, 2);

    // All stories (base + localStorage) for sidebar
    const allStories = (() => {
        try {
            const saved = JSON.parse(localStorage.getItem('nw_user_stories') || '[]');
            return [...saved, ...STORIES_DATA];
        } catch { return STORIES_DATA; }
    })();

    return (
        <div className="min-h-screen bg-[#f8f9f4]">
            {/* ── Hero Banner ── */}
            <div className={`bg-gradient-to-br ${cols.accent} py-16 px-4 relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white blur-2xl -ml-16 -mb-16" />
                </div>
                <div className="max-w-4xl mx-auto relative z-10">
                    {/* Back Button */}
                    <button onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm mb-8 transition-colors group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Stories
                    </button>

                    {/* Category + Verified + Pending */}
                    <div className="flex items-center gap-3 flex-wrap mb-5">
                        <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                            {story.category}
                        </span>
                        <span className="flex items-center gap-1.5 bg-white/20 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                            <ShieldCheck className="w-3.5 h-3.5" /> Publicly Shared
                        </span>
                        <span className="flex items-center gap-1 text-white/70 text-xs font-bold">
                            <Clock className="w-3.5 h-3.5" /> {story.duration}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4 italic">
                        "{story.title}"
                    </h1>
                    <p className="text-white/80 font-medium text-lg mb-8 max-w-2xl">{story.headline}</p>

                    {/* Author Row */}
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white text-2xl font-black backdrop-blur-sm">
                                {story.avatar}
                            </div>
                            <div>
                                <p className="font-bold text-white text-lg">{story.name}</p>
                                <div className="flex items-center gap-3 text-white/70 text-xs font-bold">
                                    {story.age && <span>{story.age} years old</span>}
                                    {story.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{story.location}</span>}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button onClick={handleLikeStory}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${isLiked ? 'bg-white text-rose-500 shadow-lg shadow-rose-500/10' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'}`}>
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
                                {story.hearts + (isLiked ? 1 : 0)}
                            </button>
                            <button onClick={handleSaveStory}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${isSaved ? 'bg-white text-amber-500 shadow-lg shadow-amber-500/10' : 'bg-white/20 text-white hover:bg-white/30 border border-white/20'}`}>
                                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-400' : ''}`} />
                            </button>
                            <button onClick={handleShare}
                                className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 border border-white/20 text-white flex items-center justify-center transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Content ── */}
            <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

                {/* Before / After Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-400" /> The Beginning
                        </p>
                        <p className="text-slate-600 font-medium leading-relaxed">{story.initialState}</p>
                    </div>
                    <div className={`${cols.bg} rounded-3xl border ${cols.border} shadow-sm p-7`}>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${cols.text} mb-3 flex items-center gap-2`}>
                            <div className={`w-2 h-2 rounded-full ${cols.dot}`} /> The Transformation
                        </p>
                        <p className={`${cols.text} font-bold leading-relaxed`}>{story.currentState}</p>
                    </div>
                </div>

                {/* Quote Pull */}
                {story.quote && (
                    <div className="bg-emerald-900 rounded-3xl p-8 md:p-10 text-center relative overflow-hidden">
                        <Quote className="w-16 h-16 text-emerald-700 absolute top-4 left-4 opacity-30" />
                        <p className="text-xl md:text-2xl font-bold italic text-emerald-100 leading-relaxed relative z-10 max-w-2xl mx-auto">
                            "{story.quote}"
                        </p>
                        <p className="text-emerald-400 font-black text-xs uppercase tracking-widest mt-4">— {story.name}</p>
                    </div>
                )}

                {/* Full Story */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-emerald-500" /> The Full Journey
                    </h2>
                    <div className="prose prose-slate max-w-none">
                        {story.fullStory.split('\n\n').map((para, i) => (
                            <p key={i} className="text-slate-600 font-medium leading-relaxed mb-5 text-[15px]">{para}</p>
                        ))}
                    </div>
                    <div className="mt-6 flex items-center gap-3">
                        <button onClick={() => setHelpful(v => !v)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${helpful ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:border-emerald-200 hover:text-emerald-600'}`}>
                            <ThumbsUp className="w-4 h-4" /> {helpful ? 'Helpful!' : 'Mark as Helpful'}
                        </button>
                        <span className="text-xs font-bold text-slate-400">{helpful ? '143' : '142'} people found this helpful</span>
                    </div>
                </div>

                {/* Timeline — guard empty */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <Clock className="w-6 h-6 text-emerald-500" /> Success Timeline
                    </h2>
                    {story.timeline && story.timeline.length > 0 ? (
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100" />
                            <div className="space-y-6">
                                {story.timeline.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 relative">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${item.milestone ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-emerald-300 bg-white'}`}>
                                            <CheckCircle2 className={`w-4 h-4 ${item.milestone ? 'text-white' : 'text-emerald-400'}`} />
                                        </div>
                                        <div className={`flex-1 pb-6 ${item.milestone ? `${cols.bg} rounded-2xl p-4 border ${cols.border}` : ''}`}>
                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${item.milestone ? cols.text : 'text-slate-400'}`}>
                                                    {item.month}
                                                </span>
                                                {item.milestone && (
                                                    <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${cols.badge}`}>
                                                        🏆 Key Milestone
                                                    </span>
                                                )}
                                            </div>
                                            <p className={`text-sm font-medium leading-relaxed ${item.milestone ? `${cols.text} font-bold` : 'text-slate-600'}`}>
                                                {item.action}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-slate-400">
                            <div className="text-4xl mb-3">⏳</div>
                            <p className="font-bold text-slate-500">Timeline coming soon</p>
                            <p className="text-sm font-medium mt-1">This journey was just shared — milestones will be added as it progresses.</p>
                        </div>
                    )}
                </div>

                {/* Remedies & Lifestyle — guard empty */}
                {((story.remedies && story.remedies.length > 0) || (story.lifestyle && story.lifestyle.length > 0)) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {story.remedies && story.remedies.length > 0 && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
                                <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                                    <Leaf className="w-5 h-5 text-emerald-500" /> Natural Remedies Used
                                </h3>
                                <div className="space-y-2.5">
                                    {story.remedies.map((r, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                                            <span className="text-sm font-bold text-slate-700">{r}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        {story.lifestyle && story.lifestyle.length > 0 && (
                            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7">
                                <h3 className="font-bold text-slate-900 mb-5 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-amber-500" /> Lifestyle Changes
                                </h3>
                                <div className="space-y-2.5">
                                    {story.lifestyle.map((l, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                            <span className="text-sm font-bold text-slate-700">{l}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Disclaimer */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-3">
                    <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        <span className="font-black uppercase">Medical Disclaimer: </span>
                        This is a personal healing experience, not medical advice. Results vary. Always consult a qualified healthcare professional before changing your treatment. This story is verified as a genuine account but individual outcomes differ.
                    </p>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-10">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                        <MessageCircle className="w-6 h-6 text-emerald-500" /> Community Response
                    </h2>
                    <p className="text-slate-400 text-sm font-medium mb-8">
                        {comments.length > 0 ? `${comments.length} comments — share your thoughts or ask questions` : 'Be the first to respond to this journey 💙'}
                    </p>

                    {story.isPending && (
                        <div className="mb-6 flex gap-3 items-start bg-amber-50 rounded-2xl p-4 border border-amber-100">
                            <span className="text-amber-400 text-xl">⏳</span>
                            <p className="text-sm font-bold text-amber-700">This story is pending review and will be publicly visible once approved by our team. Comments are live now.</p>
                        </div>
                    )}

                    {/* Add Comment Box */}
                    <div className="flex gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-sm font-black shrink-0">
                            You
                        </div>
                        <div className="flex-1 flex gap-3">
                            <input value={comment} onChange={e => setComment(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddComment()}
                                placeholder="Share your thoughts or ask a question..."
                                className="flex-1 px-5 py-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium" />
                            <button onClick={handleAddComment}
                                className="px-5 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all shrink-0">
                                Post
                            </button>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-5 divide-y divide-slate-50">
                        {comments.map(c => (
                            <div key={c.id} className="flex gap-4 pt-5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-700 text-sm font-black shrink-0">
                                    {c.author[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="font-bold text-slate-800 text-sm">{c.author}</span>
                                        <span className="text-[10px] text-slate-400 font-bold">{c.time}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm font-medium leading-relaxed">{c.text}</p>
                                    <button onClick={() => handleLikeComment(c.id)}
                                        className={`flex items-center gap-1.5 mt-2 text-xs font-bold transition-all ${c.isLiked ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}>
                                        <ThumbsUp className="w-3 h-3" /> {c.likes}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Other Stories */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-emerald-500" /> More Healing Journeys
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {allStories.filter(s => s.id !== story.id).slice(0, 2).map(s => {
                            const c2 = categoryColors[s.categoryColor] || categoryColors.emerald;
                            return (
                                <Link key={s.id} to={`/success-stories/${s.id}`}
                                    className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl ${c2.bg} ${c2.text} font-black text-lg flex items-center justify-center border ${c2.border}`}>{s.avatar}</div>
                                        <div>
                                            <p className="font-bold text-slate-800">{s.name}</p>
                                            <p className={`text-[10px] font-black uppercase tracking-wider ${c2.text}`}>{s.category}</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-slate-700 italic text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors">"{s.title}"</p>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1 text-xs font-bold text-slate-400"><Heart className="w-3.5 h-3.5 text-rose-400" />{s.hearts}</span>
                                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                            Read Journey <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    <div className="text-center mt-6">
                        <Link to="/success-stories" className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-600 transition-all">
                            <ChevronLeft className="w-4 h-4" /> View All Stories
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
