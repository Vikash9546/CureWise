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
    return (
        <div className="w-full text-center space-y-12">
            <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto">
                <Wind className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-playfair font-bold text-slate-900">How balanced is your environment?</h2>
            <div className="max-w-md mx-auto space-y-4">
                {[
                    "Feeling overwhelmed by tasks?",
                    "Poor sleep quality recently?",
                    "Lack of outdoor exposure?",
                    "Consistent muscle tension?"
                ].map(q => (
                    <button key={q} className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-left text-sm font-semibold text-slate-600 hover:border-emerald-500 hover:bg-white transition-all flex justify-between items-center group">
                        {q} <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                ))}
            </div>
            <p className="text-slate-400 text-[10px] uppercase font-black tracking-widest">4 questions remaining</p>
        </div>
    );
}

function SleepTest() {
    return (
        <div className="w-full text-center space-y-12 h-full flex flex-col justify-center">
            <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center text-indigo-500 mx-auto">
                <Moon className="w-10 h-10" />
            </div>
            <div>
                <h3 className="text-2xl font-playfair font-bold text-slate-900 mb-2">Analyzing your sleep cycles...</h3>
                <p className="text-slate-500 text-sm font-medium">Coming soon: Connect your health data for deep analysis.</p>
            </div>
            <div className="flex justify-center gap-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" />
            </div>
        </div>
    );
}
