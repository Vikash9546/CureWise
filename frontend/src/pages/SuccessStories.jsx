import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import {
    Heart, ChevronRight, Star, Plus, Image as ImageIcon,
    CheckCircle2, Quote, Sparkles, X, Zap, Award,
    BookOpen, Users, TrendingUp, Shield, Share2, Bookmark, ShieldCheck, Lock
} from 'lucide-react';

// ── Category helpers ─────────────────────────────────────────
const CATEGORY_COLOR_MAP = {
    'Chronic Stress': 'violet',
    'Metabolic Health': 'blue',
    'Mental Wellness': 'violet',
    "Women's Health": 'pink',
    'Immunity': 'emerald',
    'Skin Health': 'pink',
    'Digestive Health': 'emerald',
    'Weight Management': 'blue',
    'Other': 'emerald',
};

const CATEGORY_TAGS_MAP = {
    'Chronic Stress': ['#stress', '#anxiety', '#adaptogens'],
    'Metabolic Health': ['#metabolichealth', '#bloodsugar', '#nutrition'],
    'Mental Wellness': ['#mentalhealth', '#mindfulness', '#calm'],
    "Women's Health": ['#womenshealth', '#hormones', '#pcos'],
    'Immunity': ['#immunity', '#herbs', '#prevention'],
    'Skin Health': ['#skincare', '#naturalbeauty', '#acne'],
    'Digestive Health': ['#guthealth', '#digestion', '#probiotics'],
    'Weight Management': ['#weightloss', '#fitness', '#fatburning'],
    'Other': ['#naturalhealing', '#wellness', '#holistic'],
};

// ── Shared Story Data (exported so StoryDetail can also use it) ──────────────
export const STORIES_DATA = [
    {
        id: 1,
        name: 'Elena Rodriguez',
        age: 34,
        location: 'Barcelona, Spain',
        avatar: 'E',
        category: 'Vibrancy Restoration',
        categoryColor: 'emerald',
        title: 'Overcoming 10 Years of Chronic Fatigue',
        headline: 'From bedridden to running 5Ks — my 12-month natural healing journey',
        initialState: 'Extreme exhaustion, mental fog, unable to work full-time.',
        currentState: 'Running 5Ks, full-time career, vibrant energy.',
        duration: '12 months',
        verified: true,
        hearts: 156,
        rating: 4.9,
        tags: ['#fatigue', '#ashwagandha', '#plantbased', '#yoga'],
        quote: 'I stopped fighting my body and started listening to it. That was the turning point.',
        fullStory: `For a decade, I woke up every morning wondering if today would be the day I finally felt alive again. Chronic fatigue had stolen my career, my social life, and my sense of self. I'd seen over 20 doctors — each offering medications that masked symptoms without addressing the root cause.\n\nThe turning point came when a friend suggested I consult a naturopath. Within our first session, she identified patterns I'd overlooked: poor gut health, severe Vitamin D and B12 deficiencies, and adrenal exhaustion from years of pushing through despite the fatigue.\n\nWe began with the foundation: food. I transitioned to a whole-food, plant-based diet with an emphasis on anti-inflammatory foods — leafy greens, berries, sweet potatoes, and healthy fats. Within three weeks, the after-lunch energy crashes I'd lived with for years simply... stopped.\n\nNext came Ashwagandha, an adaptogen I was initially skeptical of. Taking 600mg of KSM-66 extract daily alongside magnesium glycinate before bed genuinely transformed my sleep quality. I started waking up without an alarm, actually rested.\n\nBy month 4, I began a gentle yoga practice — just 15 minutes of Sun Salutations each morning. What started as barely being able to hold Downward Dog became a practice I looked forward to every single day. The physical movement rewired my relationship with my body.\n\nMonth 8 was when I cried tears of joy. My brain fog, which I'd accepted as permanent, had cleared. I started moderate strength training and completed my first 5K in October — something I would have laughed at as impossible just a year before.\n\nToday, I work full-time as a wellness coach, helping others who are where I once was. Nature didn't just heal my body — it showed me a completely different way of living.`,
        timeline: [
            { month: 'Month 1', action: 'Dietary shift to plant-based whole foods. Started Ashwagandha (600mg KSM-66) + Magnesium Glycinate.', milestone: false },
            { month: 'Month 2', action: 'Added Vitamin D3 (5000 IU) + B12 supplementation. Energy crashes reduced by 40%.', milestone: false },
            { month: 'Month 4', action: 'Daily morning yoga (15-min Sun Salutations), consistent 8-hour sleep schedule established.', milestone: true },
            { month: 'Month 6', action: 'Introduced cold showers and 20-min morning walks. Mental clarity significantly improved.', milestone: false },
            { month: 'Month 8', action: 'Mental fog cleared entirely. Started moderate strength training 3x/week.', milestone: true },
            { month: 'Month 12', action: 'Completed first 5K race. Returned to full-time work. Living life without energy limitations.', milestone: true },
        ],
        remedies: ['Ashwagandha (KSM-66)', 'Magnesium Glycinate', 'Vitamin D3 + K2', 'Vitamin B12', 'Tulsi Tea', 'Turmeric Golden Milk'],
        lifestyle: ['15-min morning yoga', 'Plant-based diet', 'Cold showers', 'Digital detox after 9pm', '8-hour sleep routine'],
    },
    {
        id: 2,
        name: 'David Chen',
        age: 52,
        location: 'Toronto, Canada',
        avatar: 'D',
        category: 'Metabolic Health',
        categoryColor: 'blue',
        title: 'Managing Type-2 Diabetes Naturally',
        headline: 'How I reduced my A1C from 9.2 to 5.8 without adding medications',
        initialState: 'High A1C (9.2), multiple medications, low stamina, 30lbs overweight.',
        currentState: 'A1C at 5.8 (healthy range), medication reduced 70%, energetic, 28lbs lighter.',
        duration: '14 months',
        verified: true,
        hearts: 234,
        rating: 5.0,
        tags: ['#diabetes', '#metabolichealth', '#intermittentfasting', '#weightloss'],
        quote: 'My doctor said my results were "unusual." I told him nature is rarely unusual — we just forget to pay attention.',
        fullStory: `A Type-2 diabetes diagnosis at 48 felt like a life sentence. The medication cocktail I was prescribed made me feel worse than the condition itself — fatigue, digestive issues, and mood swings that affected my family. I knew I needed a different approach.\n\nI spent months researching the metabolic science behind blood sugar regulation. What I found was that diabetes is fundamentally a lifestyle disease — and lifestyle changes could actually reverse it, not just manage it.\n\nI started with intermittent fasting, specifically the 16:8 protocol. This single change, eating only between 12pm and 8pm, began showing results within two weeks. My fasting glucose dropped from 180mg/dL to 145mg/dL in the first month alone.\n\nBitter Melon became my most powerful natural ally. Studies show its compounds (charantin, vicine, polypeptide-p) mimic insulin and improve glucose uptake. I started with juice from fresh bitter melon each morning. The taste is challenging — but the results were worth every grimace.\n\nFenugreek seeds soaked overnight became a daily ritual. The high soluble fiber content slows glucose absorption dramatically. Combined with cinnamon added to my morning tea, these simple spices began shifting my numbers in ways my doctors found remarkable.\n\nWalking became medicine. I committed to 45 minutes daily, specifically after meals — post-meal walks are scientifically proven to reduce glucose spikes by up to 30%. What started as a struggle became the highlight of my day.\n\nAt my 12-month check, my doctor sat across from me in silence for a long moment before saying: "Your A1C is 5.8. Whatever you're doing, keep doing it." I'd reduced two medications entirely and halved a third. 28 pounds gone. Stamina I hadn't felt since my 30s.\n\nI'm not claiming I "cured" diabetes. But I am living proof that the body responds powerfully to the right conditions.`,
        timeline: [
            { month: 'Week 1', action: 'Started 16:8 intermittent fasting. Eliminated refined carbs, sugar, and processed foods.', milestone: false },
            { month: 'Month 1', action: 'Added Bitter Melon juice (morning, empty stomach). Fasting glucose dropped from 180 to 145mg/dL.', milestone: true },
            { month: 'Month 3', action: 'Started 45-min post-meal walks daily. Added fenugreek seeds soaked overnight + cinnamon to diet.', milestone: false },
            { month: 'Month 6', action: 'First medication reduced. A1C dropped from 9.2 to 7.4. Doctor approved reducing one drug.', milestone: true },
            { month: 'Month 10', action: 'Lost 28 lbs total. Added resistance training 3x/week.', milestone: false },
            { month: 'Month 14', action: 'A1C at 5.8 (healthy range). Two medications eliminated entirely. Third halved.', milestone: true },
        ],
        remedies: ['Bitter Melon Juice', 'Fenugreek Seeds (soaked)', 'Cinnamon (Ceylon)', 'Apple Cider Vinegar', 'Berberine', 'Amla (Indian Gooseberry)'],
        lifestyle: ['16:8 Intermittent Fasting', '45-min post-meal walks', 'Low-GI whole food diet', 'Resistance training 3x/week', 'Stress journaling'],
    },
    {
        id: 3,
        name: 'Priya Sharma',
        age: 28,
        location: 'Mumbai, India',
        avatar: 'P',
        category: "Women's Health",
        categoryColor: 'pink',
        title: 'Healing PCOS Naturally — My 2-Year Journey',
        headline: 'From 4-month cycles and unbearable cramps to regular periods and clear skin',
        initialState: 'Irregular cycles (skipping 3-4 months), severe acne, 18kg weight gain, constant fatigue.',
        currentState: 'Regular 28-day cycles, clear skin, lost 14kg, energy restored.',
        duration: '22 months',
        verified: true,
        hearts: 312,
        rating: 4.8,
        tags: ['#pcos', '#hormones', '#womenshealth', '#naturalhealing'],
        quote: 'PCOS taught me that my body was not broken. It was desperately asking for something different.',
        fullStory: `I was diagnosed with PCOS at 22 after years of irregular periods. By 26, I hadn't had a natural period in 5 months, my skin was in its worst condition, I'd gained nearly 18kg despite eating what I thought was healthy, and I was exhausted in a way that sleep didn't fix.\n\nThe standard prescription was birth control pills and Metformin. I took them for 6 months but felt increasingly disconnected from my body. When I came off the pill, my symptoms returned worse than before. I decided to investigate the root cause instead of managing symptoms.\n\nMy PCOS was insulin-resistant type. This was the key that unlocked everything. High insulin drives excess androgen production, which causes the acne, irregular ovulation, and weight gain. To fix the hormones, I needed to fix insulin.\n\nSpearmint tea became my first breakthrough — 2 cups daily. Clinical studies show spearmint significantly reduces free testosterone in women with PCOS. Within 6 weeks, my facial hair growth slowed and my skin started clearing.\n\nInositol (specifically Myo-inositol with D-Chiro in a 40:1 ratio) was the supplement that changed everything. It's essentially a natural insulin sensitizer. Combined with cutting out dairy completely (dairy contains IGF-1 which worsens androgen excess), my cycle appeared for the first time in 7 months at month 4.\n\nThe diet shift was dramatic: low glycemic, high protein, anti-inflammatory. No white rice, no bread, no packaged snacks. Sweet potatoes, lentils, quinoa, lots of vegetables. Flaxseeds daily for phytoestrogens to support estrogen balance.\n\nYoga targeting the pelvic region — Bhadrasana, Supta Baddha Konasana, Malasana — became a non-negotiable ritual. The combination of stress reduction and improved blood flow to the ovaries created visible changes in my cycle regularity.\n\nAt 22 months, I have regular 28-day cycles, clear skin, 14kg lost, and energy I haven't had since I was a teenager. My androgen levels are normal for the first time in my adult life. I cry every month when my period arrives — not from pain, but from gratitude.`,
        timeline: [
            { month: 'Month 1', action: 'Started spearmint tea (2 cups/day). Eliminated dairy, sugar, refined carbs completely.', milestone: false },
            { month: 'Month 2', action: 'Added Myo-Inositol (4g/day) + D-Chiro Inositol (400mg). Began daily pelvic yoga.', milestone: false },
            { month: 'Month 4', action: 'First natural period in 7 months! Skin started clearing. Lost 4kg.', milestone: true },
            { month: 'Month 8', action: 'Added Shatavari and Ashwagandha. Cycles now arriving every 34-38 days.', milestone: false },
            { month: 'Month 14', action: 'Cycles regularized to 28-30 days. Acne completely cleared. Lost 10kg total.', milestone: true },
            { month: 'Month 22', action: 'All hormone markers in normal range. 14kg lost. Regular 28-day cycles maintained.', milestone: true },
        ],
        remedies: ['Spearmint Tea (2x daily)', 'Myo-Inositol + D-Chiro Inositol', 'Shatavari', 'Ashwagandha', 'Flaxseeds (daily)', 'Vitamin D3 + Zinc'],
        lifestyle: ['Low-GI, high-protein diet', 'Dairy-free', 'Daily pelvic yoga (30 min)', 'Cold-press castor oil packs', 'Stress journaling', 'Sleep 8+ hours'],
    },
    {
        id: 4,
        name: 'Marcus Thompson',
        age: 41,
        location: 'London, UK',
        avatar: 'M',
        category: 'Mental Wellness',
        categoryColor: 'violet',
        title: 'From Severe Anxiety to Inner Peace — No Medication',
        headline: 'How Ayurveda, breathwork, and radical lifestyle change ended 8 years of anxiety',
        initialState: 'Daily panic attacks, unable to use public transport, social isolation, medication dependency.',
        currentState: 'Panic-attack free for 14 months, thriving social life, off all medication (doctor supervised).',
        duration: '18 months',
        verified: true,
        hearts: 278,
        rating: 4.9,
        tags: ['#anxiety', '#mentalhealth', '#breathwork', '#ayurveda'],
        quote: 'Anxiety was not my enemy. It was my body begging me to change the way I was living.',
        fullStory: `Eight years of anxiety. Eight years of panic attacks that would strike without warning — on the tube, in meetings, at family dinners. Eight years of carrying a growing list of medications that helped me function but never helped me heal.\n\nThe breaking point came in 2022 when a panic attack caused me to black out in a supermarket. Lying on the floor, surrounded by strangers calling an ambulance, I realized that managing anxiety was no longer enough. I needed to end it.\n\nI worked with both a psychiatrist (for medication supervision) and an Ayurvedic practitioner simultaneously. The Ayurvedic assessment identified my Vata imbalance — a constitutional tendency toward anxiety, overthinking, and dysregulation. The prescription was grounding: warm food, oil massage, routine, and calm.\n\nThe 4-7-8 breathing technique became my emergency tool. Within weeks of practicing it 3 times daily, I could abort panic attacks within 90 seconds — something no medication had ever achieved as quickly. The physiological mechanism is clear: activating the parasympathetic nervous system overrides the panic response.\n\nAshwagandha (KSM-66, 600mg daily) began rebalancing my cortisol curve. I have a cortisol test that shows my cortisol before ashwagandha was chronically elevated — a flat line where it should rise and fall. After 3 months, the rhythm normalized.\n\nThe most transformative change was a complete digital lifestyle overhaul. No news in the morning, no phone in bed, social media limited to 30 minutes in one session. The constant low-level stimulation had been feeding my anxiety without my realizing it.\n\nCold showers, which I began as a 2-week experiment, became a non-negotiable daily practice. The deliberate exposure to discomfort and the regulatory breathing it requires is, in my experience, one of the most effective anxiety interventions available without a prescription.\n\nMy last panic attack was 14 months ago. For the first time since my 20s, I take the tube every day without fear. I've traveled alone internationally. I went to a concert — in the crowd — and cried from joy, not terror.`,
        timeline: [
            { month: 'Month 1', action: 'Started 4-7-8 breathing practice 3x daily. Began Abhyanga (warm oil self-massage) each morning.', milestone: false },
            { month: 'Month 2', action: 'Added Ashwagandha (600mg KSM-66). Complete digital lifestyle overhaul.', milestone: false },
            { month: 'Month 3', action: 'Started daily cold showers. First week panic attack-free in 8 years.', milestone: true },
            { month: 'Month 6', action: 'Began supervised medication taper (with psychiatrist). Added daily meditation (10 min).', milestone: true },
            { month: 'Month 10', action: 'Off all medication (doctor-supervised). Panic attacks reduced to 1 per month.', milestone: true },
            { month: 'Month 18', action: 'Panic-attack free for 14 months. Traveling internationally. Thriving social life.', milestone: true },
        ],
        remedies: ['Ashwagandha (KSM-66)', 'Brahmi Tea', 'Chamomile + Lemon Balm Tea', 'Lavender Oil (diffuser)', 'Magnesium Glycinate', 'L-Theanine'],
        lifestyle: ['4-7-8 Breathing (3x daily)', 'Cold showers', 'Abhyanga (oil massage)', 'Daily meditation', 'Digital detox protocol', 'No caffeine after 12pm'],
    },
];

const categoryColors = {
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
    pink: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-100', badge: 'bg-pink-100 text-pink-700', dot: 'bg-pink-500' },
    violet: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-100', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
};

// ── Share Your Healing Path Modal ─────────────────────────────
function ShareModal({ onClose, onSubmit }) {
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        name: '', age: '', location: '', category: 'Chronic Stress',
        title: '', headline: '', initialState: '', currentState: '',
        fullStory: '', duration: '', remedies: '', lifestyle: '',
        isAnonymous: false, consent: false,
    });

    const TOTAL_STEPS = 3;
    const canNext1 = form.name.trim() && form.category && form.title.trim();
    const canNext2 = form.initialState.trim() && form.currentState.trim() && form.fullStory.trim();
    const canSubmit = form.consent;

    const handleSubmit = () => {
        if (!canSubmit) return;
        onSubmit(form);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-emerald-50 to-teal-50/40 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Share Your Healing Path 🌿</h2>
                        <div className="flex items-center gap-3 mt-2">
                            {[1, 2, 3].map(s => (
                                <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${s <= step ? 'bg-emerald-500 w-12' : 'bg-slate-200 w-8'}`} />
                            ))}
                            <span className="text-xs font-bold text-slate-400">Step {step} of {TOTAL_STEPS}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-8 space-y-5">
                    {/* Step 1 — Basic Info */}
                    {step === 1 && (
                        <>
                            <p className="text-sm font-bold text-slate-500 mb-4">Tell us about yourself and your journey title.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Name *</label>
                                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium"
                                        placeholder="Jane Doe" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Age</label>
                                    <input value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} type="number"
                                        className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium"
                                        placeholder="32" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location (optional)</label>
                                <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium"
                                    placeholder="City, Country" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Health Category *</label>
                                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-bold text-slate-700">
                                    {['Chronic Stress', 'Metabolic Health', 'Mental Wellness', "Women's Health", 'Immunity', 'Skin Health', 'Digestive Health', 'Weight Management', 'Other'].map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Story Title *</label>
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium"
                                    placeholder="e.g. How I Healed PCOS Naturally in 18 Months" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Healing Duration</label>
                                <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium"
                                    placeholder="e.g. 8 months" />
                            </div>
                        </>
                    )}

                    {/* Step 2 — Your Journey */}
                    {step === 2 && (
                        <>
                            <p className="text-sm font-bold text-slate-500 mb-4">Share the details of your transformation.</p>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Where You Started *</label>
                                <textarea value={form.initialState} onChange={e => setForm({ ...form, initialState: e.target.value })}
                                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium h-24 resize-none"
                                    placeholder="Describe your symptoms and how it affected your life..." />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Where You Are Now *</label>
                                <textarea value={form.currentState} onChange={e => setForm({ ...form, currentState: e.target.value })}
                                    className="w-full p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium h-24 resize-none"
                                    placeholder="Describe your life after healing..." />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Journey Story *</label>
                                <textarea value={form.fullStory} onChange={e => setForm({ ...form, fullStory: e.target.value })}
                                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium h-40 resize-none"
                                    placeholder="Tell your full story — what you tried, what worked, what didn't, key turning points..." />
                                <p className="text-[10px] text-slate-400 font-bold text-right">{form.fullStory.length}/3000</p>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Natural Remedies Used</label>
                                <input value={form.remedies} onChange={e => setForm({ ...form, remedies: e.target.value })}
                                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium"
                                    placeholder="e.g. Ashwagandha, Turmeric, Ginger tea" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lifestyle Changes</label>
                                <input value={form.lifestyle} onChange={e => setForm({ ...form, lifestyle: e.target.value })}
                                    className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-emerald-500/10 focus:outline-none text-sm font-medium"
                                    placeholder="e.g. Daily yoga, plant-based diet, cold showers" />
                            </div>
                        </>
                    )}

                    {/* Step 3 — Review & Submit */}
                    {step === 3 && (
                        <>
                            <p className="text-sm font-bold text-slate-500 mb-4">Almost there! Review and submit your healing story.</p>
                            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-6 space-y-3">
                                <h3 className="font-bold text-emerald-800 text-lg">"{form.title}"</h3>
                                <p className="text-sm text-emerald-700 font-medium">by {form.isAnonymous ? 'Anonymous' : form.name}{form.age ? `, ${form.age}` : ''}{form.location ? ` · ${form.location}` : ''}</p>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">{form.category}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Before</p>
                                    <p className="text-sm text-slate-600 font-medium line-clamp-3">{form.initialState}</p>
                                </div>
                                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                                    <p className="text-[10px] font-black uppercase text-emerald-600 mb-2">After</p>
                                    <p className="text-sm text-emerald-700 font-medium line-clamp-3">{form.currentState}</p>
                                </div>
                            </div>
                            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-amber-800 mb-1">Privacy & Medical Disclaimer</p>
                                        <p className="text-xs text-amber-700 font-medium leading-relaxed">
                                            Your story will be published instantly following compliance with our community guidelines. It is shared as a personal experience, not medical advice.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input type="checkbox" checked={form.consent} onChange={e => setForm({ ...form, consent: e.target.checked })}
                                    className="w-5 h-5 mt-0.5 rounded border-slate-200 text-emerald-500 focus:ring-emerald-500/20 shrink-0" />
                                <span className="text-sm text-slate-600 font-medium group-hover:text-slate-800 transition-colors">
                                    I confirm this is my genuine experience. I consent to it being published on NatureWellness as a personal story, not medical advice. *
                                </span>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={form.isAnonymous} onChange={e => setForm({ ...form, isAnonymous: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-200 text-emerald-500 focus:ring-emerald-500/20" />
                                <span className="text-sm text-slate-600 font-medium">Post anonymously (your name will be hidden publicly)</span>
                            </label>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-3">
                    {step > 1 && (
                        <button onClick={() => setStep(s => s - 1)}
                            className="px-6 py-3.5 bg-white text-slate-600 rounded-2xl font-bold border border-slate-200 hover:bg-slate-50 transition-all">
                            Back
                        </button>
                    )}
                    {step < TOTAL_STEPS ? (
                        <button onClick={() => setStep(s => s + 1)}
                            disabled={step === 1 ? !canNext1 : !canNext2}
                            className="flex-1 py-3.5 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95">
                            Continue <ChevronRight className="w-5 h-5" />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={!canSubmit}
                            className="flex-1 py-3.5 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95">
                            <Zap className="w-5 h-5" /> Submit for Review
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── Story Card ────────────────────────────────────────────────
function StoryCard({ story }) {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const cols = categoryColors[story.categoryColor] || categoryColors.emerald;
    const navigate = useNavigate();

    return (
        <article className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-emerald-900/5 overflow-hidden flex flex-col group hover:shadow-2xl hover:shadow-emerald-900/10 transition-all duration-300">
            {/* Top accent bar */}
            <div className={`h-1.5 w-full ${cols.dot}`} />
            <div className="p-8 sm:p-10 flex-1">
                {/* Author + Like Row */}
                <div className="flex justify-between items-start mb-7">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl ${cols.bg} ${cols.border} border flex items-center justify-center ${cols.text} text-2xl font-black`}>
                            {story.avatar}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{story.name}</h3>
                            <div className="flex items-center gap-2 flex-wrap mt-0.5">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${cols.text}`}>{story.category}</span>
                                <span className="flex items-center gap-0.5 text-[10px] font-black text-emerald-500">
                                    <CheckCircle2 className="w-3 h-3" /> Publicly Shared
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">· {story.duration}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setSaved(v => !v)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${saved ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-300 hover:text-amber-400'}`}>
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-amber-400' : ''}`} />
                        </button>
                        <button onClick={() => setLiked(v => !v)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all text-sm font-black ${liked ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-400'}`}>
                            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500' : ''}`} />
                            {story.hearts + (liked ? 1 : 0)}
                        </button>
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-slate-900 mb-6 italic leading-tight group-hover:text-emerald-600 transition-colors cursor-pointer"
                    onClick={() => navigate(`/success-stories/${story.id}`)}>
                    "{story.title}"
                </h2>

                {/* Before / After */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">The Beginning</span>
                        <p className="text-sm font-medium text-slate-500 leading-relaxed p-4 bg-slate-50 rounded-2xl border border-slate-100">{story.initialState}</p>
                    </div>
                    <div className="space-y-2">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${cols.text}`}>The Transformation</span>
                        <p className={`text-sm font-bold leading-relaxed p-4 ${cols.bg} rounded-2xl ${cols.border} border ${cols.text}`}>{story.currentState}</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {story.tags.map(tag => (
                        <span key={tag} className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cols.badge}`}>{tag}</span>
                    ))}
                </div>

                {/* Timeline Preview (first 2) */}
                {story.timeline && story.timeline.length > 0 ? (
                    <div className="space-y-3">
                        {story.timeline.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start">
                                <div className="w-7 h-7 rounded-full border-2 border-emerald-400 bg-white flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.month}</span>
                                    <p className="text-xs font-medium text-slate-600 mt-0.5 line-clamp-2">{item.action}</p>
                                </div>
                            </div>
                        ))}
                        {story.timeline.length > 2 && (
                            <p className="text-xs font-bold text-slate-400 ml-10">+ {story.timeline.length - 2} more milestones...</p>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-2xl border border-amber-100">
                        <span className="text-amber-400 text-lg">⏳</span>
                        <p className="text-xs font-bold text-amber-700">Journey just started — timeline will grow with each milestone.</p>
                    </div>
                )}
            </div>

            {/* Card Footer */}
            <div className="px-8 sm:px-10 py-5 bg-slate-50/60 border-t border-slate-100 flex justify-between items-center">
                <Link to={`/success-stories/${story.id}`}
                    className="flex items-center gap-2 text-sm font-bold text-emerald-600 hover:gap-4 transition-all group/link">
                    Read Full Journey
                    <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
                {story.isPending ? (
                    <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Publicly Shared
                    </span>
                ) : story.rating > 0 ? (
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-500">
                        {'★'.repeat(Math.round(story.rating))} <span className="text-slate-400">{story.rating}</span>
                    </div>
                ) : null}
            </div>
        </article>
    );
}

// ── Main SuccessStories Page ──────────────────────────────────
export default function SuccessStories() {
    const { user } = useAuth();
    const ud = useUserData();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Load base stories + any user-submitted stories from localStorage
    const [stories, setStories] = useState(() => {
        try {
            const saved = JSON.parse(localStorage.getItem('nw_user_stories') || '[]');
            return [...saved, ...STORIES_DATA];
        } catch { return STORIES_DATA; }
    });

    const handleSubmit = (data) => {
        const safeAvatar = data.isAnonymous ? '🌿' : (data.name?.[0]?.toUpperCase() || '?');
        const color = CATEGORY_COLOR_MAP[data.category] || 'emerald';
        const autoTags = CATEGORY_TAGS_MAP[data.category] || ['#naturalhealing'];
        const remedyList = data.remedies ? data.remedies.split(',').map(r => r.trim()).filter(Boolean) : [];
        const lifeList = data.lifestyle ? data.lifestyle.split(',').map(l => l.trim()).filter(Boolean) : [];

        // Build initial timeline from the form data
        const initialTimeline = [
            { month: 'Day 1', action: `Began healing journey: ${data.initialState}`, milestone: false },
            ...(data.duration ? [{ month: `After ${data.duration}`, action: data.currentState, milestone: true }] : []),
        ];

        const newStory = {
            id: Date.now(),
            name: data.isAnonymous ? 'Anonymous' : data.name,
            age: parseInt(data.age) || null,
            location: data.location || '',
            avatar: safeAvatar,
            category: data.category,
            categoryColor: color,
            title: data.title,
            headline: data.title,
            initialState: data.initialState,
            currentState: data.currentState,
            fullStory: data.fullStory,
            duration: data.duration || 'Ongoing',
            verified: false,
            isPending: true,
            hearts: 0,
            rating: 0,
            tags: autoTags,
            quote: '',
            timeline: initialTimeline,
            remedies: remedyList,
            lifestyle: lifeList,
        };

        // Persist to localStorage so StoryDetail can find it
        try {
            const existing = JSON.parse(localStorage.getItem('nw_user_stories') || '[]');
            localStorage.setItem('nw_user_stories', JSON.stringify([newStory, ...existing]));
        } catch { /* storage full — ignore */ }

        // Record in user's profile (awards +15 pts + Storyteller badge)
        ud.addStory(newStory);

        setStories(prev => [newStory, ...prev]);
        setIsFormOpen(false);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9f4] -mt-8 -mx-4 px-4 py-20">
                <div className="text-center bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl max-w-lg transition-all animate-in fade-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mx-auto mb-8 shadow-inner">
                        <Lock className="w-10 h-10" />
                    </div>
                    <h2 className="text-4xl font-bold text-slate-900 mb-4 font-outfit">Healing <span className="text-emerald-500 italic">Vault</span></h2>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed text-lg">
                        These success stories are intimate journeys shared by our community members. Please log in to read their full transformations.
                    </p>
                    <Link to="/login" className="inline-block w-full px-10 py-5 bg-emerald-500 text-white rounded-[2rem] font-bold text-xl hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/25 active:scale-95">
                        Enter the Vault
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9f4] py-20 px-4">
            <div className="max-w-7xl mx-auto">

                {/* Success Toast */}
                {submitted && (
                    <div className="fixed top-6 right-6 z-[200] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-xl font-bold text-sm flex items-center gap-2 animate-bounce-once">
                        <CheckCircle2 className="w-5 h-5" /> Story submitted for review! Thank you 🌿
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-[0.3em] mb-4">
                            <Sparkles className="w-4 h-4" /> Living Proof
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-5">
                            Real Journeys,{' '}
                            <span className="text-emerald-500 italic">Natural Miracles</span>
                        </h1>
                        <p className="text-slate-500 font-medium leading-relaxed text-lg">
                            Transformative stories from community members who chose the holistic path — and never looked back.
                        </p>
                        {/* Stats Row */}
                        <div className="flex gap-8 mt-8">
                            {[['5,200+', 'Stories Shared'], ['94%', 'Positive Outcomes'], ['127', 'Health Categories']].map(([val, label]) => (
                                <div key={label}>
                                    <p className="text-2xl font-bold text-emerald-600">{val}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button onClick={() => setIsFormOpen(true)}
                        className="px-10 py-5 bg-emerald-500 text-white rounded-[2rem] font-bold shadow-2xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95 flex items-center gap-3 shrink-0">
                        <Plus className="w-5 h-5" /> Share Your Healing Path
                    </button>
                </div>

                {/* Feature Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                    {[
                        { icon: Users, val: '5.2K', label: 'Community Members', color: 'emerald' },
                        { icon: Award, val: '94%', label: 'Success Rate', color: 'amber' },
                        { icon: BookOpen, val: '127', label: 'Health Topics', color: 'blue' },
                        { icon: TrendingUp, val: '38', label: 'Avg. Days to Improvement', color: 'violet' },
                    ].map(({ icon: Icon, val, label, color }) => (
                        <div key={label} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm text-center">
                            <div className={`w-10 h-10 rounded-2xl bg-${color}-50 flex items-center justify-center mx-auto mb-3`}>
                                <Icon className={`w-5 h-5 text-${color}-500`} />
                            </div>
                            <p className="text-2xl font-bold text-slate-900">{val}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
                        </div>
                    ))}
                </div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {stories.map(story => <StoryCard key={story.id} story={story} />)}
                </div>

                {/* Quote Bar */}
                <div className="mt-24 p-12 bg-emerald-900 rounded-[3rem] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
                        <Quote className="w-96 h-96" />
                    </div>
                    <p className="text-3xl font-bold italic text-emerald-100 max-w-3xl mx-auto leading-relaxed mb-6">
                        "Your body is a vessel for nature's wisdom. Give it the right conditions, and it will return to harmony."
                    </p>
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-black text-[10px] uppercase tracking-widest">
                        <Star className="w-4 h-4 fill-emerald-400" /> 5,000+ Success Stories Shared
                    </div>
                </div>

                {/* CTA Bottom */}
                <div className="mt-12 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm text-center">
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Your Story Could Inspire Thousands</h3>
                    <p className="text-slate-500 font-medium mb-6 max-w-lg mx-auto">Every healing journey matters. Share yours and become part of the cure for those still searching.</p>
                    <button onClick={() => setIsFormOpen(true)}
                        className="px-10 py-4 bg-emerald-500 text-white rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all flex items-center gap-2 mx-auto">
                        <Share2 className="w-5 h-5" /> Share Your Healing Path
                    </button>
                </div>
            </div>

            {isFormOpen && <ShareModal onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} />}
        </div>
    );
}
