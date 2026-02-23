import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Video, Calendar, Clock, Link as LinkIcon, Users, Type } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function MeetingBooking() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(false);
    const dateInputRef = useRef(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        meetingDate: '',
        duration: 30,
        type: 'video',
    });

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
        else if (user) fetchMeetings();
    }, [user, authLoading, navigate]);

    const fetchMeetings = async () => {
        try {
            const { data } = await api.get('/meetings/my');
            setMeetings(data);
        } catch (error) {
            console.error('Error fetching meetings', error);
        }
    };

    const handleSchedule = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/meetings', {
                ...formData,
                duration: parseInt(formData.duration)
            });
            setFormData({ title: '', description: '', meetingDate: '', duration: 30, type: 'video' });
            fetchMeetings();
            toast.success('Meeting scheduled and link generated!');
        } catch (error) {
            const message = error.response?.data?.message || 'Scheduling failed';
            toast.error(message);
            console.error('Scheduling failed', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <div className="w-10 h-10 border-3 border-blue-500/20 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm animate-pulse font-medium">Syncing virtual rooms...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-10 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-600/5 rounded-full blur-[80px] -z-10"></div>
                <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
                    <Video className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-4xl font-bold mb-3 text-slate-900 font-outfit">Virtual Meetings</h1>
                <p className="text-slate-600 font-medium max-w-2xl mx-auto">Schedule audio/video calls with instant secure meeting links</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form */}
                <div className="lg:col-span-4">
                    <form onSubmit={handleSchedule} className="bg-white p-6 sticky top-28 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50">
                        <h2 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-50 pb-4 font-outfit">Schedule a Call</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Meeting Title</label>
                                <div className="relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Project Sync..." />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none appearance-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="video" className="bg-white">Video Call</option>
                                        <option value="audio" className="bg-white">Audio Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Duration (min)</label>
                                    <input required type="number" min="15" step="15" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Date & Time</label>
                                <div className="relative group cursor-pointer" onClick={() => dateInputRef.current?.showPicker()}>
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                    <input
                                        required
                                        type="datetime-local"
                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-slate-900 cursor-pointer focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                                        value={formData.meetingDate}
                                        onChange={e => setFormData({ ...formData, meetingDate: e.target.value })}
                                        ref={dateInputRef}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.target.showPicker();
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description (Optional)</label>
                                <textarea className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none min-h-[80px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Agenda..." />
                            </div>

                            <button type="submit" disabled={loading} className="w-full mt-6 py-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-bold text-lg shadow-xl shadow-blue-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                {loading ? 'Scheduling...' : 'Generate Meet Link'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Scheduled Meetings Grid */}
                <div className="lg:col-span-8">
                    <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-3 font-outfit">
                        <Calendar className="w-5 h-5 text-blue-600" /> Upcoming Meetings
                    </h2>

                    {meetings.length === 0 ? (
                        <div className="bg-white flex flex-col items-center justify-center p-16 rounded-2xl text-center border-dashed border-2 border-slate-100 shadow-sm">
                            <Video className="w-12 h-12 text-slate-200 mb-4" />
                            <p className="text-slate-400 font-medium italic">Your schedule is clear. Book a meeting to get started.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {meetings.map(meeting => (
                                <div key={meeting.id} className="bg-white p-6 flex flex-col group hover:border-blue-500/30 rounded-2xl border border-slate-100 shadow-md transition-all hover:shadow-xl hover:shadow-blue-900/5">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100 shadow-sm">
                                            {meeting.type === 'video' ? <Video className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${meeting.status === 'SCHEDULED' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                            {meeting.status}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-slate-900 text-lg mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors" title={meeting.title}>{meeting.title}</h3>
                                    {meeting.description && <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">{meeting.description}</p>}

                                    <div className="mt-auto pt-4 space-y-2 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <Calendar className="w-4 h-4 text-blue-500/50" />
                                            <span>{new Date(meeting.meetingDate).toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <Clock className="w-4 h-4 text-blue-500/50" />
                                            <span>{meeting.duration} minutes</span>
                                        </div>
                                    </div>

                                    {meeting.meetLink && meeting.status !== 'CANCELLED' && (
                                        <a
                                            href={meeting.meetLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-600 hover:text-white transition-all duration-300 font-bold tracking-widest uppercase text-[10px] shadow-sm"
                                        >
                                            <LinkIcon className="w-4 h-4" /> Join Virtual Meeting
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
