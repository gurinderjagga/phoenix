import React from 'react';
import { Link } from 'react-router-dom';

const CarCard = ({ car, onToggleWishlist, isInWishlist = false }) => {
    // Guard clause for missing car data
    if (!car || (!car.id && !car._id)) {
        return null; // Silent fail for cleaner UI
    }

    const carId = car.id || car._id;



    return (
        <div className="group border border-transparent hover:border-black hover:shadow-xl transition-all duration-500 relative bg-transparent overflow-hidden">
            {/* Image Container - Monochrome to Color on Hover */}
            <div className="relative overflow-hidden aspect-[16/10] bg-neutral-100">
                <Link to={`/cars/${carId}`}>
                    <img
                        src={car.images?.[0] || '/placeholder-car.jpg'}
                        alt={`${car.brand || 'Car'} ${car.model || ''}`}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-out"
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
            <div className="pt-6 pb-2 px-1">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-primary uppercase tracking-widest leading-none mb-2">
                            <Link to={`/cars/${carId}`}>
                                {car.brand} <br /> <span className="font-light text-gray-500"> {car.model}</span>
                            </Link>
                        </h3>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                            {car.year} | {car.specifications?.fuelType || 'Gasoline'}
                        </p>
                    </div>
                </div>

                {/* Technical Specs Grid - Hidden until hover? No, always visible but subtle */}
                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 mb-4">
                    <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Power</span>
                        <span className="block text-xs font-bold text-primary uppercase">{car.specifications?.horsepower || 'N/A'}</span>
                    </div>
                    <div>
                        <span className="block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Price</span>
                        <span className="block text-xs font-bold text-primary whitespace-nowrap">
                            ${car.price?.toLocaleString()}
                        </span>
                    </div>
                </div>

                {/* Action Link -- Text Only */}
                <Link
                    to={`/cars/${carId}`}
                    className="inline-flex items-center text-[10px] font-bold uppercase tracking-widest text-gray-400"
                >
                    View Specs <span className="ml-2">→</span>
                </Link>
            </div>
        </div>
    );
};

export default CarCard;