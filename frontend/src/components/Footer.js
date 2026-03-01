import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [isModelsOpen, setIsModelsOpen] = useState(false);
    return (
        <footer className="bg-primary text-secondary pt-12 md:pt-16 pb-8 border-t border-gray-900">
            <div className="max-w-[1920px] mx-auto px-8 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
                    {/* Brand */}
                    <div className="w-full md:w-1/2">
                        <div className="mb-3">
                            <span className="text-2xl md:text-3xl font-bold tracking-widest text-secondary uppercase">PHOENIX</span>
                        </div>
                        <p className="text-gray-400 text-xs font-medium leading-relaxed uppercase tracking-wider max-w-sm">
                            Performance Reborn.<br />
                            Precision. Power. Passion.
                        </p>
                    </div>

                    {/* Links - Accordion on Mobile */}
                    <div className="w-full md:w-auto flex flex-col items-start md:items-end border-t border-gray-800 md:border-none pt-4 md:pt-0">
                        <button
                            onClick={() => setIsModelsOpen(!isModelsOpen)}
                            className="w-full md:w-auto flex justify-between items-center text-xs font-bold tracking-widest text-white uppercase mb-0 md:mb-6 min-h-[48px] md:min-h-0 focus:outline-none"
                        >
                            <span>Explore Models</span>
                            <svg
                                className={`w-4 h-4 md:hidden transition-transform duration-300 ${isModelsOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`w-full overflow-hidden transition-all duration-300 md:!max-h-none md:!opacity-100 ${isModelsOpen ? 'max-h-40 opacity-100 mt-4' : 'max-h-0 opacity-0 md:mt-0'}`}>
                            <ul className="flex flex-col md:flex-row flex-wrap gap-x-8 gap-y-4 md:justify-end pb-4 md:pb-0">
                                {['SUV', 'Sedan', 'Electric', 'Hybrid'].map(item => (
                                    <li key={item}>
                                        <Link to={`/cars?category=${item}`} className="block w-full text-gray-400 hover:text-white transition-colors text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium py-2 md:py-0">
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-0">
                        © 2024 Phoenix AG. Legal notice. Privacy Policy. Cookie Policy.
                    </div>
                    <div className="flex space-x-6">
                        <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                            English (US)
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;