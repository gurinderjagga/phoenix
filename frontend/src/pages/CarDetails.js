import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';

const CarDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [bookingCar, setBookingCar] = useState(false);

    const [isWishlisted, setIsWishlisted] = useState(false); // Acts as "In Cart" check
    const [cartItemId, setCartItemId] = useState(null);
    const [processingCart, setProcessingCart] = useState(false);
    const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', isError: false });

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const carData = await apiService.getCarById(id);
                setCar(carData);

                if (user) {
                    // Check if car is in cart (Wishlist page uses Cart API)
                    const cart = await apiService.getCart();
                    const cartItem = cart.find(item => item.car.id === carData.id);
                    if (cartItem) {
                        setIsWishlisted(true);
                        setCartItemId(cartItem.id);
                    } else {
                        setIsWishlisted(false);
                        setCartItemId(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching car details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCarDetails();
    }, [id, user]);

    const handleBuyNow = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setBookingCar(true);
        try {
            if (!isWishlisted) {
                const response = await apiService.addToCart(car.id);
                setIsWishlisted(true);
                if (response.item) {
                    setCartItemId(response.item.id);
                }
            }
            navigate(`/wishlist?checkout=${car.id}`);
        } catch (error) {
            console.error('Error proceeding to cart:', error);
            setAlertModal({ isOpen: true, message: 'Failed to add to cart.', isError: true });
        } finally {
            setBookingCar(false);
        }
    };

    const handleCloseAlert = () => {
        setAlertModal({ isOpen: false, message: '', isError: false });
    };

    const handleToggleWishlist = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setProcessingCart(true);
        try {
            if (isWishlisted && cartItemId) {
                // Remove from cart
                await apiService.removeFromCart(cartItemId);
                setIsWishlisted(false);
                setCartItemId(null);
            } else {
                // Add to cart
                const response = await apiService.addToCart(car.id);
                setIsWishlisted(true);
                // apiService.addToCart returns { message, item }
                if (response.item) {
                    setCartItemId(response.item.id);
                }
            }
        } catch (error) {
            console.error('Error updating configuration:', error);
            setAlertModal({ isOpen: true, message: 'Failed to update configuration.', isError: true });
        } finally {
            setProcessingCart(false);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-white"><div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full"></div></div>;
    if (!car) return <div className="h-screen flex items-center justify-center bg-white text-primary uppercase tracking-widest font-bold">Vehicle Not Found</div>;

    return (
        <div className="bg-white min-h-screen pt-24 pb-12 lg:pb-24">
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)]">

                {/* Visuals - 75% width */}
                <div className="lg:w-3/4 relative bg-white flex flex-col px-6 lg:px-12 pb-6 lg:pb-12 pt-2 lg:pt-4">
                    {/* Main Image Box */}
                    <div className="relative w-full rounded-2xl overflow-hidden mb-6 h-[40vh] sm:h-[50vh] lg:h-auto min-h-[250px]">
                        <img
                            src={car.images[selectedImage]}
                            alt={car.model}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                    {/* Thumbnails */}
                    {car.images.length > 1 && (
                        <div className="flex overflow-x-auto space-x-4 pb-2">
                            {car.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-20 h-14 md:w-24 md:h-16 flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${selectedImage === idx ? 'ring-2 ring-black ring-offset-2 ring-offset-white' : 'opacity-50 hover:opacity-100'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Specs & configuration - 25% width, minimal */}
                <div className="lg:w-1/4 p-6 lg:p-8 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 flex flex-col justify-between">
                    <div>
                        <div className="mb-8">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 block">{car.year} Model</span>
                            <h1 className="text-3xl font-bold uppercase tracking-tighter text-primary leading-none mb-2">
                                {car.brand}<br />{car.model}
                            </h1>
                            <div className="text-xl text-gray-900 font-medium">
                                ${car.price?.toLocaleString()}
                            </div>
                        </div>

                        {/* Quick Stats Grid - Compact */}
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8 border-t border-b border-gray-100 py-6">
                            <div>
                                <span className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1 block">Engine</span>
                                <span className="block text-sm font-bold text-primary uppercase">{car.specifications?.engine || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1 block">0-60 MPH</span>
                                <span className="block text-sm font-bold text-primary uppercase">{car.specifications?.acceleration || '3.2s'}</span>
                            </div>
                            <div>
                                <span className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1 block">Power</span>
                                <span className="block text-sm font-bold text-primary uppercase">{car.specifications?.horsepower || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1 block">Top Speed</span>
                                <span className="block text-sm font-bold text-primary uppercase">{car.specifications?.topSpeed || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1 block">Fuel Type</span>
                                <span className="block text-sm font-bold text-primary uppercase">{car.specifications?.fuelType || car.type || 'N/A'}</span>
                            </div>
                            <div>
                                <span className="block text-[9px] text-gray-400 uppercase tracking-widest mb-1 block">Color</span>
                                <span className="block text-sm font-bold text-primary uppercase">{car.specifications?.color || car.color || 'N/A'}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-8 hidden sm:block"> {/* Hide description on very small screens to save space if needed, or keep minimal */}
                            <p className="text-gray-500 text-xs leading-relaxed">
                                {car.description}
                            </p>
                        </div>
                    </div>

                    {/* Actions - Stark & Minimal */}
                    <div className="space-y-3 mt-auto pt-4">
                        <button
                            onClick={handleBuyNow}
                            disabled={bookingCar || car.stock <= 0}
                            className="w-full bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {bookingCar ? 'Processing...' : (car.stock > 0 ? 'Reserve Vehicle' : 'Out of Stock')}
                        </button>
                        <button
                            onClick={handleToggleWishlist}
                            disabled={loading || processingCart}
                            className={`w-full border border-black px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-colors disabled:cursor-not-allowed ${isWishlisted ? 'bg-black text-white hover:bg-gray-800' : 'bg-transparent text-black hover:bg-gray-50'}`}
                        >
                            {processingCart ? 'Updating...' : (isWishlisted ? 'Saved' : 'Save Config')}
                        </button>
                        <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest mt-2">
                            {car.stock > 0 ? 'Available Now' : 'Join Waitlist'}
                        </p>
                    </div>
                </div>
            </div>

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
                            {alertModal.isError ? 'Error' : 'Reservation Confirmed'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            {alertModal.message}
                        </p>
                        <button
                            className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
                            onClick={handleCloseAlert}
                        >
                            {alertModal.isError ? 'Try Again' : 'View Orders'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CarDetails;