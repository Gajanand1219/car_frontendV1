// src/components/user/EnquiryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API, { getImageUrl } from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EnquiryPage = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [enquiry, setEnquiry] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        city: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/cars');
            return;
        }
        fetchCarDetail();
        if (user) {
            setEnquiry(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.mobile || ''
            }));
        }
    }, [id, isAuthenticated, user]);

    const fetchCarDetail = async () => {
        try {
            const res = await API.get(`/cars/${id}`);
            setCar(res.data);
        } catch (error) {
            console.error('Error fetching car:', error);
            toast.error('Failed to load car details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setEnquiry({ ...enquiry, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!enquiry.name || !enquiry.email || !enquiry.phone || !enquiry.message || !enquiry.city) {
            toast.error('Please fill all fields');
            return;
        }

        setSubmitting(true);

        try {
            const enquiryData = {
                ...enquiry,
                car_id: parseInt(id)
            };
            
            await API.post('/enquiries/', enquiryData);
            setShowConfirmation(true);
            setEnquiry(prev => ({ ...prev, message: '' }));
            toast.success('Enquiry sent successfully!');
        } catch (error) {
            console.error('Enquiry error:', error);
            toast.error('Failed to send enquiry. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
        navigate(`/cars/${id}`);
    };

    const formatPrice = (price) => {
        if (!price) return '0';
        return price.toLocaleString('en-IN');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
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

    return (
        <div className="enquiry-page">
            <div className="container">
                <Link to={`/cars/${car.id}`} className="back-btn-full">← Back to Car Details</Link>

                <div className="enquiry-page-wrapper">
                    {/* Left - Car Details */}
                    <div className="enquiry-car-card">
                        <div className="enquiry-car-image">
                            <img
                                src={getImageUrl(car.images?.[0])}
                                alt={`${car.brand} ${car.model}`}
                                onError={(e) => e.target.src = 'https://via.placeholder.com/400x300'}
                            />
                            <span className={`car-status-badge ${car.status}`}>{car.status}</span>
                        </div>
                        <div className="enquiry-car-info">
                            <h2>{car.brand} {car.model}</h2>
                            <p className="car-variant">{car.variant} • {car.year}</p>
                            <div className="car-specs-row">
                                <span>⛽ {car.fuel}</span>
                                <span>⚙️ {car.transmission}</span>
                                <span>📏 {car.kilometers?.toLocaleString()} km</span>
                            </div>
                            <div className="car-price-enquiry">₹{formatPrice(car.price)}</div>
                            {car.emi_available && (
                                <div className="emi-tag">💰 EMI Available</div>
                            )}
                            <div className="car-features-enquiry">
                                {car.features?.slice(0, 4).map((f, i) => (
                                    <span key={i} className="feature-tag">{f}</span>
                                ))}
                                {car.features?.length > 4 && (
                                    <span className="feature-tag">+{car.features.length - 4}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right - Enquiry Form */}
                    <div className="enquiry-form-card">
                        <div className="enquiry-form-header">
                            <h3>📬 Enquire About This Car</h3>
                            <p>Fill in the details and we'll get back to you within 24 hours</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>👤 Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={enquiry.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>📧 Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={enquiry.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>📱 Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={enquiry.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>🏙️ Select City *</label>
                                <select
                                    value={enquiry.city}
                                    onChange={(e) => setEnquiry({ ...enquiry, city: e.target.value })}
                                    className="form-select"
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

                            <div className="form-group">
                                <label>💬 Your Message *</label>
                                <textarea
                                    name="message"
                                    placeholder="Tell us about your requirements..."
                                    value={enquiry.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-submit-enquiry" disabled={submitting}>
                                <i className="bi bi-send-fill"></i>
                                {submitting ? 'Sending...' : 'Send Enquiry'}
                            </button>

                            <p className="form-footer">We respect your privacy. Your information will not be shared.</p>
                        </form>
                    </div>
                </div>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className="confirmation-overlay" onClick={closeConfirmation}>
                    <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="confirmation-icon">✅</div>
                        <h2>Enquiry Sent Successfully!</h2>
                        <p>Thank you for reaching out to us. Our team will contact you <strong>within 24 hours</strong>.</p>
                        <div className="confirmation-details">
                            <p><strong>📧 Email:</strong> {enquiry.email}</p>
                            <p><strong>📱 Phone:</strong> {enquiry.phone}</p>
                            <p><strong>🏙️ City:</strong> {enquiry.city}</p>
                            <p><strong>🚗 Car:</strong> {car.brand} {car.model}</p>
                        </div>
                        <button className="btn-primary" onClick={closeConfirmation}>
                            Got it! 👍
                        </button>
                        <p className="confirmation-time">⏳ We'll get back to you shortly!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EnquiryPage;