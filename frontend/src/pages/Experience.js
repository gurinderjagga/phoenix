import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Experience = () => {
    return (
        <div className="bg-secondary min-h-screen pb-32 font-sans text-primary">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full flex items-center justify-start overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/exp.jpg"
                        alt="Phoenix Engine and Engineering"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 text-left px-6 md:px-16 lg:px-24 mt-16 max-w-[1440px] w-full">
                    <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Immersive</span>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-6 text-white drop-shadow-2xl">
                        The Phoenix Experience
                    </h1>
                    <p className="text-gray-200 text-xl md:text-2xl font-light max-w-2xl leading-relaxed drop-shadow-md">
                        A century of motorsport heritage fused with limitless electric potential.
                        This is more than transportation. This is the art of driving.
                    </p>
                </div>
            </section>

            {/* Engine Specs & Experience */}
            <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-5 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-4xl font-bold mb-8 text-primary tracking-tight uppercase">Engine Specs & Experience</h2>
                        <ul className="mb-8 space-y-4">
                            <li className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-lg">
                                <span className="text-accent mr-4 text-xl">✦</span>
                                <div>
                                    <strong className="block text-primary text-lg">Powertrain Configuration</strong>
                                    <span className="text-base font-light">4.0-Liter Twin-Turbo V8 Engine</span>
                                </div>
                            </li>
                            <li className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-lg">
                                <span className="text-accent mr-4 text-xl">✦</span>
                                <div>
                                    <strong className="block text-primary text-lg">Performance Output</strong>
                                    <span className="text-base font-light">680 Horsepower & 850 Nm Peak Torque</span>
                                </div>
                            </li>
                        </ul>
                        <p className="text-gray-700 font-light text-base md:text-lg leading-relaxed mt-6">
                            Fire up the ignition and feel the raw, unadulterated energy pulse through the chassis.
                            The immediate throttle response paired with a spine-tingling exhaust note creates a visceral
                            connection between driver and machine. It is a symphony of mechanical precision designed
                            to completely immerse you in the ultimate driving experience.
                        </p>
                    </div>
                    <div className="order-1 md:order-2 aspect-[4/3] bg-gray-200 rounded-[24px] overflow-hidden group">
                        <img
                            src="/engine.webp"
                            alt="Engine Specifications"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 md:scale-105 md:group-hover:scale-100"
                        />
                    </div>
                </div>
            </section>

            {/* Craftsmanship & Materials */}
            <section className="py-16 md:py-24 bg-surface w-full">
                <div className="max-w-[1440px] mx-auto px-5 md:px-12">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary tracking-tight">Uncompromising Craftsmanship</h2>
                        <p className="text-gray-600 font-light max-w-2xl mx-auto text-base md:text-lg px-2">
                            The interior of a Phoenix is a sanctuary of focus. We source only the most sustainable, high-grade materials
                            to create an environment that caters entirely to the driver.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-10 rounded-[24px] shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-2xl font-bold mb-4">Olea Club Leather</h3>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Tanned using an environmentally friendly process featuring olive leaf extracts, our premium leather
                                offers unmatched softness, durability, and a unique, natural aroma that defines the Phoenix cabin.
                            </p>
                        </div>
                        <div className="bg-white p-10 rounded-[24px] shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-2xl font-bold mb-4">Race-Tex Microfiber</h3>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Derived directly from our motorsport divisions, this high-quality microfiber material provides exceptional
                                grip for steering wheels and seat centers, while being produced with 80% less CO2 than standard materials.
                            </p>
                        </div>
                        <div className="bg-white p-10 rounded-[24px] shadow-sm hover:shadow-xl transition-shadow duration-300">
                            <h3 className="text-2xl font-bold mb-4">Carbon Fiber Composites</h3>
                            <p className="text-gray-600 font-light leading-relaxed">
                                We utilize hand-laid, exposed carbon fiber trims. Not only does this drastically reduce the vehicle's
                                overall weight, but it also visually communicates the raw, unyielding structural rigidity of the chassis.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Track-Tuned Dynamics */}
            <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-5 md:px-12 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-1 md:order-1 aspect-[4/3] bg-gray-200 rounded-[24px] overflow-hidden">
                        <img
                            src="/dynamics.jpg"
                            alt="Phoenix Track Dynamics"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="order-2 md:order-2">
                        <h2 className="text-3xl font-bold text-primary mb-6">Track-Tuned Dynamics</h2>
                        <p className="text-gray-600 font-light mb-8 leading-relaxed text-lg">
                            Our vehicles aren't just built to look good—they're engineered to perform.
                            From adaptive three-chamber air suspension systems to precision-calibrated active aerodynamics,
                            every Phoenix model guarantees a connection between driver and machine that feels genuinely telepathic.
                            Experience cornering agility that defies physics, supported by our proprietary Torque Vectoring system
                            that actively distributes power to individual wheels in milliseconds.
                        </p>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-lg">
                                <span className="text-accent mr-4 text-xl">✦</span>
                                <div>
                                    <strong className="block text-primary">0-60 in breathtaking silence</strong>
                                    <span className="text-sm font-light">Instantaneous maximum torque from standstill.</span>
                                </div>
                            </li>
                            <li className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-lg">
                                <span className="text-accent mr-4 text-xl">✦</span>
                                <div>
                                    <strong className="block text-primary">Perfect 50/50 balance</strong>
                                    <span className="text-sm font-light">Optimized battery placement for a drastically low center of gravity.</span>
                                </div>
                            </li>
                            <li className="flex items-center text-gray-700 bg-gray-50 p-4 rounded-lg">
                                <span className="text-accent mr-4 text-xl">✦</span>
                                <div>
                                    <strong className="block text-primary">Active Aerodynamics</strong>
                                    <span className="text-sm font-light">Deployable spoilers and cooling flaps that adapt to your speed.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Experience;
