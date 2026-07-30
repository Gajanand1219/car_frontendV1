// src/components/user/CarDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API, { getImageUrl } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoginModal from './LoginModal';

const CarDetailPage = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downPayment, setDownPayment] = useState(0);
    const [tenure, setTenure] = useState(60);
    const [emi, setEmi] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);
    const [activeImage, setActiveImage] = useState(0);
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        fetchCarDetail();
    }, [id]);

    const fetchCarDetail = async () => {
        try {
            const res = await API.get(`/cars/${id}`);
            setCar(res.data);
            if (res.data.emi_available) {
                const defaultDownPayment = res.data.price * 0.2;
                setDownPayment(defaultDownPayment);
                calculateEMI(defaultDownPayment, 60, res.data);
            }
        } catch (error) {
            console.error('❌ Error fetching car:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const calculateEMI = (down, months, carData) => {
        if (!carData) return;
        const loanAmount = carData.price - down;
        const rate = carData.interest_rate || 8.5;
        const monthlyRate = rate / 100 / 12;

        if (loanAmount > 0 && months > 0) {
            const emiValue = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months) /
                (Math.pow(1 + monthlyRate, months) - 1);
            setEmi(emiValue);
            setTotalPayment(emiValue * months);
        } else {
            setEmi(0);
            setTotalPayment(0);
        }
    };

    const handleDownPaymentChange = (e) => {
        const value = Number(e.target.value);
        setDownPayment(value);
        calculateEMI(value, tenure, car);
    };

    const handleTenureChange = (e) => {
        const value = Number(e.target.value);
        setTenure(value);
        calculateEMI(downPayment, value, car);
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        return price.toLocaleString('en-IN');
    };

    const handleCallNow = () => {
        window.location.href = 'tel:+918468853896';
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(
            `Hi, I am interested in ${car.brand} ${car.model} (${car.year}). Please share more details.`
        );
        window.open(`https://wa.me/918468853896?text=${message}`, '_blank');
    };

    const handleEnquiryClick = () => {
        if (!isAuthenticated) {
            setShowLogin(true);
        } else {
            navigate(`/enquiry/${car.id}`);
        }
    };

    if (loading) {
        return <div className="loading">Loading car details...</div>;
    }

    if (!car) {
        return (
            <div className="container">
                <div className="car-detail-container">
                    <h3>Car not found</h3>
                    <Link to="/cars" className="back-btn">← Back to Cars</Link>
                </div>
            </div>
        );
    }

    const images = car.images?.length > 0 ? car.images : ['https://via.placeholder.com/1200x600'];
    const isNewCar = car.vehicle_condition === 'new' || car.vehicle_condition === 'NEW';

    return (
        <>
            <div className="car-detail-page-full">
                <div className="container-full">
                    <Link to="/cars" className="back-btn-full">← Back to All Cars</Link>

                    <div className="car-detail-full">
                        {/* Image Gallery */}
                        <div className="car-gallery">
                            <div className="main-image">
                                <img
                                    src={getImageUrl(images[activeImage])}
                                    alt={`${car.brand} ${car.model}`}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/1200x600'}
                                />
                                <span className={`car-status-badge ${car.status}`}>{car.status}</span>
                                
                                {/* ✅ Vehicle Condition Badge */}
                                {/* <span className={`condition-badge-detail ${isNewCar ? 'condition-new' : 'condition-old'}`}>
                                    {isNewCar ? '✨ Brand New' : '🔄 Pre-Owned'}
                                </span> */}
                                
                                {car.emi_available && (
                                    <span className="emi-badge-detail">💰 EMI Available</span>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="thumbnails">
                                    {images.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                                            onClick={() => setActiveImage(index)}
                                        >
                                            <img
                                                src={getImageUrl(img)}
                                                alt={`${car.model} ${index + 1}`}
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/200x150'}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Car Info */}
                        <div className="car-info-full-detail">
                            <div className="car-header-detail">
                                <div>
                                    <h1>{car.brand} {car.model}</h1>
                                    <div className="car-meta-info">
                                        <span className="car-variant-detail">{car.variant} • {car.year}</span>
                                        
                                        {/* ✅ Vehicle Condition Tag */}
                                        <span className={`condition-tag ${isNewCar ? 'tag-new' : 'tag-old'}`}>
                                            {isNewCar ? '✨ New' : '🔄 Old'}
                                        </span>
                                    </div>
                                </div>
                                {/* <div className="price-detail">
                                    <span className="current-price">₹{formatPrice(car.price)}</span>
                                    {car.original_price && (
                                        <span className="original-price-detail">₹{formatPrice(car.original_price)}</span>
                                    )}
                                    {car.offer_price && (
                                        <span className="offer-price-detail">Offer: ₹{formatPrice(car.offer_price)}</span>
                                    )}
                                </div> */}
                            </div>

                            {/* ✅ Call Now & WhatsApp Buttons */}
                            <div className="contact-buttons">
                                <button className="btn-call-now" onClick={handleCallNow}>
                                    <i className="bi bi-telephone-fill"></i> Call Now
                                </button>
                                <button className="btn-whatsapp" onClick={handleWhatsApp}>
                                    <i className="bi bi-whatsapp"></i> WhatsApp
                                </button>
                            </div>

                            <div className="car-specs-grid">
                                <div className="spec-item">
                                    <span className="spec-icon">📋</span>
                                    <div>
                                        <span className="spec-label">Condition</span>
                                        <span className={`spec-value condition-value ${isNewCar ? 'new' : 'old'}`}>
                                            {isNewCar ? '✨ Brand New' : '🔄 Pre-Owned'}
                                        </span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-icon">⛽</span>
                                    <div>
                                        <span className="spec-label">Fuel</span>
                                        <span className="spec-value">{car.fuel}</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-icon">⚙️</span>
                                    <div>
                                        <span className="spec-label">Transmission</span>
                                        <span className="spec-value">{car.transmission}</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-icon">📏</span>
                                    <div>
                                        <span className="spec-label">Kilometers</span>
                                        <span className="spec-value">{car.kilometers?.toLocaleString()} km</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-icon">🎨</span>
                                    <div>
                                        <span className="spec-label">Color</span>
                                        <span className="spec-value">{car.color}</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-icon">👤</span>
                                    <div>
                                        <span className="spec-label">Owner</span>
                                        <span className="spec-value">{car.owner}</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <span className="spec-icon">📅</span>
                                    <div>
                                        <span className="spec-label">Registration Year</span>
                                        <span className="spec-value">{car.registration_year || car.year}</span>
                                    </div>
                                </div>
                                {car.seats && (
                                    <div className="spec-item">
                                        <span className="spec-icon">💺</span>
                                        <div>
                                            <span className="spec-label">Seats</span>
                                            <span className="spec-value">{car.seats}</span>
                                        </div>
                                    </div>
                                )}
                                {car.engine && (
                                    <div className="spec-item">
                                        <span className="spec-icon">🔧</span>
                                        <div>
                                            <span className="spec-label">Engine</span>
                                            <span className="spec-value">{car.engine}</span>
                                        </div>
                                    </div>
                                )}
                                {car.power && (
                                    <div className="spec-item">
                                        <span className="spec-icon">💪</span>
                                        <div>
                                            <span className="spec-label">Power</span>
                                            <span className="spec-value">{car.power}</span>
                                        </div>
                                    </div>
                                )}
                                {car.mileage && (
                                    <div className="spec-item">
                                        <span className="spec-icon">⛽</span>
                                        <div>
                                            <span className="spec-label">Mileage</span>
                                            <span className="spec-value">{car.mileage}</span>
                                        </div>
                                    </div>
                                )}
                                {car.rto && (
                                    <div className="spec-item">
                                        <span className="spec-icon">📋</span>
                                        <div>
                                            <span className="spec-label">RTO</span>
                                            <span className="spec-value">{car.rto}</span>
                                        </div>
                                    </div>
                                )}
                                {car.registration_number && (
                                    <div className="spec-item">
                                        <span className="spec-icon">🔢</span>
                                        <div>
                                            <span className="spec-label">Registration</span>
                                            <span className="spec-value">{car.registration_number}</span>
                                        </div>
                                    </div>
                                )}
                                {car.vin && (
                                    <div className="spec-item">
                                        <span className="spec-icon">🆔</span>
                                        <div>
                                            <span className="spec-label">VIN</span>
                                            <span className="spec-value">{car.vin}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {car.description && (
                                <div className="car-description">
                                    <h3>📝 Description</h3>
                                    <p>{car.description}</p>
                                </div>
                            )}

                            {/* Features */}
                            {car.features?.length > 0 && (
                                <div className="car-features-detail">
                                    <h3>✨ Features</h3>
                                    <div className="features-grid-detail">
                                        {car.features.map((f, i) => (
                                            <span key={i} className="feature-item">✅ {f}</span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Enquiry Button */}
                            <button 
                                className="btn-primary" 
                                onClick={handleEnquiryClick}
                                style={{ 
                                    width: '100%', 
                                    justifyContent: 'center',
                                    padding: '14px',
                                    fontSize: '16px',
                                    marginTop: '16px'
                                }}
                            >
                                📞 Enquire Now
                            </button>

                            {/* EMI Calculator */}
                            {car.emi_available ? (
                                <div className="emi-calculator-full">
                                    <h3>💰 EMI Calculator</h3>
                                    <div className="emi-grid-full">
                                        <div className="emi-card highlight">
                                            <span className="emi-label">Monthly EMI</span>
                                            <span className="emi-value">₹{formatPrice(emi)}</span>
                                        </div>
                                        <div className="emi-card">
                                            <span className="emi-label">Total Payment</span>
                                            <span className="emi-value">₹{formatPrice(totalPayment)}</span>
                                        </div>
                                        <div className="emi-card">
                                            <span className="emi-label">Total Interest</span>
                                            <span className="emi-value">₹{formatPrice(totalPayment - (car.price - downPayment))}</span>
                                        </div>
                                        <div className="emi-card">
                                            <span className="emi-label">Loan Amount</span>
                                            <span className="emi-value">₹{formatPrice(car.price - downPayment)}</span>
                                        </div>
                                    </div>

                                    <div className="emi-sliders">
                                        <div className="emi-slider-group">
                                            <label>Down Payment: ₹{formatPrice(downPayment)}</label>
                                            <input
                                                type="range"
                                                className="emi-slider"
                                                min={car.price * 0.05}
                                                max={car.price * 0.5}
                                                step={10000}
                                                value={downPayment}
                                                onChange={handleDownPaymentChange}
                                            />
                                            <div className="slider-labels">
                                                <span>5%</span>
                                                <span>50%</span>
                                            </div>
                                        </div>

                                        <div className="emi-slider-group">
                                            <label>Tenure: {tenure} months</label>
                                            <input
                                                type="range"
                                                className="emi-slider"
                                                min={12}
                                                max={84}
                                                step={6}
                                                value={tenure}
                                                onChange={handleTenureChange}
                                            />
                                            <div className="slider-labels">
                                                <span>12 months</span>
                                                <span>84 months</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="emi-info">
                                        <span>Interest Rate: {car.interest_rate || 8.5}% p.a.</span>
                                        <span>Processing Fee: Included</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="emi-unavailable">
                                    <h3>💰 EMI Not Available</h3>
                                    <p>EMI options are not available for this car. Please contact us for alternative payment options.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                mode="login"
                onSuccess={() => {
                    window.location.reload();
                }}
            />
        </>
    );
};

export default CarDetailPage;