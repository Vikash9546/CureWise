import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import {
    Leaf, User, LogOut, Menu, ChevronDown, Bot, Activity,
    Database, BookOpen, Wind, Calculator, Zap, Flower2, X,
    Award, Ambulance
} from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { profile, currentBadge } = useUserData();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Find Doctors', path: '/doctors' },
        {
            name: 'Services',
            path: '#',
            dropdown: [
                {
                    category: 'Core Care',
                    items: [
                        { name: 'Health Chatbot', path: '/ai-chatbot', icon: Bot },
                        { name: 'Symptom Checker', path: '/symptom-checker', icon: Activity },
                        { name: 'Emergency Ambulance', path: '/ambulance', icon: Ambulance }
                        // { name: 'Video Consultation', path: '/meetings', icon: Video }
                    ]
                },
                {
                    category: 'Natural Wisdom',
                    items: [
                        { name: 'Remedy Database', path: '/remedies', icon: Database },
                        { name: 'Disease Mapping', path: '/remedies?tab=mapping', icon: Leaf },
                        { name: 'Success Stories', path: '/success-stories', icon: Award }
                    ]
                },
                {
                    category: 'Holistic Wellness',
                    items: [
                        { name: 'BMI & Water', path: '/health-tools', icon: Calculator },
                        { name: 'Health Risk Quiz', path: '/health-tools?tab=quiz', icon: Wind },
                        { name: 'Yoga & Meditation', path: '/yoga', icon: Wind },
                        { name: 'Zen Space Finder', path: '/yoga-finder', icon: Flower2 }
                    ]
                }
            ]
        },
        { name: 'Wellness Plans', path: '/wellness-plans' },
        { name: 'Community', path: '/community' },
    ];

    return (
        <>
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 py-3 md:py-4 border-b border-slate-100 shadow-sm">
                <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                    <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center group shrink-0">
                        <img
                            src="/logo.png"
                            alt="CureWise Logo"
                            className="h-12 md:h-16 w-auto object-contain group-hover:scale-105 transition-transform"
                        />
                    </Link>

                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <div key={link.name} className="relative group/nav">
                                {link.dropdown ? (
                                    <>
                                        <button
                                            className="flex items-center gap-1 text-slate-600 hover:text-emerald-600 transition-all duration-300 font-medium text-sm py-2 cursor-pointer"
                                        >
                                            {link.name} <ChevronDown className="w-4 h-4" />
                                        </button>

                                        {/* Dropdown Menu */}
                                        <div
                                            className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-300 z-50"
                                        >
                                            <div className="bg-white rounded-3xl shadow-2xl shadow-emerald-900/10 border border-slate-100 p-8 w-[600px] grid grid-cols-2 gap-8">
                                                {link.dropdown.map((cat) => (
                                                    <div key={cat.category}>
                                                        <h4 className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4">{cat.category}</h4>
                                                        <div className="space-y-4">
                                                            {cat.items.map((item) => (
                                                                <Link
                                                                    key={item.name}
                                                                    to={item.path}
                                                                    className="flex items-center gap-3 group/item"
                                                                >
                                                                    <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all">
                                                                        <item.icon className="w-5 h-5" />
                                                                    </div>
                                                                    <span className="text-sm font-semibold text-slate-700 group-hover/item:text-emerald-600 transition-colors">{item.name}</span>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <Link to={link.path} className="text-slate-600 hover:text-emerald-600 transition-all duration-300 font-medium text-sm">{link.name}</Link>
                                )}
                            </div>
                        ))}

                        {/* {user?.role === 'ADMIN' && (
                            <Link to="/admin" className="text-slate-600 hover:text-emerald-600 transition-all duration-300 flex items-center gap-2 font-medium">
                                <Layout className="w-4 h-4" />
                                Admin
                            </Link>
                        )} */}
                    </div>

                    <div className="flex items-center gap-3 md:gap-6">
                        {user ? (
                            <div className="flex items-center gap-3 md:gap-5">
                                {/* Points Display */}
                                <Link to="/challenges" className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100/50 hover:bg-emerald-100 transition-colors group">
                                    <Zap className="w-3 md:w-3.5 h-3 md:h-3.5 text-emerald-500 fill-emerald-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] md:text-[11px] font-black text-emerald-700">{profile.points}</span>
                                </Link>

                                <Link to="/profile" className="flex items-center gap-3 group">
                                    <div className="hidden md:flex flex-col items-end">
                                        <span className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest">{currentBadge?.label} {currentBadge?.icon}</span>
                                        <span className="font-bold text-sm text-slate-800">{user.username ? user.username : (user.name || (user.firstName ? `${user.firstName}` : user.email.split('@')[0]))}</span>
                                    </div>
                                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 p-0.5 border-2 border-emerald-500 group-hover:border-emerald-600 transition-colors relative">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-400 font-bold overflow-hidden text-sm">
                                            {user.username?.[0]?.toUpperCase() || user.name?.[0] || <User className="w-5 h-5" />}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow-lg border border-slate-50 flex items-center justify-center text-[8px] md:text-[10px]">
                                            {currentBadge?.icon}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-4">
                                <Link to="/login" className="text-slate-600 hover:text-emerald-600 font-medium text-sm px-2 md:px-4">Log In</Link>
                                <Link to="/register" className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs md:text-sm px-5 md:px-7 py-2 md:py-3 rounded-full shadow-lg shadow-emerald-500/20 transition-all active:scale-95">Sign Up</Link>
                            </div>
                        )}
                        <button className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-all" onClick={() => setIsMobileMenuOpen(true)}>
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div >
            </nav >

            {/* Mobile Menu Drawer */}
            {
                isMobileMenuOpen && (
                    <div className="fixed inset-0 z-[100] lg:hidden">
                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                        <div className="absolute right-0 top-0 h-[100dvh] w-[280px] bg-white shadow-2xl animate-in slide-in-from-right duration-300 p-6 flex flex-col">
                            <div className="flex justify-between items-center mb-8 shrink-0">
                                <span className="text-sm font-black uppercase tracking-widest text-slate-400">Navigation</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-xl">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-2 pb-6">
                                {navLinks.map(link => (
                                    <div key={link.name} className="flex flex-col">
                                        {link.dropdown ? (
                                            <div className="flex flex-col bg-slate-50 rounded-2xl overflow-hidden">
                                                <button
                                                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                                                    className="flex items-center justify-between px-4 py-3 font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                                                >
                                                    {link.name} <ChevronDown className={`w-4 h-4 text-emerald-500 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                                                </button>
                                                <div className={`px-2 transition-all duration-300 overflow-hidden ${mobileServicesOpen ? 'pb-2 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                    {link.dropdown.map(cat => (
                                                        <div key={cat.category} className="space-y-2 mt-2">
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 px-2">{cat.category}</p>
                                                            <div className="grid grid-cols-1 gap-1">
                                                                {cat.items.map(item => (
                                                                    <Link
                                                                        key={item.name}
                                                                        to={item.path}
                                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-all"
                                                                    >
                                                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-100 text-slate-400 shrink-0">
                                                                            <item.icon className="w-4 h-4" />
                                                                        </div>
                                                                        <span className="text-sm font-bold">{item.name}</span>
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <Link
                                                to={link.path}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block px-4 py-3 rounded-2xl bg-white text-slate-700 font-bold hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                                {/* {user?.role === 'ADMIN' && (
                                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-violet-50 text-violet-700 font-bold mt-4">
                                        <Layout className="w-5 h-5" /> Admin Panel
                                    </Link>
                                )} */}
                            </div>

                            <div className="pt-6 border-t border-slate-100 mt-auto flex flex-col gap-3 shrink-0">
                                {!user ? (
                                    <>
                                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-center hover:bg-slate-50">Log In</Link>
                                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 rounded-2xl bg-emerald-500 text-white font-bold text-center shadow-lg shadow-emerald-500/20">Sign Up</Link>
                                    </>
                                ) : (
                                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 rounded-2xl bg-emerald-50 text-emerald-600 font-bold border border-emerald-100 flex items-center justify-center gap-2">
                                        <User className="w-5 h-5" /> View Profile
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}
