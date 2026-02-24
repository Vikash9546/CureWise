import { useState, useEffect } from 'react';
import { Wind, Play, Clock, ArrowRight, Sun, Heart, Zap, Sparkles, Volume2, VolumeX, MapPin, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function YogaSection() {
    const [timer, setTimer] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timer > 0) {
            interval = setInterval(() => {
                setTimer(timer => timer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsActive(false);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const startTimer = (mins) => {
        setTimer(mins * 60);
        setIsActive(true);
    };

    const categories = [
        {
            id: 'stress',
            name: 'Stress Relief',
            icon: Wind,
            color: 'emerald',
            video: 'https://www.youtube.com/embed/s7fR867xNfU', // Replace with real links if needed
            description: 'Gentle sequences to calm the nervous system and release daily tension.'
        },
        {
            id: 'immunity',
            name: 'Immunity Boost',
            icon: Sparkles,
            color: 'orange',
            video: 'https://www.youtube.com/embed/O-7vYAnLlxM',
            description: 'Flows designed to stimulate lymphatic drainage and strengthen natural defenses.'
        },
        {
            id: 'back-pain',
            name: 'Back Pain Care',
            icon: Heart,
            color: 'indigo',
            video: 'https://www.youtube.com/embed/X3-gKquJn5k',
            description: 'Targeted movements to decompress the spine and build core stability.'
        }
    ];

    return (
        <div className="min-h-screen bg-[#f8f9f4] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <div className="max-w-2xl">
                        <h1 className="text-6xl font-playfair font-bold text-slate-900 mb-6">Physical & <br /><span className="text-emerald-500 italic">Mental Restoration</span></h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            A curated sanctuary for yoga and meditation protocols, tailored to your body's specific needs.
                        </p>
                        <Link
                            to="/yoga-finder"
                            className="mt-8 inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 group"
                        >
                            <MapPin className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                            Find Offline Studio
                            <ArrowRight className="w-4 h-4 opacity-50" />
                        </Link>
                    </div>
                    {/* Meditation Timer Card */}
                    <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-emerald-900/5 w-full md:w-96 flex flex-col items-center">
                        <div className="flex items-center justify-between w-full mb-8">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Meditation Timer</span>
                            <button onClick={() => setIsMuted(!isMuted)} className="text-slate-300 hover:text-emerald-500 transition-colors">
                                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                        </div>
                        <h2 className="text-6xl font-playfair font-black text-slate-900 mb-8 tabular-nums">{formatTime(timer)}</h2>
                        <div className="flex gap-2 mb-8 flex-wrap justify-center">
                            {[5, 10, 20].map(mins => (
                                <button
                                    key={mins}
                                    onClick={() => startTimer(mins)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${timer === mins * 60 ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-emerald-200'}`}
                                >
                                    {mins}m
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsActive(!isActive)}
                            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${isActive ? 'bg-rose-500 text-white shadow-xl shadow-rose-500/20' : 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'}`}
                        >
                            {isActive ? 'Pause Reflection' : 'Begin Stillness'}
                        </button>
                    </div>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {categories.map((cat) => (
                        <div key={cat.id} className="space-y-8">
                            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <div className={`w-14 h-14 rounded-2xl bg-${cat.color}-50 flex items-center justify-center text-${cat.color}-500 mb-8 border border-${cat.color}-100`}>
                                    <cat.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4">{cat.name}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">{cat.description}</p>

                                <div className="aspect-video rounded-[2rem] overflow-hidden bg-slate-100 relative group border border-slate-100 shadow-inner">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={cat.video}
                                        title={cat.name}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="opacity-90 grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                    ></iframe>
                                </div>

                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                                        <Clock className="w-4 h-4" /> 24 MINS
                                    </div>
                                    <button className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all">
                                        Expand Sequence <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Daily Tip Bar */}
                <div className="mt-20 p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100 flex flex-col md:flex-row items-center justify-center gap-6 text-center md:text-left">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-emerald-500 shrink-0">
                        <Sun className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-emerald-800 italic max-w-2xl">
                        "Your breath is the anchor in the storm of daily life. Even three minutes of conscious breathing can reset your nervous system and bring you back to harmony."
                    </p>
                </div>
            </div>
        </div>
    );
}
