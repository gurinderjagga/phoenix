import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, MoreVertical, User } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import apiService from '../../utils/api';
import CustomerDetailsModal from '../../components/admin/CustomerDetailsModal';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalUsers: 0
  });

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.page, filters.role]); // Fetch when page or role changes

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllUsers(filters);

      if (data.users) {
        setCustomers(data.users);
        setPagination({
          totalPages: data.totalPages,
          totalUsers: data.totalUsers
        });
      } else {
        // Fallback for previous API structure if somehow partial
        setCustomers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleCustomerClick = async (customer) => {
    try {
      // Fetch full details including stats
      const fullDetails = await apiService.getUserById(customer.id);
      setSelectedCustomer(fullDetails);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };

  const handleCustomerUpdate = (updatedCustomer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    setSelectedCustomer(updatedCustomer);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-widest">
              Customer Management
            </h1>
            <p className="text-gray-600 mt-2">Manage customer information and interactions</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black w-full"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-gray-400" />
              </div>
              <select
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-black focus:border-black appearance-none bg-white w-full"
                value={filters.role}
                onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden shadow-sm rounded-lg">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading customers...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                          No customers found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      customers.map((customer) => (
                        <tr key={customer.id} className="">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0">
                                {customer.avatar ? (
                                  <img src={customer.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                                ) : (
                                  customer.name ? customer.name.charAt(0).toUpperCase() : <User size={20} />
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{customer.name || 'N/A'}</div>
                                <div className="text-sm text-gray-500">{customer.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${customer.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                              {customer.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${customer.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {customer.is_active !== false ? 'Active' : 'Blocked'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(customer.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleCustomerClick(customer)}
                              className="text-gray-400 min-h-[48px] min-w-[48px] flex items-center justify-center ml-auto"
                            >
                              <MoreVertical size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> to <span className="font-medium">{Math.min(filters.page * filters.limit, pagination.totalUsers)}</span> of <span className="font-medium">{pagination.totalUsers}</span> results
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePageChange(filters.page - 1)}
                      disabled={filters.page === 1}
                      className="p-2 border border-gray-300 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={() => handlePageChange(filters.page + 1)}
                      disabled={filters.page === pagination.totalPages}
                      className="p-2 border border-gray-300 rounded-md bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CustomerDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={selectedCustomer}
        onUpdate={handleCustomerUpdate}
      />
    </AdminLayout>
  );
};

export default Customers;

