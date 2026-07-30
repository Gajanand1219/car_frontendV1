// src/components/user/UserPortal.jsx
import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HomePage from './HomePage';
import CarsPage from './CarsPage';
import CarDetailPage from './CarDetailPage';
import ProfilePage from './ProfilePage';
import LoginModal from './LoginModal';
import FloatingContact from './FloatingContact';
import EnquiryPage from './EnquiryPage';
// ✅ Import Legal Pages
import PrivacyPolicy from '../../pages/PrivacyPolicy';
import TermsConditions from '../../pages/TermsConditions';
import Disclaimer from '../../pages/Disclaimer';
import Copyright from '../../pages/Copyright';

const UserPortal = () => {
    // ✅ Remove isSeller from destructuring - useAuth मधून काढा
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // ✅ Check if user is seller - हा एकदाच declare करा
    const isSeller = user?.role === 'seller' || user?.role === 'RoleEnum.seller';

    console.log('👤 UserPortal - isAdmin:', isAdmin);
    console.log('👤 UserPortal - isSeller:', isSeller);
    console.log('👤 UserPortal - user:', user);

    // ✅ If admin, redirect to admin portal
    if (isAuthenticated && isAdmin) {
        return <Navigate to="/admin" />;
    }

    // ✅ If seller, redirect to seller portal
    if (isAuthenticated && isSeller) {
        return <Navigate to="/seller" />;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
        setMobileMenuOpen(false);
    };

    const handleNavClick = () => {
        setMobileMenuOpen(false);
    };

    return (
        <div className="user-portal">
            {/* ========== HEADER ========== */}
            <header className="user-header">
                <div className="container">
                    <div className="header-content">
                        <Link to="/" className="logo" onClick={handleNavClick}>
                            <span className="logo-icon">🚗</span>
                            <span className="logo-text">Garud Property & Auto Consultancy</span>
                        </Link>

                        <nav className="nav-links">
                            <Link to="/" className="nav-link" style={{ color: "black" }}>
                                🏠 Home
                            </Link>
                            
                            {/* ✅ Cars Dropdown with New/Old options */}
                            <div className="nav-dropdown">
                                <span className="nav-link dropdown-trigger" style={{ color: "black" }}>🚗 Cars ▼</span>
                                <div className="dropdown-content">
                                    <Link to="/cars" className="dropdown-item" onClick={handleNavClick}>🚗 All Cars</Link>
                                    <Link to="/cars?filter=new" className="dropdown-item" onClick={handleNavClick}>✨ New Cars</Link>
                                    <Link to="/cars?filter=old" className="dropdown-item" onClick={handleNavClick}>🔄 Old Cars</Link>
                                </div>
                            </div>

                            {/* ✅ SELL CAR - Always visible (without login also) */}
                            <Link to="/seller" className="nav-link sell-car-link" style={{ color: "black" }}>🏪 Sell Car</Link>

                            {isAuthenticated ? (
                                <>
                                    <Link to="/profile" className="nav-link" style={{ color: "black" }}>👤 Profile</Link>
                                    <button onClick={handleLogout} className="btn-logout">Logout</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setShowLogin(true)} className="btn-login">Login</button>
                                    <button onClick={() => setShowRegister(true)} className="btn-register">Register</button>
                                </>
                            )}
                        </nav>

                        <button
                            className="menu-toggle"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? '✕' : '☰'}
                        </button>
                    </div>

                    {/* ✅ Mobile Menu */}
                    <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                        <Link to="/" className="nav-link" onClick={handleNavClick}>🏠 Home</Link>
                        
                        {/* ✅ Mobile Cars Section with New/Old */}
                        <div className="mobile-cars-section">
                            <span className="nav-link mobile-label">🚗 Cars</span>
                            <Link to="/cars" className="nav-link mobile-sub" onClick={handleNavClick}>🚗 All Cars</Link>
                            <Link to="/cars?filter=new" className="nav-link mobile-sub" onClick={handleNavClick}>
                                ✨ New Cars
                            </Link>
                            <Link to="/cars?filter=old" className="nav-link mobile-sub" onClick={handleNavClick}>
                                🔄 Old Cars
                            </Link>
                        </div>

                        {/* ✅ SELL CAR - Always visible in mobile menu */}
                        <Link to="/seller" className="nav-link" onClick={handleNavClick}>🏪 Sell Car</Link>

                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="nav-link" onClick={handleNavClick}>👤 Profile</Link>
                                <button onClick={handleLogout} className="btn-logout" style={{ width: '100%', textAlign: 'center' }}>
                                    🚪 Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => { setShowLogin(true); setMobileMenuOpen(false); }} className="btn-login" style={{ width: '100%', textAlign: 'center' }}>
                                    🔐 Login
                                </button>
                                <button onClick={() => { setShowRegister(true); setMobileMenuOpen(false); }} className="btn-register" style={{ width: '100%', textAlign: 'center' }}>
                                    📝 Register
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* ========== MAIN CONTENT ========== */}
            <main className="user-main">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/cars" element={<CarsPage />} />
                    <Route path="/cars/:id" element={<CarDetailPage />} />
                    <Route path="/enquiry/:id" element={<EnquiryPage />} />
                    <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />} />
                    {/* ✅ Legal Pages Routes */}
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-conditions" element={<TermsConditions />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/copyright" element={<Copyright />} />
                </Routes>
            </main>

            {/* ========== FOOTER ========== */}
            <footer className="user-footer">
                <div className="container">
                    <div className="footer-grid">
                        <div className="footer-brand">
                            <h4>🚗 गरुड प्रॉपर्टी अँड ऑटो कन्सल्टन्सी</h4>
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

            {/* ========== LOGIN/REGISTER MODAL ========== */}
            <LoginModal
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                mode="login"
            />
            <LoginModal
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                mode="register"
            />

            {/* ========== FLOATING CONTACT BUTTONS ========== */}
            <FloatingContact />
        </div>
    );
};

export default UserPortal;