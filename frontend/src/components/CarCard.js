import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car, onToggleWishlist, isInWishlist = false }) => {
    // Guard clause for missing car data
    if (!car || (!car.id && !car._id)) {
        return null; // Silent fail for cleaner UI
    }

    const carId = car.id || car._id;



    return (
        <div className="group border border-gray-100 flex flex-col hover:border-black hover:shadow-xl transition-all duration-500 relative bg-white overflow-hidden h-full rounded-none">
            {/* Image Container - Monochrome to Color on Hover */}
            <div className="relative overflow-hidden aspect-[16/10] bg-neutral-100">
                <Link to={`/cars/${carId}`}>
                    <img
                        src={car.images?.[0] || '/placeholder-car.jpg'}
                        alt={`${car.brand || 'Car'} ${car.model || ''}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover grayscale-0 md:grayscale group-hover:grayscale-0 md:scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
                        onError={(e) => {
                            e.target.src = '/placeholder-car.jpg';
                        }}
                    />
                </Link>



                {/* Featured Badge - Technical */}
                {car.featured && (
                    <div className="absolute top-0 left-0 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                        Featured
                    </div>
                )}
            </div>

            {/* Info Container - Spec Sheet Style */}
            <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-full">
                        <h3 className="text-lg md:text-xl font-bold text-primary uppercase tracking-widest leading-none mb-2">
                            <Link to={`/cars/${carId}`} className="flex flex-col justify-center min-h-[48px] md:min-h-0 mt-1">
                                <span className="block text-primary truncate">{car.brand}</span>
                                <span className="block font-light text-gray-500 text-sm md:text-base mt-1 truncate">{car.model}</span>
                            </Link>
                        </h3>
                        <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest mt-3 border-l-2 border-red-500 pl-2">
                            {car.year} | {car.specifications?.fuelType || 'Gasoline'}
                        </p>
                    </div>
                </div>

                {/* Technical Specs Grid - Hidden until hover? No, always visible but subtle */}
                <div className="grid grid-cols-[auto_1fr] gap-4 border-t border-gray-100 pt-4 mb-4">
                    <div className="min-w-0 pr-2">
                        <span className="block text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mb-1">Power</span>
                        <span className="block text-xs md:text-sm font-bold text-primary uppercase">{car.specifications?.horsepower || 'N/A'}</span>
                    </div>
                    <div className="min-w-0 text-right">
                        <span className="block text-[10px] md:text-xs text-gray-400 uppercase tracking-wider mb-1">Price</span>
                        <span className="block text-[10px] sm:text-xs md:text-sm font-bold text-primary whitespace-nowrap tracking-tight">
                            ₹{car.price?.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>

                {/* Action Link -- Text Only */}
                <div className="mt-auto">
                    <Link
                        to={`/cars/${carId}`}
                        className="flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors min-h-[48px] md:min-h-0 md:inline-flex md:mt-2"
                    >
                        View Specs <span className="ml-2">→</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CarCard;