import { useEffect } from 'react';
import { Zap, Target, Award, Flame, Calendar, CheckCircle2, Trophy, ArrowRight, Wind, Coffee, Plus, Lock } from 'lucide-react';
import { useUserData, BADGE_DEFS } from '../context/UserDataContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ALL_CHALLENGES = [
    {
        id: 1,
        title: '7-Day Herbal Tea Ritual',
        description: 'Replace your morning coffee with an antioxidant-rich herbal infusion (Green tea, Tulsi, or Ginger).',
        days: 7, category: 'Detox', difficulty: 'Easy', reward: 200, icon: Coffee,
    },
    {
        id: 2,
        title: '14-Day Morning Mindfulness',
        description: '10 minutes of guided meditation or rhythmic breathing every day before breakfast.',
        days: 14, category: 'Mental Health', difficulty: 'Intermediate', reward: 500, icon: Wind,
    },
    {
        id: 3,
        title: '30-Day Sugar Reset',
        description: 'Zero refined sugar intake. Focus on natural sweeteners like honey or organic jaggery.',
        days: 30, category: 'Diet', difficulty: 'Hard', reward: 1200, icon: Target,
    },
    {
        id: 4,
        title: '21-Day Yoga Journey',
        description: 'Complete at least 20 minutes of yoga every morning for 21 consecutive days.',
        days: 21, category: 'Fitness', difficulty: 'Intermediate', reward: 800, icon: Zap,
    },
    {
        id: 5,
        title: '10-Day Digital Detox Evenings',
        description: 'No screens after 9 PM for 10 days. Journal your thoughts instead.',
        days: 10, category: 'Mental Health', difficulty: 'Easy', reward: 300, icon: Trophy,
    },
];

const BADGE_DEFS_LOCAL = [
    { name: 'Herbal Explorer', icon: '🌿', condition: 'Complete 3 Herbal Challenges' },
    { name: 'Nature Healer', icon: '🏆', condition: 'Reach a 15-day Streak' },
    { name: 'Zen Master', icon: '🧘', condition: '100 Minutes of Meditation' },
    { name: 'Sugar-Free Champion', icon: '🥇', condition: 'Complete the 30-Day Sugar Reset' },
];

const diffColor = (d) => d === 'Easy' ? 'bg-emerald-50 text-emerald-600' : d === 'Intermediate' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600';

export default function DailyChallenges() {
    const { user } = useAuth();
    const ud = useUserData();

    const points = ud.profile.points;
    const streak = ud.profile.streak;
    const badge = ud.currentBadge;

    // Run streak check once per session on mount
    useEffect(() => {
        if (user) ud.checkStreak();
    }, [user]); // eslint-disable-line

    return (
        <div className="min-h-screen bg-[#f8f9f4] py-20 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Dashboard Header */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    <div className="lg:col-span-2 bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-emerald-900/5 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                        <h1 className="text-5xl font-bold text-slate-900 mb-6">
                            Rise Above. <br />
                            <span className="text-emerald-500 italic">Level Up Your Life.</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-lg mb-8 leading-relaxed">
                            Consistency is the key to natural healing. Complete daily tasks, maintain your streak, and earn legendary badges.
                        </p>

                        {user ? (
                            <div className="flex gap-8 flex-wrap">
                                {/* Streak */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 border border-orange-100">
                                        <Flame className="w-6 h-6 fill-orange-500" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Streak</span>
                                        <p className="text-xl font-black text-slate-800">{streak} Days 🔥</p>
                                    </div>
                                </div>
                                {/* Points */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                                        <Zap className="w-6 h-6 fill-emerald-600" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wellness Points</span>
                                        <p className="text-xl font-black text-slate-800">{points} pts</p>
                                    </div>
                                </div>
                                {/* Badge */}
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center border border-violet-100 text-2xl">
                                        {badge?.icon || '🌱'}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Rank</span>
                                        <p className="text-xl font-black text-slate-800">{badge?.label || 'Beginner'}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-center gap-4">
                                <Lock className="w-6 h-6 text-emerald-500 shrink-0" />
                                <div>
                                    <p className="font-bold text-emerald-800">Log in to track your progress</p>
                                    <p className="text-sm text-emerald-600 font-medium">Your streak, points, and badges are saved to your account.</p>
                                </div>
                                <Link to="/login" className="ml-auto px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-all shrink-0">
                                    Log In
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Badges sidebar */}
                    <div className="bg-emerald-900 p-10 rounded-[3.5rem] text-white flex flex-col justify-between">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-6">Badges to Unlock 🏅</h3>
                            <div className="space-y-5">
                                {BADGE_DEFS_LOCAL.map(badge => (
                                    <div key={badge.name} className="flex gap-4 items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shrink-0">
                                            {badge.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">{badge.name}</h4>
                                            <p className="text-[10px] text-emerald-100/60 font-medium">{badge.condition}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Earned badges */}
                        {ud.profile.badges.length > 1 && (
                            <div className="mt-8 border-t border-white/10 pt-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Your Earned Badges</p>
                                <div className="flex flex-wrap gap-2">
                                    {ud.profile.badges.map(bId => {
                                        const def = BADGE_DEFS.find(b => b.id === bId);
                                        return def ? (
                                            <span key={bId} title={def.label} className="text-xl cursor-default" aria-label={def.label}>{def.icon}</span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Challenges Grid */}
                <h2 className="text-3xl font-bold text-slate-900 mb-12 flex items-center gap-4">
                    Available Challenges <span className="h-px flex-1 bg-slate-100" />
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {ALL_CHALLENGES.map(challenge => {
                        const joined = ud.isChallengeJoined(challenge.id);
                        const progress = ud.getChallengeProgress(challenge.id);
                        const completed = ud.profile.challengesCompleted.includes(challenge.id);
                        const pct = Math.min(100, (progress / challenge.days) * 100);
                        const Icon = challenge.icon;

                        return (
                            <div key={challenge.id} className={`bg-white p-8 rounded-[3rem] border shadow-sm hover:shadow-2xl hover:shadow-emerald-900/5 transition-all group ${completed ? 'border-emerald-200 bg-emerald-50/50' : 'border-slate-100'}`}>
                                <div className="flex justify-between items-start mb-8">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all ${completed ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-emerald-500 group-hover:text-white'}`}>
                                        {completed ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {completed && <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-2.5 py-1 rounded-full">✓ Completed!</span>}
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${diffColor(challenge.difficulty)}`}>
                                            {challenge.difficulty}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 mb-3">{challenge.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">{challenge.description}</p>

                                {/* Progress bar — shown only if joined */}
                                {joined && (
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</span>
                                            <span className="text-xs font-black text-slate-700">{progress} / {challenge.days} Days</span>
                                        </div>
                                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                                                style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                )}

                                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600">
                                        <Award className="w-3.5 h-3.5" /> +{challenge.reward} PTS
                                    </div>

                                    {!user ? (
                                        <Link to="/login" className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-emerald-600 transition-colors">
                                            <Lock className="w-3.5 h-3.5" /> Log in to join
                                        </Link>
                                    ) : completed ? (
                                        <span className="text-xs font-black text-emerald-600">🏅 Done!</span>
                                    ) : joined ? (
                                        <button
                                            onClick={() => { ud.logChallengeDay(challenge.id, challenge.days); }}
                                            className="flex items-center gap-1.5 text-xs font-black text-emerald-600 hover:translate-x-1 transition-transform">
                                            Log Today <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => ud.joinChallenge(challenge.id)}
                                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all active:scale-95">
                                            <Plus className="w-3.5 h-3.5" /> Join Challenge
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Calendar heatmap */}
                <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 text-center">
                    <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">Your Wellness Calendar</h3>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto mb-8">
                        Visualise your journey. Each filled circle represents a day you chose nature over habit.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        {[...Array(14)].map((_, i) => (
                            <div key={i} className={`w-10 h-10 rounded-xl border-2 transition-all ${i < Math.min(streak, 14) ? 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/30' : 'border-slate-100'}`} />
                        ))}
                    </div>
                    {streak > 0 && (
                        <p className="mt-4 text-sm font-bold text-emerald-600">{streak}-day streak! Keep going 🔥</p>
                    )}
                </div>
            </div>
        </div>
    );
}
