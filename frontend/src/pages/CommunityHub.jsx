import { useState, useMemo } from 'react';
import {
    MessageSquare, Star, Zap, Users, Search, Plus, ThumbsUp, MessageCircle,
    Share2, Award, TrendingUp, ShieldCheck, Flag, X, ChevronDown, ChevronUp,
    Flame, Trophy, Filter, Check, Bell, BookOpen, Leaf, Brain, Salad, Dumbbell,
    Heart, Eye, EyeOff, Send, MoreHorizontal, Bookmark, BadgeCheck, Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';

// ── Static Data ──────────────────────────────────────────────
const CATEGORIES = [
    { id: 'all', name: 'All Topics', icon: Leaf, color: 'slate' },
    { id: 'herbal', name: 'Herbal Remedies', icon: Leaf, color: 'emerald', count: 124 },
    { id: 'mental', name: 'Mental Wellness', icon: Brain, color: 'violet', count: 89 },
    { id: 'diet', name: 'Natural Diet', icon: Salad, color: 'lime', count: 56 },
    { id: 'yoga', name: 'Yoga & Meditation', icon: Zap, color: 'amber', count: 42 },
    { id: 'womens', name: "Women's Health", icon: Heart, color: 'pink', count: 37 },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell, color: 'blue', count: 28 },
];

const BADGES = {
    beginner: { icon: '🌱', label: 'Beginner', min: 0 },
    explorer: { icon: '🌿', label: 'Wellness Explorer', min: 200 },
    mentor: { icon: '🌳', label: 'Nature Mentor', min: 800 },
    healer: { icon: '🏆', label: 'Community Healer', min: 2000 },
};

const SORT_OPTIONS = [
    { id: 'recent', label: 'Most Recent' },
    { id: 'popular', label: 'Most Liked' },
    { id: 'unanswered', label: 'No Answers' },
    { id: 'expert', label: 'Expert Verified' },
];

const CHALLENGES = [
    { id: 1, title: '7-Day Meditation', emoji: '🧘', progress: 4, total: 7, streak: 4 },
    { id: 2, title: '14-Day Detox', emoji: '🍃', progress: 9, total: 14, streak: 9 },
    { id: 3, title: 'Water Streak', emoji: '💧', progress: 11, total: 30, streak: 11 },
];

const INITIAL_POSTS = [
    {
        id: 1, author: 'PureLiving', category: 'herbal', isExpert: true, isAnonymous: false,
        title: 'The power of Ashwagandha for chronic stress',
        content: "I've been using Ashwagandha for 30 days and the results are incredible. My cortisol levels feel balanced and my sleep has improved significantly. Anyone else tried this adaptogen? I combined it with 4-7-8 breathing and the results compounded beautifully.",
        tags: ['#stress', '#herbs', '#adaptogens'], likes: 42, isLiked: false, savedBy: [], time: '2h ago',
        comments: [
            {
                id: 101, author: 'NatureSoul', text: 'I had the same experience! KSM-66 extract is the most bioavailable form.', likes: 8, isLiked: false, time: '1h ago', isExpert: false,
                replies: [{ id: 1011, author: 'HerbGuru', text: 'Agreed — pair it with black pepper for better absorption.', likes: 3, isLiked: false, time: '45m ago', isExpert: true }]
            },
            { id: 102, author: 'Anonymous', text: 'How long before you saw results? I\'m on day 10 and feel nothing yet.', likes: 2, isLiked: false, time: '30m ago', isExpert: false, replies: [] },
        ],
        isReported: false, showComments: false, points: 42,
    },
    {
        id: 2, author: 'Anonymous', category: 'mental', isExpert: false, isAnonymous: true,
        title: 'Dealing with anxiety naturally — what worked for me',
        content: "I wanted to share my journey with anxiety. Breathwork (specifically 4-7-8 method) and specific herbal teas like chamomile truly changed my life. Peace is possible without medication. Please share what worked for you too — we heal together.",
        tags: ['#anxiety', '#mentalhealth', '#breathwork'], likes: 38, isLiked: false, savedBy: [], time: '5h ago',
        comments: [
            { id: 201, author: 'MindfulMeera', text: 'Lavender oil diffusing while doing box breathing is incredible too!', likes: 5, isLiked: false, time: '4h ago', isExpert: false, replies: [] },
        ],
        isReported: false, showComments: false, points: 38,
    },
    {
        id: 3, author: 'HerbGuru', category: 'diet', isExpert: true, isAnonymous: false,
        title: 'My 21-day anti-inflammatory diet experiment — full results',
        content: "After 3 weeks on a strict anti-inflammatory diet (no sugar, no refined carbs, no seed oils), my joint pain reduced by 70%, my skin cleared, and my energy is through the roof. Here's my full protocol including meal plans and supplement stack.",
        tags: ['#diet', '#inflammation', '#healing'], likes: 67, isLiked: false, savedBy: [], time: '1d ago',
        comments: [],
        isReported: false, showComments: false, points: 67,
    },
    {
        id: 4, author: 'WellnessMom', category: 'womens', isExpert: false, isAnonymous: false,
        title: 'PCOS journey: natural healing after 2 years of struggle',
        content: "Two years of irregular periods, weight gain, and frustration. Then I discovered the spearmint tea + inositol + low GI diet protocol. Within 3 months my cycles normalized. I want to share everything I learned for anyone struggling with PCOS.",
        tags: ['#pcos', '#hormones', '#womenshealth'], likes: 94, isLiked: false, savedBy: [], time: '2d ago',
        comments: [
            { id: 401, author: 'Anonymous', text: 'Thank you so much for sharing this. I needed to hear this today 💙', likes: 12, isLiked: false, time: '1d ago', isExpert: false, replies: [] },
        ],
        isReported: false, showComments: false, points: 94,
    },
];

const TOP_HEALERS = [
    { name: 'HerbGuru', points: 2100, badge: '🏆', isExpert: true },
    { name: 'PureLiving', points: 1250, badge: '🌳', isExpert: false },
    { name: 'NatureSoul', points: 850, badge: '🌿', isExpert: false },
    { name: 'WellnessMom', points: 620, badge: '🌿', isExpert: false },
    { name: 'MindfulMeera', points: 310, badge: '🌱', isExpert: false },
];

// ── Helper Components ─────────────────────────────────────────
function Badge({ badge }) {
    return (
        <span title={badge.label}
            className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            {badge.icon} {badge.label}
        </span>
    );
}

function getBadge(points) {
    if (points >= BADGES.healer.min) return BADGES.healer;
    if (points >= BADGES.mentor.min) return BADGES.mentor;
    if (points >= BADGES.explorer.min) return BADGES.explorer;
    return BADGES.beginner;
}

function Avatar({ author, isExpert, isAnonymous, size = 'md' }) {
    const sz = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-11 h-11 text-sm';
    const bg = isExpert ? 'bg-amber-500' : isAnonymous ? 'bg-slate-400' : 'bg-emerald-500';
    return (
        <div className={`${sz} ${bg} rounded-2xl flex items-center justify-center text-white font-black shadow-sm shrink-0`}>
            {isExpert ? <BadgeCheck className="w-4 h-4" /> : isAnonymous ? <ShieldCheck className="w-4 h-4" /> : author[0].toUpperCase()}
        </div>
    );
}

function TagChip({ tag }) {
    return <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">{tag}</span>;
}

function ProgressBar({ value, max }) {
    const pct = Math.round((value / max) * 100);
    return (
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }} />
        </div>
    );
}

// ── Comment Component ─────────────────────────────────────────
function CommentItem({ comment, onLike, onReply, depth = 0 }) {
    const [showReply, setShowReply] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [showReplies, setShowReplies] = useState(true);

    return (
        <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-emerald-50' : ''}`}>
            <div className="flex gap-3 py-3">
                <Avatar author={comment.author} isExpert={comment.isExpert} isAnonymous={comment.author === 'Anonymous'} size="sm" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-800 text-sm">{comment.author}</span>
                        {comment.isExpert && (
                            <span className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full">Expert</span>
                        )}
                        <span className="text-[10px] text-slate-400 font-bold">{comment.time}</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium mt-1 leading-relaxed">{comment.text}</p>
                    <div className="flex items-center gap-4 mt-2">
                        <button onClick={() => onLike(comment.id)}
                            className={`flex items-center gap-1.5 text-xs font-bold transition-all ${comment.isLiked ? 'text-emerald-500' : 'text-slate-400 hover:text-emerald-500'}`}>
                            <ThumbsUp className="w-3 h-3" /> {comment.likes}
                        </button>
                        {depth === 0 && (
                            <button onClick={() => setShowReply(v => !v)}
                                className="text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors">
                                Reply
                            </button>
                        )}
                        {comment.replies?.length > 0 && depth === 0 && (
                            <button onClick={() => setShowReplies(v => !v)}
                                className="text-xs font-bold text-slate-400 hover:text-emerald-600 flex items-center gap-1">
                                {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                            </button>
                        )}
                    </div>
                    {showReply && (
                        <div className="flex gap-2 mt-2">
                            <input value={replyText} onChange={e => setReplyText(e.target.value)}
                                placeholder="Write a reply..."
                                className="flex-1 text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none font-medium" />
                            <button onClick={() => { onReply(comment.id, replyText); setReplyText(''); setShowReply(false); }}
                                className="p-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all">
                                <Send className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showReplies && comment.replies?.map(reply => (
                <CommentItem key={reply.id} comment={reply} onLike={onLike} onReply={onReply} depth={depth + 1} />
            ))}
        </div>
    );
}

// ── Report Modal ──────────────────────────────────────────────
function ReportModal({ postTitle, onClose, onSubmit }) {
    const [reason, setReason] = useState('');
    const reasons = ['Medical misinformation', 'Harmful advice', 'Spam', 'Inappropriate content', 'Other'];
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl z-10">
                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500">
                    <X className="w-4 h-4" />
                </button>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Report Post</h3>
                <p className="text-xs text-slate-400 font-medium mb-6 line-clamp-1">"{postTitle}"</p>
                <div className="space-y-2 mb-6">
                    {reasons.map(r => (
                        <button key={r} onClick={() => setReason(r)}
                            className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all border ${reason === r ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'}`}>
                            {r}
                        </button>
                    ))}
                </div>
                <button onClick={() => reason && onSubmit(reason)} disabled={!reason}
                    className="w-full py-3.5 bg-rose-500 text-white rounded-2xl font-bold disabled:opacity-40 hover:bg-rose-600 transition-all">
                    Submit Report
                </button>
            </div>
        </div>
    );
}

// ── Post Card ─────────────────────────────────────────────────
function PostCard({ post, onLike, onToggleComments, onAddComment, onLikeComment, onReplyComment, onReport, onSave, onShare, onDelete, currentUser, isOwner }) {
    const [commentText, setCommentText] = useState('');
    const [showMenu, setShowMenu] = useState(false);
    const [reportTarget, setReportTarget] = useState(null);
    const isSaved = post.savedBy?.includes(currentUser);

    return (
        <article className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 transition-all group/card">
            <div className="p-6 sm:p-8">
                {/* Author Row */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                        <Avatar author={post.author} isExpert={post.isExpert} isAnonymous={post.isAnonymous} />
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-800 text-sm">{post.author}</span>
                                {post.isExpert && <span className="bg-amber-100 text-amber-700 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">✓ Expert</span>}
                                {post.isAnonymous && <span className="bg-slate-100 text-slate-500 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Anonymous</span>}
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{post.time} · {post.category}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1 flex-wrap justify-end">
                            {post.tags.slice(0, 2).map(tag => <TagChip key={tag} tag={tag} />)}
                        </div>
                        <div className="relative">
                            <button onClick={() => setShowMenu(v => !v)}
                                className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 transition-all">
                                <MoreHorizontal className="w-4 h-4" />
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 w-44 overflow-hidden py-1">
                                    <button onClick={() => { onSave(post.id); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                        <Bookmark className="w-4 h-4" /> {isSaved ? 'Unsave' : 'Save post'}
                                    </button>
                                    <button onClick={() => { onShare(post.title); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                    <button onClick={() => { setReportTarget(post); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 flex items-center gap-2">
                                        <Flag className="w-4 h-4" /> Report
                                    </button>
                                    {isOwner && (
                                        <button onClick={() => { if (window.confirm('Delete this post?')) { onDelete(post.id); } setShowMenu(false); }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-100 flex items-center gap-2 border-t border-slate-50">
                                            <Trash2 className="w-4 h-4" /> Delete Post
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3 group-hover/card:text-emerald-600 transition-colors cursor-pointer leading-tight">
                    {post.title}
                </h2>
                <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-3 mb-6">{post.content}</p>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                    <div className="flex gap-4">
                        <button onClick={() => onLike(post.id)}
                            className={`flex items-center gap-2 transition-all group/btn ${post.isLiked ? 'text-emerald-600' : 'text-slate-400 hover:text-emerald-500'}`}>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${post.isLiked ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'bg-slate-50 group-hover/btn:bg-emerald-50'}`}>
                                <ThumbsUp className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black">{post.likes}</span>
                        </button>
                        <button onClick={() => onToggleComments(post.id)}
                            className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-all group/btn">
                            <div className="w-9 h-9 rounded-xl bg-slate-50 group-hover/btn:bg-emerald-50 flex items-center justify-center transition-all">
                                <MessageCircle className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-black">{post.comments.length}</span>
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        {isSaved && <Bookmark className="w-4 h-4 text-emerald-500 fill-emerald-500" />}
                        <button onClick={() => onShare(post.title)}
                            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-500 transition-all flex items-center justify-center">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Comments Panel */}
            {post.showComments && (
                <div className="px-6 sm:px-8 pb-6 border-t border-slate-50">
                    <div className="pt-5 divide-y divide-slate-50">
                        {post.comments.length === 0 && (
                            <p className="text-center text-slate-400 text-sm font-medium py-6">Be the first to share your thoughts 💬</p>
                        )}
                        {post.comments.map(comment => (
                            <CommentItem key={comment.id} comment={comment}
                                onLike={(cid) => onLikeComment(post.id, cid)}
                                onReply={(cid, text) => onReplyComment(post.id, cid, text)} />
                        ))}
                    </div>
                    {/* Add Comment */}
                    <div className="flex gap-3 mt-4">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-xs font-black shrink-0">You</div>
                        <div className="flex-1 flex gap-2">
                            <input value={commentText} onChange={e => setCommentText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && commentText.trim()) { onAddComment(post.id, commentText); setCommentText(''); } }}
                                placeholder="Add a helpful comment..."
                                className="flex-1 text-sm p-3 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none font-medium" />
                            <button onClick={() => { if (commentText.trim()) { onAddComment(post.id, commentText); setCommentText(''); } }}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all font-bold text-xs">
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {reportTarget && (
                <ReportModal postTitle={reportTarget.title} onClose={() => setReportTarget(null)}
                    onSubmit={(reason) => { onReport(post.id, reason); setReportTarget(null); }} />
            )}
        </article>
    );
}

// ── Create Post Modal ─────────────────────────────────────────
function CreatePostModal({ onClose, onSubmit }) {
    const [form, setForm] = useState({ title: '', category: 'herbal', content: '', tags: '', isAnonymous: false });
    const MAX_CHARS = 1000;
    const charLeft = MAX_CHARS - form.content.length;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim() || !form.content.trim()) return;
        const rawTags = form.tags.split(',').map(t => t.trim()).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`);
        onSubmit({ ...form, tags: rawTags.length ? rawTags : [`#${form.category}`] });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[92vh]">
                {/* Modal Header */}
                <div className="p-7 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-teal-50/30">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Start a Discussion</h2>
                        <p className="text-xs font-medium text-slate-400 mt-1">Share your wisdom with the sanctuary 🌿</p>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-7 space-y-5 overflow-y-auto">
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Discussion Title *</label>
                        <input required maxLength={120} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:outline-none transition-all text-sm font-semibold text-slate-800"
                            placeholder="What's your topic?" />
                    </div>

                    {/* Category */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category *</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:outline-none transition-all text-sm font-bold text-slate-700">
                            {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Message *</label>
                        <textarea required maxLength={MAX_CHARS} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:outline-none transition-all text-sm font-medium h-36 resize-none"
                            placeholder="Share your experience, question, or wisdom..." />
                        <p className={`text-[10px] font-bold text-right ${charLeft < 50 ? 'text-rose-400' : 'text-slate-300'}`}>{charLeft} chars left</p>
                    </div>

                    {/* Tags */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tags <span className="normal-case font-medium">(comma-separated)</span></label>
                        <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
                            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white focus:outline-none transition-all text-sm font-medium"
                            placeholder="#anxiety, #herbs, #healing" />
                    </div>

                    {/* Anonymous Toggle */}
                    <button type="button" onClick={() => setForm({ ...form, isAnonymous: !form.isAnonymous })}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${form.isAnonymous ? 'border-emerald-200 bg-emerald-50' : 'border-slate-100 bg-slate-50'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${form.isAnonymous ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                            {form.isAnonymous ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </div>
                        <div className="text-left">
                            <p className="text-sm font-bold text-slate-700">{form.isAnonymous ? 'Posting Anonymously' : 'Post Anonymously'}</p>
                            <p className="text-[11px] text-slate-400 font-medium">Safe space for sensitive topics — your identity is hidden publicly</p>
                        </div>
                        {form.isAnonymous && <Check className="w-5 h-5 text-emerald-500 ml-auto" />}
                    </button>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button type="submit" className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-95">
                            <Plus className="w-5 h-5" /> Post Discussion
                        </button>
                        <button type="button" onClick={onClose} className="px-6 py-4 bg-white text-slate-400 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ── Main Component ────────────────────────────────────────────
export default function CommunityHub() {
    const { user } = useAuth();
    const ud = useUserData();

    // currentUser display name — real name if logged in, else 'Guest'
    const currentUser = user ? (user.name || user.email?.split('@')[0] || 'You') : 'Guest';

    const [posts, setPosts] = useState(INITIAL_POSTS);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeSort, setActiveSort] = useState('recent');
    const [searchQuery, setSearchQuery] = useState('');
    const [reportedPosts, setReportedPosts] = useState(new Set());
    const [toast, setToast] = useState(null);

    // Points & badge come from the persistent context
    const myPoints = ud.profile.points;
    const myBadge = ud.currentBadge;

    // ── Show toast ──
    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    // ── Post Actions ──
    const handleLike = (id) => {
        if (!user) { showToast('Please log in to like posts.', 'info'); return; }
        ud.toggleLikePost(id);
        setPosts(prev => prev.map(p =>
            p.id === id ? { ...p, likes: ud.isPostLiked(id) ? p.likes - 1 : p.likes + 1 } : p
        ));
        showToast(ud.isPostLiked(id) ? 'Unliked.' : '+2 pts for liking! 💚');
    };

    const handleToggleComments = (id) => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, showComments: !p.showComments } : p));
    };

    const handleAddComment = (postId, text) => {
        if (!user) { showToast('Please log in to comment.', 'info'); return; }
        setPosts(prev => prev.map(p => p.id === postId ? {
            ...p,
            comments: [...p.comments, {
                id: Date.now(), author: currentUser, text, likes: 0, isLiked: false,
                time: 'Just now', isExpert: false, replies: []
            }]
        } : p));
        ud.addComment(postId, text, false);
        showToast('Comment posted! +5 pts 🌱');
    };

    const handleLikeComment = (postId, commentId) => {
        if (!user) return;
        ud.toggleLikeComment(commentId);
        setPosts(prev => prev.map(p => p.id !== postId ? p : {
            ...p,
            comments: p.comments.map(c => {
                if (c.id === commentId) return { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked };
                return {
                    ...c,
                    replies: c.replies?.map(r => r.id === commentId
                        ? { ...r, likes: r.isLiked ? r.likes - 1 : r.likes + 1, isLiked: !r.isLiked }
                        : r) || []
                };
            })
        }));
    };

    const handleReplyComment = (postId, commentId, text) => {
        if (!text.trim()) return;
        setPosts(prev => prev.map(p => p.id !== postId ? p : {
            ...p,
            comments: p.comments.map(c => c.id === commentId
                ? { ...c, replies: [...(c.replies || []), { id: Date.now(), author: currentUser, text, likes: 0, isLiked: false, time: 'Just now', isExpert: false }] }
                : c)
        }));
    };

    const handleReport = (postId, reason) => {
        setReportedPosts(prev => new Set([...prev, postId]));
        showToast('Report submitted. We\'ll review it shortly.', 'info');
    };

    const handleSave = (postId) => {
        if (!user) { showToast('Please log in to save posts.', 'info'); return; }
        ud.toggleSavePost(postId);
        setPosts(prev => prev.map(p => {
            if (p.id !== postId) return p;
            const isSaved = ud.isPostSaved(postId);
            showToast(isSaved ? 'Post unsaved.' : 'Post saved! +3 pts 🔖');
            return p;
        }));
    };

    const handleShare = (title) => {
        if (navigator.share) { navigator.share({ title, url: window.location.href }).catch(() => { }); }
        else { navigator.clipboard?.writeText(window.location.href); showToast('Link copied! 🔗'); }
    };

    const handleDelete = (id) => {
        ud.deleteDiscussion(id);
        setPosts(prev => prev.filter(p => p.id !== id));
        showToast('Post removed.');
    };

    const handleCreatePost = (data) => {
        if (!user) { showToast('Please log in to post.', 'info'); return; }
        const newPost = {
            id: Date.now(), author: data.isAnonymous ? 'Anonymous' : currentUser,
            category: data.category, isExpert: false, isAnonymous: data.isAnonymous,
            title: data.title, content: data.content, tags: data.tags,
            likes: 0, savedBy: [], time: 'Just now',
            comments: [], isReported: false, showComments: false, points: 0,
        };
        setPosts(prev => [newPost, ...prev]);
        ud.addDiscussion(data);
        setIsCreateOpen(false);
        showToast('Discussion posted! +10 pts 🌳');
    };

    // ── Filter & Sort ──
    const filteredPosts = useMemo(() => {
        let result = [...posts];
        if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory);
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q)));
        }
        if (activeSort === 'popular') result.sort((a, b) => b.likes - a.likes);
        if (activeSort === 'recent') result.sort((a, b) => a.id < b.id ? 1 : -1);
        if (activeSort === 'unanswered') result = result.filter(p => p.comments.length === 0);
        if (activeSort === 'expert') result = result.filter(p => p.isExpert || p.comments.some(c => c.isExpert));
        return result;
    }, [posts, activeCategory, activeSort, searchQuery]);

    // myBadge now comes from the context (set above)

    return (
        <div className="w-full bg-[#f8f9f4] -mt-8 -mx-4 px-4 py-12 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* ── Toast ── */}
                {toast && (
                    <div className={`fixed bottom-6 right-6 z-[300] px-5 py-3.5 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 transition-all animate-bounce-once ${toast.type === 'info' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>
                        <Check className="w-4 h-4" /> {toast.msg}
                    </div>
                )}

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
                            The NatureWellness <span className="text-emerald-500 italic">Community</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 max-w-lg">A sanctuary for sharing, healing, and growing together 🌿</p>
                    </div>
                    <div className="flex flex-wrap gap-3 shrink-0">
                        <Link to="/success-stories" className="px-5 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm font-bold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-all text-sm">
                            <Star className="w-4 h-4 text-amber-500" /> Stories
                        </Link>
                        <button onClick={() => setIsCreateOpen(true)}
                            className="px-6 py-3 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/25 font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all active:scale-95 text-sm">
                            <Plus className="w-4 h-4" /> Start Discussion
                        </button>
                    </div>
                </div>

                {/* ── Search Bar ── */}
                <div className="max-w-2xl mx-auto w-full">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search discussions, stories, or experts..."
                            className="w-full py-4 pl-14 pr-6 bg-white rounded-2xl border border-slate-100 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-200 transition-all font-medium text-sm text-slate-700" />
                    </div>
                    {/* Trending tags */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {['#anxiety', '#ashwagandha', '#pcos', '#meditation', '#detox'].map(tag => (
                            <button key={tag} onClick={() => setSearchQuery(tag.slice(1))}
                                className="text-[11px] font-bold text-slate-400 bg-white px-3 py-1.5 rounded-full border border-slate-100 hover:text-emerald-500 hover:border-emerald-200 transition-all">
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Three-Column Layout ── */}
                <div className="flex flex-col lg:flex-row gap-8 items-start">

                    {/* ── Left Sidebar ── */}
                    <aside className="w-full lg:w-64 space-y-5 shrink-0">
                        {/* My Badge Card */}
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-500 p-6 rounded-3xl text-white shadow-lg shadow-emerald-500/20">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-3">Your Reputation</p>
                            <div className="text-3xl mb-1">{myBadge.icon}</div>
                            <h3 className="font-bold text-lg">{myBadge.label}</h3>
                            <p className="text-emerald-100/80 text-xs font-bold mt-1">{myPoints} pts earned</p>
                            <div className="mt-3 space-y-1">
                                <ProgressBar value={myPoints - 200} max={600} />
                                <p className="text-[10px] opacity-60 font-bold">Next: 🌳 Nature Mentor at 800 pts</p>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-3.5 h-3.5" /> Categories
                            </h3>
                            <div className="space-y-1">
                                {CATEGORIES.map(cat => (
                                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                                        className={`w-full text-left p-3 rounded-2xl font-bold text-sm transition-all flex justify-between items-center ${activeCategory === cat.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-500 hover:bg-slate-50'}`}>
                                        <div className="flex items-center gap-2.5">
                                            <cat.icon className="w-4 h-4 shrink-0" />
                                            <span>{cat.name}</span>
                                        </div>
                                        {cat.count && <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${activeCategory === cat.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>{cat.count}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daily Challenges */}
                        <div className="bg-emerald-900 p-6 rounded-3xl text-white shadow-xl shadow-emerald-900/20">
                            <div className="flex items-center gap-2 mb-4">
                                <Flame className="w-5 h-5 text-orange-400" />
                                <h3 className="font-bold text-sm">Daily Challenges</h3>
                            </div>
                            <div className="space-y-4">
                                {CHALLENGES.map(ch => (
                                    <div key={ch.id}>
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-xs font-bold text-emerald-100">{ch.emoji} {ch.title}</span>
                                            <span className="text-[10px] text-orange-400 font-black">🔥{ch.streak}</span>
                                        </div>
                                        <ProgressBar value={ch.progress} max={ch.total} />
                                        <p className="text-[10px] text-emerald-100/50 font-bold mt-1">{ch.progress}/{ch.total} days</p>
                                    </div>
                                ))}
                            </div>
                            <Link to="/challenges" className="block mt-5 text-center text-[10px] font-black uppercase tracking-widest text-emerald-400 hover:text-white transition-colors">
                                View All Challenges →
                            </Link>
                        </div>
                    </aside>

                    {/* ── Main Feed ── */}
                    <main className="flex-1 min-w-0 space-y-5">
                        {/* Sort Bar */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                            {SORT_OPTIONS.map(opt => (
                                <button key={opt.id} onClick={() => setActiveSort(opt.id)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${activeSort === opt.id ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-white text-slate-500 border border-slate-100 hover:border-emerald-200 hover:text-emerald-600'}`}>
                                    {opt.label}
                                </button>
                            ))}
                            <span className="ml-auto text-xs font-bold text-slate-400">{filteredPosts.length} posts</span>
                        </div>

                        {filteredPosts.length === 0 ? (
                            <div className="bg-white rounded-3xl p-16 text-center border border-slate-100">
                                <div className="text-5xl mb-4">🌿</div>
                                <h3 className="font-bold text-slate-700 mb-2">No discussions found</h3>
                                <p className="text-slate-400 text-sm font-medium">Be the first to start one!</p>
                                <button onClick={() => setIsCreateOpen(true)}
                                    className="mt-6 px-6 py-3 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all">
                                    Start Discussion
                                </button>
                            </div>
                        ) : (
                            filteredPosts.filter(p => !reportedPosts.has(p.id)).map(post => {
                                const isOwner = ud.profile.myDiscussions.some(d => String(d.id) === String(post.id));
                                return (
                                    <PostCard key={post.id} post={post}
                                        onLike={handleLike}
                                        onToggleComments={handleToggleComments}
                                        onAddComment={handleAddComment}
                                        onLikeComment={handleLikeComment}
                                        onReplyComment={handleReplyComment}
                                        onReport={handleReport}
                                        onSave={handleSave}
                                        onShare={handleShare}
                                        onDelete={handleDelete}
                                        currentUser={currentUser}
                                        isOwner={isOwner}
                                    />
                                );
                            })
                        )}
                    </main>

                    {/* ── Right Sidebar ── */}
                    <aside className="w-full lg:w-64 space-y-5 shrink-0">
                        {/* Leaderboard */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                                <Trophy className="w-3.5 h-3.5" /> Top Healers
                            </h3>
                            <div className="space-y-4">
                                {TOP_HEALERS.map((h, i) => (
                                    <div key={h.name} className="flex items-center gap-3">
                                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-black text-xs ${i === 0 ? 'bg-amber-100 text-amber-700' : i === 1 ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-700'}`}>
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-slate-800 text-sm truncate">{h.name}</span>
                                                {h.isExpert && <BadgeCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-bold">{h.badge} {h.points} pts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Badges Guide */}
                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                <Award className="w-3.5 h-3.5" /> Badges
                            </h3>
                            <div className="space-y-3">
                                {Object.values(BADGES).map(b => (
                                    <div key={b.label} className="flex items-center gap-3">
                                        <span className="text-xl">{b.icon}</span>
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{b.label}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">{b.min}+ points</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expert Tip */}
                        <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-3 flex items-center gap-2">
                                <BookOpen className="w-3.5 h-3.5" /> Daily Expert Tip
                            </h3>
                            <p className="text-sm font-medium text-amber-900/80 italic leading-relaxed">
                                "Sharing your healing journey not only helps you process your experience but also lights the path for someone else in darkness."
                            </p>
                            <p className="text-[10px] text-amber-600 font-black mt-3">— Dr. Aranya Seth, Naturopath</p>
                        </div>

                        {/* Anonymous Safe Space Card */}
                        <div className="p-6 bg-violet-50 rounded-3xl border border-violet-100">
                            <ShieldCheck className="w-6 h-6 text-violet-400 mb-3" />
                            <h3 className="font-bold text-violet-800 text-sm mb-1">Safe Space 🛡️</h3>
                            <p className="text-xs text-violet-700/70 font-medium leading-relaxed">
                                Struggling with mental health, depression, or anxiety? Post anonymously — your identity is fully protected.
                            </p>
                            <button onClick={() => setIsCreateOpen(true)}
                                className="mt-4 w-full py-2.5 bg-violet-500 text-white rounded-xl font-bold text-xs hover:bg-violet-600 transition-all">
                                Post Anonymously
                            </button>
                        </div>
                    </aside>
                </div>
            </div>

            {/* ── Create Post Modal ── */}
            {isCreateOpen && <CreatePostModal onClose={() => setIsCreateOpen(false)} onSubmit={handleCreatePost} />}
        </div>
    );
}
