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
                <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
                </div>

                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="sm:flex sm:items-start">
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
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
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black sm:text-sm"
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
                                                className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${formData.is_active
                                                        ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                                        : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                    }`}
                                            >
                                                {formData.is_active ? 'Block User' : 'Unblock User'}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
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
