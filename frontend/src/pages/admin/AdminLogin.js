import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../utils/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { signIn, user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect if already logged in as admin
    useEffect(() => {
        const checkUserRole = async () => {
            if (user) {
                try {
                    const profile = await apiService.getProfile();
                    if (profile && profile.role === 'admin') {
                        const from = location.state?.from?.pathname || '/admin';
                        navigate(from, { replace: true });
                    }
                } catch (err) {
                    console.error("Error verifying admin status:", err);
                }
            }
        };
        checkUserRole();
    }, [user, navigate, location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Sign in via Supabase
            await signIn(email, password);

            // Check role via our backend
            const profile = await apiService.getProfile();

            if (profile && profile.role === 'admin') {
                // Success
                const from = location.state?.from?.pathname || '/admin';
                navigate(from, { replace: true });
            } else {
                // Not an admin, sign them out and show error
                await signOut();
                setError('Unauthorized: Admin credentials required.');
            }
        } catch (err) {
            setError(err.message || 'Failed to sign in. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center mb-8">
                    <span
                        className="text-[2.5rem] tracking-[0.1em] text-primary"
                        style={{ fontFamily: '"Didot", "Bodoni MT", "Times New Roman", serif', fontWeight: 300, letterSpacing: '0.15em' }}
                    >
                        PHOENIX
                    </span>
                </Link>
                <h2 className="text-center text-3xl font-bold tracking-tighter text-gray-900 uppercase">
                    Admin Portal
                </h2>
                <p className="mt-2 text-center text-xs text-gray-500 uppercase tracking-widest">
                    Sign in to manage inventory and bookings
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 border border-gray-200 sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-widest">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-xs font-bold uppercase tracking-[0.15em] text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 transition-colors"
                            >
                                {loading ? 'Authenticating...' : 'Sign in as Admin'}
                            </button>
                        </div>

                        <div className="mt-6 text-center">
                            <Link to="/" className="text-xs font-medium text-gray-500 hover:text-gray-900 uppercase tracking-widest underline decoration-1 underline-offset-4">
                                Return to Main Site
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
