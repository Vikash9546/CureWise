import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Leaf, Info, ArrowRight, BookOpen, Filter } from 'lucide-react';
import { remedyData } from '../data/remedyData';

export default function RemedyDatabase() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') === 'mapping' ? 'mapping' : 'remedies';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDisease, setSelectedDisease] = useState(null);

    useEffect(() => {
        const tab = queryParams.get('tab') === 'mapping' ? 'mapping' : 'remedies';
        setActiveTab(tab);
    }, [location.search]);

    const filteredRemedies = remedyData.remedies.filter(remedy =>
        remedy.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        remedy.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDiseases = remedyData.diseases.filter(disease =>
        disease.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#f8f9f4] py-20 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-playfair font-bold text-slate-900 mb-4">Natural Remedy Directory</h1>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                        Explore your path to wellness with our research-backed database of herbal treatments and holistic mapping.
                    </p>
                </div>

                {/* Tabs & Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                    <div className="bg-white p-1.5 rounded-2xl border border-slate-100 flex gap-2">
                        <button
                            onClick={() => setActiveTab('remedies')}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'remedies' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Remedies
                        </button>
                        <button
                            onClick={() => setActiveTab('mapping')}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'mapping' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Disease Mapping
                        </button>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder={activeTab === 'remedies' ? "Search remedies..." : "Search diseases..."}
                            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Content */}
                {activeTab === 'remedies' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredRemedies.map((remedy) => (
                            <div key={remedy.name} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 border border-emerald-100">
                                        <Leaf className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-3 py-1 rounded-full">{remedy.category}</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{remedy.name}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">{remedy.benefits}</p>
                                <div className="pt-6 border-t border-slate-50">
                                    <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">How to use</h4>
                                    <p className="text-xs text-slate-500 italic">{remedy.howToUse}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Disease List */}
                        <div className="lg:col-span-1 space-y-4">
                            {filteredDiseases.map((disease) => (
                                <button
                                    key={disease.id}
                                    onClick={() => setSelectedDisease(disease)}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all ${selectedDisease?.id === disease.id ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/10' : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-200'}`}
                                >
                                    <h3 className="font-bold mb-1">{disease.name}</h3>
                                    <p className={`text-[10px] font-medium uppercase tracking-widest ${selectedDisease?.id === disease.id ? 'text-emerald-100' : 'text-slate-400'}`}>Mapping Available</p>
                                </button>
                            ))}
                        </div>

                        {/* Details View */}
                        <div className="lg:col-span-3">
                            {selectedDisease ? (
                                <div className="bg-white rounded-[2.5rem] border border-slate-100 p-8 md:p-12 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                            <BookOpen className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-playfair font-bold text-slate-900">{selectedDisease.name}</h2>
                                            <p className="text-slate-400 text-sm font-medium">Holistic Treatment Protocol</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div>
                                            <div className="mb-8">
                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-4">Recommended Herbs</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedDisease.remedies.map(r => (
                                                        <span key={r} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100">{r}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-4">Lifestyle Adjustments</h4>
                                                <ul className="space-y-3">
                                                    {selectedDisease.lifestyle.map(l => (
                                                        <li key={l} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                                                            <Leaf className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> {l}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                        <div>
                                            <div className="mb-8">
                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-4">Dietary Guidance</h4>
                                                <ul className="space-y-3">
                                                    {selectedDisease.diet.map(d => (
                                                        <li key={d} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 shrink-0 mt-2" /> {d}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-4">Yoga & Meditation</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedDisease.yoga.map(y => (
                                                        <span key={y} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-100">{y}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4">
                                        <Info className="w-6 h-6 text-amber-500 shrink-0" />
                                        <p className="text-xs text-amber-700 leading-relaxed font-medium">
                                            <span className="font-bold">Natural Disclaimer:</span> These remedies are intended for supplementary wellness and should not replace professional medical advice. Always consult with your doctor before starting new treatments.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center p-12 text-center">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 mb-6">
                                        <Leaf className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-400 mb-2">Select a Disease</h3>
                                    <p className="text-slate-400 text-sm max-w-xs">Pick a condition from the left to view its natural remedy and lifestyle mapping.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
