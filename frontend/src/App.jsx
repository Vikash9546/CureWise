import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { UserDataProvider, useUserData } from './context/UserDataContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './pages/Login';
import Register from './pages/Register';
// import AdminDashboard from './pages/AdminDashboard';
import HomePage from './pages/HomePage';
import DoctorBooking from './pages/DoctorBooking';
import AmbulanceBooking from './pages/AmbulanceBooking';
import MeetingBooking from './pages/MeetingBooking';
import Profile from './pages/Profile';
import AIChatbot from './pages/AIChatbot';
import SymptomChecker from './pages/SymptomChecker';
import RemedyDatabase from './pages/RemedyDatabase';
import HealthTools from './pages/HealthTools';
import WellnessBlog from './pages/WellnessBlog';
import YogaSection from './pages/YogaSection';
import CommunityHub from './pages/CommunityHub';
import SuccessStories from './pages/SuccessStories';
import StoryDetail from './pages/StoryDetail';
import DailyChallenges from './pages/DailyChallenges';
import WellnessPlans from './pages/WellnessPlans';
import YogaCentreFinder from './pages/YogaCentreFinder';
import './index.css';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID";

// ── Global Badge Toast ────────────────────────────────────────
function BadgeToast() {
    const { newBadges } = useUserData();
    if (!newBadges || newBadges.length === 0) return null;
    return (
        <div className="fixed bottom-6 left-6 z-[500] flex flex-col gap-3 pointer-events-none">
            {newBadges.map((badge, i) => badge && (
                <div key={badge.id || i}
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce pointer-events-auto">
                    <span className="text-2xl">{badge.icon}</span>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Badge Unlocked! 🎉</p>
                        <p className="font-bold text-sm">{badge.label}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-violet-500/10 border-t-violet-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-b-fuchsia-500 rounded-full animate-spin [animation-duration:1.5s]"></div>
            </div>
            <p className="text-slate-600 font-medium animate-pulse">Initializing Appointly...</p>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ErrorBoundary>
                <Router>
                    <AuthProvider>
                        <UserDataProvider>
                            <div className="min-h-screen bg-white text-slate-900">
                                <Navbar />
                                <main>
                                    <Routes>
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                        <Route path="/" element={<HomePage />} />
                                        <Route path="/doctors" element={<DoctorBooking />} />
                                        <Route path="/ambulance" element={<AmbulanceBooking />} />
                                        <Route path="/meetings" element={<MeetingBooking />} />
                                        <Route
                                            path="/profile"
                                            element={
                                                <ProtectedRoute>
                                                    <Profile />
                                                </ProtectedRoute>
                                            }
                                        />
                                        {/* <Route
                                            path="/admin"
                                            element={
                                                <ProtectedRoute roles={['ADMIN']}>
                                                    <AdminDashboard />
                                                </ProtectedRoute>
                                            }
                                        /> */}
                                        {/* NatureWellness Core Features */}
                                        <Route path="/ai-chatbot" element={<AIChatbot />} />
                                        <Route path="/symptom-checker" element={<SymptomChecker />} />
                                        <Route path="/remedies" element={<RemedyDatabase />} />
                                        <Route path="/health-tools" element={<HealthTools />} />
                                        <Route path="/blog" element={<WellnessBlog />} />
                                        <Route path="/yoga" element={<YogaSection />} />
                                        <Route path="/community" element={<CommunityHub />} />
                                        <Route path="/success-stories" element={<SuccessStories />} />
                                        <Route path="/success-stories/:id" element={<StoryDetail />} />
                                        <Route path="/challenges" element={<DailyChallenges />} />
                                        <Route path="/wellness-plans" element={<WellnessPlans />} />
                                        <Route path="/yoga-finder" element={<YogaCentreFinder />} />
                                    </Routes>
                                </main>
                            </div>
                            <BadgeToast />
                            <Toaster
                                position="top-right"
                                toastOptions={{
                                    duration: 2000,
                                    className: 'bg-white border border-slate-200 text-slate-800 shadow-xl rounded-xl',
                                    style: {
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                    },
                                    success: {
                                        iconTheme: {
                                            primary: '#7c3aed',
                                            secondary: '#fff',
                                        },
                                    },
                                }}
                            />
                        </UserDataProvider>
                    </AuthProvider>
                </Router>
            </ErrorBoundary>
        </GoogleOAuthProvider>
    );
}

export default App;
