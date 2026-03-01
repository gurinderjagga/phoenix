import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', isError: false });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name } }
      });
      if (error) throw error;
      if (data.user) {
        // Auto-login or redirect
        setAlertModal({ isOpen: true, message: 'Registration successful! Please login.', isError: false });
      }
    } catch (error) {
      setError(error.message || 'Registration failed');
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

          <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-2">
            Join the Legacy.
          </h2>
          <p className="text-gray-500 mb-12 text-sm">
            Create an account to configure and reserve your vehicle.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-surface border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-primary placeholder-gray-400"
                placeholder="John Doe"
              />
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  Password
                </label>
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
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full bg-surface border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-primary placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-accent text-xs font-bold uppercase tracking-wide">
                {error}
              </div>
            )}

            <div className="pt-6">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </div>

            <div className="text-center mt-6">
              <span className="text-gray-400 text-xs">Already a member? </span>
              <Link to="/login" className="text-primary text-xs font-bold uppercase tracking-wide border-b border-primary pb-0.5">
                Sign In
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative text-center border-t-4 border-black">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${alertModal.isError ? 'border-red-500 text-red-500' : 'border-black text-black'}`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-lg font-bold uppercase tracking-widest text-primary mb-2">
              Registration Complete
            </h2>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              {alertModal.message}
            </p>
            <button
              className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em]"
              onClick={() => {
                setAlertModal({ isOpen: false, message: '', isError: false });
                navigate('/login');
              }}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;