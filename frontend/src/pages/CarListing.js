import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { apiService } from '../utils/api';
import Button from '../components/Button';

const CarListing = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: searchParams.get('category') || '',
        brand: searchParams.get('brand') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        search: searchParams.get('search') || ''
    });
    const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'createdAt');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCars();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, sortBy, currentPage]);

    useEffect(() => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        if (sortBy !== 'createdAt') params.set('sort', sortBy);
        setSearchParams(params);
    }, [filters, sortBy, setSearchParams]);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 12,
                ...filters,
                sort: sortBy
            };
            const result = await apiService.getCars(params);
            setCars(result.cars || []);
            setTotalPages(result.totalPages || 1);
        } catch (error) {
            console.error('Error fetching cars:', error);
            setCars([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const categories = ['SUV', 'Electric', 'Hybrid', 'Sedan'];
    const brands = ['BMW', 'Mercedes-Benz', 'Porsche', 'Toyota', 'Tesla', 'Lamborghini'];

    return (
        <div className="bg-white min-h-screen pt-20">
            {/* Header Title */}
            <div className="bg-white py-8 md:py-16 border-b border-gray-200">
                <div className="max-w-[1440px] mx-auto px-5 md:px-12">
                    <h1 className="text-2xl md:text-5xl font-bold tracking-tight text-primary uppercase">
                        The Collection
                    </h1>
                    <p className="text-gray-500 uppercase tracking-widest text-xs mt-2 md:mt-4">
                        {loading ? 'Loading...' : `${cars.length} Models Available`}
                    </p>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-5 md:px-12 py-6 md:py-12">

                {/* ── MOBILE: Sort + Filter toggle bar ── */}
                <div className="flex items-center justify-between mb-4 lg:hidden">
                    <button
                        onClick={() => setShowFilters(v => !v)}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-gray-300 px-4 min-h-[44px] bg-white"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M7 8h10M11 12h2" />
                        </svg>
                        {showFilters ? 'Hide Filters' : 'Filters'}
                        {(filters.category || filters.brand || filters.search) && (
                            <span className="ml-1 w-2 h-2 bg-black rounded-full"></span>
                        )}
                    </button>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-xs font-bold uppercase tracking-widest border border-gray-200 px-3 min-h-[44px] focus:ring-0 focus:border-primary cursor-pointer"
                    >
                        <option value="-createdAt">Newest</option>
                        <option value="price">Price ↑</option>
                        <option value="-price">Price ↓</option>
                    </select>
                </div>

                {/* ── MOBILE: Collapsible filters ── */}
                {showFilters && (
                    <div className="lg:hidden bg-gray-50 border border-gray-200 p-4 mb-6 space-y-5">
                        {/* Search */}
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Search</h3>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="MODEL, KEYWORD..."
                                className="w-full bg-white border border-gray-200 px-3 py-2 text-sm focus:ring-1 focus:ring-primary placeholder-gray-400 uppercase tracking-wide min-h-[44px]"
                            />
                        </div>
                        {/* Category */}
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Category</h3>
                            <div className="flex flex-wrap gap-2">
                                {['', ...categories].map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => handleFilterChange('category', cat)}
                                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border min-h-[36px] ${filters.category === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}
                                    >
                                        {cat || 'All'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Brand */}
                        <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-2">Make</h3>
                            <div className="flex flex-wrap gap-2">
                                {['', ...brands].map(brand => (
                                    <button
                                        key={brand}
                                        onClick={() => handleFilterChange('brand', brand)}
                                        className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest border min-h-[36px] ${filters.brand === brand ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'}`}
                                    >
                                        {brand || 'All'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => { setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', search: '' }); setShowFilters(false); }}
                            className="text-xs font-bold uppercase tracking-widest text-gray-400 underline"
                        >
                            Reset
                        </button>
                    </div>
                )}

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Filters Sidebar — hidden on mobile, visible on lg+ */}
                    <div className="hidden lg:block lg:w-1/4 space-y-12">
                        {/* Search */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Search</h3>
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                placeholder="MODEL, KEYWORD..."
                                className="w-full bg-surface border-none px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-primary placeholder-gray-400 uppercase tracking-wide"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Category</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-x-4 gap-y-3">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filters.category === ''}
                                        onChange={() => handleFilterChange('category', '')}
                                        className="hidden"
                                    />
                                    <span className={`w-3 h-3 flex-shrink-0 border border-gray-300 mr-3 ${filters.category === '' ? 'bg-primary border-primary' : 'bg-transparent'}`}></span>
                                    <span className={`text-sm tracking-wide uppercase truncate ${filters.category === '' ? 'text-primary font-bold' : 'text-gray-500 group-'}`}>All</span>
                                </label>
                                {categories.map(category => (
                                    <label key={category} className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === category}
                                            onChange={() => handleFilterChange('category', category)}
                                            className="hidden"
                                        />
                                        <span className={`w-3 h-3 flex-shrink-0 border border-gray-300 mr-3 ${filters.category === category ? 'bg-primary border-primary' : 'bg-transparent'}`}></span>
                                        <span className={`text-sm tracking-wide uppercase truncate ${filters.category === category ? 'text-primary font-bold' : 'text-gray-500 group-'}`}>{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Brand */}
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Make</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-x-4 gap-y-3">
                                <label className="flex items-center cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="brand"
                                        checked={filters.brand === ''}
                                        onChange={() => handleFilterChange('brand', '')}
                                        className="hidden"
                                    />
                                    <span className={`w-3 h-3 flex-shrink-0 border border-gray-300 mr-3 ${filters.brand === '' ? 'bg-primary border-primary' : 'bg-transparent'}`}></span>
                                    <span className={`text-sm tracking-wide uppercase truncate ${filters.brand === '' ? 'text-primary font-bold' : 'text-gray-500 group-'}`}>All Makes</span>
                                </label>
                                {brands.map(brand => (
                                    <label key={brand} className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="brand"
                                            checked={filters.brand === brand}
                                            onChange={() => handleFilterChange('brand', brand)}
                                            className="hidden"
                                        />
                                        <span className={`w-3 h-3 flex-shrink-0 border border-gray-300 mr-3 ${filters.brand === brand ? 'bg-primary border-primary' : 'bg-transparent'}`}></span>
                                        <span className={`text-sm tracking-wide uppercase truncate ${filters.brand === brand ? 'text-primary font-bold' : 'text-gray-500 group-'}`}>{brand}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => setFilters({ category: '', brand: '', minPrice: '', maxPrice: '', search: '' })}
                            className="text-xs font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1"
                        >
                            Reset Filters
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="lg:w-3/4">
                        {/* Sort Options — desktop only */}
                        <div className="hidden lg:flex justify-end mb-8">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-xs font-bold uppercase tracking-widest border-b border-gray-200 py-2 focus:ring-0 focus:border-primary cursor-pointer"
                            >
                                <option value="-createdAt">Newest Arrivals</option>
                                <option value="price">Price: Low to High</option>
                                <option value="-price">Price: High to Low</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="w-8 h-8 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="text-center py-24 bg-surface">
                                <span className="text-2xl text-gray-400 block mb-4">∅</span>
                                <h3 className="text-lg font-bold uppercase tracking-widest text-primary mb-2">No Vehicles Found</h3>
                                <p className="text-gray-500 text-sm">Adjust your filters to see more results.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-x-6 sm:gap-y-12">
                                {cars.map((car) => (
                                    <CarCard key={car._id || car.id} car={car} />
                                ))}
                            </div>
                        )}

                        {/* Pagination - Simple */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-20 space-x-4">
                                <Button
                                    variant="secondary"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-6"
                                >
                                    Prev
                                </Button>
                                <span className="flex items-center text-xs font-bold uppercase tracking-widest">
                                    {currentPage} / {totalPages}
                                </span>
                                <Button
                                    variant="secondary"
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="px-6"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarListing;