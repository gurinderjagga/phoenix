import React, { useState } from 'react';
import Button from './Button';
import { apiService } from '../utils/api';

const AddressModal = ({ isOpen, onClose, onSuccess, initialAddress = {} }) => {
    const [address, setAddress] = useState({
        street: initialAddress?.street || '',
        city: initialAddress?.city || '',
        state: initialAddress?.state || '',
        zipCode: initialAddress?.zipCode || ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Basic validation
        if (!address.street || !address.city || !address.state || !address.zipCode) {
            setError('All fields are required');
            setLoading(false);
            return;
        }

        try {
            // Get current profile to merge data (or just update address part if API supports partial)
            // Assuming updateProfile expects the full profile object or we reconstruct it.
            // Ideally api.updateProfile should handle partial updates, but looking at Profile.js it seems to send the whole object.
            // Let's fetch current profile first to be safe, or assume the caller passed the current user context if needed.
            // To keep it self-contained, let's fetch profile first.
            const currentProfile = await apiService.getProfile();

            const updatedProfile = {
                ...currentProfile,
                address: address
            };

            await apiService.updateProfile(updatedProfile);

            onSuccess(address);
        } catch (err) {
            console.error('Error saving address:', err);
            setError(err.message || 'Failed to save address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md p-8 relative shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold uppercase tracking-tighter text-primary mb-2">
                    Shipping Address
                </h2>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-6">
                    Please provide a delivery address to continue.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Street Address</label>
                        <input
                            type="text"
                            name="street"
                            value={address.street}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 py-2 text-primary font-medium focus:outline-none focus:border-black"
                            placeholder="123 Main St"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">City</label>
                            <input
                                type="text"
                                name="city"
                                value={address.city}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 py-2 text-primary font-medium focus:outline-none focus:border-black"
                                placeholder="New York"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">State</label>
                            <input
                                type="text"
                                name="state"
                                value={address.state}
                                onChange={handleChange}
                                className="w-full border-b border-gray-300 py-2 text-primary font-medium focus:outline-none focus:border-black"
                                placeholder="NY"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-1">Zip Code</label>
                        <input
                            type="text"
                            name="zipCode"
                            value={address.zipCode}
                            onChange={handleChange}
                            className="w-full border-b border-gray-300 py-2 text-primary font-medium focus:outline-none focus:border-black"
                            placeholder="10001"
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save & Continue'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
