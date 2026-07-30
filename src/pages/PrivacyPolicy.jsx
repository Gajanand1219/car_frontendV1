// src/pages/PrivacyPolicy.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

const PrivacyPolicy = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-content">
                    <h1>🔒 Privacy Policy</h1>
                    <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="legal-section">
                        <h2>1. Information We Collect</h2>
                        <p>At Garud Property & Auto Consultancy, we collect information to provide better services to our customers. We collect:</p>
                        <ul>
                            <li><strong>Personal Information:</strong> Name, email address, phone number, and address</li>
                            <li><strong>Vehicle Information:</strong> Details about cars you view, enquire about, or purchase</li>
                            <li><strong>Usage Data:</strong> How you interact with our website and services</li>
                            <li><strong>Cookies:</strong> We use cookies to improve your browsing experience</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>2. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul>
                            <li>Process your enquiries and orders</li>
                            <li>Provide customer support and respond to your queries</li>
                            <li>Send you updates about new cars and offers</li>
                            <li>Improve our website and services</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>3. Information Sharing</h2>
                        <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> Third-party vendors who help us operate our business</li>
                            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>4. Data Security</h2>
                        <p>We implement appropriate security measures to protect your personal information. This includes:</p>
                        <ul>
                            <li>Secure SSL encryption for data transmission</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited access to personal data by authorized personnel</li>
                            <li>Secure storage of sensitive information</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access your personal information</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your information</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent at any time</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>6. Cookies</h2>
                        <p>We use cookies to enhance your experience. You can control cookie preferences in your browser settings. Essential cookies are used for:</p>
                        <ul>
                            <li>Authentication and security</li>
                            <li>Remembering your preferences</li>
                            <li>Analytics to improve our services</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>7. Children's Privacy</h2>
                        <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children.</p>
                    </div>

                    <div className="legal-section">
                        <h2>8. Changes to Privacy Policy</h2>
                        <p>We may update this policy periodically. We will notify you of any changes by posting the new policy on this page.</p>
                    </div>

                    <div className="legal-section">
                        <h2>9. Contact Us</h2>
                        <p>If you have questions about this Privacy Policy, please contact us:</p>
                        <ul>
                            <li><strong>Email:</strong> akashrathod62872@gmail.com</li>
                            <li><strong>Phone:</strong> +91 8468853896</li>
                            <li><strong>Address:</strong> Nanded, Maharashtra, India</li>
                        </ul>
                    </div>

                    <div className="legal-footer">
                        <Link to="/" className="back-btn">← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;