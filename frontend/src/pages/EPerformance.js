import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const EPerformance = () => {
    return (
        <div className="bg-secondary min-h-screen pb-32 font-sans text-primary">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full flex items-center justify-start overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/eper.jpg"
                        alt="E-Performance Sustainable Mobility"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 text-left px-6 md:px-16 lg:px-24 mt-16 max-w-[1440px] w-full">
                    <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Sustainable</span>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-6 drop-shadow-2xl text-white">
                        E-Performance
                    </h1>
                    <p className="text-gray-200 text-xl md:text-2xl font-light max-w-2xl leading-relaxed drop-shadow-md">
                        The future is electric, but it doesn't have to be clinical. Our E-Performance architecture
                        marries uncompromising, zero-emission driving with the visceral thrill of a true sports car.
                    </p>
                </div>
            </section>

            {/* Core Architecture */}
            <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-5 md:px-12 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <h2 className="text-4xl font-bold mb-6 text-primary tracking-tight">800-Volt Architecture</h2>
                        <p className="text-gray-700 font-light mb-6 text-lg leading-relaxed">
                            While the industry standard remains at 400 volts, our engineers pushed the boundaries to develop
                            a high-performance 800-volt system. This fundamental decision changes everything about how our
                            vehicles operate.
                        </p>
                        <p className="text-gray-700 font-light mb-8 text-lg leading-relaxed">
                            By doubling the voltage, we can halve the current while maintaining the same power output.
                            This allows for thinner, lighter copper wiring, vastly reducing the vehicle's weight and
                            significantly improving thermal management during sustained periods of high-speed driving or track use.
                        </p>
                        <ul className="space-y-4 mb-8 border-l-2 border-accent pl-6">
                            <li className="flex flex-col text-gray-700">
                                <strong className="text-xl">Faster Charging</strong>
                                <span className="font-light text-sm">Accepts up to 270 kW of power, allowing you to charge from 5% to 80% in under 22.5 minutes.</span>
                            </li>
                            <li className="flex flex-col text-gray-700 mt-4">
                                <strong className="text-xl">Continuous Power Delivery</strong>
                                <span className="font-light text-sm">Perform consecutive launches without any thermal throttling or power degradation.</span>
                            </li>
                        </ul>
                    </div>
                    <div className="aspect-square md:aspect-[4/3] bg-gray-200 rounded-[24px] overflow-hidden order-1 md:order-2">
                        <img
                            src="/charge.jpg"
                            alt="Electric Charging Architecture"
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* Aerodynamics & Efficiency */}
            <section className="py-16 md:py-24 bg-surface w-full">
                <div className="max-w-[1440px] mx-auto px-5 md:px-12 text-center">
                    <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block">Efficiency</span>
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-primary tracking-tight">Sculpted by the Wind</h2>
                    <p className="text-gray-600 font-light max-w-3xl mx-auto text-base md:text-lg mb-10 md:mb-16 px-2">
                        In an electric vehicle, aerodynamic drag is the enemy of range. Our designers and aerodynamicists work
                        hand-in-hand to sculpt bodies that cut through the air with a drag coefficient as low as 0.22,
                        without compromising our signature, aggressive aesthetics.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-left">
                        <div className="bg-white p-10 rounded-[24px] shadow-sm transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Active Air Intakes</h3>
                            <p className="text-gray-600 font-light text-sm leading-relaxed">
                                Seamlessly integrated cooling flaps open only when the powertrain or brakes require cooling.
                                Otherwise, they remain flush to maximize aerodynamics and extend your driving range.
                            </p>
                        </div>
                        <div className="bg-white p-10 rounded-[24px] shadow-sm transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Recuperation Management</h3>
                            <p className="text-gray-600 font-light text-sm leading-relaxed">
                                Our intelligent system can recuperate up to 265 kW of kinetic energy. During everyday driving,
                                approximately 90% of all braking events are performed entirely by the electric motors without mobilizing the hydraulic wheel brakes.
                            </p>
                        </div>
                        <div className="bg-white p-10 rounded-[24px] shadow-sm transform hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-bold mb-3">Zero Local Emissions</h3>
                            <p className="text-gray-600 font-light text-sm leading-relaxed">
                                Environmental responsibility without the performance penalty. By driving a Phoenix E-Performance model,
                                you actively contribute to cleaner urban air quality and significantly reduced noise pollution.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Charging Ecosystem - Just a link now */}
            <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-5 md:px-12 flex justify-center border-t border-gray-200">
                <Link to="/cars?category=Electric">
                    <Button variant="primary" className="min-w-[260px] py-4 text-sm font-bold uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all">Explore Electric Models</Button>
                </Link>
            </section>
        </div>
    );
};

export default EPerformance;
