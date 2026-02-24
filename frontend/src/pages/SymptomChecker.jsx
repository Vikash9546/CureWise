import { useState } from 'react';
import { Activity, Check, Info, ArrowRight, RefreshCcw, Leaf, AlertTriangle } from 'lucide-react';
import { remedyData } from '../data/remedyData';

export default function SymptomChecker() {
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [result, setResult] = useState(null);

    const toggleSymptom = (name) => {
        setSelectedSymptoms(prev =>
            prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
        );
    };

    const handleAnalyze = () => {
        if (selectedSymptoms.length === 0) return;

        const possibleConditions = new Set();
        selectedSymptoms.forEach(s => {
            const symptomInfo = remedyData.symptoms.find(si => si.name === s);
            if (symptomInfo) {
                symptomInfo.possibleConditions.forEach(pc => possibleConditions.add(pc));
            }
        });

        const conditions = Array.from(possibleConditions).map(name =>
            remedyData.diseases.find(d => d.name === name)
        ).filter(c => c !== undefined);

        setResult(conditions);
    };

    const reset = () => {
        setSelectedSymptoms([]);
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-[#f8f9f4] py-20 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-emerald-500/20">
                        <Activity className="w-10 h-10" />
                    </div>
                    <h1 className="text-5xl font-playfair font-bold text-slate-900 mb-4">Symptom Checker</h1>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                        Identify potential natural paths based on what you're feeling. A gentle first step towards holistic recovery.
                    </p>
                </div>

                {!result ? (
                    <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-sm">
                        <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-12 text-center">Select all that apply</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                            {remedyData.symptoms.map((symptom) => (
                                <button
                                    key={symptom.name}
                                    onClick={() => toggleSymptom(symptom.name)}
                                    className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group ${selectedSymptoms.includes(symptom.name) ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-emerald-200'}`}
                                >
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${selectedSymptoms.includes(symptom.name) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 group-hover:border-emerald-300'}`}>
                                        {selectedSymptoms.includes(symptom.name) && <Check className="w-4 h-4" />}
                                    </div>
                                    <span className="text-sm font-bold uppercase tracking-wider">{symptom.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col items-center gap-8">
                            <button
                                onClick={handleAnalyze}
                                disabled={selectedSymptoms.length === 0}
                                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold px-12 py-5 rounded-full shadow-2xl shadow-emerald-500/20 transition-all active:scale-95"
                            >
                                Analyze Symptoms
                            </button>

                            <div className="flex items-center gap-3 text-amber-500 bg-amber-50 px-6 py-3 rounded-full border border-amber-100">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                <span className="text-[10px] uppercase font-black tracking-widest">Medical Disclaimer: consult a doctor for serious issues.</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="bg-white rounded-[3rem] p-8 md:p-16 border border-slate-100 shadow-sm mb-8">
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-3xl font-playfair font-bold text-slate-900">Analysis Results</h2>
                                <button
                                    onClick={reset}
                                    className="flex items-center gap-2 text-slate-400 hover:text-emerald-500 transition-colors font-bold text-xs uppercase tracking-widest"
                                >
                                    <RefreshCcw className="w-4 h-4" /> Start Over
                                </button>
                            </div>

                            <div className="space-y-8">
                                {result.map((condition) => (
                                    <div key={condition.id} className="p-8 rounded-[2rem] bg-[#f8f9f4] border border-slate-100">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                                                <Leaf className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900">Possible: {condition.name}</h3>
                                                <p className="text-slate-400 text-xs font-medium">Holistic Perspective</p>
                                            </div>
                                        </div>

                                        <p className="text-slate-600 text-sm leading-relaxed mb-8 font-medium">{condition.description}</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-4">Initial Natural Steps</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {condition.remedies.map(r => (
                                                        <span key={r} className="px-3 py-1.5 bg-white border border-slate-100 text-slate-600 rounded-lg text-xs font-bold">{r}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-4">Yoga for Recovery</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {condition.yoga.map(y => (
                                                        <span key={y} className="px-3 py-1.5 bg-white border border-slate-100 text-slate-600 rounded-lg text-xs font-bold">{y}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-emerald-500 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="max-w-md">
                                <h3 className="text-2xl font-bold mb-2">Want a professional opinion?</h3>
                                <p className="text-emerald-100 text-sm font-medium">Schedule a deep-dive consultation with one of our specialized natural health practitioners.</p>
                            </div>
                            <button className="bg-white text-emerald-500 font-bold px-10 py-4 rounded-full shadow-xl hover:bg-emerald-50 transition-all flex items-center gap-3">
                                Book Practitioner <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
