import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Models');
    const [showMobileSubMenu, setShowMobileSubMenu] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuth();
    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMenuOpen]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        if (isMenuOpen) {
            setTimeout(() => setShowMobileSubMenu(false), 300);
        } else {
            setShowMobileSubMenu(false);
        }
    };

    const handleLogout = async () => { await signOut(); navigate('/'); };

    const useDarkIcons = location.pathname.startsWith('/cars') || location.pathname.startsWith('/login') || location.pathname.startsWith('/profile') || location.pathname.startsWith('/reserved');


    return (
        <>
            <header className={`absolute top-0 left-0 right-0 z-50 h-24 flex items-center transition-colors ${(!['/', '/experience', '/e-performance', '/finder'].includes(location.pathname) && !isMenuOpen) ? 'bg-white/80 backdrop-blur-md border-b border-gray-200' : 'bg-transparent border-transparent'}`}>
                <div className="w-full mx-auto px-6 lg:px-12 flex justify-between items-center relative">

                    {/* Left - Hamburger Menu (Always Visible) */}
                    <button
                        onClick={toggleMenu}
                        className={`${isMenuOpen ? 'text-black' : (useDarkIcons ? 'text-primary' : 'text-white')} z-[70] min-w-[44px] min-h-[44px] flex items-center justify-center`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>

                    {/* Center - PHOENIX Logo */}
                    <div className={`absolute left-1/2 -translate-x-1/2 z-50 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                        <Link to="/" className="flex items-center space-x-2">
                            <img src="/logo.png" alt="Phoenix" className="h-14 md:h-20 w-auto object-contain" />
                        </Link>
                    </div>

                    {/* Right Actions */}
                    <div className={`flex items-center space-x-4 md:space-x-8 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
                        {/* User Auth */}
                        {location.pathname !== '/login' && (
                            user ? (
                                <div className="relative">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(true);
                                            setActiveMenu('Account');
                                        }}
                                        className={`flex items-center space-x-2 ${useDarkIcons ? 'text-primary' : 'text-white'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-8">
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(true);
                                            setActiveMenu('Account');
                                        }}
                                        className={`flex items-center space-x-2 ${useDarkIcons ? 'text-primary' : 'text-white'}`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                        </svg>
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </header>

            {/* ── MOBILE MENU: Tabbed layout ── */}
            <div className={`md:hidden fixed inset-0 z-[60] flex flex-col bg-white transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Header spacer (matches parent h-24 roughly) with separation space and Navigation/Close Button */}
                <div className="h-24 flex-shrink-0 w-full flex items-center justify-between px-6">
                    <div className="flex-1">
                        {showMobileSubMenu && (
                            <button onClick={() => setShowMobileSubMenu(false)} className="flex items-center text-sm font-bold text-gray-900 uppercase tracking-[0.15em] hover:text-black transition-colors">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                Back
                            </button>
                        )}
                    </div>
                    {showMobileSubMenu && (
                        <span className="text-sm font-bold uppercase tracking-[0.15em] text-gray-900 mx-auto absolute left-1/2 -translate-x-1/2">{activeMenu}</span>
                    )}
                    <div className="flex-1 flex justify-end">
                        <button onClick={toggleMenu} className="text-black p-2 -mr-2 flex items-center justify-center">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Main Menu Layout */}
                <div className="flex flex-col flex-1 relative overflow-hidden">
                    {/* Top Section - Navigation Tabs */}
                    <div className={`absolute inset-0 w-full bg-white flex flex-col px-6 pt-0 transition-transform duration-300 overflow-y-auto ${showMobileSubMenu ? '-translate-x-full' : 'translate-x-0'}`}>
                        <div className="flex flex-col space-y-2 pt-0 flex-1">
                            {['Models', 'Experience', 'Support'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() => { setActiveMenu(item); setShowMobileSubMenu(true); }}
                                    className="group flex items-center justify-between text-base font-medium p-3 rounded-lg text-left w-full text-black hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                                >
                                    <span>{item}</span>
                                    <svg className="w-4 h-4 text-gray-300 group-hover:text-black transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-gray-100 pb-8 mt-auto">
                            <button
                                onClick={() => { setActiveMenu('Account'); setShowMobileSubMenu(true); }}
                                className="flex items-center space-x-3 p-3 rounded-lg w-full text-left text-gray-900 hover:bg-gray-50 focus:bg-gray-50 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">Account</span>
                                    {user && <span className="text-[10px] text-gray-500">Signed in</span>}
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Section - Content Area */}
                    <div className={`absolute inset-0 flex flex-col bg-gray-50 w-full p-6 overflow-y-auto transition-transform duration-300 ${showMobileSubMenu ? 'translate-x-0' : 'translate-x-full'}`}>
                        {activeMenu === 'Models' && (
                            <div className="flex flex-col gap-6 max-w-[280px] w-full animate-fade-in mx-auto pb-4 pt-0">
                                {[
                                    { name: 'SUV', image: '/suv.webp' },
                                    { name: 'Sedan', image: '/sedan.webp' },
                                    { name: 'Electric', image: '/electric.webp' },
                                    { name: 'Hybrid', image: '/hybrid.webp' },
                                ].map((category) => (
                                    <Link to={`/cars?category=${category.name}`} key={category.name} onClick={() => setIsMenuOpen(false)} className="group cursor-pointer flex flex-col items-start w-full relative">
                                        <h4 className="text-xl font-semibold text-black z-10 uppercase tracking-widest">{category.name}</h4>
                                        <div className="w-full h-32 flex items-center justify-center overflow-hidden -mt-2 -mb-1">
                                            <img src={category.image} alt={category.name} className="h-full w-full object-contain drop-shadow-sm group-active:scale-95 transition-transform duration-300" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                        {activeMenu === 'Experience' && (
                            <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in py-10">
                                <h2 className="text-4xl font-bold text-gray-200 uppercase tracking-tighter mb-4">GGDSD</h2>
                                <p className="text-lg font-medium text-gray-900 tracking-wide">College Project</p>
                                <p className="text-xs text-gray-500 mt-4 max-w-sm px-4">Demonstrating modern web excellence through a luxury automotive commerce experience.</p>
                                <p className="text-sm text-gray-600 tracking-wide mt-6 font-medium">
                                    Developed By<br />Gurinder Singh and Yuvraj
                                </p>
                            </div>
                        )}
                        {activeMenu === 'Support' && (
                            <div className="max-w-xl mx-auto w-full animate-fade-in pt-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6 border-b border-gray-200 pb-3">Contact Us</h3>
                                <div className="space-y-6">
                                    <div><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Email</p><a href="mailto:support@phoenix.com" className="text-base font-medium text-gray-900">support@phoenix.com</a></div>
                                    <div><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Live Help</p><a href="tel:+91987654321" className="text-base font-medium text-gray-900">+91 987654321</a></div>
                                    <div><p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Headquarters</p><p className="text-sm text-gray-900">Chandigarh, India</p></div>
                                </div>
                            </div>
                        )}
                        {activeMenu === 'Account' && (
                            <div className="max-w-xl mx-auto w-full animate-fade-in pt-4">
                                {user ? (
                                    <>
                                        <div className="mb-8">
                                            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1 font-medium">Signed in as</p>
                                            <p className="text-xl font-bold uppercase tracking-wide text-black">{user.user_metadata?.name || user.email?.split('@')[0]}</p>
                                        </div>
                                        <div className="space-y-4 flex flex-col items-start w-full">
                                            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-gray-900">Profile Settings</Link>
                                            <Link to="/reserved" onClick={() => setIsMenuOpen(false)} className="text-base font-medium text-gray-900">Reserved</Link>
                                            <div className="w-full h-px bg-gray-200 my-2"></div>
                                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="bg-black text-white px-6 py-3 w-full text-xs font-bold uppercase tracking-[0.15em] rounded-lg">Sign Out</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-8 w-full">
                                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-center w-full bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-lg pointer-events-auto">Log in</Link>
                                        </div>
                                        <div className="space-y-4 flex flex-col items-center w-full">
                                            <Link to="/register" state={{ from: 'profile-settings' }} onClick={() => setIsMenuOpen(false)} className="text-sm font-medium text-gray-600 underline pointer-events-auto">Sign up for an account</Link>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── DESKTOP MENU: side drawer ── */}
            <div className={`hidden md:block fixed inset-0 z-[60] ${isMenuOpen ? 'visible' : 'invisible'}`}>
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setIsMenuOpen(false)}
                />
                <div className={`absolute top-0 left-0 w-[60%] h-full bg-white shadow-2xl flex transition-transform duration-300 z-[60] ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>

                    <nav className="flex flex-row flex-1 overflow-y-hidden">
                        <div className="w-[60%] bg-white h-full flex-shrink-0 flex flex-col justify-between px-12 pb-12 overflow-y-auto border-r border-gray-100 relative">
                            {/* Precisely absolutely positioned Close Button matching the main Header layout */}
                            <div className="absolute top-0 left-0 w-full h-24 px-6 lg:px-12 flex items-center">
                                <button onClick={toggleMenu} className="text-black z-[70] min-w-[44px] min-h-[44px] flex items-center justify-center hover:opacity-75 transition-opacity pointer-events-auto">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex flex-col space-y-4 pt-0">
                                {/* Header spacer to provide the separation space only for the left menu items */}
                                <div className="h-24 flex-shrink-0 w-full"></div>
                                {['Models', 'Experience', 'Support'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => setActiveMenu(item)}
                                        className={`group flex items-center justify-between text-lg font-medium p-4 rounded-lg text-left w-full ${activeMenu === item ? 'bg-gray-100 text-black' : 'text-gray-500'}`}
                                    >
                                        <span>{item}</span>
                                        <svg className={`w-5 h-5 transition-transform ${activeMenu === item ? 'text-accent translate-x-1' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                            <div className="pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => setActiveMenu('Account')}
                                    className={`flex items-center space-x-3 p-4 rounded-lg w-full text-left ${activeMenu === 'Account' ? 'bg-gray-100 text-black' : 'text-gray-900'}`}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div className="flex flex-col">
                                        <span className="font-medium">Account</span>
                                        {user && <span className="text-xs text-gray-500">Signed in</span>}
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 bg-gray-50 h-full p-12 overflow-y-auto">
                            {activeMenu === 'Models' && (
                                <div className="flex flex-col gap-10 max-w-[280px] w-full animate-fade-in mx-auto pb-4 pt-12">
                                    {[
                                        { name: 'SUV', image: '/suv.webp' },
                                        { name: 'Sedan', image: '/sedan.webp' },
                                        { name: 'Electric', image: '/electric.webp' },
                                        { name: 'Hybrid', image: '/hybrid.webp' },
                                    ].map((category) => (
                                        <Link to={`/cars?category=${category.name}`} key={category.name} onClick={() => setIsMenuOpen(false)} className="group cursor-pointer flex flex-col items-start w-full relative">
                                            <h4 className="text-xl font-semibold text-black z-10">{category.name}</h4>
                                            <div className="w-full h-32 flex items-center justify-center overflow-hidden -mt-2 -mb-1">
                                                <img src={category.image} alt={category.name} className="h-full w-full object-contain opacity-80 drop-shadow-sm group-hover:scale-105 transition-transform duration-500" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                            {activeMenu === 'Experience' && (
                                <div className="flex flex-col items-center pt-24 pb-12 text-center animate-fade-in">
                                    <h2 className="text-6xl font-bold text-gray-200 uppercase tracking-tighter mb-4">GGDSD</h2>
                                    <p className="text-xl font-medium text-gray-900 tracking-wide">College Project</p>
                                    <p className="text-sm text-gray-500 mt-4 max-w-md">Demonstrating modern web excellence through a luxury automotive commerce experience.</p>
                                    <p className="text-lg text-gray-600 tracking-wide mt-6 font-medium">
                                        Developed By<br />Gurinder Singh and Yuvraj
                                    </p>
                                </div>
                            )}
                            {activeMenu === 'Support' && (
                                <div className="max-w-xl mx-auto w-full animate-fade-in pt-12">
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8 border-b border-gray-200 pb-4">Contact Us</h3>
                                    <div className="space-y-8">
                                        <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p><a href="mailto:support@phoenix.com" className="text-xl font-medium text-gray-900">support@phoenix.com</a></div>
                                        <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Live Help</p><a href="tel:+91987654321" className="text-xl font-medium text-gray-900">+91 987654321</a></div>
                                        <div><p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Headquarters</p><p className="text-lg text-gray-900">Chandigarh, India</p></div>
                                    </div>
                                </div>
                            )}
                            {activeMenu === 'Account' && (
                                <div className="max-w-xl mx-auto w-full animate-fade-in pl-8 relative z-10 pt-12">
                                    {user ? (
                                        <>
                                            <div className="mb-12">
                                                <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-medium">Signed in as</p>
                                                <p className="text-3xl font-bold uppercase tracking-wide text-black">{user.user_metadata?.name || user.email?.split('@')[0]}</p>
                                            </div>
                                            <div className="space-y-6 flex flex-col items-start w-full">
                                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-900 w-full block">Profile Settings</Link>
                                                <Link to="/reserved" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-900 w-full block">Reserved</Link>
                                                <div className="w-full h-px bg-gray-100 my-4"></div>
                                                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-[0.15em] hover:bg-gray-900 transition-colors pointer-events-auto">Sign Out</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="mb-8 w-full">
                                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors pointer-events-auto mb-2">Log in</Link>
                                            </div>
                                            <div className="space-y-6 flex flex-col items-start w-full">
                                                <Link to="/register" state={{ from: 'profile-settings' }} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-900 hover:text-black transition-colors pointer-events-auto">Sign up for an account</Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
};

export default Header;