import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';

const AdminRoute = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const location = useLocation();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isChecking, setIsChecking] = useState(true);
    const [authError, setAuthError] = useState('');

    useEffect(() => {
        const verifyAdminStatus = async () => {
            if (!user) {
                setIsChecking(false);
                return;
            }

            try {
                const profile = await apiService.getProfile();
                if (profile && profile.role === 'admin') {
                    setIsAdmin(true);
                } else {
                    setAuthError('Unauthorized: Admin access required.');
                }
            } catch (error) {
                console.error('Error verifying admin status:', error);
                setAuthError('Error verifying credentials.');
            } finally {
                setIsChecking(false);
            }
        };

        if (!authLoading) {
            verifyAdminStatus();
        }
    }, [user, authLoading]);

    if (authLoading || isChecking) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    if (!user) {
        // Redirect to admin login, saving the location they tried to access
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold tracking-widest text-primary uppercase mb-4">
                        Access Denied
                    </h2>
                    <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs leading-relaxed">
                        {authError || 'You do not have permission to view the admin control panel.'}
                    </p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="bg-black text-white px-8 py-3 text-xs font-bold uppercase tracking-[0.15em]"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    // User is authenticated and is an admin
    return children;
};

export default AdminRoute;
