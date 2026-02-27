import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { toast } from 'react-hot-toast';
import { Search, Stethoscope, Zap, Video, ArrowRight, Star, Calendar, Mail, Facebook, Twitter, Instagram, Leaf, MapPin, Phone, Settings, Sparkles, Globe, X } from 'lucide-react';

export default function HomePage() {
    const { user } = useAuth();
    const { profile, registerEvent } = useUserData();
    const navigate = useNavigate();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newsletterEmail, setNewsletterEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (!newsletterEmail) {
            toast.error("Please enter your email address");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(newsletterEmail)) {
            toast.error("Please enter a valid email address");
            return;
        }
        toast.success("Welcome to the community! Check your inbox for your first wellness guide.");
        setNewsletterEmail('');
    };
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 pt-6 md:pt-8 pb-12 md:pb-20">
                <div className="bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 md:p-20 text-center relative overflow-hidden group min-h-[450px] md:min-h-[500px] flex items-center justify-center">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <img
                            src="https://static.vecteezy.com/system/resources/thumbnails/075/531/477/small/close-up-shot-of-green-leaves-with-sunlight-streaming-through-foliage-creating-soft-bokeh-background-and-natural-light-textures-free-video.jpg"
                            alt="Nature Background"
                            className="w-full h-full object-cover opacity-60 scale-105 group-hover:scale-110 transition-transform duration-[10s]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/20 to-slate-900/60" />
                    </div>

                    <div className="relative z-10 w-full">
                        <p className="text-emerald-400 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4 sm:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                            Healing Starts With Harmony
                        </p>

                        <h1 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-bold text-white mb-6 sm:mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                            Healthcare Inspired by <br className="hidden sm:block" />
                            <span className="text-emerald-400 italic">Nature</span>
                        </h1>

                        <p className="text-emerald-50/70 max-w-2xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed mb-8 sm:mb-12 font-inter font-medium px-2 sm:px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                            Experience a gentler approach to medical care. Book appointments, access emergency support, and consult with specialists in a space designed for your peace of mind.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-700">
                            <Link to="/doctors" className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-full transition-all shadow-xl shadow-emerald-500/40 active:scale-95 whitespace-nowrap text-sm sm:text-base">
                                Book Appointment
                            </Link>
                            <Link to="/community" className="w-full sm:w-auto bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 font-bold px-8 sm:px-10 py-4 sm:py-5 rounded-full transition-all shadow-lg active:scale-95 whitespace-nowrap text-sm sm:text-base">
                                Join Community
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Services Section */}
            <div id="services-section" className="max-w-7xl mx-auto px-4 py-12 md:py-20">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-6 md:gap-4">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-slate-900 mb-4">
                            How can we support you today?
                        </h2>
                        <p className="text-sm md:text-base text-slate-500 font-medium font-inter">
                            Our services are designed to nurture your physical and mental well-being through integrated care solutions.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Community */}
                    <Link to="/community" className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 transition-all group relative overflow-hidden flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src="https://i0.wp.com/www.animasoul.org/wp-content/uploads/2017/10/community-group.jpg?fit=950%2C534&ssl=1" alt="Community Support" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-emerald-500 border border-emerald-50 shadow-lg">
                                    <Globe className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 pt-4">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                Community
                                <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Active Hub</span>
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-4 font-medium">
                                Join our network of support. Connect with others sharing similar journeys and learn from shared experiences.
                            </p>
                        </div>
                    </Link>

                    {/* Ambulance */}
                    <Link to="/ambulance" className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 transition-all group relative overflow-hidden flex flex-col">
                        <div className="h-48 overflow-hidden relative">
                            <img src="https://proambri.com/wp-content/uploads/2024/05/Ambulance-On-Street.jpg" alt="Ambulance Service" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
                            <div className="absolute bottom-4 left-6">
                                <div className="w-12 h-12 rounded-xl bg-white/90 backdrop-blur-md flex items-center justify-center text-orange-500 border border-orange-50 shadow-lg">
                                    <Zap className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                        <div className="p-8 pt-4">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                Ambulance
                                <span className="text-[10px] bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">24/7 Priority</span>
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-4 font-medium">
                                24/7 priority emergency transport and immediate care coordination for when you need us most.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Wellness Plan CTA Section */}
            <div className="bg-emerald-900 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[50%] h-full bg-emerald-500/10 skew-x-12 translate-x-24" />
                <div className="max-w-7xl mx-auto px-4 py-16 md:py-32 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="space-y-8 md:space-y-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800 text-emerald-400 rounded-full font-black text-[9px] sm:text-[10px] uppercase tracking-widest border border-emerald-700">
                                <Sparkles className="w-3.5 h-3.5" /> Personalized for your bio-data
                            </div>
                            <h2 className="text-3xl sm:text-5xl md:text-6xl font-playfair font-bold text-white leading-[1.15] md:leading-[1.1]">
                                Your Path to Healing <br />
                                is <span className="text-emerald-400 italic">One of a Kind.</span>
                            </h2>
                            <p className="text-emerald-100/60 font-medium text-base md:text-lg leading-relaxed max-w-lg">
                                Stop guessing. Get a structured 7-day wellness blueprint covering your diet, routine, and natural remedies, curated by our AI based on your unique health profile.
                            </p>
                            <Link to="/wellness-plans" className="inline-flex items-center justify-center sm:justify-start gap-4 sm:gap-6 px-8 sm:px-10 py-4 sm:py-5 bg-white text-emerald-900 rounded-[2rem] sm:rounded-[2.5rem] font-bold text-lg sm:text-xl hover:bg-emerald-50 transition-all shadow-2xl shadow-emerald-950/20 active:scale-95 w-full sm:w-auto">
                                Create My Plan <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-400/20 blur-[120px] rounded-full" />
                            <div className="relative bg-emerald-800/50 backdrop-blur-xl p-10 rounded-[4rem] border border-emerald-700 shadow-2xl">
                                <div className="space-y-8">
                                    {[
                                        { label: 'Detox Ritual', pct: '85%', color: 'bg-emerald-400' },
                                        { label: 'Circadian Rhythm', pct: '62%', color: 'bg-indigo-400' },
                                        { label: 'Herbal Synergy', pct: '94%', color: 'bg-amber-400' },
                                    ].map((stat, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-emerald-100/80">
                                                <span>{stat.label}</span>
                                                <span>{stat.pct}</span>
                                            </div>
                                            <div className="h-2 bg-emerald-950 rounded-full overflow-hidden">
                                                <div className={`h-full ${stat.color} rounded-full`} style={{ width: stat.pct }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-12 p-6 bg-white/5 rounded-3xl border border-white/5 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-emerald-400 rounded-2xl flex items-center justify-center text-emerald-900 shrink-0">
                                        <Zap className="w-6 h-6 fill-emerald-900" />
                                    </div>
                                    <p className="text-emerald-100 text-sm font-medium">Over 2,400 members have optimized their health this month.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Wellness Experiences */}
            <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 border-t border-slate-50">
                <div className="text-center mb-10 md:mb-16">
                    <h2 className="text-3xl md:text-4xl font-playfair font-bold text-slate-900 mb-4">
                        Upcoming Wellness Experiences
                    </h2>
                    <p className="text-sm md:text-base text-slate-500 font-medium font-inter max-w-2xl mx-auto">
                        Go beyond clinical visits with our curated programs for holistic restoration and community wellness.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Event 1 */}
                    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col md:flex-row group hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 h-full relative">
                        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100">
                            Offline Event
                        </div>
                        <div className="md:w-1/2 overflow-hidden h-64 md:h-auto">
                            <img
                                src="https://elohee.org/wp-content/uploads/2025/04/image_5b3cb4f6041283aface23c0db6b086c9-scaled.jpg"
                                alt="Forest Therapy"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest mb-4">
                                    <Calendar className="w-3.5 h-3.5" /> OCT 12 - 14, 2026
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">Forest Therapy & Mindfulness</h3>
                                <div className="space-y-3 mb-6">
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        Reconnect with your senses through guided shinrin-yoku and meditation sessions led by specialists.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                            <MapPin className="w-3.5 h-3.5" /> Shimla, HP
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                            <Sparkles className="w-3.5 h-3.5" /> 12 Spots Left
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {(profile?.registeredEvents || []).some(e => e.name === 'Forest Therapy & Mindfulness') ? (
                                <button
                                    onClick={() => {
                                        setSelectedEvent({
                                            name: 'Forest Therapy & Mindfulness',
                                            date: 'OCT 12 - 14, 2026',
                                            type: 'Offline',
                                            isDetailView: true,
                                            itinerary: [
                                                { day: 'Day 1', activity: 'Arrival & Nature Attunement' },
                                                { day: 'Day 2', activity: 'Morning Meditation & Guided Trail' },
                                                { day: 'Day 3', activity: 'Breathwork & Integration Circle' }
                                            ],
                                            coordinates: '31.1048° N, 77.1734° E'
                                        });
                                    }}
                                    className="w-full md:w-fit px-8 py-3 bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all active:scale-95 shadow-lg shadow-emerald-200"
                                >
                                    Get Details
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        if (user) {
                                            setSelectedEvent({ name: 'Forest Therapy & Mindfulness', date: 'OCT 12 - 14, 2026', type: 'Offline' });
                                        } else {
                                            toast.error("Please login to register for events");
                                            navigate('/login');
                                        }
                                    }}
                                    className="w-full md:w-fit px-8 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all active:scale-95 shadow-lg shadow-slate-200"
                                >
                                    Register Now
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Event 2 */}
                    <div className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col md:flex-row group hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 h-full relative">
                        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-orange-600 uppercase tracking-widest border border-orange-100">
                            Online Webinar
                        </div>
                        <div className="md:w-1/2 overflow-hidden h-64 md:h-auto">
                            <img
                                src="https://static.wixstatic.com/media/2edc32_51622f6df99b4d5bbdefc02967479958~mv2.jpg/v1/fill/w_516,h_516,fp_0.50_0.50,q_80,usm_0.66_1.00_0.01,enc_auto/2edc32_51622f6df99b4d5bbdefc02967479958~mv2.jpg0"
                                alt="Harmony Workshop"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                        <div className="md:w-1/2 p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 text-orange-600 text-[10px] font-black uppercase tracking-widest mb-4">
                                    <Calendar className="w-3.5 h-3.5" /> EVERY DAY
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-orange-600 transition-colors">Nutritional Harmony Workshop</h3>
                                <div className="space-y-3 mb-6">
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">
                                        Learn to fuel your body with seasonal, nature-derived foods tailored to your specific profile.
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                            {/* <Video className="w-3.5 h-3.5" /> Zoom Video */}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                                            <Zap className="w-3.5 h-3.5" /> Free Entry
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    if (user) {
                                        toast.success("Opening educational session...");
                                        window.open("https://www.youtube.com/watch?v=_80azPcnmPQ", "_blank");
                                    } else {
                                        toast.error("Please login to join the session");
                                        navigate('/login');
                                    }
                                }}
                                className="w-full md:w-fit px-8 py-3 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-orange-500 transition-all active:scale-95 shadow-lg shadow-slate-200"
                            >
                                Join Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Registration & Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <button onClick={() => setSelectedEvent(null)} className="absolute top-4 md:top-6 right-4 md:right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>

                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${selectedEvent.isDetailView ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                            {selectedEvent.isDetailView ? <Calendar className="w-8 h-8" /> : <Sparkles className="w-8 h-8" />}
                        </div>

                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{selectedEvent.isDetailView ? 'Event Details' : 'Register for Retreat'}</h2>
                        <p className="text-slate-500 mb-8 font-medium italic">"{selectedEvent.name}" — {selectedEvent.date}</p>

                        <div className="space-y-6">
                            {selectedEvent.isDetailView ? (
                                <>
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-indigo-500">Scheduled Itinerary</h4>
                                        <div className="space-y-3">
                                            {selectedEvent.itinerary?.map((item, id) => (
                                                <div key={id} className="flex gap-4 items-start p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <span className="text-xs font-black text-indigo-400 shrink-0 mt-0.5">{item.day}</span>
                                                    <p className="text-sm font-bold text-slate-700">{item.activity}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm shrink-0">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-indigo-400">GPS Coordinates</p>
                                            <p className="text-xs font-mono font-bold text-slate-700 tracking-wider">{selectedEvent.coordinates}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400">Prepare for your visit</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['Breathable gear', 'Daily journal', 'Eco-bottle', 'Open mind'].map(tool => (
                                                <div key={tool} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-500">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> {tool}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Link to="/community" onClick={() => setSelectedEvent(null)} className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-3">
                                        Discussion Forum <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase text-slate-400">Location</p>
                                            <p className="text-sm font-bold text-slate-700">Mountain Sanctuary, Shimla</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            registerEvent(selectedEvent);
                                            toast.success("Successfully registered! You can now view full details.", { duration: 4000 });
                                            setSelectedEvent(null);
                                        }}
                                        className="w-full py-5 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        Confirm My Spot <ArrowRight className="w-5 h-5" />
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 uppercase font-bold tracking-widest">No payment required for registration confirmation</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-[#f8f9f4] border-t border-slate-100 pt-20 pb-10">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="md:col-span-1">
                            <Link to="/" className="text-xl font-bold flex items-center gap-2 text-slate-900 mb-8">
                                <Leaf className="w-6 h-6 text-emerald-500" />
                                <span className="tracking-tight font-playfair">NatureWellness</span>
                            </Link>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium mb-8">
                                Redefining medical care through the lens of holistic balance and natural harmony. Your health is our sanctuary.
                            </p>
                            <div className="flex gap-4">
                                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"><Facebook className="w-4 h-4" /></button>
                                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"><Twitter className="w-4 h-4" /></button>
                                <button className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all"><Instagram className="w-4 h-4" /></button>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-8">Patient Care</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li><Link to="/doctors" className="hover:text-emerald-500 transition-colors">Find a Doctor</Link></li>
                                <li><Link to="/wellness-plans" className="hover:text-emerald-500 transition-colors">Wellness Plans</Link></li>
                                <li><Link to="/ambulance" className="hover:text-emerald-500 transition-colors">Emergency Ambulance</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-8">Resources</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-400">
                                <li><Link to="/remedies" className="hover:text-emerald-500 transition-colors">Natural Remedies</Link></li>
                                <li><Link to="/ai-chatbot" className="hover:text-emerald-500 transition-colors">AI Health Assistant</Link></li>
                                <li><Link to="/community" className="hover:text-emerald-500 transition-colors">Community Forum</Link></li>
                                <li><Link to="/yoga" className="hover:text-emerald-500 transition-colors">Yoga & Mindfulness</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-slate-900 text-sm uppercase tracking-widest mb-8">Newsletter & Perks</h4>
                            <p className="text-xs text-slate-500 mb-6 leading-relaxed">Join 50k+ members receiving weekly holistic insights.</p>
                            <form onSubmit={handleSubscribe} className="relative mb-6">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-full py-4 px-6 text-sm focus:outline-none focus:border-emerald-500 transition-all font-medium pr-14"
                                />
                                <button type="submit" className="absolute right-2 top-2 p-2 rounded-full bg-slate-900 text-white hover:bg-emerald-500 transition-all">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </form>
                            <div className="space-y-2">
                                {[
                                    { icon: <Zap className="w-3 h-3" />, text: 'Early Event Access' },
                                    { icon: <Leaf className="w-3 h-3" />, text: 'Natural Health Guides' },
                                    { icon: <Sparkles className="w-3 h-3" />, text: 'Community Exclusive' }
                                ].map((item, id) => (
                                    <div key={id} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
                                        <span className="text-emerald-500">{item.icon}</span> {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                            © 2026 NatureWellness Medical Group. All rights reserved.
                        </p>
                        <div className="flex gap-8 text-slate-400">
                            <a href="mailto:support@naturewellness.com" className="hover:text-emerald-500 transition-colors"><Mail className="w-4 h-4" /></a>
                            <a href="tel:+1234567890" className="hover:text-emerald-500 transition-colors"><Phone className="w-4 h-4" /></a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
