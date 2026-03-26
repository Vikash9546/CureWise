import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock as LockIcon, Loader2 } from 'lucide-react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('CUSTOMER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register', { email, password, role, firstName, lastName, username: username || undefined });
            toast.success('Registration successful! Please sign in.');
            navigate('/login');
        } catch (err) {
            const message = err.response?.data?.message || 'Failed to register';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setLoading(true);
        setError('');
        try {
            const { data } = await api.post('/auth/google', { credential: credentialResponse.credential });
            login(data.token, data.user);
            toast.success(`Welcome ${data.user.email}!`);
            navigate('/');
        } catch (err) {
            const message = err.response?.data?.message || 'Google Sign-In failed';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 px-4">
            <div className="bg-white p-10 relative overflow-hidden rounded-3xl border border-slate-100 shadow-2xl shadow-slate-200/50">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 to-indigo-600"></div>

                <div className="mb-10 text-center">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2 font-outfit">Create Account</h1>
                    <p className="text-slate-500 text-sm font-medium">Join Appointly today and start booking</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-sm mb-8 animate-shake font-medium">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">First Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all outline-none"
                                placeholder="John"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Last Name</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all outline-none"
                                placeholder="Doe"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Username <span className="text-slate-400 font-medium">(optional)</span></label>
                        <div className="relative group">
                            <input
                                type="text"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all outline-none"
                                placeholder="your_username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, '_'))}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                            <input
                                type="email"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all outline-none"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                        <div className="relative group">
                            <LockIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-600 transition-colors" />
                            <input
                                type="password"
                                required
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/5 transition-all outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-slate-900 hover:bg-violet-600 text-white font-bold text-lg shadow-xl shadow-slate-900/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Create Account'}
                    </button>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-widest font-black">
                            <span className="px-4 bg-white text-slate-400">Or continue with</span>
                        </div>
                    </div>

                    <div className="flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Sign-In was unsuccessful')}
                            theme="outline"
                            shape="pill"
                            size="large"
                        />
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-slate-50 text-center">
                    <p className="text-slate-500 text-sm font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-600 hover:text-indigo-600 font-bold transition-colors">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
