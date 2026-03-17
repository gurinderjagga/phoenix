import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'forgot-sent'
  const [resetEmail, setResetEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) throw error;
      if (data.user) navigate('/');
    } catch (error) {
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      setView('forgot-sent');
    } catch (error) {
      setError(error.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Visual Side */}
      <div className="hidden lg:block w-1/2 bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <h1 className="text-[10vw] font-bold text-white opacity-10 tracking-tighter loading-none select-none">
            PHOENIX
          </h1>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-md">
          <Link to="/" className="text-2xl font-bold tracking-widest text-primary uppercase mb-12 block">
            Phoenix
          </Link>

          {/* ── LOGIN VIEW ── */}
          {view === 'login' && (
            <>
              <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-2">
                Welcome Back.
              </h2>
              <p className="text-gray-500 mb-12 text-sm">
                Enter your credentials to access your garage.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-primary placeholder-gray-400"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-primary">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setResetEmail(formData.email); setError(''); }}
                      className="text-xs text-gray-400 hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-surface border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-primary placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-accent text-xs font-bold uppercase tracking-wide">
                    {error}
                  </div>
                )}

                <div className="pt-6">
                  <Button variant="primary" type="submit" disabled={loading} className="w-full">
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </Button>
                </div>

                <div className="text-center mt-6">
                  <span className="text-gray-400 text-xs">New to Phoenix? </span>
                  <Link to="/register" className="text-primary text-xs font-bold uppercase tracking-wide border-b border-primary pb-0.5">
                    Create Account
                  </Link>
                </div>
              </form>
            </>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {view === 'forgot' && (
            <>
              <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-2">
                Reset Password.
              </h2>
              <p className="text-gray-500 mb-12 text-sm">
                Enter your email and we'll send you a reset link.
              </p>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full bg-surface border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-primary placeholder-gray-400"
                    placeholder="name@example.com"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-accent text-xs font-bold uppercase tracking-wide">
                    {error}
                  </div>
                )}

                <div className="pt-6">
                  <Button variant="primary" type="submit" disabled={loading} className="w-full">
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </div>

                <div className="text-center mt-6">
                  <button
                    type="button"
                    onClick={() => { setView('login'); setError(''); }}
                    className="text-xs text-gray-400 hover:text-primary uppercase tracking-widest transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </form>
            </>
          )}

          {/* ── CONFIRMATION VIEW ── */}
          {view === 'forgot-sent' && (
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-8 border-2 border-black flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold uppercase tracking-tight text-primary mb-3">
                Check Your Email.
              </h2>
              <p className="text-gray-500 text-sm mb-2">
                A password reset link has been sent to:
              </p>
              <p className="font-bold text-primary text-sm mb-10">{resetEmail}</p>
              <button
                type="button"
                onClick={() => { setView('login'); setError(''); }}
                className="text-xs text-gray-400 hover:text-primary uppercase tracking-widest transition-colors"
              >
                ← Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;