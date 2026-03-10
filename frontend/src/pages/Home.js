import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../utils/api';
import CarCard from '../components/CarCard';
import Button from '../components/Button';

const Home = () => {
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
            <section className="relative w-screen h-screen flex items-end justify-start pb-40 md:pb-32 bg-primary text-secondary overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="none"
                        className="w-full h-full object-cover"
                    >
                        <source src="/0125.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    {/* Overlay for better text visibility */}
                    <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className="relative z-10 text-left px-6 md:px-12 max-w-[1440px] w-full">
                    <h1 className="text-4xl sm:text-6xl md:text-[10vw] leading-none font-roboto-slab font-light tracking-tighter mb-3 md:mb-4 text-white mix-blend-difference opacity-0 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        PHOENIX
                    </h1>
                    <p className="text-xs sm:text-base md:text-2xl font-light tracking-[0.2em] md:tracking-[0.3em] uppercase mb-5 md:mb-12 opacity-0 animate-slide-up" style={{ animationDelay: '0.4s' }}>
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
            <section className="pt-16 md:pt-32 pb-8 md:pb-16 bg-white">
                <div className="max-w-[1440px] mx-auto px-8 md:px-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24 border-b border-gray-200 pb-8">
                        <div>
                            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">The Collection</span>
                            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-primary uppercase">
                                Models
                            </h2>
                        </div>
                        <Link to="/cars" className="hidden md:flex items-center text-sm font-bold uppercase tracking-widest mt-8 md:mt-0 hover:text-red-500 transition-colors">
                            All Models <span className="ml-2">→</span>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="w-12 h-12 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                        </div>
                    ) : (
                        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-16 pb-8 -mx-6 px-6 sm:-mx-8 sm:px-8 md:mx-0 md:px-0">
                            {featuredCars.map((car) => (
                                <div key={car.id || car._id} className="w-[75vw] min-w-[75vw] sm:w-[50vw] sm:min-w-[50vw] md:w-auto md:min-w-0 snap-center md:snap-align-none shrink-0 h-full">
                                    <CarCard car={car} />
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="mt-8 md:mt-16 text-center md:hidden">
                        <Link to="/cars">
                            <Button variant="primary" className="w-[85%] md:w-full">View All Models</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Discover Section */}
            <section className="pt-4 md:pt-8 pb-12 md:pb-24 bg-white overflow-hidden">
                <div className="max-w-[1440px] mx-auto">
                    <div className="text-left px-6 md:px-12 mb-6 md:mb-8">
                        <span className="text-accent font-bold uppercase tracking-[0.2em] text-xs mb-3 block">The Experience</span>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black uppercase mb-4">
                            Discover
                        </h2>
                        <p className="text-gray-500 font-light max-w-xl text-base md:text-lg leading-relaxed md:px-0">
                            A vehicle is more than its engineering; it's a reflection of ambition. Explore the history,
                            vision, and limitless personalization that defines every machine we build.
                        </p>
                    </div>
                    {/* Mobile: horizontal scroll carousel | Desktop: 3-col grid */}
                    <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-4 px-6 md:px-12 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
                        {/* Card 1 */}
                        <Link to="/experience" className="relative group overflow-hidden rounded-[20px] aspect-[3/4] w-[78vw] min-w-[78vw] sm:w-[55vw] sm:min-w-[55vw] md:w-auto md:min-w-0 md:aspect-[4/3] snap-center shrink-0 block">
                            <img src="/experience.webp" alt="Phoenix Experience" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full p-5 md:p-8 flex justify-between items-end">
                                <h3 className="text-white text-xl md:text-2xl font-medium pr-8">Phoenix Experience.</h3>
                                <span className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </Link>

                        {/* Card 2 */}
                        <Link to="/e-performance" className="relative group overflow-hidden rounded-[20px] aspect-[3/4] w-[78vw] min-w-[78vw] sm:w-[55vw] sm:min-w-[55vw] md:w-auto md:min-w-0 md:aspect-[4/3] snap-center shrink-0 block">
                            <img src="/mobility.webp" alt="E-Performance" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full p-5 md:p-8 flex justify-between items-end">
                                <div className="text-white text-xl md:text-2xl pr-8">
                                    <span className="block font-medium">E-Performance —</span>
                                    <span className="block font-medium">Sustainable mobility</span>
                                </div>
                                <span className="text-white opacity-80 group-hover:opacity-100 transition-opacity pb-1">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </Link>

                        {/* Card 3 */}
                        <Link to="/finder" className="relative group overflow-hidden rounded-[20px] aspect-[3/4] w-[78vw] min-w-[78vw] sm:w-[55vw] sm:min-w-[55vw] md:w-auto md:min-w-0 md:aspect-[4/3] snap-center shrink-0 block">
                            <img src="/finder.webp" alt="Phoenix Finder" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 w-full p-5 md:p-8 flex justify-between items-end">
                                <h3 className="text-white text-xl md:text-2xl font-medium pr-8">Phoenix Finder.</h3>
                                <span className="text-white opacity-80 group-hover:opacity-100 transition-opacity">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA - "Join the Legacy" */}
            <section className="py-20 md:py-40 bg-primary text-secondary text-center relative overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl sm:text-5xl md:text-8xl font-bold tracking-tighter mb-6 md:mb-8 text-white">
                        YOUR LEGACY.
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 font-light mb-10 md:mb-12 max-w-2xl mx-auto">
                        The road awaits. Take the wheel of the ultimate driving machine.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                        <Link to="/cars">
                            <Button variant="white" className="w-[85%] sm:w-auto min-w-[240px]">Become an Owner</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;