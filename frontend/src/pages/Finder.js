import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const Finder = () => {
    return (
        <div className="bg-secondary min-h-screen pb-32 font-sans text-primary">
            {/* Hero Section */}
            <section className="relative h-[80vh] w-full flex items-center justify-start overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/finder.jpg"
                        alt="Phoenix Finder Configuration"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 text-left px-6 md:px-16 lg:px-24 mt-16 max-w-[1440px] w-full">
                    <span className="text-accent font-bold uppercase tracking-widest text-xs mb-4 block opacity-90">Personalized</span>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-6 drop-shadow-2xl text-white">
                        Phoenix Finder
                    </h1>
                    <p className="text-gray-200 text-xl md:text-2xl font-light max-w-2xl leading-relaxed drop-shadow-md">
                        Your vision, articulated in metal, leather, and carbon fiber.
                        Begin the journey to a vehicle that is unequivocally yours.
                    </p>
                </div>
            </section>

            {/* The Configuration Journey */}
            <section className="py-16 md:py-24 max-w-[1440px] mx-auto px-5 md:px-12">
                <div className="text-center mb-16 md:mb-24">
                    <h2 className="text-3xl md:text-[40px] font-bold mb-4 md:mb-6 text-black tracking-tight uppercase">The Art of Configuration</h2>
                    <p className="text-gray-500 font-light max-w-3xl mx-auto text-base md:text-lg leading-relaxed px-2">
                        Finding the perfect Phoenix is a highly personal process. Whether you are ordering a bespoke
                        commission from the factory or searching our curated national inventory for an exact match, the
                        Phoenix Finder is your primary tool.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 px-4 md:px-0">
                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#f4f4f4] rounded-full flex items-center justify-center mb-8">
                            <span className="text-xl font-bold text-black">1</span>
                        </div>
                        <h3 className="text-[17px] font-bold mb-4 uppercase tracking-[0.15em] text-black">Select Model Line</h3>
                        <p className="text-gray-500 font-light text-[14px] px-6 md:px-2 leading-relaxed">
                            Choose the fundamental architecture that fits your lifestyle, from our dynamic sedans to versatile SUVs.
                        </p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#f4f4f4] rounded-full flex items-center justify-center mb-8">
                            <span className="text-xl font-bold text-black">2</span>
                        </div>
                        <h3 className="text-[17px] font-bold mb-4 uppercase tracking-[0.15em] text-black">Choose Powertrain</h3>
                        <p className="text-gray-500 font-light text-[14px] px-6 md:px-2 leading-relaxed">
                            Tailor your performance needs. Select from long-range efficient setups to our blistering 'Turbo S' E-Performance dual-motors.
                        </p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#f4f4f4] rounded-full flex items-center justify-center mb-8">
                            <span className="text-xl font-bold text-black">3</span>
                        </div>
                        <h3 className="text-[17px] font-bold mb-4 uppercase tracking-[0.15em] text-black">Define Aesthetics</h3>
                        <p className="text-gray-500 font-light text-[14px] px-6 md:px-2 leading-relaxed">
                            Specify historic paint-to-sample colors, wheel designs, and exclusive interior material combinations.
                        </p>
                    </div>
                    <div className="text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-[#f4f4f4] rounded-full flex items-center justify-center mb-8">
                            <span className="text-xl font-bold text-black">4</span>
                        </div>
                        <h3 className="text-[17px] font-bold mb-4 uppercase tracking-[0.15em] text-black">Match or Reserve</h3>
                        <p className="text-gray-500 font-light text-[14px] px-6 md:px-2 leading-relaxed">
                            Instantly match your built specification with available dealer inventory, or reserve a production slot.
                        </p>
                    </div>
                </div>
            </section>



            {/* Financial & Ownership */}
            <section className="py-16 md:py-24 bg-surface w-full border-b border-gray-200">
                <div className="max-w-[1440px] mx-auto px-5 md:px-12 text-center">
                    <h2 className="text-3xl font-bold mb-4 md:mb-6 text-primary tracking-tight">Ownership & Financial Services</h2>
                    <p className="text-gray-600 font-light max-w-3xl mx-auto text-base md:text-lg mb-10 md:mb-16 px-2">
                        Acquiring a Phoenix is designed to be as seamless and refined as driving one. Our tailored financial solutions offer
                        flexibility without compromising premium service.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 text-left">
                        <div className="bg-white p-6 md:p-8 rounded-[20px] shadow-sm">
                            <h3 className="text-xl font-bold mb-2">Phoenix Preferred Lease</h3>
                            <p className="text-gray-600 font-light text-sm mb-4">
                                Experience a new vehicle every few years with flexible terms and mileage options designed around your driving habits.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-[20px] shadow-sm">
                            <h3 className="text-xl font-bold mb-2">Retail Financing</h3>
                            <p className="text-gray-600 font-light text-sm mb-4">
                                Traditional ownership paths with competitive rates, extended terms up to 84 months, and customizable down payment structures.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-[20px] shadow-sm">
                            <h3 className="text-xl font-bold mb-2">Phoenix Drive Subscription</h3>
                            <p className="text-gray-600 font-light text-sm mb-4">
                                A single monthly payment covering vehicle access, insurance, maintenance, and the flexibility to switch models via our concierge app.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-16 md:py-20 max-w-[1440px] mx-auto px-5 md:px-12">
                <div className="bg-gray-100 rounded-[24px] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-gray-200 shadow-inner text-center md:text-left">
                    <div className="md:w-2/3">
                        <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4">Stop Dreaming. Start Driving.</h2>
                        <p className="text-gray-600 font-light text-base md:text-lg max-w-2xl mx-auto md:mx-0">
                            Our inventory spans the nation. Use our advanced search tools to locate the exact model, powertrain, and trim combination you've been looking for.
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 flex justify-center md:justify-end mt-4 md:mt-0">
                        <Link to="/cars" className="w-full md:w-auto">
                            <Button variant="primary" className="w-full md:min-w-[200px] py-4 text-base md:text-lg">Search Inventory</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Finder;
