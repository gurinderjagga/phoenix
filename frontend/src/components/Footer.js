import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
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

                    {/* Links */}
                    <div className="w-full md:w-auto flex flex-col items-start md:items-end">
                        <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-6">Explore Models</h4>
                        <ul className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
                            {['SUV', 'Sedan', 'Electric', 'Hybrid'].map(item => (
                                <li key={item}>
                                    <Link to={`/cars?category=${item}`} className="text-gray-500 text-[10px] md:text-xs uppercase tracking-[0.2em] font-medium">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="text-gray-600 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-0">
                        © 2026 Phoenix AG. Legal notice. Privacy Policy. Cookie Policy.
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