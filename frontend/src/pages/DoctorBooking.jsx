import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Heart, Calendar, Clock, User, FileText, CheckCircle2, ChevronDown, Search, Filter, Star, CreditCard, X, Building2 as Hospital, Globe, MapPin as MapPinIcon, Navigation2, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';

const SPECIALTIES = ["All", "Ayurveda", "Homeopathy", "Naturopathy", "Siddha Medicine", "Unani Medicine", "Yoga Therapy", "Herbal Medicine", "Cardiology", "Dentistry", "Dermatology", "Pediatrics"];

export default function DoctorBooking() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // States
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Booking Flow States
    const [step, setStep] = useState(1); // 1: List, 2: Form, 3: Payment, 4: Success
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDetailDoctor, setSelectedDetailDoctor] = useState(null);
    const [bookingData, setBookingData] = useState({
        patientName: '',
        patientAge: '',
        appointmentDate: '',
        notes: ''
    });

    useEffect(() => {
        if (user) {
            fetchDoctors();
        }
    }, [user, searchQuery, selectedSpecialty, currentPage]);

    useEffect(() => {
        if (user) {
            fetchAppointments();
            if (!window.Razorpay && !document.querySelector('script[src*="razorpay.com"]')) {
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                document.body.appendChild(script);
            }
        }
    }, [user]);

    const fetchDoctors = async () => {
        setDoctorsLoading(true);
        try {
            const { data } = await api.get('/doctors', {
                params: {
                    page: currentPage,
                    search: searchQuery,
                    specialty: selectedSpecialty,
                    limit: 9
                }
            });
            setDoctors(data.doctors);
            setTotalPages(data.totalPages);
        } catch (error) {
            toast.error('Failed to load doctors');
        } finally {
            setDoctorsLoading(false);
        }
    };

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/doctors/my');
            setAppointments(data);
        } catch (error) {
            console.error('Error fetching appointments', error);
        }
    };

    const handleInitiateBooking = (doctor) => {
        setSelectedDoctor(doctor);
        setStep(2);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setStep(3);
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const payload = {
                ...bookingData,
                doctorId: selectedDoctor.id,
                paymentAmount: selectedDoctor.consultancyFee,
                simulated: true
            };
            await api.post('/doctors', payload);
            toast.success('Payment Received! Appointment Confirmed.');
            setStep(4);
            fetchAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setStep(1);
        setSelectedDoctor(null);
        setBookingData({ patientName: '', patientAge: '', appointmentDate: '', notes: '' });
    };

    // Server-side filtering, so we just use doctors from state
    const filteredDoctors = doctors;

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSpecialtyChange = (e) => {
        setSelectedSpecialty(e.target.value);
        setCurrentPage(1);
    };

    if (authLoading) {
        return (
            <div className="max-w-6xl mx-auto p-8 animate-pulse">
                <div className="flex justify-center mb-10"><div className="w-20 h-20 bg-violet-50 rounded-full"></div></div>
                <div className="h-10 bg-slate-200 rounded-full w-1/3 mx-auto mb-4"></div>
                <div className="h-4 bg-slate-100 rounded-full w-1/2 mx-auto mb-16"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="bg-white border text-center border-slate-100 h-[350px] rounded-[2rem] shadow-sm"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="mb-10 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-violet-600/5 rounded-full blur-[80px] -z-10"></div>
                <div className="w-16 h-16 rounded-full bg-violet-50 flex items-center justify-center mx-auto mb-4 border border-violet-100 shadow-sm">
                    <Heart className="w-8 h-8 text-violet-600" />
                </div>
                <h1 className="text-4xl font-bold mb-3 text-slate-900">
                    {step === 1 ? 'Find Your Specialist' : step === 2 ? 'Patient Information' : step === 3 ? 'Secure Payment' : 'Booking Confirmed!'}
                </h1>
                <p className="text-slate-600">
                    {step === 1 ? 'Select from our highly qualified medical professionals' :
                        step === 2 ? `Book an appointment with ${selectedDoctor?.name}` :
                            step === 3 ? 'Complete your consultancy fee payment' : 'Your health journey continues with us'}
                </p>
            </div>

            {step === 1 && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="md:col-span-2 relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by doctor or hospital name..."
                                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 focus:outline-none focus:border-violet-500/50 shadow-sm"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="relative group">
                            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                            <select
                                className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 appearance-none focus:outline-none focus:border-violet-500/50 shadow-sm cursor-pointer"
                                value={selectedSpecialty}
                                onChange={handleSpecialtyChange}
                            >
                                {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {(searchQuery !== '' || selectedSpecialty !== 'All') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedSpecialty('All');
                                }}
                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-violet-600 text-white text-xs font-bold hover:bg-violet-700 transition-all shadow-md"
                            >
                                <X className="w-3 h-3" /> Show All Doctors (Reset)
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {doctorsLoading ? (
                            [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="bg-white h-80 rounded-3xl animate-pulse border border-slate-100"></div>)
                        ) : filteredDoctors.length > 0 ? (
                            filteredDoctors.map(doctor => (
                                <div key={doctor.id} className="glass-card overflow-hidden group hover:border-violet-500/30 transition-all duration-500 flex flex-col shadow-sm">
                                    <div className="p-6 flex flex-col flex-1 cursor-pointer" onClick={() => setSelectedDetailDoctor(doctor)}>
                                        <div className="flex gap-4 mb-6">
                                            <div className="relative">
                                                <img src={doctor.imageUrl} alt={doctor.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-slate-50" />
                                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-white shadow-sm"></div>
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-violet-600">{doctor.name}</h3>
                                                <p className="text-violet-600 text-sm font-medium mb-1">{doctor.specialty}</p>
                                                <div className="flex items-center gap-1 text-xs text-amber-500">
                                                    <Star className="w-3 h-3 fill-amber-500" />
                                                    <span>{doctor.rating}</span>
                                                    <span className="text-slate-500 ml-1">({doctor.experience} Yrs Exp)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3 mb-6">
                                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                                <Hospital className="w-4 h-4 text-slate-400" />
                                                <span className="line-clamp-1">{doctor.hospitalName || 'Health Center'} {doctor.city && `• ${doctor.city}`}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-emerald-600 font-bold">
                                                <CreditCard className="w-4 h-4" />
                                                <span>₹{doctor.consultancyFee} Consultancy</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 pb-6 mt-auto">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleInitiateBooking(doctor); }}
                                            className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-violet-600 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                                        >
                                            <Calendar className="w-4 h-4" /> Book Appointment
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border-dashed border-2 border-slate-200">
                                <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-slate-400">No doctors match your search</h3>
                            </div>
                        )}
                    </div>

                    {/* Pagination UI */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 mb-16">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-violet-50 hover:text-violet-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronDown className="w-5 h-5 rotate-90" />
                            </button>
                            
                            {[...Array(totalPages)].map((_, i) => {
                                const page = i + 1;
                                if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === page 
                                                ? 'bg-violet-600 text-white shadow-lg shadow-violet-200 scale-110' 
                                                : 'text-slate-500 hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
                                        >
                                            {page}
                                        </button>
                                    );
                                }
                                if (page === currentPage - 2 || page === currentPage + 2) {
                                    return <span key={page} className="text-slate-300">...</span>;
                                }
                                return null;
                            })}

                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                className="w-10 h-10 rounded-xl flex items-center justify-center border border-slate-200 hover:bg-violet-50 hover:text-violet-600 disabled:opacity-30 disabled:pointer-events-none transition-all"
                            >
                                <ChevronDown className="w-5 h-5 -rotate-90" />
                            </button>
                        </div>
                    )}
                </>
            )}

            {step === 2 && (
                <div className="max-w-xl mx-auto">
                    <div className="glass-card p-8 border border-violet-100 shadow-xl">
                        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-4">
                                <img src={selectedDoctor.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                <div>
                                    <h2 className="text-lg font-bold text-slate-900">{selectedDoctor.name}</h2>
                                    <p className="text-xs text-violet-600 font-medium">{selectedDoctor.specialty}</p>
                                </div>
                            </div>
                            <button onClick={resetFlow} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={handleFormSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Patient Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-violet-600" />
                                    <input required type="text" className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4" placeholder="Full Name" value={bookingData.patientName} onChange={(e) => setBookingData({ ...bookingData, patientName: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                                    <input required type="number" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4" placeholder="Years" value={bookingData.patientAge} onChange={(e) => setBookingData({ ...bookingData, patientAge: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Date & Time</label>
                                    <input required type="datetime-local" className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4" value={bookingData.appointmentDate} onChange={(e) => setBookingData({ ...bookingData, appointmentDate: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Notes</label>
                                <textarea className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 resize-none min-h-[100px]" placeholder="Symptoms..." value={bookingData.notes} onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full py-4 rounded-xl bg-violet-600 text-white font-bold shadow-lg flex justify-center items-center gap-2 hover:bg-violet-700">
                                Proceed to Payment <CreditCard className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="max-w-md mx-auto">
                    <div className="glass-card p-8 border border-emerald-100 shadow-xl">
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
                                <CreditCard className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900">Consultancy Fee</h2>
                            <p className="text-emerald-600 text-3xl font-black mt-2">₹{selectedDoctor.consultancyFee}</p>
                        </div>
                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm py-3 border-b border-slate-100">
                                <span className="text-slate-500">Doctor</span>
                                <span className="text-slate-900 font-semibold">{selectedDoctor.name}</span>
                            </div>
                            <div className="flex justify-between text-sm py-3 border-b border-slate-100">
                                <span className="text-slate-500">Patient</span>
                                <span className="text-slate-900 font-semibold">{bookingData.patientName}</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setStep(2)} className="flex-1 py-4 rounded-xl border border-slate-200 font-bold">Back</button>
                            <button onClick={handlePayment} disabled={loading} className="flex-[2] py-4 rounded-xl bg-emerald-600 text-white font-bold disabled:opacity-50">
                                {loading ? 'Processing...' : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="max-w-md mx-auto text-center py-20 px-8 bg-white rounded-3xl shadow-xl">
                    <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-8 border-4 border-emerald-100">
                        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 mb-4">You're All Set!</h2>
                    <button onClick={resetFlow} className="w-full py-4 bg-violet-600 text-white rounded-xl font-bold">Return to Portal</button>
                </div>
            )}

            {(step === 1 || step === 4) && (
                <div className="mt-20">
                    <h2 className="text-2xl font-bold mb-8 text-slate-800 flex items-center gap-3"><Clock className="w-6 h-6 text-violet-500" /> History</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {appointments.length === 0 ? <p className="text-slate-400">No appointments yet.</p> :
                            appointments.map(apt => (
                                <div key={apt.id} className="bg-white p-6 rounded-2xl border border-slate-100 border-l-4 border-l-violet-500 shadow-sm">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-slate-900">{apt.doctor?.name}</h3>
                                            <p className="text-violet-600 text-xs">{apt.specialty}</p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">{apt.status}</span>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-slate-50 text-xs flex justify-between">
                                        <span className="text-slate-500 italic">{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                                        <span className="font-bold text-emerald-600">₹{apt.paymentAmount} Paid</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )}

            {selectedDetailDoctor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                        <button onClick={() => setSelectedDetailDoctor(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 z-10"><X className="w-6 h-6" /></button>
                        <div className="h-48 bg-gradient-to-br from-violet-600 to-indigo-700 p-8 flex items-end">
                            <div className="flex items-center gap-6 translate-y-12">
                                <img src={selectedDetailDoctor.imageUrl} alt="" className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl" />
                                <div className="pb-2">
                                    <h2 className="text-3xl font-bold text-white mb-1">{selectedDetailDoctor.name}</h2>
                                    <p className="text-violet-100 font-medium">{selectedDetailDoctor.specialty}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 pt-16">
                            <div className="grid grid-cols-3 gap-4 mb-10">
                                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400">Exp</p>
                                    <p className="font-bold">{selectedDetailDoctor.experience} Yrs</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400">Rating</p>
                                    <p className="font-bold">{selectedDetailDoctor.rating}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl text-center">
                                    <p className="text-[10px] font-black uppercase text-slate-400">Fee</p>
                                    <p className="text-emerald-600 font-black">₹{selectedDetailDoctor.consultancyFee}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-10">
                                Professional {selectedDetailDoctor.specialty} expert with {selectedDetailDoctor.experience} years of experience.
                            </p>
                            <button onClick={() => { handleInitiateBooking(selectedDetailDoctor); setSelectedDetailDoctor(null); }} className="w-full py-5 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-violet-600 transition-all flex items-center justify-center gap-3">
                                <Calendar className="w-6 h-6" /> Book Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
