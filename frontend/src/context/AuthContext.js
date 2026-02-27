import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { apiService } from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Error getting session:', error);
            } else {
                setSession(session);
                setUser(session?.user ?? null);
            }

            setLoading(false);
        };

        getInitialSession();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log('Auth state changed:', event, session?.user?.email);

                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);

                // Handle auth events - create user profile
                if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session?.user) {
                    console.log('📝 Creating/verifying user profile for:', session.user.email);
                    try {
                        const response = await fetch(`${apiService.baseURL}/auth/callback`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${session.access_token}`
                            },
                            body: JSON.stringify({
                                user: session.user,
                                session: session
                            })
                        });

                        if (response.ok) {
                            const result = await response.json();
                            console.log('✅ User profile ready:', result.message);
                        } else {
                            const errorData = await response.text();
                            console.warn('⚠️ Profile creation failed:', response.status, errorData);
                        }
                    } catch (error) {
                        console.warn('⚠️ Auth callback error:', error.message);
                    }
                }
            }
        );

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signUp = async (email, password, metadata = {}) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) throw error;
        return data;
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    };

    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
    };

    const value = {
        user,
        session,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};