// src/components/user/CarsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API, { getImageUrl } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';

// src/components/user/CarsPage.jsx
import { useLocation } from 'react-router-dom';

const CarsPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const location = useLocation();

    const [filter, setFilter] = useState({
        fuel: '',
        transmission: '',
        minPrice: '',
        maxPrice: '',
        brand: '',
        year: ''
    });
    const [showLogin, setShowLogin] = useState(false);
    const [selectedCar, setSelectedCar] = useState(null);
    const [activeFilter, setActiveFilter] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const res = await API.get('/cars/');
            console.log('✅ Cars fetched:', res.data);
            setCars(res.data);
        } catch (error) {
            console.log(JSON.stringify(error.response?.data, null, 2));
        } finally {
            setLoading(false);
        }
    };

    const handleCarClick = (car) => {
        navigate(`/cars/${car.id}`);
    };

    const handleCallNow = (e) => {
        e.stopPropagation();
        window.location.href = 'tel:+918468853896';
    };

    const handleWhatsApp = (e, car) => {
        e.stopPropagation();
        const message = encodeURIComponent(
            `Hi, I am interested in ${car.brand} ${car.model} (${car.year}). Please share more details.`
        );
        window.open(`https://wa.me/918468853896?text=${message}`, '_blank');
    };

    // Get unique brands for filter
    const brands = [...new Set(cars.map(car => car.brand).filter(Boolean))];
    const years = [...new Set(cars.map(car => car.year).filter(Boolean))].sort((a, b) => b - a);
    const fuelTypes = [...new Set(cars.map(car => car.fuel).filter(Boolean))];
    const transmissions = [...new Set(cars.map(car => car.transmission).filter(Boolean))];

    // Get cars by condition
    const newCars = cars.filter(car => car.vehicle_condition === 'new' || car.vehicle_condition === 'NEW');
    const oldCars = cars.filter(car => car.vehicle_condition === 'old' || car.vehicle_condition === 'OLD');

    // Filter cars based on active tab
    const getFilteredCars = () => {
        let baseCars = cars;
        if (activeTab === 'new') {
            baseCars = newCars;
        } else if (activeTab === 'old') {
            baseCars = oldCars;
        }
        
        return baseCars.filter(car => {
            const matchesSearch = car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                car.variant?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesBrand = !filter.brand || car.brand === filter.brand;
            const matchesYear = !filter.year || car.year === parseInt(filter.year);
            const matchesFuel = !filter.fuel || car.fuel === filter.fuel;
            const matchesTrans = !filter.transmission || car.transmission === filter.transmission;
            const matchesPrice = (!filter.minPrice || car.price >= Number(filter.minPrice)) &&
                (!filter.maxPrice || car.price <= Number(filter.maxPrice));
            return matchesSearch && matchesBrand && matchesYear && matchesFuel && matchesTrans && matchesPrice;
        });
    };

    
// Inside the CarsPage component, add:

// Add this useEffect to handle URL filter parameter
useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filterParam = params.get('filter');
    if (filterParam === 'new') {
        setActiveTab('new');
    } else if (filterParam === 'old') {
        setActiveTab('old');
    } else {
        setActiveTab('all');
    }
}, [location.search]);


    const filteredCars = getFilteredCars();

    const clearFilters = () => {
        setFilter({ fuel: '', transmission: '', minPrice: '', maxPrice: '', brand: '', year: '' });
        setSearchTerm('');
        setActiveFilter(false);
        setShowFilters(false);
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        return price.toLocaleString('en-IN');
    };

    // Count cars by condition
    const newCount = newCars.length;
    const oldCount = oldCars.length;
    const totalCount = cars.length;

    // Toggle filters on mobile
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    if (loading) {
        return (
            <div className="cars-page">
                <div className="container-full">
                    <div className="cars-grid-full">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="car-card shimmer" style={{ height: '350px' }}></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cars-page">
            <div className="container-full">
                {/* Header with Filter Toggle */}
                <div className="cars-header">
                    <div className="cars-header-left">
                        <h1>🚗 All Cars</h1>
                        <p className="cars-count">{filteredCars.length} cars available</p>
                    </div>
                    <button 
                        className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                        onClick={toggleFilters}
                        aria-label="Toggle filters"
                    >
                        <i className="bi bi-sliders2"></i>
                        <span>Filters</span>
                        {(filter.brand || filter.year || filter.fuel || filter.transmission || filter.minPrice || filter.maxPrice || searchTerm) && (
                            <span className="filter-dot"></span>
                        )}
                    </button>
                </div>

                {/* ✅ New & Old Cars Tabs */}
                <div className="cars-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        🚗 All
                        <span className="tab-count">{totalCount}</span>
                    </button>
                    <button 
                        className={`tab-btn tab-new ${activeTab === 'new' ? 'active' : ''}`}
                        onClick={() => setActiveTab('new')}
                    >
                        ✨ New
                        <span className="tab-count">{newCount}</span>
                    </button>
                    <button 
                        className={`tab-btn tab-old ${activeTab === 'old' ? 'active' : ''}`}
                        onClick={() => setActiveTab('old')}
                    >
                        🔄 Old
                        <span className="tab-count">{oldCount}</span>
                    </button>
                </div>

                {/* ✅ Filters - Toggle on Mobile */}
                <div className={`filters-wrapper ${showFilters ? 'filters-open' : ''}`}>
                    <div className="filters-bar-full">
                        <div className="filter-group">
                            <input
                                type="text"
                                placeholder="🔍 Search by brand, model..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="filter-input search-input"
                            />
                        </div>

                        <div className="filter-group">
                            <select
                                value={filter.brand}
                                onChange={(e) => setFilter({ ...filter, brand: e.target.value })}
                                className="filter-select"
                            >
                                <option value="">All Brands</option>
                                {brands.map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <select
                                value={filter.year}
                                onChange={(e) => setFilter({ ...filter, year: e.target.value })}
                                className="filter-select"
                            >
                                <option value="">All Years</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <select
                                value={filter.fuel}
                                onChange={(e) => setFilter({ ...filter, fuel: e.target.value })}
                                className="filter-select"
                            >
                                <option value="">All Fuel</option>
                                {fuelTypes.map(fuel => (
                                    <option key={fuel} value={fuel}>{fuel}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <select
                                value={filter.transmission}
                                onChange={(e) => setFilter({ ...filter, transmission: e.target.value })}
                                className="filter-select"
                            >
                                <option value="">All Transmission</option>
                                {transmissions.map(trans => (
                                    <option key={trans} value={trans}>{trans}</option>
                                ))}
                            </select>
                        </div>

                        <button onClick={clearFilters} className="btn-clear-filters">
                            ✕ Clear
                        </button>
                    </div>

                    {/* Active Filters Tags */}
                    {(filter.brand || filter.year || filter.fuel || filter.transmission || filter.minPrice || filter.maxPrice || searchTerm) && (
                        <div className="active-filters">
                            <span className="active-label">Active Filters:</span>
                            {searchTerm && (
                                <span className="filter-tag" onClick={() => setSearchTerm('')}>
                                    Search: {searchTerm} ✕
                                </span>
                            )}
                            {filter.brand && (
                                <span className="filter-tag" onClick={() => setFilter({ ...filter, brand: '' })}>
                                    Brand: {filter.brand} ✕
                                </span>
                            )}
                            {filter.year && (
                                <span className="filter-tag" onClick={() => setFilter({ ...filter, year: '' })}>
                                    Year: {filter.year} ✕
                                </span>
                            )}
                            {filter.fuel && (
                                <span className="filter-tag" onClick={() => setFilter({ ...filter, fuel: '' })}>
                                    Fuel: {filter.fuel} ✕
                                </span>
                            )}
                            {filter.transmission && (
                                <span className="filter-tag" onClick={() => setFilter({ ...filter, transmission: '' })}>
                                    Trans: {filter.transmission} ✕
                                </span>
                            )}
                            {(filter.minPrice || filter.maxPrice) && (
                                <span className="filter-tag" onClick={() => setFilter({ ...filter, minPrice: '', maxPrice: '' })}>
                                    Price: {filter.minPrice || '0'} - {filter.maxPrice || '∞'} ✕
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* ✅ Tab Indicator */}
                <div className="tab-indicator">
                    {activeTab === 'all' && (
                        <p>Showing <strong>all {totalCount}</strong> cars</p>
                    )}
                    {activeTab === 'new' && (
                        <p>Showing <strong>{newCount} new</strong> cars ✨</p>
                    )}
                    {activeTab === 'old' && (
                        <p>Showing <strong>{oldCount} old</strong> cars 🔄</p>
                    )}
                </div>

                {/* Cars Grid */}
                {filteredCars.length === 0 ? (
                    <div className="no-cars-full">
                        <div className="no-cars-icon">🔍</div>
                        <h3>No {activeTab === 'all' ? '' : activeTab} cars found</h3>
                        <p>Try adjusting your filters or search terms</p>
                        <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
                    </div>
                ) : (
                    <div className="cars-grid-full">
                        {filteredCars.map(car => (
                            <div
                                key={car.id}
                                className="car-card-full"
                                onClick={() => handleCarClick(car)}
                            >
                                <div className="car-image-full">
                                    <img
                                        src={getImageUrl(car.images?.[0])}
                                        alt={`${car.brand} ${car.model}`}
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/600x400'}
                                    />
                                    <span className={`car-status ${car.status}`}>{car.status}</span>
                                    {car.emi_available && (
                                        <span className="emi-badge">💰 EMI Available</span>
                                    )}
                                    <span className={`condition-badge ${car.vehicle_condition === 'new' ? 'condition-new' : 'condition-old'}`}>
                                        {car.vehicle_condition === 'new' ? '✨ New' : '🔄 Old'}
                                    </span>
                                </div>
                                <div className="car-info-full">
                                    <div className="car-title">
                                        <h3>{car.brand} {car.model}</h3>
                                        <span className="car-year-badge">{car.year}</span>
                                    </div>
                                    <p className="car-variant">{car.variant}</p>
                                    <div className="car-specs-full">
                                        <span>⛽ {car.fuel}</span>
                                        <span>⚙️ {car.transmission}</span>
                                        <span>📏 {car.kilometers?.toLocaleString()} km</span>
                                    </div>
                                    {/* <div className="car-price-full">
                                        ₹{formatPrice(car.price)}
                                        {car.original_price && (
                                            <span className="original-price">₹{formatPrice(car.original_price)}</span>
                                        )}
                                    </div> */}
                                    {car.features?.length > 0 && (
                                        <div className="car-features-full">
                                            {car.features.slice(0, 4).map((f, i) => (
                                                <span key={i} className="feature-tag">{f}</span>
                                            ))}
                                            {car.features.length > 4 && (
                                                <span className="feature-tag">+{car.features.length - 4}</span>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="card-contact-buttons">
                                        <button 
                                            className="card-btn-call" 
                                            onClick={(e) => handleCallNow(e)}
                                        >
                                            <i className="bi bi-telephone-fill"></i> Call Now
                                        </button>
                                        <button 
                                            className="card-btn-whatsapp" 
                                            onClick={(e) => handleWhatsApp(e, car)}
                                        >
                                            <i className="bi bi-whatsapp"></i> WhatsApp
                                        </button>
                                    </div>

                                    <button className="btn-view-details">
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <LoginModal
                isOpen={showLogin}
                onClose={() => { setShowLogin(false); setSelectedCar(null); }}
                onSuccess={() => {
                    if (selectedCar) {
                        navigate(`/cars/${selectedCar.id}`);
                    }
                }}
            />
        </div>
    );
};

export default CarsPage;