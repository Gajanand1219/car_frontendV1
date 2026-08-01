// src/components/user/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API, { getImageUrl } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './HomePage.css';

const HomePage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [enquiry, setEnquiry] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        city: ''
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchFeaturedCars();
        if (isAuthenticated && user) {
            setEnquiry(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.mobile || ''
            }));
        }
    }, [isAuthenticated, user]);

    const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
};


    const fetchFeaturedCars = async () => {
        try {
            const res = await API.get('/cars/');
            // ✅ Filter only available cars
            const availableCars = res.data.filter(car => 
                car.status === 'available' || car.status === 'featured'
            );
            setCars(availableCars.slice(0, 4));
        } catch (error) {
            console.error('Error fetching cars:', error);
        } finally {
            setLoading(false);
        }
    };

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const popupShown = sessionStorage.getItem("popupShown");
        if (!popupShown) {
            const timer = setTimeout(() => {
                setShowPopup(true);
                sessionStorage.setItem("popupShown", "true");
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, []);
    

    const closePopup = () => {
        setShowPopup(false);
    };

    const handleBannerClick = () => {
        setShowPopup(false);
        navigate("/cars");
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/cars?search=${encodeURIComponent(searchTerm.trim())}`);
        } else {
            navigate('/cars');
        }
    };

    

    const handleCarClick = () => {
    navigate("/cars");
};

    const handleEnquiry = async (e) => {
        e.preventDefault();
        if (!enquiry.name || !enquiry.email || !enquiry.phone || !enquiry.message || !enquiry.city) {
            toast.error('Please fill all fields');
            return;
        }
        setIsSubmitting(true);
        try {
            await API.post('/enquiries/', enquiry);
            setShowConfirmation(true);
            setEnquiry(prev => ({ ...prev, message: '' }));
        } catch (error) {
            console.error('Enquiry error:', error);
            toast.error('Failed to send enquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
        toast.success('We will contact you soon! 📞');
    };

    const handleCall = () => {
        window.location.href = 'tel:+918468853896';
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent("नमस्कार, मला तुमच्या कारबद्दल माहिती हवी आहे.");
        window.open(`https://wa.me/918468853896?text=${message}`, "_blank");
    };

    const handleEmail = () => {
        window.location.href = "mailto:gajanand1902@gmail.com?subject=Car%20Enquiry&body=Hello,%20I%20am%20interested%20in%20your%20car.";
    };

    const handleSellCar = () => {
        navigate('/seller');
    };

    const handleAskEMI = () => {
        handleWhatsApp();
    };

    // ✅ Get Status Display
    const getStatusDisplay = (car) => {
        const status = car.status || car.approval_status;
        
        if (status === 'available' || status === 'approved') {
            return { label: 'Available', icon: 'bi-check-circle-fill', className: 'available' };
        } else if (status === 'featured') {
            return { label: 'Featured', icon: 'bi-star-fill', className: 'featured' };
        } else if (status === 'sold') {
            return { label: 'Sold', icon: 'bi-check-circle-fill', className: 'sold' };
        } else if (status === 'pending') {
            return { label: 'Pending', icon: 'bi-clock-fill', className: 'pending' };
        } else if (status === 'rejected') {
            return { label: 'Unavailable', icon: 'bi-x-circle-fill', className: 'rejected' };
        } else {
            return { label: 'Unavailable', icon: 'bi-x-circle-fill', className: 'unavailable' };
        }
    };

    // ✅ Get Condition Display
    const getConditionDisplay = (car) => {
        const condition = car.vehicle_condition || car.car_condition;
        
        if (condition === 'new') {
            return { label: 'New', icon: 'bi-stars', className: 'new' };
        } else {
            return { label: 'Used', icon: 'bi-arrow-repeat', className: 'used' };
        }
    };

    return (
        <div className="home-page">

            {/* ==================== HERO SECTION ==================== */}
            <section className="hp-hero">
                <div className="hp-hero-badge top-right">
                    <span className="badge-dot"></span>
                    ⭐ Trusted by 500+ Customers
                </div>
                <div className="hp-hero-badge bottom-left">
                    🚗 200+ Cars Sold
                </div>
                <div className="container">
                    <div className="hp-hero-content">
                        <div className="hp-hero-tag">
                            <i className="bi bi-star-fill"></i>
                            India's Most Trusted Car Platform
                        </div>
                        <h1 className="hp-hero-title">Find Your <span className="highlight">Dream Car</span> Today</h1>
                        <p className="hp-hero-subtitle">Explore Premium New & Used Cars at the Best Prices. <br /> Verified • Tested • Trusted</p>
                        
                        <div className="hp-hero-search-card">
                            <form className="hp-hero-search" onSubmit={handleSearch}>
                                <div className="hp-search-field">
                                    <i className="bi bi-search"></i>
                                    <input
                                        type="text"
                                        placeholder="Search by brand, model..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button type="button" className="hp-search-clear" onClick={() => setSearchTerm('')}>
                                            <i className="bi bi-x-circle-fill"></i>
                                        </button>
                                    )}
                                </div>
                                <button type="submit" className="hp-btn-search">
                                    <i className="bi bi-search"></i> Search Cars
                                </button>
                            </form>
                            <div className="hp-search-tags">
                                <span>Popular:</span>
                                <button onClick={() => { setSearchTerm('Toyota'); navigate('/cars?search=Toyota'); }}>Toyota</button>
                                <button onClick={() => { setSearchTerm('Honda'); navigate('/cars?search=Honda'); }}>Honda</button>
                                <button onClick={() => { setSearchTerm('BMW'); navigate('/cars?search=BMW'); }}>BMW</button>
                                <button onClick={() => { setSearchTerm('Maruti'); navigate('/cars?search=Maruti'); }}>Maruti</button>
                                <button onClick={() => { setSearchTerm('Hyundai'); navigate('/cars?search=Hyundai'); }}>Hyundai</button>
                            </div>
                        </div>

                        <div className="hp-hero-cta">
                            <button className="hp-btn-buy" onClick={() => navigate('/cars')}>
                                <i className="bi bi-car-front-fill"></i> Buy Car
                            </button>
                            <button className="hp-btn-sell" onClick={handleSellCar}>
                                <i className="bi bi-clipboard-check"></i> Evaluate / Sell
                            </button>
                            <button className="hp-btn-emi" onClick={handleAskEMI}>
                                <i className="bi bi-calculator-fill"></i> Ask EMI
                            </button>
                            
                            <button className="hp-btn-buy" onClick={scrollToContact}>
                                <i className="bi bi-send-fill"></i> Enquire Now
                            </button>
                        </div>

                        <div className="hp-hero-stats">
                            <div className="hp-stat-item">
                                <span className="hp-stat-number">500+</span>
                                <span className="hp-stat-label">Happy Customers</span>
                            </div>
                            <div className="hp-stat-divider"></div>
                            <div className="hp-stat-item">
                                <span className="hp-stat-number">200+</span>
                                <span className="hp-stat-label">Cars Sold</span>
                            </div>
                            <div className="hp-stat-divider"></div>
                            <div className="hp-stat-item">
                                <span className="hp-stat-number">50+</span>
                                <span className="hp-stat-label">Brands</span>
                            </div>
                            <div className="hp-stat-divider"></div>
                            <div className="hp-stat-item">
                                <span className="hp-stat-number">⭐ 4.9</span>
                                <span className="hp-stat-label">Rating</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hp-hero-float-car">🚗</div>
            </section>

            {/* ==================== QUICK SERVICES ==================== */}
<section className="hp-services">
    <div className="container">
        <div className="hp-services-grid">
            <div className="hp-service-box" onClick={() => navigate('/cars')}>
                <span className="hp-service-icon"><i className="bi bi-car-front-fill"></i></span>
                <h4>Buy Car</h4>
                <p>New & Used Cars</p>
                <span className="hp-service-arrow"><i className="bi bi-arrow-right"></i></span>
                <span className="hp-service-float-icon">🚗</span>
            </div>
            <div className="hp-service-box" onClick={handleSellCar}>
                <span className="hp-service-icon"><i className="bi bi-clipboard-check"></i></span>
                <h4>Evaluate / Sell</h4>
                <p>Get Best Price</p>
                <span className="hp-service-arrow"><i className="bi bi-arrow-right"></i></span>
                <span className="hp-service-float-icon">💰</span>
            </div>
            <div className="hp-service-box" onClick={handleAskEMI}>
                <span className="hp-service-icon"><i className="bi bi-calculator-fill"></i></span>
                <h4>Ask EMI</h4>
                <p>Easy Finance</p>
                <span className="hp-service-arrow"><i className="bi bi-arrow-right"></i></span>
                <span className="hp-service-float-icon">📊</span>
            </div>
            <div className="hp-service-box" onClick={scrollToContact}>
                <span className="hp-service-icon"><i className="bi bi-headset"></i></span>
                <h4>Enquire Now</h4>
                <p>Easy Support</p>
                <span className="hp-service-arrow"><i className="bi bi-arrow-right"></i></span>
                <span className="hp-service-float-icon">💬</span>
            </div>
            <div className="hp-service-box" onClick={() => window.open('https://parivahan.gov.in', '_blank')}>
                <span className="hp-service-icon"><i className="bi bi-clipboard-check"></i></span>
                <h4>Check Challan</h4>
                <p>Verify Status</p>
                <span className="hp-service-arrow"><i className="bi bi-arrow-right"></i></span>
                <span className="hp-service-float-icon">📋</span>
            </div>
            <div className="hp-service-box" onClick={() => window.open('https://www.netc.org.in/', '_blank')}>
                <span className="hp-service-icon"><i className="bi bi-tag"></i></span>
                <h4>FASTag</h4>
                <p>Recharge</p>
                <span className="hp-service-arrow"><i className="bi bi-arrow-right"></i></span>
                <span className="hp-service-float-icon">🏷️</span>
            </div>
        </div>
    </div>
</section>
            {/* ==================== WHY CHOOSE US ==================== */}
            <section className="hp-features">
                <div className="container">
                    <div className="hp-features-heading">
                        <span className="hp-section-label"><i className="bi bi-award-fill"></i> Why Choose Us</span>
                        <h2>Car Buying Made <span>Simple & Transparent</span></h2>
                        <p>We make car buying simple, transparent, and hassle-free</p>
                    </div>
                    <div className="hp-features-grid">
                        <div className="hp-feature-card">
                            <div className="hp-feature-number">01</div>
                            <span className="hp-feature-icon"><i className="bi bi-check-circle-fill"></i></span>
                            <h3>Verified Cars</h3>
                            <p>All cars are inspected and certified by our experts</p>
                            <span className="hp-feature-tag">Trusted</span>
                        </div>
                        <div className="hp-feature-card">
                            <div className="hp-feature-number">02</div>
                            <span className="hp-feature-icon"><i className="bi bi-rocket-takeoff-fill"></i></span>
                            <h3>Quick Delivery</h3>
                            <p>Get your car delivered to your doorstep in 24 hours</p>
                            <span className="hp-feature-tag">Fast</span>
                        </div>
                        <div className="hp-feature-card">
                            <div className="hp-feature-number">03</div>
                            <span className="hp-feature-icon"><i className="bi bi-piggy-bank-fill"></i></span>
                            <h3>Best Prices</h3>
                            <p>Guaranteed best market prices with no hidden charges</p>
                            <span className="hp-feature-tag">Save ₹</span>
                        </div>
                        <div className="hp-feature-card">
                            <div className="hp-feature-number">04</div>
                            <span className="hp-feature-icon"><i className="bi bi-person-badge-fill"></i></span>
                            <h3>Trusted Dealers</h3>
                            <p>Connected with top verified dealers across India</p>
                            <span className="hp-feature-tag">Verified</span>
                        </div>
                    </div>
                </div>
            </section>

           
            {/* ==================== FEATURED CARS ==================== */}
            <section className="hp-featured-cars">
                <div className="container">
                    <div className="hp-section-header">
                        <div>
                            <span className="hp-section-label"><i className="bi bi-fire"></i> Hot Deals</span>
                            <h2>Featured Cars</h2>
                        </div>
                        <div className="hp-header-actions">
                           
                            <Link to="/cars" className="hp-view-all">
                                View All <i className="bi bi-arrow-right-circle-fill"></i>
                            </Link>
                        </div>
                    </div>
                    {loading ? (
                        <div className="hp-cars-grid">
                            {[1, 2, 3].map(i => <div key={i} className="hp-shimmer"></div>)}
                        </div>
                    ) : cars.length === 0 ? (
                        <div className="hp-no-cars">
                            <div className="hp-no-cars-icon">🚗</div>
                            <h3>No Cars Available</h3>
                            <p>Check back later for new listings!</p>
                        </div>
                    ) : (
                        <div className="hp-cars-grid">
                            {cars.map((car, index) => {
                                const status = getStatusDisplay(car);
                                const condition = getConditionDisplay(car);
                                
                                return (
                                    <div 
                                        key={index} 
                                        className="hp-car-card" 
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                        onClick={() => handleCarClick()}
                                    >
                                        <div className="hp-car-image">
                                            <img
                                                src={getImageUrl(car.images?.[0])}
                                                alt={car.model || car.car_model}
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/400x250/4A6CF7/FFFFFF?text=Garud+Car'}
                                            />
                                            {/* Status Badge */}
                                            <span className={`hp-car-status ${status.className}`}>
                                                <i className={status.icon}></i> {status.label}
                                            </span>
                                            {/* Condition Badge */}
                                            <span className={`hp-car-condition ${condition.className}`}>
                                                <i className={condition.icon}></i> {condition.label}
                                            </span>
                                            {/* Price Flag */}
                                            {/* <span className="hp-car-price">
                                                <i className="bi bi-currency-rupee"></i> {(car.expected_price || car.price)?.toLocaleString()}
                                            </span> */}
                                            {/* Click Hint */}
                                            <span className="hp-click-hint">
                                                <i className="bi bi-hand-index-thumb-fill"></i> Click to view
                                            </span>
                                        </div>
                                        <div className="hp-car-info">
                                            <h3>{car.brand || car.car_brand} {car.model || car.car_model}</h3>
                                            <p className="hp-car-variant">{car.variant} • {car.year || car.car_year}</p>
                                            <div className="hp-car-specs">
                                                <span><i className="bi bi-fuel-pump"></i> {car.fuel}</span>
                                                <span><i className="bi bi-gear"></i> {car.transmission}</span>
                                                <span><i className="bi bi-speedometer"></i> {(car.kilometers)?.toLocaleString()} km</span>
                                            </div>
                                            <div className="hp-car-actions" onClick={(e) => e.stopPropagation()}>
                                                <button className="hp-btn-detail" onClick={() => handleCarClick(car.id)}>
                                                    View Details <i className="bi bi-arrow-right"></i>
                                                </button>
                                                <button className="hp-btn-whatsapp" onClick={handleWhatsApp}>
                                                    <i className="bi bi-whatsapp"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>


             {/* ==================== FREE EVALUATION ==================== */}
            <section className="hp-evaluation">
                <div className="container">
                    <div className="hp-eval-card">
                        <div className="hp-eval-content">
                            <span className="hp-eval-badge"><i className="bi bi-calendar-check-fill"></i> Free Evaluation</span>
                            <h2>Sell Your Car at the <span>Best Price</span></h2>
                            <p>Sell your car for free with ease. Reach genuine buyers and get the best price for your car.</p>
                            <div className="hp-eval-features">
                                <span><i className="bi bi-check-circle-fill"></i> Free Inspection</span>
                                <span><i className="bi bi-graph-up-arrow"></i> Instant Price</span>
                                <span><i className="bi bi-hand-thumbs-up-fill"></i> No Obligation</span>
                            </div>
                            <button className="hp-btn-evaluate" onClick={handleSellCar}>
                                <i className="bi bi-car-front-fill"></i> Sell Your Car
                            </button>
                        </div>
                        <div className="hp-eval-image">
                            <div className="hp-eval-car">🚗</div>
                            <div className="hp-eval-float price"><i className="bi bi-currency-rupee"></i> Best Price</div>
                            <div className="hp-eval-float inspect"><i className="bi bi-search"></i> Free Inspection</div>
                            <div className="hp-eval-float trust"><i className="bi bi-shield-check"></i> Trusted</div>
                        </div>
                    </div>
                </div>
            </section>



            {/* ==================== MARQUEE SERVICES ==================== */}
<section className="hp-service-marquee">

    <marquee
        behavior="scroll"
        direction="left"
        scrollAmount="5"
        onMouseOver={(e) => e.target.stop()}
        onMouseOut={(e) => e.target.start()}
    >

        {/* Card 1 */}
        <a href="/cars" className="hp-service-card">
            <span className="sticker">🔥 HOT</span>
            <div className="floating-bg">🚗</div>
            <div className="icon">🚗</div>
            <h5>Buy Cars</h5>
        </a>

        {/* Card 2 */}
        <a href="/seller" className="hp-service-card">
            <span className="sticker">💰 BEST</span>
            <div className="floating-bg">🚘</div>
            <div className="icon">📋</div>
            <h5>Sell Car</h5>
        </a>

        {/* Card 3 */}
        <a
            href="https://wa.me/918468853896?text=Hi%20I%20want%20Car%20EMI"
            className="hp-service-card"
        >
            <span className="sticker">💸 EMI</span>
            <div className="floating-bg">🏦</div>
            <div className="icon">💳</div>
            <h5>Ask EMI</h5>
        </a>

        {/* Card 4 */}
        <a href="#contact" className="hp-service-card">
            <span className="sticker">⚡ NOW</span>
            <div className="floating-bg">📞</div>
            <div className="icon">📞</div>
            <h5>Quick Enquiry</h5>
        </a>

        {/* Card 5 */}
        <a
            href="https://wa.me/918468853896"
            className="hp-service-card"
        >
            <span className="sticker">💬 LIVE</span>
            <div className="floating-bg">💚</div>
            <div className="icon">
                <i className="bi bi-whatsapp"></i>
            </div>
            <h5>WhatsApp</h5>
        </a>

        {/* Card 6 */}
        <a href="/cars" className="hp-service-card">
            <span className="sticker">⚡ EV</span>
            <div className="floating-bg">🔋</div>
            <div className="icon">🚘</div>
            <h5>Electric Cars</h5>
        </a>

        {/* Card 7 */}
        <div className="hp-service-card no-click">
            <span className="sticker">🚀 FAST</span>
            <div className="floating-bg">🚚</div>
            <div className="icon">🚚</div>
            <h5>Delivery</h5>
        </div>

        {/* Card 8 */}
        <a href="/seller" className="hp-service-card">
            <span className="sticker">🏆 TOP</span>
            <div className="floating-bg">💰</div>
            <div className="icon">🚗</div>
            <h5>Sell Car</h5>
        </a>

        {/* Card 9 */}
        <a href="/cars" className="hp-service-card">
            <span className="sticker">⭐ NEW</span>
            <div className="floating-bg">🚙</div>
            <div className="icon">🚙</div>
            <h5>Buy Cars</h5>
        </a>

        <div className="hp-service-card no-click">
    <span className="sticker">🚗 DOORSTEP</span>
    <div className="floating-bg">🏠</div>

    <div className="icon">🚚</div>

    <h5>Doorstep Service</h5>
    <small>Anywhere in India</small>
</div>

{/* Online Service (Not Clickable) */}
<div className="hp-service-card no-click">
    <span className="sticker">🌐 ONLINE</span>
    <div className="floating-bg">💻</div>

    <div className="icon">
        <i className="bi bi-globe2"></i>
    </div>

    <h5>Online Service</h5>
    <small>Available 24×7</small>
</div>

    </marquee>

</section>
            {/* ==================== ABOUT ==================== */}
            <section className="hp-about">
                <div className="container">
                    <div className="hp-about-wrapper">
                        <div className="hp-about-text">
                            <span className="hp-section-label"><i className="bi bi-building"></i> About Us</span>
                            <h2>Garud Property & <span>Auto Consultancy</span></h2>
                            <p>Garud Property & Auto Consultancy is India's leading platform for buying and selling used cars. We connect buyers with verified dealers, ensuring a transparent and hassle-free experience.</p>
                            <p>With over 500+ happy customers and 200+ cars sold, we pride ourselves on providing the best deals with complete peace of mind.</p>
                            <div className="hp-about-stats">
                                <div className="hp-about-stat">
                                    <span className="num">500+</span>
                                    <span className="lbl">Happy Customers</span>
                                </div>
                                <div className="hp-about-stat">
                                    <span className="num">200+</span>
                                    <span className="lbl">Cars Sold</span>
                                </div>
                                <div className="hp-about-stat">
                                    <span className="num">50+</span>
                                    <span className="lbl">Brands</span>
                                </div>
                                <div className="hp-about-stat">
                                    <span className="num">⭐ 4.9</span>
                                    <span className="lbl">Rating</span>
                                </div>
                            </div>
                            <div className="hp-about-btns">
                                <button className="hp-btn-about-primary" onClick={() => navigate('/cars')}>
                                    <i className="bi bi-car-front-fill"></i> Browse Cars
                                </button>
                                <button className="hp-btn-about-secondary" onClick={handleWhatsApp}>
                                    <i className="bi bi-whatsapp"></i> Chat Now
                                </button>
                            </div>
                        </div>
                        <div className="hp-about-map">
                            <div className="map-header">
                                <i className="bi bi-geo-alt-fill"></i> Our Location
                            </div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.125!2d73.8565!3d18.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd1d614ad49d1b9%3A0x764891ca8bb0866e!2sNanded%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                                title="Location"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                            <div className="map-footer">
                                <span><i className="bi bi-telephone-fill"></i> +91 8468853896</span>
                                <span><i className="bi bi-geo-alt"></i> Nanded, Maharashtra</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== CONTACT & ENQUIRY ==================== */}
            <section className="hp-contact" id="contact">
                <div className="container">
                    <div className="hp-contact-wrapper">
                        <div className="hp-contact-side">
                            <h2><i className="bi bi-headset"></i> Get in Touch</h2>
                            <p>Connect with us instantly through any of these channels</p>
                            <div className="hp-contact-list">
                                <div className="hp-contact-item" onClick={handleCall}>
                                    <div className="hp-contact-icon call"><i className="bi bi-telephone-fill"></i></div>
                                    <div>
                                        <h4>Call Us</h4>
                                        <p>+91 8468853896</p>
                                        <span className="hp-contact-tag"><i className="bi bi-clock"></i> 24/7 Available</span>
                                    </div>
                                    <span className="hp-contact-arrow"><i className="bi bi-arrow-right-circle-fill"></i></span>
                                </div>
                                <div className="hp-contact-item" onClick={handleWhatsApp}>
                                    <div className="hp-contact-icon whatsapp"><i className="bi bi-whatsapp"></i></div>
                                    <div>
                                        <h4>WhatsApp</h4>
                                        <p>+91 8468853896</p>
                                        <span className="hp-contact-tag"><i className="bi bi-clock"></i> Quick Response</span>
                                    </div>
                                    <span className="hp-contact-arrow"><i className="bi bi-arrow-right-circle-fill"></i></span>
                                </div>
                                <div className="hp-contact-item" onClick={handleEmail}>
                                    <div className="hp-contact-icon email"><i className="bi bi-envelope-fill"></i></div>
                                    <div>
                                        <h4>Email Us</h4>
                                        <p>akashrathod62872@gmail.com</p>
                                        <span className="hp-contact-tag"><i className="bi bi-clock"></i> Reply within 24hrs</span>
                                    </div>
                                    <span className="hp-contact-arrow"><i className="bi bi-arrow-right-circle-fill"></i></span>
                                </div>
                            </div>
                        </div>

                        <div className="hp-enquiry-card">
                            <div className="hp-enquiry-header">
                                <span className="hp-enquiry-badge"><i className="bi bi-send-fill"></i> Quick Enquiry</span>
                                <h3>Send Us a Message</h3>
                                <p>We'll get back to you within 24 hours</p>
                            </div>
                            <form onSubmit={handleEnquiry}>
                                <div className="hp-form-row">
                                    <div className="hp-form-group">
                                        <label><i className="bi bi-person-fill"></i> Full Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={enquiry.name}
                                            onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="hp-form-group">
                                        <label><i className="bi bi-envelope-fill"></i> Email *</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={enquiry.email}
                                            onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="hp-form-row">
                                    <div className="hp-form-group">
                                        <label><i className="bi bi-phone-fill"></i> Phone *</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            value={enquiry.phone}
                                            onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="hp-form-group">
                                        <label><i className="bi bi-geo-alt-fill"></i> City *</label>
                                        <select
                                            value={enquiry.city}
                                            onChange={(e) => setEnquiry({ ...enquiry, city: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Select City --</option>
                                            <option value="Parbhani">Parbhani</option>
                                            <option value="Nanded">Nanded</option>
                                            <option value="Hingoli">Hingoli</option>
                                            <option value="Latur">Latur</option>
                                            <option value="Chhatrapati Sambhajinagar">Chhatrapati Sambhajinagar</option>
                                            <option value="Beed">Beed</option>
                                            <option value="Washim">Washim</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="hp-form-group">
                                    <label><i className="bi bi-chat-dots-fill"></i> Your Message *</label>
                                    <textarea
                                        placeholder="Tell us about your requirements..."
                                        value={enquiry.message}
                                        onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
                                        rows="3"
                                        required
                                    />
                                </div>
                                <button type="submit" className="hp-btn-submit" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <><span className="hp-spinner"></span> Sending...</>
                                    ) : (
                                        <><i className="bi bi-send-fill"></i> Send Enquiry</>
                                    )}
                                </button>
                                <p className="hp-privacy"><i className="bi bi-lock-fill"></i> We respect your privacy. Your information will not be shared.</p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== CONFIRMATION ==================== */}
            {showConfirmation && (
                <div className="hp-confirm-overlay" onClick={closeConfirmation}>
                    <div className="hp-confirm-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="hp-confirm-icon">✅</div>
                        <h2>Enquiry Sent Successfully!</h2>
                        <p>Thank you for reaching out to us. Our team will contact you <strong>within 24 hours</strong>.</p>
                        <div className="hp-confirm-details">
                            <p><i className="bi bi-envelope-fill"></i> {enquiry.email}</p>
                            <p><i className="bi bi-phone-fill"></i> {enquiry.phone}</p>
                            <p><i className="bi bi-geo-alt-fill"></i> {enquiry.city}</p>
                        </div>
                        <button className="hp-btn-primary" onClick={closeConfirmation}>
                            Got it! <i className="bi bi-hand-thumbs-up-fill"></i>
                        </button>
                        <p className="hp-confirm-time"><i className="bi bi-clock"></i> We'll get back to you shortly!</p>
                    </div>
                </div>
            )}

            {/* ==================== POPUP ==================== */}
            {showPopup && (
                    <div className="popup-overlay">
                            <div className="popup-card">

                                <button
                                    className="popup-close"
                                    onClick={closePopup}
                                >
                                    ✕
                                </button>

                                <div
                                    className="popup-banner"
                                    onClick={handleBannerClick}
                                >
                                    <img src="/favicon.png" alt="Offer"/>

                                    <div className="popup-content">
                                    
                                        <button className="popup-btn">
                                            🚗 View Cars → 
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
            )}

            {/* ==================== ADD TO CSS ==================== */}
            <style>{`
                .hp-no-cars {
                    text-align: center;
                    padding: 60px 20px;
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                }

                .hp-no-cars-icon {
                    font-size: 4rem;
                    display: block;
                    margin-bottom: 12px;
                }

                .hp-no-cars h3 {
                    font-size: 1.5rem;
                    color: #1a1a2e;
                    margin: 0 0 8px;
                }

                .hp-no-cars p {
                    color: #888;
                    font-size: 1rem;
                }

                /* Status Colors */
                .hp-car-status.available {
                    background: #00B894;
                    color: #fff;
                }
                .hp-car-status.featured {
                    background: #FDCB6E;
                    color: #1a1a2e;
                }
                .hp-car-status.sold {
                    background: #6C5CE7;
                    color: #fff;
                }
                .hp-car-status.pending {
                    background: #F39C12;
                    color: #fff;
                }
                .hp-car-status.rejected {
                    background: #E17055;
                    color: #fff;
                }
                .hp-car-status.unavailable {
                    background: #95a5a6;
                    color: #fff;
                }

                /* Dark Theme */
                [data-theme="dark"] .hp-no-cars {
                    background: #1f1f3a;
                }

                [data-theme="dark"] .hp-no-cars h3 {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .hp-no-cars p {
                    color: #8888aa;
                }
            `}</style>

        </div>
    );
};

export default HomePage;