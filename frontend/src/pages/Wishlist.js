import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import CarCard from '../components/CarCard';
import Button from '../components/Button';
import AddressModal from '../components/AddressModal';

const Wishlist = () => {
    const { user } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [creatingProfile, setCreatingProfile] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [currentUserProfile, setCurrentUserProfile] = useState(null);
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, address: null });
    const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', isError: false, navigateTo: null });

    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setLoading(false);
        }
    }, [user]);

    const fetchWishlist = async () => {
        try {
            const wishlist = await apiService.getCart();
            setWishlistItems(wishlist);
        } catch (error) {
            console.error('Wishlist loading failed:', error.message);
            // Auto-create profile fallback logic omitted for brevity, assuming standard flow used elsewhere
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (wishlistItemId) => {
        try {
            await apiService.removeFromCart(wishlistItemId);
            setWishlistItems(items => items.filter(item => item.id !== wishlistItemId));
            window.dispatchEvent(new Event('wishlistChanged'));
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const checkoutCarId = queryParams.get('checkout');

    // Calculate totals
    const checkoutItems = checkoutCarId
        ? wishlistItems.filter(item => item.car.id === checkoutCarId)
        : wishlistItems;

    const taxRate = 0.10; // 10% Tax
    const subtotal = checkoutItems.reduce((total, item) => total + (item.car.price * item.quantity), 0);
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    const handleCheckout = async () => {
        if (!user) return;

        // Check for address first
        try {
            const profile = await apiService.getProfile();
            setCurrentUserProfile(profile);

            // Validate address
            if (!profile.address || !profile.address.street || !profile.address.city || !profile.address.zipCode) {
                setShowAddressModal(true);
                return;
            }

            proceedToCheckout(profile.address);
        } catch (error) {
            console.error('Profile check failed:', error);
            // Fallback to modal if profile fetch fails (safe default)
            setShowAddressModal(true);
        }
    };

    const proceedToCheckout = (shippingAddress) => {
        setConfirmModal({ isOpen: true, address: shippingAddress });
    };

    const executeCheckout = async () => {
        const shippingAddress = confirmModal.address;
        setConfirmModal({ isOpen: false, address: null });

        try {
            // Create order from cart items
            const orderItems = checkoutItems.map(item => ({
                car: item.car.id, // backend expects 'car' (id) in items array based on usage in orderService
                quantity: item.quantity
            }));

            await apiService.createOrder({
                items: orderItems,
                shippingAddress: shippingAddress,
                paymentMethod: 'bank_transfer',
                orderNotes: 'Checkout from Cart'
            });

            // Remove only the checked out items from cart
            for (const item of checkoutItems) {
                await apiService.removeFromCart(item.id);
            }
            window.dispatchEvent(new Event('wishlistChanged'));

            setAlertModal({ isOpen: true, message: 'Order placed successfully!', isError: false, navigateTo: '/orders' });
        } catch (error) {
            console.error('Checkout failed:', error);
            setAlertModal({ isOpen: true, message: 'Checkout failed: ' + (error.message || 'Unknown error'), isError: true, navigateTo: null });
        }
    };

    const handleCloseAlert = () => {
        const navTarget = alertModal.navigateTo;
        setAlertModal({ isOpen: false, message: '', isError: false, navigateTo: null });
        if (navTarget) {
            window.location.href = navTarget;
        }
    };

    const handleAddressSaved = (newAddress) => {
        setShowAddressModal(false);
        proceedToCheckout(newAddress);
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter text-primary mb-4">Access Restricted</h2>
                    <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">
                        Please authenticate to view your configuration.
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

    if (loading) {
        return (
            <div className="min-h-screen bg-secondary flex justify-center items-center">
                <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
            </div>
        );
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tighter text-primary uppercase mb-6">
                        Your Collection is Empty
                    </h2>
                    <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">
                        Start your journey by exploring models.
                    </p>
                    <Link to="/cars">
                        <Button variant="primary">Explore Models</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (checkoutCarId && checkoutItems.length === 0) {
        return (
            <div className="min-h-screen bg-secondary flex items-center justify-center px-6">
                <div className="text-center">
                    <h2 className="text-4xl font-bold tracking-tighter text-primary uppercase mb-6">
                        Vehicle Not Found In Cart
                    </h2>
                    <p className="text-gray-500 mb-8 uppercase tracking-widest text-xs">
                        The vehicle you are trying to reserve is no longer in your cart.
                    </p>
                    <Link to="/wishlist">
                        <Button variant="primary">View Collection</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary pt-24 pb-12">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="mb-16 border-b border-gray-200 pb-8">
                    <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">Saved Configurations</span>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-primary uppercase">
                        Your Collection
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Items Grid */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {checkoutItems.map((item) => (
                            <div key={item.id} className="relative">
                                <CarCard
                                    car={item.car}
                                    onToggleWishlist={() => handleRemoveItem(item.id)}
                                    isInWishlist={true} // Logic implies these are "saved", so heart is full
                                />
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-surface border border-gray-200 p-8 sticky top-32">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-primary mb-8 pb-4 border-b border-gray-200">
                                Summary
                            </h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs uppercase tracking-wider text-gray-500">
                                    <span>Vehicles</span>
                                    <span>{checkoutItems.length}</span>
                                </div>
                                <div className="flex justify-between text-xs uppercase tracking-wider text-gray-500">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs uppercase tracking-wider text-gray-500">
                                    <span>Tax (10%)</span>
                                    <span>${tax.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-primary border-t border-gray-100 pt-4 mt-4">
                                    <span>Total</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button variant="primary" className="w-full" onClick={handleCheckout}>
                                    Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AddressModal
                isOpen={showAddressModal}
                onClose={() => setShowAddressModal(false)}
                onSuccess={handleAddressSaved}
                initialAddress={currentUserProfile?.address}
            />

            {/* Custom Confirm Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative text-center border-t-4 border-black">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-2">Confirm Checkout</h2>
                        <p className="text-sm text-gray-500 mb-8 tracking-wide">
                            Proceed to checkout with total amount of <br />
                            <span className="font-bold text-black text-lg mt-2 block">${total.toLocaleString()}?</span>
                        </p>
                        <div className="flex space-x-4">
                            <button
                                className="flex-1 border border-black text-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-gray-50 transition-colors"
                                onClick={() => setConfirmModal({ isOpen: false, address: null })}
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 bg-black text-white px-6 py-3 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
                                onClick={executeCheckout}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Custom Alert Modal */}
            {alertModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative text-center border-t-4 border-black">
                        <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${alertModal.isError ? 'border-red-500 text-red-500' : 'border-black text-black'}`}>
                            {alertModal.isError ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                            )}
                        </div>
                        <h2 className="text-lg font-bold uppercase tracking-widest text-primary mb-2">
                            {alertModal.isError ? 'Checkout Failed' : 'Order Placed'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            {alertModal.message}
                        </p>
                        <button
                            className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
                            onClick={handleCloseAlert}
                        >
                            {alertModal.isError ? 'Close' : 'View Orders'}
                        </button>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Wishlist;