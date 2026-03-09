import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import Button from '../components/Button';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: ''
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', isError: false });

    useBodyScrollLock(alertModal.isOpen);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getProfile();

            setProfile({
                name: data.name || user.user_metadata?.name || '',
                email: data.email || user.email || '',
                phone: data.phone || '',
                address: data.address || {
                    street: '',
                    city: '',
                    state: '',
                    zipCode: ''
                }
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError(error.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await apiService.updateProfile(profile);
            setIsEditing(false);
            setAlertModal({ isOpen: true, message: 'Profile updated successfully!', isError: false });
        } catch (error) {
            console.error('Error updating profile:', error);
            setAlertModal({ isOpen: true, message: error.message || 'Failed to update profile', isError: true });
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter text-primary mb-4">Access Restricted</h2>
                    <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">
                        Please authenticate to view this secure area.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/login">
                            <Button variant="primary">Sign In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="secondary">Register</Button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-secondary flex justify-center items-center">
                <div className="text-red-500 border border-red-200 bg-white p-6">
                    <h3 className="uppercase tracking-widest font-bold mb-2">Error</h3>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary flex justify-center items-center">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary pt-28 md:pt-32 pb-12">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12">

                {/* Header */}
                <div className="mb-8 md:mb-16 border-b border-gray-200 pb-6 md:pb-8 flex justify-between items-end">
                    <div>
                        <span className="text-accent font-bold uppercase tracking-widest text-xs mb-1 md:mb-2 block">Owner Area</span>
                        <h1 className="text-3xl md:text-6xl font-bold tracking-tighter text-primary uppercase">
                            Profile
                        </h1>
                    </div>
                    <div className="text-right hidden md:block">
                        <p className="text-xs uppercase tracking-widest text-gray-500">Member ID</p>
                        <p className="text-sm font-bold text-primary font-mono">{user.id.slice(0, 8)}</p>
                    </div>
                </div>

                {/* MOBILE: Horizontal quick nav */}
                <div className="flex gap-2 mb-6 lg:hidden">
                    <span className="flex-1 text-center py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest">Account Settings</span>
                    <Link to="/reserved" className="flex-1 text-center py-2.5 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                        Reserved Vehicle
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Nav — desktop only */}
                    <div className="hidden lg:block w-full lg:w-64 flex-shrink-0 space-y-1">
                        <div className="p-4 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">
                            Account Settings
                        </div>
                        <Link to="/reserved" className="block p-4 border border-gray-100 text-xs font-bold uppercase tracking-widest">
                            Your Reserved Vehicle
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow">
                        <div className="border border-gray-200 p-4 sm:p-6 md:p-8 lg:p-12">
                            <div className="flex justify-between items-center mb-8 md:mb-12">
                                <h2 className="text-xl font-bold uppercase tracking-widest text-primary">
                                    Personal Details
                                </h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="text-xs font-bold uppercase tracking-widest text-accent"
                                >
                                    {isEditing ? 'Cancel Editing' : '[ Edit Information ]'}
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
                                {/* Left Column */}
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-widest text-gray-400">Full Name</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full border-b border-gray-300 py-2 min-h-[48px] text-primary font-bold focus:outline-none focus:border-primary bg-transparent rounded-none"
                                            />
                                        ) : (
                                            <p className="text-lg font-medium text-primary border-b border-transparent py-2">
                                                {profile.name || '—'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-widest text-gray-400">Email Address</label>
                                        <p className="text-lg font-medium text-gray-500 border-b border-transparent py-2">
                                            {profile.email}
                                            <span className="text-[10px] text-gray-300 ml-2 uppercase tracking-normal">(Read Only)</span>
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-widest text-gray-400">Phone</label>
                                        {isEditing ? (
                                            <input
                                                type="tel"
                                                value={profile.phone}
                                                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                className="w-full border-b border-gray-300 py-2 min-h-[48px] text-primary font-bold focus:outline-none focus:border-primary bg-transparent rounded-none"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        ) : (
                                            <p className="text-lg font-medium text-primary border-b border-transparent py-2">
                                                {profile.phone || '—'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Address */}
                                <div className="space-y-8">
                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-widest text-gray-400">Street Address</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={profile.address.street}
                                                onChange={(e) => setProfile({ ...profile, address: { ...profile.address, street: e.target.value } })}
                                                className="w-full border-b border-gray-300 py-2 min-h-[48px] text-primary font-bold focus:outline-none focus:border-primary bg-transparent rounded-none"
                                            />
                                        ) : (
                                            <p className="text-lg font-medium text-primary border-b border-transparent py-2">
                                                {profile.address.street || '—'}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-400">City</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={profile.address.city}
                                                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, city: e.target.value } })}
                                                    className="w-full border-b border-gray-300 py-2 text-primary font-bold focus:outline-none focus:border-primary bg-transparent rounded-none"
                                                />
                                            ) : (
                                                <p className="text-lg font-medium text-primary border-b border-transparent py-2">
                                                    {profile.address.city || '—'}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-[10px] uppercase tracking-widest text-gray-400">State / Province</label>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={profile.address.state}
                                                    onChange={(e) => setProfile({ ...profile, address: { ...profile.address, state: e.target.value } })}
                                                    className="w-full border-b border-gray-300 py-2 text-primary font-bold focus:outline-none focus:border-primary bg-transparent rounded-none"
                                                />
                                            ) : (
                                                <p className="text-lg font-medium text-primary border-b border-transparent py-2">
                                                    {profile.address.state || '—'}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-[10px] uppercase tracking-widest text-gray-400">Zip / Postal Code</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={profile.address.zipCode}
                                                onChange={(e) => setProfile({ ...profile, address: { ...profile.address, zipCode: e.target.value } })}
                                                className="w-full border-b border-gray-300 py-2 text-primary font-bold focus:outline-none focus:border-primary bg-transparent rounded-none"
                                            />
                                        ) : (
                                            <p className="text-lg font-medium text-primary border-b border-transparent py-2">
                                                {profile.address.zipCode || '—'}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isEditing && (
                                <div className="mt-8 md:mt-12 flex justify-end">
                                    <Button onClick={handleSave} disabled={saving} className="w-full md:w-auto">
                                        {saving ? 'Saving...' : 'Save Profile'}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Alert Modal */}
            {alertModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
                    <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative text-center border-t-4 border-black">
                        <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${alertModal.isError ? 'border-red-500 text-red-500' : 'border-black text-black'}`}>
                            {alertModal.isError ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                            )}
                        </div>
                        <h2 className="text-lg font-bold uppercase tracking-widest text-primary mb-2">
                            {alertModal.isError ? 'Action Failed' : 'Success'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            {alertModal.message}
                        </p>
                        <button
                            className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em]"
                            onClick={() => setAlertModal({ isOpen: false, message: '', isError: false })}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;