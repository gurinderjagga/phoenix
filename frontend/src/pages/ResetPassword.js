import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { supabase } from '../utils/supabase';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false); // true once Supabase confirms recovery session
  const navigate = useNavigate();

  // Supabase processes the #access_token hash from the reset email during client
  // initialization — before React mounts. So PASSWORD_RECOVERY may have already
  // fired. We cover both cases: check an existing session AND listen for new events.
  useEffect(() => {
    // Case 1: token already exchanged before this component mounted
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    // Case 2: event fires after component mounts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      // Sign out so the user logs in fresh with the new password
      await supabase.auth.signOut();
      navigate('/login', { state: { passwordReset: true } });
    } catch (err) {
      setError(err.message || 'Failed to reset password.');
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
          <h1 className="text-[10vw] font-bold text-white opacity-10 tracking-tighter select-none">
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

          {!ready ? (
            /* Waiting for Supabase to fire PASSWORD_RECOVERY */
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-gray-500 text-sm uppercase tracking-widest">Verifying reset link…</p>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold uppercase tracking-tight text-primary mb-2">
                New Password.
              </h2>
              <p className="text-gray-500 mb-12 text-sm">
                Choose a strong password for your account.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full bg-surface border-none px-4 py-4 text-sm font-medium focus:ring-1 focus:ring-primary placeholder-gray-400"
                    placeholder="Min. 6 characters"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    {loading ? 'Saving…' : 'Set New Password'}
                  </Button>
                </div>

                <div className="text-center mt-6">
                  <Link
                    to="/login"
                    className="text-xs text-gray-400 hover:text-primary uppercase tracking-widest transition-colors"
                  >
                    ← Back to Sign In
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
