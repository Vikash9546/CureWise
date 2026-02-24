import { Link } from 'react-router-dom';
import { BookOpen, User, Calendar, ArrowRight, Heart, Share2, MessageCircle, Search, Leaf } from 'lucide-react';
import { remedyData } from '../data/remedyData';

export default function WellnessBlog() {
    return (
        <div className="min-h-screen bg-[#f8f9f4] py-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <div className="max-w-2xl text-left">
                        <h1 className="text-6xl font-playfair font-bold text-slate-900 mb-6">Wellness & <br /><span className="text-emerald-500 italic">Research</span></h1>
                        <p className="text-slate-500 font-medium leading-relaxed">
                            Deep dive into research-backed studies on natural remedies, forest bathing, and the future of holistic medicine.
                        </p>
                    </div>
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-bold"
                        />
                    </div>
                </div>

                {/* Featured Post */}
                <div className="mb-20">
                    <div className="bg-white rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm flex flex-col lg:flex-row group hover:shadow-2xl hover:shadow-emerald-900/5 transition-all duration-700">
                        <div className="lg:w-1/2 overflow-hidden h-96 lg:h-auto">
                            <img
                                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
                                alt="Featured Post"
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                        <div className="lg:w-1/2 p-12 md:p-20 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-4 mb-8">
                                    <span className="bg-emerald-500 text-white text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-full">Featured Research</span>
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-300">12 MIN READ</span>
                                </div>
                                <h2 className="text-4xl font-playfair font-bold text-slate-900 mb-6 group-hover:text-emerald-500 transition-colors cursor-pointer leading-tight">
                                    Nature vs Modern Medicine: <br />Establishing the Synergy
                                </h2>
                                <p className="text-slate-500 text-base leading-relaxed font-medium mb-12">
                                    An in-depth analysis of how ancient herbal wisdom is gaining validation through modern clinical trials, and why the future of care is integrated.
                                </p>
                            </div>
                            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 p-1 border border-slate-200">
                                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-slate-300 uppercase font-black text-xs">AS</div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Dr. Aranya Seth</p>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Natural Health Expert</p>
                                    </div>
                                </div>
                                <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
                    {remedyData.blogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500 flex flex-col">
                            <div className="h-64 overflow-hidden relative">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-6 right-6 flex gap-2">
                                    <button className="p-3 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all opacity-0 group-hover:opacity-100">
                                        <Heart className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-10 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-300 mb-6">
                                    <Calendar className="w-4 h-4" /> {blog.date}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 group-hover:text-emerald-500 transition-colors cursor-pointer leading-tight">
                                    {blog.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-auto font-medium">
                                    {blog.excerpt}
                                </p>
                                <div className="pt-10 mt-10 border-t border-slate-50 flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-slate-400">
                                        <button className="flex items-center gap-2 hover:text-emerald-500 transition-all"><Share2 className="w-4 h-4" /></button>
                                        <button className="flex items-center gap-2 hover:text-emerald-500 transition-all"><MessageCircle className="w-4 h-4" /> <span className="text-[10px] font-black">12</span></button>
                                    </div>
                                    <button className="text-emerald-500 font-bold text-xs uppercase tracking-widest hover:gap-4 transition-all flex items-center gap-2">
                                        Read More <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newsletter Box */}
                <div className="bg-[#111827] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <Leaf className="w-64 h-64 text-emerald-500 absolute -top-20 -left-20 rotate-45" />
                        <Leaf className="w-64 h-64 text-emerald-500 absolute -bottom-20 -right-20 -rotate-12" />
                    </div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-8">Stay informed on <span className="text-emerald-500 italic">natural breakthroughs</span></h2>
                        <p className="text-slate-400 font-medium mb-12">Get our weekly curated research summaries delivered directly to your inbox. No spam, just pure wellness knowledge.</p>
                        <div className="max-w-md mx-auto relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-white/5 border border-white/10 rounded-full py-5 px-8 text-white focus:outline-none focus:border-emerald-500/50 transition-all font-medium"
                            />
                            <button className="absolute right-2 top-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-full transition-all active:scale-95">
                                Join Now
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
