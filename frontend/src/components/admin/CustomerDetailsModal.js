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
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0" aria-hidden="true">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white text-left overflow-hidden shadow-2xl border-t-4 border-black sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-6 pt-6 pb-4">
                        <div className="w-full">
                            <div className="w-full">
                                <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest border-b border-gray-200 pb-4 mb-4" id="modal-title">
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
                                                className={`inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-bold uppercase tracking-widest rounded-sm text-white min-h-[48px] focus:outline-none w-full sm:w-auto mt-3 sm:mt-0 ${formData.is_active ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'}`}
                                            >
                                                {formData.is_active ? 'Block User' : 'Unblock User'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-200 sm:flex sm:flex-row-reverse space-y-3 sm:space-y-0 text-center">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full inline-flex items-center justify-center border border-transparent shadow-sm px-6 py-3 bg-black text-sm font-bold uppercase tracking-widest text-white min-h-[48px] focus:outline-none sm:ml-3 sm:w-auto disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="w-full inline-flex items-center justify-center border border-gray-300 shadow-sm px-6 py-3 bg-white text-sm font-bold uppercase tracking-widest text-gray-700 min-h-[48px] focus:outline-none sm:w-auto"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsModal;
