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
    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

    // EMI Calculator State
    const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
    const [downPayment, setDownPayment] = useState('');
    const [loanTerm, setLoanTerm] = useState(60); // default 60 months
    const [interestRate, setInterestRate] = useState(9); // default 9%

    const [processingOrder, setProcessingOrder] = useState(false);
    const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', isError: false, goOrders: false });

    useEffect(() => {
        const fetchCarDetails = async () => {
            try {
                const carData = await apiService.getCarById(id);
                setCar(carData);
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

        setProcessingOrder(true);
        try {
            // Default to bank_transfer without shipping since it's an immediate booking
            await apiService.bookCar(car.id, 1, 'In-Store Pickup', 'bank_transfer', 'Immediate Booking via Car Details');

            // Note: In a real app we might prompt the user for address or shipping details, but this ensures a seamless transition for now based on the previous simple setup 
            setAlertModal({ isOpen: true, message: 'Reservation created successfully!', isError: false, goOrders: true });
            setIsReservationModalOpen(false);
        } catch (error) {
            console.error('Error proceeding with order:', error);
            setAlertModal({ isOpen: true, message: 'Failed to create reservation.', isError: true });
        } finally {
            setProcessingOrder(false);
        }
    };

    const handleCloseAlert = () => {
        if (alertModal.goOrders && !alertModal.isError) {
            navigate('/orders');
        } else {
            setAlertModal({ isOpen: false, message: '', isError: false, goOrders: false });
        }
    };

    const calculateEMI = () => {
        if (!car) return 0;

        const principal = car.price - (Number(downPayment) || 0);
        if (principal <= 0) return 0;

        const r = (Number(interestRate) / 100) / 12; // Monthly interest rate
        const n = Number(loanTerm); // Number of months

        if (r === 0) return principal / n;

        const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        return emi;
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
                            onClick={() => {
                                if (!user) {
                                    navigate('/login');
                                    return;
                                }
                                setIsReservationModalOpen(true);
                            }}
                            disabled={bookingCar || car.stock <= 0}
                            className="w-full bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {bookingCar ? 'Processing...' : (car.stock > 0 ? 'Reserve Vehicle' : 'Out of Stock')}
                        </button>
                        <button
                            onClick={() => setIsEmiModalOpen(true)}
                            disabled={loading || processingOrder}
                            className={`w-full border border-black px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] transition-colors hover:bg-black hover:text-white bg-transparent text-black`}
                        >
                            EMI Calculator
                        </button>
                        <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest mt-2">
                            {car.stock > 0 ? 'Available Now' : 'Join Waitlist'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Reservation Modal */}
            {isReservationModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative border-t-4 border-black">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-6 text-center">
                            Reservation Details
                        </h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 uppercase tracking-widest font-bold text-[10px]">Total Price</span>
                                <span className="font-bold">${car.price?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-gray-100 pb-4">
                                <span className="text-gray-500 uppercase tracking-widest font-bold text-[10px]">Booking Amount (5%)</span>
                                <span className="font-bold">${(car.price * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="text-black uppercase tracking-widest font-bold text-[11px]">Total Amount</span>
                                <span className="font-bold text-primary">${(car.price * 0.05).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handleBuyNow}
                                disabled={processingOrder}
                                className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                {processingOrder ? 'Processing...' : 'Pay Now'}
                            </button>
                            <button
                                onClick={() => setIsReservationModalOpen(false)}
                                disabled={processingOrder}
                                className="w-full bg-transparent text-black border border-black px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EMI Calculator Modal */}
            {isEmiModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative border-t-4 border-black">
                        <button
                            onClick={() => setIsEmiModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-6 text-center">
                            EMI Calculator
                        </h2>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Total Vehicle Price</label>
                                <div className="text-lg font-bold">${car.price?.toLocaleString()}</div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Down Payment ($)</label>
                                <input
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(e.target.value)}
                                    placeholder="e.g. 5000"
                                    className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Interest Rate (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={interestRate}
                                        onChange={(e) => setInterestRate(e.target.value)}
                                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Loan Term</label>
                                    <select
                                        value={loanTerm}
                                        onChange={(e) => setLoanTerm(e.target.value)}
                                        className="w-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
                                    >
                                        <option value="12">12 Months</option>
                                        <option value="24">24 Months</option>
                                        <option value="36">36 Months</option>
                                        <option value="48">48 Months</option>
                                        <option value="60">60 Months</option>
                                        <option value="72">72 Months</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 border border-gray-100 mb-6 text-center">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Estimated Monthly Payment</div>
                            <div className="text-3xl font-bold text-primary">${calculateEMI().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <div className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest">*Excludes taxes & registration fees</div>
                        </div>

                        <button
                            onClick={() => setIsEmiModalOpen(false)}
                            className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors"
                        >
                            Close Calculator
                        </button>
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