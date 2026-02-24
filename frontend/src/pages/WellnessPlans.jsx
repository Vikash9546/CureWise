import { useState, useMemo } from 'react';
import {
    Activity, Apple, Brain, Calendar, CheckCircle2, ChevronRight,
    Clock, Coffee, Droplets, Flame, Heart, Moon, Plus,
    RefreshCw, Shield, Sparkles, Star, Sun, Target,
    TrendingUp, User, Wind, Zap, Lock, Info, ArrowLeft, Trophy
} from 'lucide-react';
import { useUserData } from '../context/UserDataContext';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// ── Static Data & Logic ────────────────────────────────────────

const HEALTH_GOALS = [
    { id: 'stress', label: 'Stress Relief', icon: Brain, color: 'text-violet-500', bg: 'bg-violet-50', desc: 'Reduce cortisol and calm your nervous system.' },
    { id: 'weight', label: 'Weight Loss', icon: Target, color: 'text-rose-500', bg: 'bg-rose-50', desc: 'Burn fat and improve metabolic health naturally.' },
    { id: 'sleep', label: 'Better Sleep', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50', desc: 'Regulate your circadian rhythm and deep rest.' },
    { id: 'immunity', label: 'Immunity Boost', icon: Shield, color: 'text-emerald-500', bg: 'bg-emerald-50', desc: 'Strengthen your internal defenses with herbs.' },
    { id: 'hormone', label: 'Hormone Balance', icon: Sparkles, color: 'text-pink-500', bg: 'bg-pink-50', desc: 'Align your cycles and moods through nutrition.' },
];

const PLAN_TEMPLATES = {
    stress: {
        diet: ['Morning: Moon Milk with Ashwagandha', 'Lunch: Quinoa and Steamed Greens', 'Dinner: Warm Mung Bean Soup'],
        routine: ['7 AM: Deep Breathing (10 mins)', '1 PM: Short Walk in Nature', '9 PM: Digital Detox'],
        tasks: ['Morning Meditation', 'Tulsi Tea Break', 'Gentle Stretching'],
    },
    weight: {
        diet: ['Morning: Warm Lemon Water', 'Lunch: Large Salad with Chickpeas', 'Dinner: Roasted Veggies'],
        routine: ['6 AM: 30-min Brisk Walk', '12 PM: No Heavy Meals', '7 PM: Early Dinner'],
        tasks: ['Weight Track', 'Step Goal (10k)', 'No Refined Sugar'],
    },
    sleep: {
        diet: ['Morning: Ginger Tea', 'Lunch: Balanced Bowl', 'Dinner: Light Rice and Dal'],
        routine: ['8 PM: No Blue Light', '9 PM: Chamomile Tea', '10 PM: Sleep'],
        tasks: ['Sunlight Exposure', 'Evening Journaling', 'Cool Shower'],
    },
    immunity: {
        diet: ['Morning: Turmeric & Honey Water', 'Lunch: Seasonal Veggie Curry', 'Dinner: Nutritious Broth'],
        routine: ['7 AM: Sun Salutations', '2 PM: Sunshine Break', '9 PM: restorative rest'],
        tasks: ['Herbal Infusion', 'Vitamin C Intake', 'Breathing exercises'],
    },
    hormone: {
        diet: ['Morning: Seed Cycling Mix', 'Lunch: Avocado & Flax Salad', 'Dinner: Sweet Potato Base'],
        routine: ['ASAP: Sunlight exposure', 'Night: Epsom Salt Bath', '11 PM: Lights out'],
        tasks: ['Track Mood', 'Magnesium Rich Food', 'Yoga for Balance'],
    }
};

const generatePlan = (goal) => {
    const template = PLAN_TEMPLATES[goal] || PLAN_TEMPLATES.stress;
    const days = [];
    for (let i = 1; i <= 7; i++) {
        days.push({
            day: i,
            diet: template.diet,
            routine: template.routine,
            tasks: template.tasks.map(t => ({ id: `d${i}-t${Math.random()}`, label: t, completed: false }))
        });
    }
    return {
        id: Date.now(),
        goal,
        days,
        createdAt: new Date().toISOString()
    };
};

// ── Components ────────────────────────────────────────────────

export default function WellnessPlans() {
    const { user } = useAuth();
    const { profile, saveWellnessPlan, logDailyActivity, toggleHabitTask } = useUserData();

    const [step, setStep] = useState(0); // 0: Start, 1: Assessment, 2: Goal, 3: Generating
    const [formData, setFormData] = useState({
        age: '', gender: 'other', weight: '', height: '',
        sleepHours: '7', stressLevel: '5', waterIntake: '2',
        healthGoal: ''
    });
    const [showConfirm, setShowConfirm] = useState(false);

    const activePlan = profile.activePlan;
    const today = new Date().toISOString().slice(0, 10);
    const dayIndex = activePlan ? Math.min(6, Math.floor((Date.now() - new Date(activePlan.createdAt)) / 86400000)) : 0;
    const currentDayData = activePlan?.days[dayIndex];
    const dailyLog = { water: 0, sleep: 0, weight: '', mood: 5, completedTasks: [], ...(profile.dailyLogs[today] || {}) };

    const handleStart = () => {
        if (!user) { toast.error('Please log in to create a plan'); return; }
        setStep(1);
    };

    const handleGenerate = () => {
        setStep(3);
        setTimeout(() => {
            const plan = generatePlan(formData.healthGoal);
            saveWellnessPlan(formData, plan);
            toast.success('Your personalized wellness plan is ready! 🌿');
            setStep(0);
        }, 3000);
    };

    const handleLogTask = (taskId) => {
        toggleHabitTask(today, taskId);
    };

    const progressValue = useMemo(() => {
        if (!currentDayData) return 0;
        const total = currentDayData.tasks.length;
        const done = currentDayData.tasks.filter(t => dailyLog.completedTasks.includes(t.id)).length;
        return Math.round((done / total) * 100);
    }, [currentDayData, dailyLog]);

    if (!user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-[#f8f9f4]">
                <div className="text-center bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl max-w-lg">
                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-8">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 font-outfit">Exclusive Access</h2>
                    <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                        Personalized wellness plans are tailored specifically to your body and lifestyle. Please log in to start your transformation journey.
                    </p>
                    <Link to="/login" className="inline-block px-10 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25">
                        Log In Now
                    </Link>
                </div>
            </div>
        );
    }

    // ── Render: Goal Selection Screen ──
    if (step === 2) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 transition-all animate-in fade-in slide-in-from-bottom-4">
                <button onClick={() => setStep(1)} className="mb-8 flex items-center gap-2 text-slate-400 font-bold hover:text-slate-900 transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Go Back
                </button>
                <div className="mb-12">
                    <h2 className="text-4xl font-bold text-slate-900 mb-2 font-outfit">Choose Your Primary <span className="text-emerald-500 italic">Goal</span></h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Select the area you want to focus on for the next 7 days.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {HEALTH_GOALS.map(goal => (
                        <button key={goal.id}
                            onClick={() => { setFormData({ ...formData, healthGoal: goal.id }); handleGenerate(); }}
                            className={`flex items-start gap-6 p-8 rounded-[2.5rem] bg-white border border-slate-100 text-left transition-all hover:shadow-2xl hover:shadow-emerald-900/5 group relative overflow-hidden`}>
                            <div className={`w-14 h-14 rounded-2xl ${goal.bg} ${goal.color} flex items-center justify-center shrink-0`}>
                                <goal.icon className="w-7 h-7" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition-colors uppercase text-sm tracking-wide">{goal.label}</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">{goal.desc}</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                <ChevronRight className="w-6 h-6 text-emerald-500" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // ── Render: Assessment Form ──
    if (step === 1) {
        return (
            <div className="max-w-3xl mx-auto py-12 px-4">
                <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl p-10 md:p-16 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2 font-outfit">Health Assessment</h2>
                                <p className="text-slate-400 font-medium">Let's build your natural wellness blueprint.</p>
                            </div>
                            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black">1/2</div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Weight (kg)</label>
                                <input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                    placeholder="e.g. 70" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Height (cm)</label>
                                <input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })}
                                    placeholder="e.g. 175" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-700" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Avg. Sleep (hrs)</label>
                                <select value={formData.sleepHours} onChange={e => setFormData({ ...formData, sleepHours: e.target.value })}
                                    className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-700">
                                    <option value="4">Less than 5</option>
                                    <option value="6">5 - 7 hours</option>
                                    <option value="8">7 - 9 hours</option>
                                    <option value="10">9+ hours</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Daily Water (L)</label>
                                <input type="number" value={formData.waterIntake} onChange={e => setFormData({ ...formData, waterIntake: e.target.value })}
                                    placeholder="Liters" className="w-full p-4 bg-slate-50 rounded-2xl border-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-700" />
                            </div>
                        </div>

                        <div className="space-y-4 mb-12">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stress Level (1-10)</label>
                            <input type="range" min="1" max="10" value={formData.stressLevel} onChange={e => setFormData({ ...formData, stressLevel: e.target.value })}
                                className="w-full accent-emerald-500 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer" />
                            <div className="flex justify-between text-[10px] font-black text-slate-300 uppercase tracking-tighter px-1">
                                <span>Totally Zen</span>
                                <span>Moderate</span>
                                <span>High Stress</span>
                            </div>
                        </div>

                        <button onClick={() => setStep(2)}
                            disabled={!formData.weight || !formData.height}
                            className="w-full py-5 bg-emerald-500 text-white rounded-[2rem] font-bold text-lg hover:shadow-2xl hover:shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                            Continue Journey <ChevronRight className="inline-block w-5 h-5 ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ── Render: Generating Simulation ──
    if (step === 3) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="relative w-40 h-40 mx-auto mb-10">
                        <div className="absolute inset-0 border-[12px] border-emerald-50 rounded-full"></div>
                        <div className="absolute inset-0 border-[12px] border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="w-12 h-12 text-emerald-500 animate-pulse" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4 font-outfit italic">Designing Your Path...</h2>
                    <p className="text-slate-500 font-medium">Wait a moment while our system analyzes your bio-data to curate the perfect herbal and routine blend.</p>
                </div>
            </div>
        );
    }

    // ── Render: Active Dashboard ──
    if (activePlan) {
        return (
            <div className="max-w-7xl mx-auto py-12 px-4 space-y-12">
                {/* Header Profile Summary */}
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full">Active Plan</span>
                            <span className="text-slate-400 font-bold text-sm">Started {new Date(activePlan.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                            Namaste, {user.name?.split(' ')[0] || 'Seeker'}. <br />
                            Today is <span className="text-emerald-500 italic">Day {dayIndex + 1}</span>
                        </h1>
                    </div>
                    <div className="flex gap-4 mt-8 md:mt-0">
                        <div className="text-center p-6 bg-[#f8f9f4] rounded-[2.5rem] border border-slate-100/50 min-w-[140px]">
                            <p className="text-[10px] font-black uppercase text-slate-400 mb-2">My Focus</p>
                            <Target className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                            <p className="font-bold text-slate-800 text-sm">{formData.healthGoal.toUpperCase()}</p>
                        </div>
                        <div className="text-center p-6 bg-emerald-900 rounded-[2.5rem] text-white min-w-[140px]">
                            <p className="text-[10px] font-black uppercase text-emerald-400 mb-2">Today's Progress</p>
                            <div className="text-3xl font-bold mb-1">{progressValue}%</div>
                            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-400" style={{ width: `${progressValue}%` }} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Tasks Checklist */}
                    <div className="lg:col-span-2 space-y-8">
                        <section>
                            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center justify-between">
                                Daily Tasks
                                <span className="text-xs font-black text-slate-400">{currentDayData.tasks.length} Habits</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentDayData.tasks.map(task => {
                                    const done = dailyLog.completedTasks.includes(task.id);
                                    return (
                                        <button key={task.id}
                                            onClick={() => handleLogTask(task.id)}
                                            className={`flex items-center gap-4 p-6 rounded-[2.2rem] border transition-all text-left ${done ? 'bg-emerald-50/50 border-emerald-200' : 'bg-white border-slate-100 hover:border-emerald-200 shadow-sm'}`}>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 transition-all ${done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 text-slate-200'}`}>
                                                {done ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                                            </div>
                                            <span className={`font-bold text-sm ${done ? 'text-emerald-700' : 'text-slate-600'}`}>{task.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Nutrition Hub */}
                        <section className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <h3 className="text-2xl font-bold text-slate-900 mb-10 flex items-center gap-4">
                                <Apple className="w-7 h-7 text-rose-500" /> Bio-Dynamic Diet
                            </h3>
                            <div className="space-y-8">
                                {currentDayData.diet.map((item, idx) => (
                                    <div key={idx} className="flex gap-6 items-start">
                                        <div className="w-2 rounded-full h-12 bg-emerald-100" />
                                        <p className="text-lg font-bold text-slate-700 leading-relaxed italic">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Routine */}
                            <div className="bg-violet-900 text-white p-10 rounded-[3.5rem] shadow-2xl shadow-violet-900/20">
                                <h4 className="flex items-center gap-2 font-bold mb-8 text-violet-300">
                                    <Clock className="w-5 h-5" /> Clockwork Habits
                                </h4>
                                <div className="space-y-6">
                                    {currentDayData.routine.map((r, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-2 shrink-0" />
                                            <p className="text-sm font-medium text-violet-100">{r}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Herba Reminders */}
                            <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                                <div>
                                    <h4 className="flex items-center gap-2 font-bold mb-6 text-slate-900">
                                        <Sparkles className="w-5 h-5 text-amber-500" /> Smart Reminders
                                    </h4>
                                    <p className="text-slate-400 text-sm font-medium mb-6">Stay hydrated and grounded throughout the day.</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <Droplets className="w-4 h-4 text-emerald-500" />
                                            <span className="text-xs font-bold text-slate-700">Water Log (L)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => logDailyActivity(today, { water: Math.max(0, dailyLog.water - 0.25) })} className="w-6 h-6 flex items-center justify-center text-slate-400">-</button>
                                            <span className="text-sm font-black text-emerald-600">{dailyLog.water.toFixed(2)}</span>
                                            <button onClick={() => logDailyActivity(today, { water: dailyLog.water + 0.25 })} className="w-6 h-6 flex items-center justify-center text-emerald-500">+</button>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <Moon className="w-4 h-4 text-indigo-500" />
                                            <span className="text-xs font-bold text-slate-700">Mood</span>
                                        </div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map(v => (
                                                <button key={v} onClick={() => logDailyActivity(today, { mood: v })}
                                                    className={`w-6 h-6 rounded-lg transition-all ${dailyLog.mood === v ? 'bg-indigo-500' : 'bg-indigo-50 hover:bg-indigo-100'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-lg">
                            <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" /> Weekly Heatmap
                            </h3>
                            <div className="grid grid-cols-7 gap-2">
                                {activePlan.days.map((d, i) => (
                                    <div key={i} className={`aspect-square rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${i < dayIndex ? 'bg-emerald-500 border-emerald-500 text-white' : i === dayIndex ? 'bg-emerald-50 border-emerald-500 text-emerald-600 border-2 scale-110 shadow-lg shadow-emerald-500/10' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                                        {d.day}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                                <p className="text-xs text-slate-400 font-medium mb-1 uppercase tracking-widest">Wellness Streak</p>
                                <div className="text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
                                    <Flame className="w-6 h-6 text-orange-500 fill-orange-500" /> {profile.streak} Days
                                </div>
                            </div>
                        </div>

                        <div className="bg-emerald-900 text-white p-10 rounded-[3rem] shadow-2xl shadow-emerald-900/30 overflow-hidden relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                            <Trophy className="w-12 h-12 text-emerald-400 mb-6" />
                            <h4 className="text-2xl font-bold mb-4">You're doing <br />amazing.</h4>
                            <p className="text-emerald-100/60 text-sm font-medium mb-8">One day at a time, you are shifting your body towards its natural state of balance.</p>
                            <button onClick={() => setShowConfirm(true)}
                                className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-black uppercase tracking-[0.2em] transition-all border border-white/10">
                                Regenerate Plan
                            </button>
                        </div>
                    </div>
                    {/* Custom Confirm Modal */}
                    {showConfirm && (
                        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                            <div className="bg-white rounded-[3rem] p-10 max-w-md w-full shadow-2xl scale-in-center overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <div className="relative">
                                    <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                                        <RefreshCw className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 font-outfit">Reset Journey?</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                        Your current progress will be archived, and you'll be able to re-assess your health goals.
                                    </p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setShowConfirm(false)}
                                            className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                                            Cancel
                                        </button>
                                        <button onClick={() => { setShowConfirm(false); setStep(1); }}
                                            className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">
                                            Restart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // ── Render: Get Started Screen ──
    return (
        <div className="min-h-screen bg-[#f8f9f4] py-16 px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full font-black text-[10px] uppercase tracking-widest">
                        <Sparkles className="w-3.5 h-3.5" /> High Performance Living
                    </div>
                    <h1 className="text-6xl md:text-7xl font-bold text-slate-900 font-outfit leading-[1.1]">
                        Healing is <br />Not <span className="text-emerald-500 italic">Generic.</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-lg">
                        NatureWellness uses ancient herbal wisdom and modern bio-data to craft a wellness blueprint as unique as your fingerprint.
                    </p>

                    <div className="space-y-6">
                        {[
                            { icon: Calendar, text: 'Custom 7-Day Intensive Plan' },
                            { icon: Apple, text: 'Bio-Dynamic Nutritional Guide' },
                            { icon: TrendingUp, text: 'Real-time Progress Analytics' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <span className="font-bold text-slate-700">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={handleStart}
                        className="group flex items-center gap-6 px-10 py-5 bg-emerald-500 text-white rounded-[2.5rem] font-bold text-xl hover:bg-emerald-600 transition-all shadow-2xl shadow-emerald-500/30 hover:scale-105 active:scale-95">
                        Get Started <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center transition-all group-hover:translate-x-2"><ChevronRight className="w-6 h-6" /></div>
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/10 rounded-[4rem] blur-[100px]" />
                    <div className="relative bg-white p-12 rounded-[4.5rem] border border-slate-100 shadow-2xl overflow-hidden">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200">
                                <Activity className="w-8 h-8" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Health Score</h4>
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} className={`w-6 h-1 rounded-full ${i < 4 ? 'bg-emerald-400' : 'bg-slate-100'}`} />)}
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="h-4 bg-slate-50 rounded-full w-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-2/3 rounded-full" />
                            </div>
                            <div className="h-4 bg-slate-50 rounded-full w-5/6 overflow-hidden">
                                <div className="h-full bg-violet-400 w-1/2 rounded-full" />
                            </div>
                            <div className="h-4 bg-slate-50 rounded-full w-3/4 overflow-hidden">
                                <div className="h-full bg-rose-400 w-1/3 rounded-full" />
                            </div>
                        </div>
                        <div className="mt-12 flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-xs font-black text-slate-400 uppercase mb-1">Status</p>
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">Optimizing</span>
                            </div>
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                                <Zap className="w-6 h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
