import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import apiService from '../../utils/api';
import useBodyScrollLock from '../../hooks/useBodyScrollLock';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', isError: false });

  useBodyScrollLock(alertModal.isOpen);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await apiService.getAllBookings();
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await apiService.updateBookingStatus(bookingId, newStatus);
      // Refresh list to show updated status
      fetchBookings();
    } catch (error) {
      console.error('Error updating status:', error);
      setAlertModal({ isOpen: true, message: 'Failed to update booking status', isError: true });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-green-100 text-green-800';
      case 'ready for pickup': return 'bg-green-100 text-green-800';
      default: return 'bg-yellow-100 text-yellow-800'; // pending
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-widest">
            Bookings Management
          </h1>
          <p className="text-gray-600 mt-2">Manage customer bookings and reservations</p>
        </div>

        <div className="bg-white border border-gray-200 overflow-hidden relative">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading bookings...</p>
            </div>
          ) : (
            <>
              {/* === MOBILE CARD VIEW === */}
              <div className="block md:hidden divide-y divide-gray-200">
                {bookings.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No bookings found.</div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-gray-500">#{booking.id.slice(0, 8)}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full uppercase ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{booking.profiles?.name || booking.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{booking.profiles?.email || booking.user?.email}</p>
                      </div>
                      {booking.order_items && booking.order_items.length > 0 && (
                        <div className="bg-gray-50 p-2 rounded-sm">
                          {booking.order_items.map((item, idx) => (
                            <p key={idx} className="text-xs text-gray-700">{item.cars.brand} {item.cars.model} &times;{item.quantity}</p>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">${(booking.total_amount || 0).toLocaleString()}</span>
                        <select
                          value={booking.status}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                          className="bg-white border border-gray-300 text-gray-700 py-2 px-3 min-h-[44px] rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-black"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Ready for Pickup</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* === DESKTOP TABLE VIEW === */}
              <div className="hidden md:block overflow-x-auto scrollbar-hide">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Car</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {bookings.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                          No bookings found.
                        </td>
                      </tr>
                    ) : (
                      bookings.map((booking) => (
                        <tr key={booking.id} className="">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{booking.id.slice(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="font-medium text-gray-900">
                              {booking.profiles?.name || booking.user?.name || 'Unknown'}
                            </div>
                            <div>{booking.profiles?.email || booking.user?.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.shipping_address ? (
                              typeof booking.shipping_address === 'object' ? (
                                <div>
                                  <div className="font-medium text-gray-900">{booking.shipping_address.street || booking.shipping_address.address}</div>
                                  <div className="text-xs">{booking.shipping_address.city}, {booking.shipping_address.zipCode}</div>
                                </div>
                              ) : (
                                <span>{booking.shipping_address}</span>
                              )
                            ) : (
                              <span className="text-gray-400">Not provided</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.order_items && booking.order_items.length > 0 ? (
                              <div>
                                {booking.order_items.map((item, idx) => (
                                  <div key={idx} className="mb-1">
                                    {item.cars.brand} {item.cars.model} ({item.quantity}x)
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-400">No items</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ${(booking.total_amount || 0).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full uppercase ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <select
                              value={booking.status}
                              onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                              className="bg-white border border-gray-300 text-gray-700 py-2 px-3 min-h-[48px] md:min-h-0 md:py-1 md:px-2 rounded-sm text-sm md:text-xs focus:outline-none focus:ring-1 focus:ring-black"
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="shipped">Ready for Pickup</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative text-center border-t-4 border-black">
            <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${alertModal.isError ? 'border-red-500 text-red-500' : 'border-green-500 text-green-500'}`}>
              {alertModal.isError ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
              )}
            </div>
            <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 mb-2">
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
    </AdminLayout>
  );
};
export default Bookings;


