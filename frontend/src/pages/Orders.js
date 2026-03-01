import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import Button from '../components/Button';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

// Order Details Modal Component - Refactored for Phoenix Aesthetic
const OrderDetailsModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-primary text-white';
      case 'processing': return 'bg-gray-200 text-primary';
      case 'shipped': return 'bg-gray-800 text-white';
      case 'confirmed': return 'bg-gray-200 text-primary';
      case 'cancelled': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-2xl sm:max-h-[90vh] max-h-[92vh] overflow-y-auto border border-primary rounded-t-2xl sm:rounded-none animate-fade-in-up">
        <div className="p-5 sm:p-8">
          <div className="flex justify-between items-center mb-6 sm:mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-base sm:text-xl font-bold uppercase tracking-widest text-primary">Booking Details</h2>
            <button
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 text-2xl font-light"
            >
              ×
            </button>
          </div>

          <div className="space-y-8">
            {/* Order Header */}
            <div className="bg-gray-50 p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Booking #{order.id}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="mt-2 text-right">
                    <p className="text-xl font-bold text-primary">Total: ${order.total_amount.toLocaleString()}</p>
                    <p className="text-sm text-gray-700 mt-1">Paid (5%): ${(order.total_amount * 0.05).toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Pending Balance: ${(order.total_amount * 0.95).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-4">Items</h4>
                <div className="space-y-4">
                  {order.order_items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-white p-4 border border-gray-100">
                      <div className="flex items-center">
                        <img
                          src={item.cars?.images?.[0] || '/placeholder-car.jpg'}
                          alt={item.cars?.name}
                          className="w-12 h-12 object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-car.jpg';
                          }}
                        />
                        <div className="ml-4">
                          <h5 className="text-xs font-bold uppercase text-primary">{item.cars?.brand} {item.cars?.model}</h5>
                          <p className="text-[10px] uppercase tracking-widest text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">${(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Address & Payment Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 border border-gray-100">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Booking Status</h4>
                {order.status ? (
                  <div className="font-bold text-gray-900 uppercase tracking-widest">{order.status}</div>
                ) : (
                  <span className="text-gray-400 italic">Processing</span>
                )}
              </div>
              <div className="bg-gray-50 p-6 border border-gray-100">
                <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Payment Details</h4>
                <div className="text-sm font-medium text-primary">
                  <p><span className="text-gray-500 font-normal">Method:</span> {order.payment_method || 'Standard'}</p>
                  <p><span className="text-gray-500 font-normal">Status:</span> Successful</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 sm:mt-8">
            <Button onClick={onClose} variant="primary" className="w-full sm:w-auto">
              Close Detail
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Lock body scroll when the order modal is open
  useBodyScrollLock(showOrderModal);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiService.getMyOrders();
      setOrders(result.orders);
    } catch (error) {
      console.error('Orders loading failed:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600';
      case 'processing': return 'text-amber-600';
      case 'shipped': return 'text-blue-600';
      case 'cancelled': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleCloseModal = () => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tighter text-primary mb-4">Access Restricted</h2>
          <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">
            Please authenticate to view your reserved vehicle.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login">
              <Button variant="primary">Sign In</Button>
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
          <h3 className="uppercase tracking-widest font-bold mb-2">Error Loading Data</h3>
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
            <h1 className="text-2xl md:text-6xl font-bold tracking-tighter text-primary uppercase">
              Your Reserved Vehicle
            </h1>
          </div>
        </div>

        {/* MOBILE: Horizontal quick nav */}
        <div className="flex gap-2 mb-6 lg:hidden">
          <Link to="/profile" className="flex-1 text-center py-2.5 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-600">
            Account Settings
          </Link>
          <span className="flex-1 text-center py-2.5 bg-black text-white text-[10px] font-bold uppercase tracking-widest">Reserved Vehicle</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Nav — desktop only */}
          <div className="hidden lg:block w-full lg:w-64 flex-shrink-0 space-y-1">
            <Link to="/profile" className="block p-4 border border-gray-100 text-xs font-bold uppercase tracking-widest">
              Account Settings
            </Link>
            <div className="p-4 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">
              Your Reserved Vehicle
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {orders.length === 0 ? (
              <div className="border border-gray-200 p-8 sm:p-12 text-center bg-white">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-lg sm:text-xl font-bold uppercase tracking-widest text-primary mb-2">No Vehicles Reserved</h3>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-6 sm:mb-8">You haven't reserved a vehicle yet.</p>
                <Link to="/cars">
                  <Button variant="primary" className="w-full sm:w-auto">Browse Models</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 p-4 sm:p-6 group">
                    {/* Order header row */}
                    <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2 sm:gap-4">
                          <h3 className="text-sm sm:text-lg font-bold uppercase tracking-widest text-primary">#{order.id.slice(0, 8)}...</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                            • {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-base sm:text-xl font-bold text-primary">${order.total_amount.toLocaleString()}</p>
                    </div>

                    {/* Car image + View button */}
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2 flex-grow overflow-hidden">
                        {order.order_items?.slice(0, 2).map((item, idx) => (
                          <div key={idx} className="w-16 h-12 sm:w-20 sm:h-14 flex-shrink-0 bg-gray-100">
                            <img
                              src={item.cars?.images?.[0] || '/placeholder-car.jpg'}
                              alt={item.cars?.name}
                              className="w-full h-full object-cover opacity-80"
                              onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
                            />
                          </div>
                        ))}
                        {order.order_items?.length > 2 && (
                          <div className="w-16 h-12 sm:w-20 sm:h-14 flex-shrink-0 bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                            +{order.order_items.length - 2}
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <Button
                          variant="secondary"
                          onClick={() => handleViewOrderDetails(order)}
                          className="min-w-[120px] sm:min-w-[140px] min-h-[44px]"
                        >
                          View Manifest
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={showOrderModal}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default Orders;