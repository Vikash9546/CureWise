import { Layout, Shield } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
            <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center text-emerald-600 mx-auto mb-8 shadow-xl shadow-emerald-500/10">
                <Shield className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold font-playfair text-slate-900 mb-4">Admin Sanctuary</h1>
            <p className="text-slate-500 max-w-lg mx-auto font-medium">
                Welcome to the command center. We are currently reorganizing our administrative tools to better serve the community.
            </p>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                {[
                    { title: 'User Management', desc: 'Monitor community growth and member wellness scores.', icon: '👥' },
                    { title: 'Content Moderation', desc: 'Review success stories and discussion hub activity.', icon: '📝' },
                    { title: 'System Analytics', desc: 'Track consultation and event registration trends.', icon: '📊' }
                ].map((item, i) => (
                    <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm opacity-50 cursor-not-allowed grayscale">
                        <div className="text-3xl mb-4">{item.icon}</div>
                        <h3 className="font-bold text-slate-800 mb-2">{item.title}</h3>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                        <div className="mt-4 inline-flex px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-400">Under Construction</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
