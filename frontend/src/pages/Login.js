import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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

  return (
    <div className="min-h-screen flex">
      {/* Visual Side */}
      <div className="hidden lg:block w-1/2 bg-neutral-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        {/* Abstract or car background could go here */}
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
        </div>
      </div>
    </div>
  );
};

export default Login;