import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, RefreshCcw, Zap, AlertTriangle, ChevronRight } from 'lucide-react';
import { detectIntent, getSuggestions } from '../data/intentDetection';

export default function AIChatbot() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'bot',
            text: "Hello! 👋 I'm your **NatureWellness Guide** — your personal health companion powered by 200+ health categories.\n\nI can help with symptoms, natural remedies, diet, mental health, women's & men's health, and much more.\n\n💬 How are you feeling today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: ['I have a headache', 'Natural sleep remedy', 'Weight loss tips', 'Stress & anxiety help']
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const processMessage = (text) => {
        const { group, response, isEmergency } = detectIntent(text);
        const suggestions = getSuggestions(group);
        return { response, suggestions, isEmergency };
    };

    const handleSend = (customText) => {
        const messageText = (customText || input).trim();
        if (!messageText) return;

        const userMsg = {
            id: Date.now(),
            role: 'user',
            text: messageText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const { response, suggestions, isEmergency } = processMessage(messageText);

            const botMsg = {
                id: Date.now() + 1,
                role: 'bot',
                text: response,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                suggestions,
                isEmergency
            };

            setMessages(prev => [...prev, botMsg]);
            setIsTyping(false);
        }, 900);
    };

    const resetChat = () => {
        setMessages([{
            id: Date.now(),
            role: 'bot',
            text: "Chat reset! 🌿 I'm ready to help. What health topic would you like to explore?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            suggestions: ['I have a headache', 'Natural sleep remedy', 'Weight loss tips', 'Stress & anxiety help']
        }]);
    };

    // Render markdown-like bold (**text**) and newlines
    const renderText = (text) => {
        return text.split('\n').map((line, i) => {
            const parts = line.split(/\*\*(.*?)\*\*/g);
            return (
                <span key={i}>
                    {parts.map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                    {i < text.split('\n').length - 1 && <br />}
                </span>
            );
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f0faf4] via-[#f8fffe] to-[#edf7f2] py-8 px-4 flex items-center justify-center">
            <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-emerald-900/10 border border-slate-100 overflow-hidden flex flex-col" style={{ height: '90vh' }}>

                {/* ── Header ── */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-6 text-white flex items-center justify-between shadow-lg flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                            <Bot className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">NatureWellness Guide</h2>
                            <div className="flex items-center gap-1.5 opacity-80 mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
                                <span className="text-[10px] uppercase font-black tracking-widest">200+ Health Categories</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={resetChat}
                        className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/20 group"
                        title="Reset Chat"
                    >
                        <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    </button>
                </div>

                {/* ── Messages ── */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6" style={{ scrollbarWidth: 'none' }}>
                    {messages.map((msg) => (
                        <div key={msg.id}>
                            <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[82%] flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {/* Avatar */}
                                    <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-sm mt-1 ${msg.role === 'user'
                                            ? 'bg-emerald-500 text-white'
                                            : msg.isEmergency
                                                ? 'bg-red-500 text-white'
                                                : 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 border border-emerald-100'
                                        }`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>

                                    {/* Bubble */}
                                    <div className="space-y-1">
                                        <div className={`px-5 py-4 rounded-3xl shadow-sm text-sm leading-relaxed font-medium ${msg.role === 'user'
                                                ? 'bg-emerald-500 text-white rounded-tr-sm'
                                                : msg.isEmergency
                                                    ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-sm'
                                                    : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-sm'
                                            }`}>
                                            {renderText(msg.text)}
                                        </div>
                                        <span className={`text-[10px] font-semibold text-slate-300 block uppercase tracking-wider px-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Reply Chips */}
                            {msg.role === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                                <div className={`flex flex-wrap gap-2 mt-3 ${msg.role === 'bot' ? 'pl-12' : 'justify-end'}`}>
                                    {msg.suggestions.map((s, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(s)}
                                            className="flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-400 transition-all active:scale-95 shadow-sm"
                                        >
                                            <ChevronRight className="w-3 h-3" />
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-emerald-500" />
                                </div>
                                <div className="bg-slate-50 px-5 py-4 rounded-3xl rounded-tl-sm border border-slate-100 flex gap-1.5 shadow-sm">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* ── Disclaimer ── */}
                <div className="px-6 pb-3 flex-shrink-0">
                    <div className="bg-amber-50 px-4 py-3 rounded-2xl border border-amber-100 flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        <p className="text-[10px] text-amber-700 font-semibold">
                            <span className="uppercase">Medical Disclaimer:</span> This guide provides natural wellness information and is NOT a substitute for professional medical advice, diagnosis, or treatment.
                        </p>
                    </div>
                </div>

                {/* ── Input ── */}
                <div className="p-5 border-t border-slate-100 bg-slate-50/40 flex-shrink-0">
                    <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-2 border border-slate-200 shadow-sm focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-300 transition-all">
                        <Zap className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                        <input
                            type="text"
                            placeholder="Describe a symptom, ask about a remedy, or how you feel..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium text-slate-700 py-3 outline-none"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim()}
                            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center gap-2 group"
                        >
                            <span className="text-xs font-black uppercase tracking-widest hidden sm:block">Send</span>
                            <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
