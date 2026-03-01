import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import Button from '../components/Button';

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-primary animate-fade-in-up">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-bold uppercase tracking-widest text-primary">Order Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-primary text-2xl font-light transition-colors"
            >
              ×
            </button>
          </div>

          <div className="space-y-8">
            {/* Order Header */}
            <div className="bg-gray-50 p-6 border border-gray-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-primary">Order #{order.id}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <div className="mt-2 text-right">
                    <p className="text-sm font-bold text-gray-500 line-through">Total: ${order.total_amount.toLocaleString()}</p>
                    <p className="text-lg font-bold text-primary mt-1">Paid (5%): ${(order.total_amount * 0.05).toLocaleString()}</p>
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
                          className="w-12 h-12 object-cover grayscale"
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
              {order.shipping_address && (
                <div className="bg-gray-50 p-6 border border-gray-100">
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Shipping To</h4>
                  <div className="text-sm font-medium text-primary">
                    {typeof order.shipping_address === 'object' ? (
                      <div>
                        <p>{order.shipping_address.street || order.shipping_address.address || 'Address not provided'}</p>
                        <p>{order.shipping_address.city || ''}, {order.shipping_address.state || ''} {order.shipping_address.zipCode || ''}</p>
                        <p>{order.shipping_address.country || ''}</p>
                      </div>
                    ) : (
                      <p>{order.shipping_address}</p>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-gray-50 p-6 border border-gray-100">
                <h4 className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Payment Details</h4>
                <div className="text-sm font-medium text-primary">
                  <p><span className="text-gray-500 font-normal">Method:</span> {order.payment_method || 'Standard'}</p>
                  <p><span className="text-gray-500 font-normal">Status:</span> {order.payment_status || 'Pending'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button onClick={onClose} variant="primary">
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
    <div className="min-h-screen bg-secondary pt-24 pb-12">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-16 border-b border-gray-200 pb-8 flex justify-between items-end">
          <div>
            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">Owner Area</span>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary uppercase">
              Your Reserved Vehicle
            </h1>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Nav */}
          <div className="w-full lg:w-64 flex-shrink-0 space-y-1">
            <Link to="/profile" className="block p-4 border border-gray-100 hover:border-black hover:bg-gray-50 text-xs font-bold uppercase tracking-widest transition-all">
              Account Settings
            </Link>
            <div className="p-4 bg-black text-white text-xs font-bold uppercase tracking-widest mb-4">
              Your Reserved Vehicle
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {orders.length === 0 ? (
              <div className="border border-gray-200 p-12 text-center bg-white">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-2">No Vehicles Reserved</h3>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-8">You haven't reserved a vehicle yet.</p>
                <Link to="/cars">
                  <Button variant="primary">Browse Models</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 p-6 hover:border-black transition-colors group">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-100 pb-4">
                      <div>
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-bold uppercase tracking-widest text-primary">#{order.id.slice(0, 8)}...</h3>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                            • {order.status}
                          </span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right mt-4 md:mt-0">
                        <p className="text-xl font-bold text-primary">${order.total_amount.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="flex-grow grid grid-cols-4 gap-2">
                        {order.order_items?.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="relative aspect-square bg-gray-100">
                            <img
                              src={item.cars?.images?.[0] || '/placeholder-car.jpg'}
                              alt={item.cars?.name}
                              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                              onError={(e) => { e.target.src = '/placeholder-car.jpg'; }}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex-shrink-0">
                        <Button
                          variant="secondary"
                          onClick={() => handleViewOrderDetails(order)}
                          className="min-w-[140px]"
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