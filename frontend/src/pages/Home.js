import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../utils/api';
import CarCard from '../components/CarCard';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const Home = () => {
    const { user } = useAuth();
    const [featuredCars, setFeaturedCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBufferedCars = async () => {
            try {
                const result = await apiService.getCars();
                // Handle potential different response structures (array vs object)
                const carsData = Array.isArray(result) ? result : (result.cars || []);
                setFeaturedCars(carsData.slice(0, 3));
            } catch (err) {
                console.error("Failed to load cars", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBufferedCars();
    }, []);

    // Wishlist functionality removed.

    return (
        <div className="bg-secondary overflow-x-hidden">
            {/* Hero Section - The "Phoenix" Moment */}
            <section className="relative w-screen h-screen flex items-end justify-start pb-32 bg-primary text-secondary overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/0125.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 text-left px-6 md:px-12 max-w-[1440px] w-full">
                    <h1 className="text-7xl sm:text-8xl md:text-[10vw] leading-none font-roboto-slab font-light tracking-tighter mb-4 text-white mix-blend-difference opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        PHOENIX
                    </h1>
                    <p className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase mb-12 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                        Performance Reborn
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-start opacity-0 animate-slide-up" style={{ animationDelay: '0.6s' }}>

                        <Link to="/cars">
                            <Button className="min-w-[200px] bg-gray-200 text-black border-none">Discover</Button>
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
                    <span className="text-[10px] uppercase tracking-widest text-gray-500 block mb-2 text-center">Scroll</span>
                    <div className="w-[1px] h-12 bg-gray-700 mx-auto"></div>
                </div>
            </section>

            {/* Featured Models - "The Collection" */}
            <section className="py-32 bg-white">
                <div className="max-w-[1440px] mx-auto px-8 md:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-24 border-b border-gray-200 pb-8">
                        <div>
                            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">The Collection</span>
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-primary uppercase">
                                Models
                            </h2>
                        </div>
                        <Link to="/cars" className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest mt-8 md:mt-0">
                            All Models <span className="ml-2">→</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {featuredCars.map((car) => (
                                <CarCard
                                    key={car.id || car._id}
                                    car={car}
                                />
                            ))}
                        </div>
                    )}
                    <div className="mt-16 text-center md:hidden">
                        <Link to="/cars">
                            <Button variant="primary" className="w-full">View All Models</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Brand Values - "Innovation" */}
            <section className="py-32 bg-surface">
                <div className="max-w-[1440px] mx-auto px-8 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                        <div>
                            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Innovation</span>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary uppercase mb-8 leading-tight">
                                Engineering <br /> The Future.
                            </h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-8 font-light">
                                Phoenix isn't just a car; it's a statement. We combine heritage-inspired design with cutting-edge electric performance. Every curve is wind-tunnel tested, every line has a purpose.
                            </p>

                        </div>
                        <div className="relative aspect-square bg-gray-200 overflow-hidden group">
                            <img
                                src="/engine.jpg"
                                alt="Engine Engineering"
                                className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA - "Join the Legacy" */}
            <section className="py-40 bg-primary text-secondary text-center relative overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter mb-8 text-white">
                        YOUR LEGACY.
                    </h2>
                    <p className="text-xl text-gray-400 font-light mb-12 max-w-2xl mx-auto">
                        The road awaits. Take the wheel of the ultimate driving machine.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/cars">
                            <Button variant="white" className="min-w-[240px]">Become an Owner</Button>
                        </Link>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;