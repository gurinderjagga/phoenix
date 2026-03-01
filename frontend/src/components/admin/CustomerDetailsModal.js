import React, { useState, useEffect } from 'react';
import apiService from '../../utils/api';

const CustomerDetailsModal = ({ isOpen, onClose, customer, onUpdate }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        role: 'user',
        is_active: true
    });
    const [error, setError] = useState('');

    useEffect(() => {
        if (customer) {
            setFormData({
                role: customer.role || 'user',
                is_active: customer.is_active !== false // Default to true if undefined
            });
        }
    }, [customer]);

    if (!isOpen || !customer) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const updatedUser = await apiService.updateUser(customer.id, formData);
            onUpdate(updatedUser);
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update customer');
        } finally {
            setLoading(false);
        }
    };

    const handleBlockToggle = () => {
        setFormData(prev => ({ ...prev, is_active: !prev.is_active }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>

            <div className="relative bg-white w-full max-w-lg shadow-2xl">
                <div className="bg-white px-6 pt-6 pb-4">
                    <div className="w-full">
                        <div className="w-full">
                            <h3 className="text-base font-bold text-gray-900 uppercase tracking-widest pb-4 mb-4 border-b border-gray-100" id="modal-title">
                                Customer Details
                            </h3>

                            {error && (
                                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Full Name</label>
                                    <div className="mt-1 text-sm text-gray-900">{customer.name || 'N/A'}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Email</label>
                                    <div className="mt-1 text-sm text-gray-900">{customer.email}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Joined Date</label>
                                    <div className="mt-1 text-sm text-gray-900">
                                        {new Date(customer.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Total Orders</label>
                                    <div className="mt-1 text-sm text-gray-900">{customer.totalOrders || 0}</div>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-6 border-t pt-4">
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                            Role
                                        </label>
                                        <select
                                            id="role"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="mt-1 block w-full py-2 px-3 min-h-[48px] border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                                        <div>
                                            <span className="text-sm font-medium text-gray-900">Account Status</span>
                                            <p className="text-xs text-gray-500">
                                                {formData.is_active ? 'Active' : 'Blocked'}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleBlockToggle}
                                            className={`inline-flex justify-center items-center py-2 px-4 text-sm font-medium text-white min-h-[44px] focus:outline-none w-full sm:w-auto mt-3 sm:mt-0 ${formData.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
                                        >
                                            {formData.is_active ? 'Block User' : 'Unblock User'}
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="w-full inline-flex items-center justify-center px-5 py-2.5 border border-gray-300 bg-white text-sm font-medium text-gray-700 min-h-[44px] focus:outline-none sm:w-auto"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full inline-flex items-center justify-center px-5 py-2.5 bg-black text-sm font-medium text-white min-h-[44px] focus:outline-none sm:w-auto disabled:opacity-50"
                                    >
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsModal;
