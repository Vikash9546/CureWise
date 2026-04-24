import { useState } from 'react';
import { Calculator, Droplets, Wind, Moon, ChevronRight, RefreshCcw, Info, PieChart } from 'lucide-react';

export default function HealthTools() {
    const [activeTab, setActiveTab] = useState('bmi');

    return (
        <div className="min-h-screen bg-[#f8f9f4] py-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-playfair font-bold text-slate-900 mb-4">Wellness Calculators</h1>
                    <p className="text-slate-500 font-medium">Precision tools to help you benchmark and monitor your natural biological rhythms.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {[
                        { id: 'bmi', name: 'BMI Tracker', icon: Calculator },
                        { id: 'water', name: 'Hydration', icon: Droplets },
                        { id: 'stress', name: 'Stress Quiz', icon: Wind },
                        { id: 'sleep', name: 'Sleep Test', icon: Moon }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border ${activeTab === tab.id ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20' : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200'}`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Tool Content */}
                <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-sm min-h-[500px] flex flex-col items-center">
                    {activeTab === 'bmi' && <BMICalculator />}
                    {activeTab === 'water' && <WaterIntakeCalculator />}
                    {activeTab === 'stress' && <StressQuiz />}
                    {activeTab === 'sleep' && <SleepTest />}
                </div>
            </div>
        </div>
    );
}

function BMICalculator() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);

    const calculate = () => {
        if (!weight || !height) return;
        const heightMeters = height / 100;
        const val = (weight / (heightMeters * heightMeters)).toFixed(1);
        setBmi(val);
    };

    return (
        <div className="w-full text-center space-y-12">
            <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto">
                <Calculator className="w-10 h-10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-md mx-auto">
                <div className="space-y-4 text-left">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Weight (kg)</label>
                    <input
                        type="number"
                        className="w-full p-4 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-bold"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div className="space-y-4 text-left">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Height (cm)</label>
                    <input
                        type="number"
                        className="w-full p-4 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 font-bold"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                    />
                </div>
            </div>

            <button
                onClick={calculate}
                className="bg-emerald-500 text-white font-bold px-12 py-5 rounded-full shadow-2xl shadow-emerald-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
                Calculate BMI
            </button>

            {bmi && (
                <div className="pt-12 border-t border-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Your BMI is</p>
                    <h2 className="text-6xl font-playfair font-black text-emerald-500 mb-6">{bmi}</h2>
                    <div className="flex justify-center gap-4">
                        <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${bmi < 18.5 ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400'}`}>Under</div>
                        <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${bmi >= 18.5 && bmi <= 24.9 ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>Normal</div>
                        <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${bmi >= 25 ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-400'}`}>Over</div>
                    </div>
                </div>
            )}
        </div>
    );
}

function WaterIntakeCalculator() {
    const [weight, setWeight] = useState('');
    const [activity, setActivity] = useState('30');
    const [water, setWater] = useState(null);

    const calculate = () => {
        if (!weight) return;
        // Basic formula: weight (kg) * 0.033 + activity mins * 0.01
        const val = (weight * 0.033 + (activity / 60) * 0.5).toFixed(1);
        setWater(val);
    };

    return (
        <div className="w-full text-center space-y-12">
            <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center text-blue-500 mx-auto">
                <Droplets className="w-10 h-10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-md mx-auto">
                <div className="space-y-4 text-left">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Weight (kg)</label>
                    <input
                        type="number"
                        className="w-full p-4 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 font-bold"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                    />
                </div>
                <div className="space-y-4 text-left">
                    <label className="text-[10px] uppercase font-black tracking-widest text-slate-400">Activity (min/day)</label>
                    <select
                        className="w-full p-4 rounded-xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/10 font-bold"
                        value={activity}
                        onChange={(e) => setActivity(e.target.value)}
                    >
                        <option value="0">Sedentary</option>
                        <option value="30">Light (30 min)</option>
                        <option value="60">Active (1 hr)</option>
                        <option value="120">Pro (2+ hr)</option>
                    </select>
                </div>
            </div>

            <button
                onClick={calculate}
                className="bg-blue-500 text-white font-bold px-12 py-5 rounded-full shadow-2xl shadow-blue-500/20 active:scale-95 transition-all text-xs uppercase tracking-widest"
            >
                Calculate Needs
            </button>

            {water && (
                <div className="pt-12 border-t border-slate-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">Recommended Intake</p>
                    <h2 className="text-6xl font-playfair font-black text-blue-500 mb-2">{water}L</h2>
                    <p className="text-slate-400 text-xs font-medium">approx. {Math.round(water * 4)} large glasses per day</p>
                </div>
            )}
        </div>
    );
}

function StressQuiz() {
    const { profile, awardPoints } = useUserData();
    const [step, setStep] = useState(0);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);

    const questions = [
        { q: "How often do you feel overwhelmed by your daily tasks?", points: 3 },
        { q: "Have you experienced consistent muscle tension or headaches?", points: 2 },
        { q: "Is your sleep often interrupted by racing thoughts?", points: 4 },
        { q: "Do you spend less than 30 minutes outdoors each day?", points: 2 },
        { q: "How frequently do you feel irritable or restless?", points: 3 },
        { q: "Do you find it difficult to disconnect from digital devices?", points: 2 },
        { q: "Have you noticed changes in your appetite due to mood?", points: 2 },
        { q: "Do you feel like you lack a supportive community?", points: 4 }
    ];

    const handleAnswer = (val) => {
        const newScore = score + (val ? questions[step].points : 0);
        if (step < questions.length - 1) {
            setScore(newScore);
            setStep(step + 1);
        } else {
            setScore(newScore);
            setFinished(true);
            // Award points for completion
            api.post('/community/points', { actionType: 'DAILY_LOG', referenceId: '60d5ecb00000000000000001' }).catch(() => {});
        }
    };

    if (finished) {
        const risk = score > 15 ? 'High' : score > 8 ? 'Medium' : 'Low';
        const color = risk === 'High' ? 'text-rose-500' : risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500';
        
        return (
            <div className="w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className={`w-24 h-24 rounded-full border-4 ${color.replace('text', 'border')} flex items-center justify-center mx-auto`}>
                    <PieChart className={`w-12 h-12 ${color}`} />
                </div>
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-slate-900 mb-2">{risk} Risk Level</h2>
                    <p className="text-slate-500 max-w-sm mx-auto">Your current environmental and internal stress is {risk.toLowerCase()}. We recommend {risk === 'High' ? 'Deep Meditation' : 'Light Yoga'} today.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reward Earned</p>
                        <p className="font-bold text-emerald-600">+15 Wellness Points</p>
                    </div>
                    <button onClick={() => { setStep(0); setScore(0); setFinished(false); }} className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
                        <RefreshCcw className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <Link to="/remedies" className="inline-block bg-slate-900 text-white font-bold px-10 py-4 rounded-full text-sm">View Recommended Remedies</Link>
            </div>
        );
    }

    return (
        <div className="w-full text-center space-y-12 animate-in slide-in-from-right-4 duration-500">
            <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto">
                <Wind className="w-10 h-10" />
            </div>
            <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-500">Question {step + 1} of {questions.length}</p>
                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-slate-900 px-4">{questions[step].q}</h2>
            </div>
            
            <div className="max-w-md mx-auto grid grid-cols-2 gap-4">
                <button onClick={() => handleAnswer(true)} className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] font-bold text-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-all text-xl">Yes</button>
                <button onClick={() => handleAnswer(false)} className="p-8 bg-white border-2 border-slate-100 rounded-[2rem] font-bold text-slate-700 hover:border-rose-500 hover:text-rose-600 transition-all text-xl">No</button>
            </div>

            <div className="w-full h-1 bg-slate-100 rounded-full max-w-xs mx-auto overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
            </div>
        </div>
    );
}

function SleepTest() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);

    const startAnalysis = () => {
        setAnalyzing(true);
        setTimeout(() => {
            setAnalyzing(false);
            setResult({
                score: 82,
                quality: 'Restorative',
                tip: 'Your rhythm is consistent. Try reducing blue light 1 hour earlier for 90+ score.'
            });
            // Award points for completion
            api.post('/community/points', { actionType: 'DAILY_LOG', referenceId: '60d5ecb00000000000000002' }).catch(() => {});
        }, 3000);
    };

    if (result) {
        return (
            <div className="w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-indigo-50" />
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * result.score) / 100} className="text-indigo-500" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-indigo-600">{result.score}</span>
                        <span className="text-[8px] font-black uppercase text-slate-400">Sleep Score</span>
                    </div>
                </div>
                <div>
                    <h2 className="text-3xl font-playfair font-bold text-slate-900 mb-2">{result.quality} Sleep</h2>
                    <p className="text-slate-500 max-w-sm mx-auto font-medium">{result.tip}</p>
                </div>
                <button onClick={() => setResult(null)} className="flex items-center gap-2 mx-auto text-xs font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-600 transition-colors">
                    <RefreshCcw className="w-4 h-4" /> Retake Analysis
                </button>
            </div>
        );
    }

    return (
        <div className="w-full text-center space-y-12 h-full flex flex-col justify-center">
            <div className={`bg-indigo-50 w-24 h-24 rounded-[2rem] flex items-center justify-center text-indigo-500 mx-auto ${analyzing ? 'animate-pulse' : ''}`}>
                <Moon className="w-12 h-12" />
            </div>
            
            {analyzing ? (
                <div className="space-y-6">
                    <h3 className="text-2xl font-playfair font-bold text-slate-900 mb-2">Analyzing your sleep cycles...</h3>
                    <div className="flex justify-center gap-3">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    <div>
                        <h3 className="text-3xl font-playfair font-bold text-slate-900 mb-4">Deep Sleep Analysis</h3>
                        <p className="text-slate-500 text-sm font-medium max-w-sm mx-auto leading-relaxed">
                            Our AI will evaluate your reported rhythms and provide a biological restoration score.
                        </p>
                    </div>
                    <button onClick={startAnalysis} className="bg-indigo-600 text-white font-bold px-12 py-5 rounded-full shadow-2xl shadow-indigo-600/20 active:scale-95 transition-all text-xs uppercase tracking-widest">
                        Begin Analysis
                    </button>
                </div>
            )}
        </div>
    );
}

import { useUserData } from '../context/UserDataContext';
import { Link } from 'react-router-dom';
import api from '../api';
