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

    const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);

    // EMI Calculator State
    const [isEmiModalOpen, setIsEmiModalOpen] = useState(false);
    const [downPayment, setDownPayment] = useState('');
    const [loanTerm, setLoanTerm] = useState(60); // default 60 months
    const [interestRate, setInterestRate] = useState(9); // default 9%

    const [processingOrder, setProcessingOrder] = useState(false);
    const [isDummyPaymentOpen, setIsDummyPaymentOpen] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('idle'); // idle -> processing -> success
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

    const handlePayNowStep = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        setIsDummyPaymentOpen(true);
        setPaymentStatus('processing');

        // Simulate payment processing delay (2.5s)
        setTimeout(() => {
            setPaymentStatus('success');
            // Wait 1 second to show success tick, then process order backend
            setTimeout(() => {
                setIsDummyPaymentOpen(false);
                setIsReservationModalOpen(false);
                setPaymentStatus('idle');
                finalizeOrder();
            }, 1000);
        }, 2500);
    };

    const finalizeOrder = async () => {
        setProcessingOrder(true);
        try {
            // Default to bank_transfer without shipping since it's an immediate booking
            await apiService.bookCar(car.id, 1, { address: 'In-Store Pickup', city: 'N/A', country: 'N/A' }, 'bank_transfer', 'Immediate Booking via Car Details');

            // Note: In a real app we might prompt the user for address or shipping details, but this ensures a seamless transition for now based on the previous simple setup 
            setAlertModal({ isOpen: true, message: 'Reservation created successfully!', isError: false, goOrders: true });
            setIsReservationModalOpen(false);
        } catch (error) {
            console.error('Error proceeding with order:', error);
            if (error.response) console.error('Response data:', error.response);
            setAlertModal({ isOpen: true, message: `Failed to create reservation: ${error.message || 'Unknown error'}`, isError: true });
        } finally {
            setProcessingOrder(false);
        }
    };

    const handleCloseAlert = () => {
        if (alertModal.goOrders && !alertModal.isError) {
            navigate('/reserved');
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
        <div className="bg-white min-h-screen pt-28 md:pt-32 pb-20 lg:pb-12">
            <div className="flex flex-col lg:flex-row min-h-[calc(100vh-6rem)]">

                {/* Visuals - 75% width on desktop */}
                <div className="lg:w-3/4 relative bg-white flex flex-col px-4 sm:px-6 lg:px-12 pb-4 lg:pb-12 pt-2 lg:pt-4">
                    {/* Main Image Box */}
                    <div className="relative w-full rounded-xl lg:rounded-2xl overflow-hidden mb-4 lg:mb-6 h-[35vh] sm:h-[45vh] lg:h-auto min-h-[220px]">
                        <img
                            src={car.images[selectedImage]}
                            alt={car.model}
                            className="w-full h-full lg:h-auto object-cover"
                        />
                    </div>
                    {/* Thumbnails */}
                    {car.images.length > 1 && (
                        <div className="flex overflow-x-auto space-x-2 sm:space-x-4 pb-2">
                            {car.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-16 h-11 sm:w-20 sm:h-14 md:w-24 md:h-16 flex-shrink-0 rounded-lg overflow-hidden ${selectedImage === idx ? 'ring-2 ring-black ring-offset-2 ring-offset-white' : 'opacity-50'}`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* ── MOBILE ONLY: Car info + specs inline ── */}
                    <div className="lg:hidden mt-5 pb-2">
                        <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-0.5 block">{car.year} Model</span>
                        <h1 className="text-2xl font-bold uppercase tracking-tighter text-primary leading-none mb-1">
                            {car.brand} {car.model}
                        </h1>
                        <div className="text-xl text-gray-900 font-semibold mb-4">₹{car.price?.toLocaleString('en-IN')}</div>

                        {/* Specs — 3 col compact grid */}
                        <div className="grid grid-cols-3 gap-3 border-t border-b border-gray-100 py-4 mb-4">
                            {[
                                { label: 'Engine', value: car.specifications?.engine },
                                { label: '0–60', value: car.specifications?.acceleration || '3.2s' },
                                { label: 'Power', value: car.specifications?.horsepower },
                                { label: 'Top Speed', value: car.specifications?.topSpeed },
                                { label: 'Fuel', value: car.specifications?.fuelType || car.type },
                                { label: 'Color', value: car.specifications?.color || car.color },
                            ].map(({ label, value }) => (
                                <div key={label} className="bg-gray-50 rounded-lg p-2.5 text-center">
                                    <span className="block text-[9px] text-gray-400 uppercase tracking-widest mb-0.5">{label}</span>
                                    <span className="block text-xs font-bold text-primary uppercase truncate">{value || 'N/A'}</span>
                                </div>
                            ))}
                        </div>

                        {car.description && (
                            <p className="text-gray-500 text-xs leading-relaxed">{car.description}</p>
                        )}
                    </div>
                </div>

                {/* Specs & config - 25% width — DESKTOP ONLY */}
                <div className="hidden lg:flex lg:w-1/4 p-6 lg:p-8 bg-white border-t lg:border-t-0 lg:border-l border-gray-100 flex-col justify-between">
                    <div>
                        <div className="mb-8">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1 block">{car.year} Model</span>
                            <h1 className="text-3xl font-bold uppercase tracking-tighter text-primary leading-none mb-2">
                                {car.brand}<br />{car.model}
                            </h1>
                            <div className="text-xl text-gray-900 font-medium">
                                ₹{car.price?.toLocaleString('en-IN')}
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
                            disabled={car.stock <= 0}
                            className="w-full bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {car.stock > 0 ? 'Reserve Vehicle' : 'Out of Stock'}
                        </button>
                        <button
                            onClick={() => setIsEmiModalOpen(true)}
                            disabled={loading || processingOrder}
                            className={`w-full border border-black px-8 py-4 text-xs font-bold uppercase tracking-[0.15em] bg-transparent text-black`}
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
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
                    <div className="bg-white w-full sm:max-w-sm p-6 sm:p-8 shadow-2xl relative border-t-4 border-black rounded-t-2xl sm:rounded-none">
                        <h2 className="text-xl font-bold uppercase tracking-widest text-primary mb-6 text-center">
                            Reservation Details
                        </h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 uppercase tracking-widest font-bold text-[10px]">Total Price</span>
                                <span className="font-bold">₹{car.price?.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-gray-100 pb-4">
                                <span className="text-gray-500 uppercase tracking-widest font-bold text-[10px]">Booking Amount (5%)</span>
                                <span className="font-bold">₹{(car.price * 0.05).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-base">
                                <span className="text-black uppercase tracking-widest font-bold text-[11px]">Total Amount</span>
                                <span className="font-bold text-primary">₹{(car.price * 0.05).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handlePayNowStep}
                                disabled={processingOrder || isDummyPaymentOpen}
                                className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                {processingOrder ? 'Finalizing...' : 'Pay Now Securely'}
                            </button>
                            <button
                                onClick={() => setIsReservationModalOpen(false)}
                                disabled={processingOrder}
                                className="w-full bg-transparent text-black border border-black px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em]"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Dummy Payment Modal */}
            {isDummyPaymentOpen && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80">
                    <div className="bg-white w-full max-w-sm p-10 shadow-2xl relative text-center border-t-4 border-black animate-fade-in-up">
                        {paymentStatus === 'processing' ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 border-4 border-gray-100 border-t-black animate-spin rounded-full mb-6"></div>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-primary mb-2">
                                    Processing Payment
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">Securing your configuration...</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-6">Please do not close window</p>
                            </div>
                        ) : paymentStatus === 'success' ? (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-6 animate-pulse">
                                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-lg font-bold uppercase tracking-widest text-primary mb-2">
                                    Payment Successful
                                </h2>
                                <p className="text-sm text-gray-500 font-medium">Redirecting to manifest...</p>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}

            {/* EMI Calculator Modal */}
            {isEmiModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60">
                    <div className="bg-white w-full sm:max-w-sm p-6 sm:p-8 shadow-2xl relative border-t-4 border-black rounded-t-2xl sm:rounded-none">
                        <button
                            onClick={() => setIsEmiModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400"
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
                                <div className="text-lg font-bold">₹{car.price?.toLocaleString('en-IN')}</div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">Down Payment (₹)</label>
                                <input
                                    type="number"
                                    value={downPayment}
                                    onChange={(e) => setDownPayment(e.target.value)}
                                    placeholder="e.g. 5000000"
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
                            <div className="text-3xl font-bold text-primary">₹{calculateEMI().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                            <div className="text-[9px] text-gray-400 mt-2 uppercase tracking-widest">*Excludes taxes & registration fees</div>
                        </div>

                        <button
                            onClick={() => setIsEmiModalOpen(false)}
                            className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em]"
                        >
                            Close Calculator
                        </button>
                    </div>
                </div>
            )}

            {/* Custom Alert Modal */}
            {alertModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60">
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
                            className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em]"
                            onClick={handleCloseAlert}
                        >
                            {alertModal.isError ? 'Try Again' : 'View Reserved Vehicles'}
                        </button>
                    </div>
                </div>
            )}
            {/* ── MOBILE ONLY: CTA bar above footer ── */}
            <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-3 flex gap-3 sticky bottom-0 z-30">
                <button
                    onClick={() => setIsEmiModalOpen(true)}
                    className="flex-1 border border-black px-4 min-h-[48px] text-xs font-bold uppercase tracking-[0.12em] bg-transparent text-black"
                >
                    EMI Calculator
                </button>
                <button
                    onClick={() => {
                        if (!user) { navigate('/login'); return; }
                        setIsReservationModalOpen(true);
                    }}
                    disabled={car.stock <= 0}
                    className="flex-[2] bg-black text-white min-h-[48px] text-xs font-bold uppercase tracking-[0.12em] disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    {car.stock > 0 ? 'Reserve Vehicle' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default CarDetails;