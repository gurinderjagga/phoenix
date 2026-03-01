import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState('Models');

    const navigate = useNavigate();
    const location = useLocation();
    const { user, signOut } = useAuth();
    // Fetch wishlist count simplified for brevity
    // useEffect(() => {
    //     if (user) {
    //         apiService.getCartSummary().then(res => setWishlistCount(res.totalItems || 0)).catch(() => setWishlistCount(0));
    //     }
    // }, [user]);

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

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleLogout = async () => { await signOut(); navigate('/'); };

    const useDarkIcons = location.pathname.startsWith('/cars') || location.pathname.startsWith('/login') || location.pathname.startsWith('/profile') || location.pathname.startsWith('/orders');


    return (
        <header className="absolute top-0 left-0 right-0 z-50 bg-transparent h-24 flex items-center">
            <div className="w-full mx-auto px-6 lg:px-12 flex justify-between items-center relative">

                {/* Left - Hamburger Menu (Always Visible) */}
                <button onClick={toggleMenu} className={`${useDarkIcons ? 'text-primary' : 'text-white'} z-50 min-h-[48px] min-w-[48px] flex items-center justify-center -ml-2`}>
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
                <div className="flex items-center space-x-4 md:space-x-8 z-50">
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

            {/* Menu Overlay Container */}
            <div className={`fixed inset-0 z-40 ${isMenuOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop - Dark overlay that closes menu on click */}
                <div
                    className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Menu Content - 60% Width Drawer */}
                <div className={`absolute top-0 left-0 w-full sm:w-[85%] md:w-[60%] h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <nav className="flex flex-col h-full overflow-y-auto">
                        {/* Header row in drawer */}
                        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Menu</span>
                            <button onClick={() => setIsMenuOpen(false)} className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Main nav links - full width on mobile, left panel on md+ */}
                        <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
                            <div className="w-full md:w-[45%] bg-white flex-shrink-0 flex flex-col p-5 md:p-10 border-r-0 md:border-r border-gray-100">
                                <div className="flex flex-col space-y-1">
                                    {['Models', 'Experience', 'Support'].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => setActiveMenu(activeMenu === item ? '' : item)}
                                            className={`group flex items-center justify-between text-base font-semibold p-4 min-h-[52px] rounded-lg text-left w-full transition-colors ${activeMenu === item ? 'bg-gray-100 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                                        >
                                            <span>{item}</span>
                                            <svg
                                                className={`w-4 h-4 transition-transform ${activeMenu === item ? 'rotate-90 text-accent' : 'text-gray-300'}`}
                                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    ))}
                                </div>

                                {/* Account Link */}
                                <div className="pt-4 border-t border-gray-100 mt-auto">
                                    <button
                                        onClick={() => setActiveMenu('Account')}
                                        className={`flex items-center space-x-3 p-4 min-h-[52px] rounded-lg w-full text-left transition-colors ${activeMenu === 'Account' ? 'bg-gray-100 text-black' : 'text-gray-900 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">Account</span>
                                            {user && <span className="text-xs text-gray-500">Signed in</span>}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Right Content - Dynamic Content */}
                            <div className="flex-1 bg-gray-50 h-auto md:h-full p-6 md:p-12 overflow-y-visible md:overflow-y-auto flex flex-col justify-start">
                                {activeMenu === 'Models' && (
                                    <div className="flex flex-col gap-10 max-w-[280px] w-full animate-fade-in mx-auto pb-4 pt-4">
                                        {[
                                            { name: 'SUV', image: '/suv.webp', types: ['Gasoline', 'Electric'] },
                                            { name: 'Sedan', image: '/sedan.webp', types: ['Gasoline', 'Hybrid'] },
                                            { name: 'Electric', image: '/electric.webp', types: ['Electric'] },
                                            { name: 'Hybrid', image: '/hybrid.webp', types: ['Hybrid'] },
                                        ].map((category) => (
                                            <Link to={`/cars?category=${category.name}`} key={category.name} onClick={() => setIsMenuOpen(false)} className="group cursor-pointer flex flex-col items-start w-full relative">
                                                <h4 className="text-xl font-semibold text-black z-10">{category.name === 'SUV' ? 'SUV' : category.name === 'Electric' ? 'Electric' : category.name === 'Hybrid' ? 'Hybrid' : 'Sedan'}</h4>
                                                <div className="w-full h-32 bg-transparent flex items-center justify-center overflow-hidden -mt-2 -mb-1 relative z-0">
                                                    <img src={category.image} alt={category.name} className="h-full w-full object-contain opacity-80 group- group- drop-shadow-sm" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}

                                {activeMenu === 'Experience' && (
                                    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                                        <h2 className="text-6xl font-bold text-gray-200 uppercase tracking-tighter mb-4">Project</h2>
                                        <p className="text-xl font-medium text-gray-900 tracking-wide">College Project</p>
                                        <p className="text-sm text-gray-500 mt-4 max-w-md">
                                            Demonstrating modern web technologies with a luxury automotive commerce experience.
                                        </p>
                                    </div>
                                )}

                                {activeMenu === 'Support' && (
                                    <div className="max-w-xl mx-auto w-full animate-fade-in">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-8 border-b border-gray-200 pb-4">Contact Us</h3>
                                        <div className="space-y-8">
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Email</p>
                                                <a href="mailto:support@phoenix.com" className="text-xl font-medium text-gray-900">support@phoenix.com</a>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                                                <a href="tel:+18005550123" className="text-xl font-medium text-gray-900">+1 (800) 555-0123</a>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Headquarters</p>
                                                <p className="text-lg text-gray-900">
                                                    123 Innovation Drive<br />
                                                    Silicon Valley, CA 94025
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeMenu === 'Account' && (
                                    <div className="max-w-xl mx-auto w-full animate-fade-in pl-8">
                                        {user ? (
                                            <>
                                                <div className="mb-12">
                                                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-2 font-medium">Signed in as</p>
                                                    <p className="text-3xl font-bold uppercase tracking-wide text-black" title={user.user_metadata?.name || user.email}>
                                                        {user.user_metadata?.name || user.email?.split('@')[0]}
                                                    </p>
                                                </div>

                                                <div className="space-y-6 flex flex-col items-start w-full">
                                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-900">
                                                        Profile Settings
                                                    </Link>
                                                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-900">
                                                        Your Reserved Vehicle
                                                    </Link>

                                                    <div className="w-full h-px bg-gray-100 my-4"></div>

                                                    <button
                                                        onClick={() => {
                                                            handleLogout();
                                                            setIsMenuOpen(false);
                                                        }}
                                                        className="bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-[0.15em] w-auto"
                                                    >
                                                        Sign Out
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="mb-12">
                                                    <Link
                                                        to="/login"
                                                        onClick={() => setIsMenuOpen(false)}
                                                        className="inline-block bg-black text-white px-8 py-3 text-sm font-bold uppercase tracking-widest"
                                                    >
                                                        Log in
                                                    </Link>
                                                </div>

                                                <div className="space-y-6 flex flex-col items-start">

                                                    <Link to="/login" state={{ from: 'profile-settings' }} onClick={() => setIsMenuOpen(false)} className="text-lg font-medium text-gray-900">
                                                        Profile Settings
                                                    </Link>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;