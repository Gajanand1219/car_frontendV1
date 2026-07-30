// src/components/seller/SellerPortal.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SellerProvider, useSeller } from '../../context/SellerContext';
import SellerDashboard from './SellerDashboard';
import SellerCars from './SellerCars';
import AddSellerCar from './AddSellerCar';
import EditSellerCar from './EditSellerCar';
import SellerProfile from './SellerProfile';
import toast from 'react-hot-toast';
import './SellerPortal.css';
import './SellerDashboard.css';
import API from '../../api/axios';
import SellerLoginModal from './SellerLoginModal';

const SellerPortalContent = () => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const { loading } = useSeller();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    
    // ✅ Check if user is seller
    const isSeller = user?.role === 'seller' || user?.role === 'RoleEnum.seller';
    
    // ✅ Enquiry State
    const [enquiry, setEnquiry] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        city: ''
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ✅ Auto-fill user details if authenticated
    useEffect(() => {
        if (isAuthenticated && user) {
            setEnquiry(prev => ({
                ...prev,
                name: user.name || '',
                email: user.email || '',
                phone: user.mobile || ''
            }));
        }
    }, [isAuthenticated, user]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // ✅ Handle Enquiry Submit
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
            toast.success('Enquiry sent successfully!');
        } catch (error) {
            console.error('Enquiry error:', error);
            toast.error('Failed to send enquiry. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeConfirmation = () => {
        setShowConfirmation(false);
    };

    // ✅ Contact Handlers
    const handleCall = () => {
        window.location.href = 'tel:+918468853896';
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(
            "नमस्कार, मला तुमच्या कारबद्दल माहिती हवी आहे."
        );
        window.open(`https://wa.me/918468853896?text=${message}`, "_blank");
    };

    const handleEmail = () => {
        window.location.href =
            "mailto:akashrathod62872@gmail.com?subject=Car%20Enquiry&body=Hello,%20I%20am%20interested%20in%20your%20car.";
    };

    // ✅ If admin tries to access seller portal, redirect to admin
    if (isAuthenticated && isAdmin) {
        return <Navigate to="/admin" />;
    }

    // ✅ If not authenticated OR authenticated user (not seller) - show login/register page
    // This handles both: without login AND user login
    if (!isAuthenticated || (isAuthenticated && !isSeller)) {
        return (
            <div className="seller-portal">
                {/* ========== HERO SECTION ========== */}
                <section className="seller-hero-section">
                    <div className="seller-hero-overlay"></div>
                    <div className="container">
                        <div className="seller-hero-content">
                            <div className="seller-hero-text">
                                <span className="seller-hero-badge">🚀 Start Selling Today</span>
                                <h1>Turn Your Car into <span className="highlight">Cash</span></h1>
                                <p>
                                    List your car on India's most trusted platform. 
                                    Get the best price with zero hassle. Join thousands of satisfied sellers.
                                </p>
                                <div className="seller-hero-stats">
                                    <div className="hero-stat">
                                        <span className="stat-number">500+</span>
                                        <span className="stat-label">Cars Sold</span>
                                    </div>
                                    <div className="hero-stat">
                                        <span className="stat-number">4.9⭐</span>
                                        <span className="stat-label">Seller Rating</span>
                                    </div>
                                    <div className="hero-stat">
                                        <span className="stat-number">24hrs</span>
                                        <span className="stat-label">Fast Listing</span>
                                    </div>
                                </div>
                                <div className="seller-hero-buttons">
                                    <button onClick={() => setShowRegister(true)} className="btn btn-primary btn-large">
                                        📝 Register & Sell
                                    </button>
                                    <button onClick={() => setShowLogin(true)} className="btn btn-secondary btn-large">
                                        🔐 Login
                                    </button>
                                </div>
                                <div className="seller-hero-note">
                                    <span>✅ Free Listing</span>
                                    <span>📸 Upload Photos</span>
                                    <span>💰 Best Price Guarantee</span>
                                </div>
                            </div>
                            <div className="seller-hero-image">
                                <div className="hero-car-animation">🚗</div>
                                <div className="hero-float-icons">
                                    <span className="float-icon">💰</span>
                                    <span className="float-icon">📸</span>
                                    <span className="float-icon">✅</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== FEATURES SECTION ========== */}
                <section className="seller-features-section">
                    <div className="container">
                        <div className="seller-features-header">
                            <h2>Why Sell With Us?</h2>
                            <p>Everything you need to sell your car quickly and at the best price</p>
                        </div>
                        <div className="seller-features-grid">
                            <div className="seller-feature-card">
                                <div className="feature-icon">📝</div>
                                <h3>Easy Listing</h3>
                                <p>List your car in just 5 minutes with our simple form</p>
                            </div>
                            <div className="seller-feature-card">
                                <div className="feature-icon">📸</div>
                                <h3>Photo Upload</h3>
                                <p>Upload up to 10 high-quality photos of your car</p>
                            </div>
                            <div className="seller-feature-card">
                                <div className="feature-icon">💰</div>
                                <h3>Best Price</h3>
                                <p>Get expert advice on the best price for your car</p>
                            </div>
                            <div className="seller-feature-card">
                                <div className="feature-icon">🤝</div>
                                <h3>Full Support</h3>
                                <p>Our team helps you throughout the selling process</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== HOW IT WORKS ========== */}
                <section className="seller-how-section">
                    <div className="container">
                        <h2>How It Works</h2>
                        <div className="seller-steps">
                            <div className="step">
                                <div className="step-number">1</div>
                                <div className="step-icon">📝</div>
                                <h3>Register</h3>
                                <p>Create your seller account</p>
                            </div>
                            <div className="step-arrow">→</div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <div className="step-icon">🚗</div>
                                <h3>List Car</h3>
                                <p>Add car details & photos</p>
                            </div>
                            <div className="step-arrow">→</div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <div className="step-icon">✅</div>
                                <h3>Approval</h3>
                                <p>Admin reviews your listing</p>
                            </div>
                            <div className="step-arrow">→</div>
                            <div className="step">
                                <div className="step-number">4</div>
                                <div className="step-icon">💰</div>
                                <h3>Sell</h3>
                                <p>Get buyers & close deal</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== CONTACT & ENQUIRY SECTION ========== */}
                <section className="seller-contact-section">
                    <div className="container">
                        <div className="seller-contact-header">
                            <h2>📞 Get in Touch</h2>
                            <p>Have questions about selling? We're here to help!</p>
                        </div>

                        <div className="seller-contact-wrapper">
                            <div className="seller-contact-cards">
                                <div className="contact-card call" onClick={handleCall}>
                                    <div className="contact-card-icon">📞</div>
                                    <h4>Call Us</h4>
                                    <p>+91 8468853896</p>
                                    <span className="contact-card-action">Click to Call →</span>
                                </div>

                                <div className="contact-card whatsapp" onClick={handleWhatsApp}>
                                    <div className="contact-card-icon"><i className="bi bi-whatsapp"></i></div>
                                    <h4>WhatsApp</h4>
                                    <p>+91 8468853896</p>
                                    <span className="contact-card-action">Chat Now →</span>
                                </div>

                                <div className="contact-card email" onClick={handleEmail}>
                                    <div className="contact-card-icon">✉️</div>
                                    <h4>Email Us</h4>
                                    <p>akashrathod62872@gmail.com</p>
                                    <span className="contact-card-action">Send Email →</span>
                                </div>
                            </div>

                            <div className="seller-enquiry-form">
                                <h3>✉️ Send Enquiry</h3>
                                <p>Fill in the details and we'll get back to you</p>
                                
                                <form onSubmit={handleEnquiry}>
                                    <div className="form-group">
                                        <label>👤 Full Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Enter your full name"
                                            value={enquiry.name}
                                            onChange={(e) => setEnquiry({ ...enquiry, name: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>📧 Email Address *</label>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={enquiry.email}
                                            onChange={(e) => setEnquiry({ ...enquiry, email: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>📱 Phone Number *</label>
                                        <input
                                            type="tel"
                                            placeholder="Enter your phone number"
                                            value={enquiry.phone}
                                            onChange={(e) => setEnquiry({ ...enquiry, phone: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>🏙️ Select City *</label>
                                        <select
                                            value={enquiry.city}
                                            onChange={(e) => setEnquiry({ ...enquiry, city: e.target.value })}
                                            required
                                        >
                                            <option value="">-- Select City --</option>
                                            <option value="Parabhi">Parabhi</option>
                                            <option value="Nanded">Nanded</option>
                                            <option value="Hingoli">Hingoli</option>
                                            <option value="Basmath">Basmath</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>💬 Your Message *</label>
                                        <textarea
                                            placeholder="Tell us about your requirements..."
                                            value={enquiry.message}
                                            onChange={(e) => setEnquiry({ ...enquiry, message: e.target.value })}
                                            rows="4"
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="btn-submit-enquiry" disabled={isSubmitting}>
                                        <i className="bi bi-send-fill"></i>
                                        {isSubmitting ? 'Sending...' : 'Send Enquiry'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== CTA SECTION ========== */}
                <section className="seller-cta-section">
                    <div className="container">
                        <div className="seller-cta-card">
                            <h2>Ready to Sell Your Car?</h2>
                            <p>Join thousands of sellers who have successfully sold their cars on our platform</p>
                            <button onClick={() => setShowRegister(true)} className="btn btn-primary btn-large">
                                🚀 Start Selling Now
                            </button>
                            <div className="cta-trust">
                                <span>🔒 Secure Platform</span>
                                <span>⭐ Trusted by 500+ Sellers</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ========== FOOTER ========== */}
                <footer className="seller-footer">
                    <div className="container">
                        <div className="footer-grid">
                            <div className="footer-brand">
                                <h4>🚗 Garud Property & Auto Consultancy</h4>
                                <p>India's leading platform for buying and selling used cars. Quality guaranteed with complete transparency.</p>
                                <div className="footer-contact">
                                    <p><span>📞</span> +91 8468853896</p>
                                    <p><span>✉️</span> akashrathod62872@gmail.com</p>
                                    <p><span>📍</span> Nanded, Maharashtra, India</p>
                                </div>
                            </div>
                            <div className="footer-links">
                                <h4>Quick Links</h4>
                                <ul>
                                    <li><Link to="/">Home</Link></li>
                                    <li><Link to="/cars">Cars</Link></li>
                                    <li><Link to="/seller">Sell Car</Link></li>
                                </ul>
                            </div>
                            <div className="footer-links">
                                <h4>Top Brands</h4>
                                <ul>
                                    <li><Link to="/cars">Toyota</Link></li>
                                    <li><Link to="/cars">Honda</Link></li>
                                    <li><Link to="/cars">Hyundai</Link></li>
                                </ul>
                            </div>
                            <div className="footer-social">
                                <h4>Follow Us</h4>
                                <p>Stay connected with us on social media</p>
                                <div className="social-links">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                                        <i className="bi bi-facebook"></i>
                                    </a>
                                    <a href="https://www.instagram.com/r__akash__24/" target="_blank" className="social-icon">
                                        <i className="bi bi-instagram"></i>
                                    </a>
                                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                                        <i className="bi bi-twitter-x"></i>
                                    </a>
                                </div>
                                <div className="footer-legal-links">
                                    <Link to="/privacy-policy">Privacy Policy</Link>
                                    <span>•</span>
                                    <Link to="/terms-conditions">Terms & Conditions</Link>
                                    <span>•</span>
                                    <Link to="/disclaimer">Disclaimer</Link>
                                    <span>•</span>
                                    <Link to="/copyright">Copyright</Link>
                                </div>
                                <div className="footer-github">
                                    <a href="https://garudproperties.dpdns.org/" target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-globe"></i> Garud Properties
                                    </a>
                                    <span>•</span>
                                    <a href="https://garudgroup.vercel.app/" target="_blank" rel="noopener noreferrer">
                                        <i className="bi bi-globe"></i> Garud Group
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="footer-bottom">
                            <p>
                                © {new Date().getFullYear()} Garud Property & Auto Consultancy. All rights reserved. | 
                                Created by{" "}
                                <span className="tooltip">
                                    <a
                                        href="https://portfolio-w98d.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="creator-link"
                                    >
                                        Gajanan Deshmukh
                                    </a>
                                    <span className="tooltip-text">
                                        👋 See Gajanan's Portfolio
                                    </span>
                                </span>
                            </p>
                        </div>
                    </div>
                </footer>

                {/* ========== MODALS ========== */}
                <SellerLoginModal
                    isOpen={showLogin}
                    onClose={() => setShowLogin(false)}
                    mode="login"
                />
                <SellerLoginModal
                    isOpen={showRegister}
                    onClose={() => setShowRegister(false)}
                    mode="register"
                />

                {/* ========== CONFIRMATION POPUP ========== */}
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
                            </div>
                            <button className="btn-primary" onClick={closeConfirmation}>
                                Got it! 👍
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ✅ Authenticated seller - show full portal
    if (loading) {
        return (
            <div className="seller-portal">
                <div className="loading">Loading your dashboard...</div>
            </div>
        );
    }

    // ✅ Only sellers can see the dashboard
    return (
        <div className="seller-portal">
            <header className="seller-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/seller" className="logo">
                            <span className="logo-icon">🏪</span>
                            <span className="logo-text">Seller Dashboard</span>
                        </Link>

                        <nav className="nav-links">
                            <Link to="/seller" className="nav-link">📊 Dashboard</Link>
                            <Link to="/seller/cars" className="nav-link">🚗 My Cars</Link>
                            <Link to="/seller/add" className="nav-link">➕ Add Car</Link>
                            <Link to="/seller/profile" className="nav-link">👤 Profile</Link>
                            <button onClick={handleLogout} className="btn-logout">🚪 Logout</button>
                        </nav>

                        <button
                            className="menu-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>

                    <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                        <Link to="/seller" className="nav-link" onClick={() => setMobileMenuOpen(false)}>📊 Dashboard</Link>
                        <Link to="/seller/cars" className="nav-link" onClick={() => setMobileMenuOpen(false)}>🚗 My Cars</Link>
                        <Link to="/seller/add" className="nav-link" onClick={() => setMobileMenuOpen(false)}>➕ Add Car</Link>
                        <Link to="/seller/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>👤 Profile</Link>
                        <button onClick={handleLogout} className="btn-logout" style={{ width: '100%', textAlign: 'center' }}>🚪 Logout</button>
                    </div>
                </div>
            </header>

            <main className="seller-main">
                <div className="container">
                    <Routes>
                        <Route path="/" element={<SellerDashboard />} />
                        <Route path="/cars" element={<SellerCars />} />
                        <Route path="/add" element={<AddSellerCar />} />
                        <Route path="/edit/:id" element={<EditSellerCar />} />
                        <Route path="/profile" element={<SellerProfile />} />
                    </Routes>
                </div>
            </main>

            <footer className="seller-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h4>🚗 Garud Property & Auto Consultancy</h4>
                            <p>India's leading platform for buying and selling used cars. Quality guaranteed with complete transparency.</p>
                            <div className="footer-contact">
                                <p><span>📞</span> +91 8468853896</p>
                                <p><span>✉️</span> akashrathod62872@gmail.com</p>
                                <p><span>📍</span> Nanded, Maharashtra, India</p>
                            </div>
                        </div>
                        <div className="footer-links">
                            <h4>Quick Links</h4>
                            <ul>
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/cars">Cars</Link></li>
                                <li><Link to="/seller">Sell Car</Link></li>
                            </ul>
                        </div>
                        <div className="footer-links">
                            <h4>Top Brands</h4>
                            <ul>
                                <li><Link to="/cars">Toyota</Link></li>
                                <li><Link to="/cars">Honda</Link></li>
                                <li><Link to="/cars">Hyundai</Link></li>
                            </ul>
                        </div>
                        <div className="footer-social">
                            <h4>Follow Us</h4>
                            <p>Stay connected with us on social media</p>
                            <div className="social-links">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                                    <i className="bi bi-facebook"></i>
                                </a>
                                <a href="https://www.instagram.com/r__akash__24/" target="_blank" className="social-icon">
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                                    <i className="bi bi-twitter-x"></i>
                                </a>
                            </div>
                            <div className="footer-legal-links">
                                <Link to="/privacy-policy">Privacy Policy</Link>
                                <span>•</span>
                                <Link to="/terms-conditions">Terms & Conditions</Link>
                                <span>•</span>
                                <Link to="/disclaimer">Disclaimer</Link>
                                <span>•</span>
                                <Link to="/copyright">Copyright</Link>
                            </div>
                            <div className="footer-github">
                                <a href="https://garudproperties.dpdns.org/" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-globe"></i> Garud Properties
                                </a>
                                <span>•</span>
                                <a href="https://garudgroup.vercel.app/" target="_blank" rel="noopener noreferrer">
                                    <i className="bi bi-globe"></i> Garud Group
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>
                            © {new Date().getFullYear()} Garud Property & Auto Consultancy. All rights reserved. | 
                            Created by{" "}
                            <span className="tooltip">
                                <a
                                    href="https://portfolio-w98d.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="creator-link"
                                >
                                    Gajanan Deshmukh
                                </a>
                                <span className="tooltip-text">
                                    👋 See Gajanan's Portfolio
                                </span>
                            </span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const SellerPortal = () => {
    return (
        <SellerProvider>
            <SellerPortalContent />
        </SellerProvider>
    );
};

export default SellerPortal;