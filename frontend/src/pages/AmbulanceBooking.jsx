import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Truck, MapPin, Phone, AlertTriangle, AlertCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const EMERGENCIES = ["Accident", "Heart Attack", "Stroke", "Pregnancy", "Critical Condition", "Other"];

export default function AmbulanceBooking() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmCancelId, setConfirmCancelId] = useState(null);

    const [formData, setFormData] = useState({
        patientName: '',
        location: '',
        contactNumber: '',
        emergencyType: 'Accident',
        notes: ''
    });

    useEffect(() => {
        if (!authLoading && !user) navigate('/login');
        else if (user) fetchRequests();
    }, [user, authLoading, navigate]);

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/ambulance/my');
            setRequests(data);
        } catch (error) {
            console.error('Error fetching requests', error);
        }
    };

    const handleRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/ambulance', formData);
            setFormData({ patientName: '', location: '', contactNumber: '', emergencyType: 'Accident', notes: '' });
            fetchRequests();
            toast.success('Ambulance request dispatched!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Request failed');
            console.error('Request failed', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        try {
            await api.patch(`/ambulance/${id}/cancel`);
            fetchRequests();
            toast.success('Request cancelled successfully');
        } catch (error) {
            toast.error('Cancellation failed');
            console.error('Cancellation failed', error);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
                <div className="w-10 h-10 border-3 border-red-500/20 border-t-red-600 rounded-full animate-spin"></div>
                <p className="text-slate-500 text-sm animate-pulse font-medium">Connecting to emergency fleet...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-10 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-red-600/5 rounded-full blur-[80px] -z-10"></div>
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100 shadow-sm">
                    <Truck className="w-8 h-8 text-red-600" />
                </div>
                <h1 className="text-4xl font-bold mb-3 text-slate-900 font-outfit">Emergency Ambulance</h1>
                <p className="text-red-700/80 font-medium max-w-2xl mx-auto">Request emergency transport immediately. Live tracking and quick dispatch for critical situations. Or directly call the government ambulance numbers below.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Request Form */}
                <div className="lg:col-span-1">
                    <form onSubmit={handleRequest} className="bg-white border border-red-100 p-6 rounded-2xl relative overflow-hidden shadow-xl shadow-red-900/5">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>

                        <div className="flex items-center gap-2 mb-6 text-red-600 border-b border-slate-50 pb-4">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-bold uppercase tracking-wider">Treated as highest priority</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Location / Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all outline-none" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} placeholder="Current exact location" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Contact No.</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input required type="tel" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all outline-none" value={formData.contactNumber} onChange={e => setFormData({ ...formData, contactNumber: e.target.value })} placeholder="+91..." />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Type</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all outline-none appearance-none" value={formData.emergencyType} onChange={e => setFormData({ ...formData, emergencyType: e.target.value })}>
                                        {EMERGENCIES.map(e => <option key={e} value={e} className="bg-white">{e}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Patient Name</label>
                                <input required type="text" className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500/50 focus:ring-4 focus:ring-red-500/5 transition-all outline-none" value={formData.patientName} onChange={e => setFormData({ ...formData, patientName: e.target.value })} placeholder="Patient's Name" />
                            </div>

                            <button type="submit" disabled={loading} className="w-full mt-6 py-4 rounded-xl bg-slate-900 hover:bg-red-600 text-white font-bold text-lg shadow-xl shadow-red-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                                {loading ? 'Dispatching...' : 'Request Ambulance Now'}
                            </button>

                            <a href="tel:102" className="flex items-center justify-center gap-2 w-full py-4 rounded-xl border border-red-100 bg-red-50 text-red-600 font-bold hover:bg-red-600 hover:text-white transition-all duration-300 mt-4 shadow-sm">
                                <Phone className="w-5 h-5" /> Call Govt Ambulance (102)
                            </a>
                        </div>
                    </form>
                </div>

                {/* Status Tracking */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold mb-6 text-slate-900 flex items-center gap-3 font-outfit">
                        <AlertCircle className="w-5 h-5 text-red-600" /> Live Requests
                    </h2>

                    <div className="space-y-4">
                        {requests.length === 0 ? (
                            <div className="bg-white flex flex-col items-center justify-center p-12 rounded-2xl text-center border-dashed border-2 border-slate-100 shadow-sm">
                                <Truck className="w-12 h-12 text-slate-200 mb-4" />
                                <p className="text-slate-400 font-medium">No active ambulance requests.</p>
                            </div>
                        ) : (
                            requests.map(req => (
                                <div key={req.id} className="bg-white p-6 rounded-2xl border border-slate-100 border-l-4 border-l-red-600 shadow-md hover:shadow-xl hover:shadow-red-900/5 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">{req.emergencyType} Emergency</h3>
                                            <p className="text-slate-400 text-xs font-semibold">{new Date(req.createdAt).toLocaleString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${req.status === 'REQUESTED' ? 'bg-amber-50 text-amber-600 border border-amber-100 animate-pulse' :
                                            req.status === 'DISPATCHED' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                                                req.status === 'ARRIVED' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                                                    req.status === 'CANCELLED' ? 'bg-slate-50 text-slate-500 border border-slate-200' :
                                                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            }`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-slate-600 font-medium">
                                        <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-red-400" /> {req.location}</p>
                                        <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-red-400" /> {req.contactNumber}</p>
                                    </div>

                                    {(req.status === 'REQUESTED' || req.status === 'DISPATCHED') && (
                                        <div className="mt-4">
                                            {confirmCancelId === req.id ? (
                                                <div className="flex gap-2 animate-in slide-in-from-right-2">
                                                    <button onClick={() => setConfirmCancelId(null)} className="flex-1 py-2 rounded-lg bg-slate-100 text-slate-500 text-xs font-bold">No, Keep</button>
                                                    <button onClick={() => { handleCancel(req.id); setConfirmCancelId(null); }} className="flex-1 py-2 rounded-lg bg-red-600 text-white text-xs font-bold shadow-lg shadow-red-500/20">Yes, Cancel</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmCancelId(req.id)}
                                                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20 text-xs font-semibold"
                                                >
                                                    <XCircle className="w-4 h-4" /> Cancel Application
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Progress Bar Visualizer */}
                                    {req.status !== 'CANCELLED' && (
                                        <div className="mt-6 pt-4 border-t border-slate-50">
                                            <div className="flex justify-between text-[10px] font-black tracking-widest mb-2 text-slate-400 uppercase">
                                                <span className={req.status === 'REQUESTED' || req.status === 'DISPATCHED' || req.status === 'ARRIVED' || req.status === 'COMPLETED' ? 'text-red-600' : ''}>Requested</span>
                                                <span className={req.status === 'DISPATCHED' || req.status === 'ARRIVED' || req.status === 'COMPLETED' ? 'text-red-600' : ''}>Dispatched</span>
                                                <span className={req.status === 'ARRIVED' || req.status === 'COMPLETED' ? 'text-red-600' : ''}>Arrived</span>
                                            </div>
                                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                                                <div className="h-full bg-gradient-to-r from-red-600 to-orange-500 transition-all duration-1000" style={{
                                                    width: req.status === 'REQUESTED' ? '25%' : req.status === 'DISPATCHED' ? '50%' : req.status === 'ARRIVED' ? '75%' : '100%'
                                                }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
