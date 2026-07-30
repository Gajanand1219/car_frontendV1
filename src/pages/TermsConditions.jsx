// src/pages/TermsConditions.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

const TermsConditions = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-content">
                    <h1>📋 Terms & Conditions</h1>
                    <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="legal-section">
                        <h2>1. Acceptance of Terms</h2>
                        <p>By using Garud Property & Auto Consultancy's website and services, you agree to these terms and conditions. If you do not agree, please do not use our services.</p>
                    </div>

                    <div className="legal-section">
                        <h2>2. Services Description</h2>
                        <p>Garud Property & Auto Consultancy provides:</p>
                        <ul>
                            <li>Car buying and selling platform</li>
                            <li>Vehicle verification and inspection</li>
                            <li>Property consultancy services</li>
                            <li>Dealer connections and support</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>3. User Accounts</h2>
                        <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to:</p>
                        <ul>
                            <li>Provide accurate and complete information</li>
                            <li>Keep your login credentials secure</li>
                            <li>Notify us immediately of unauthorized use</li>
                            <li>Be responsible for all activities under your account</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>4. Listing and Transactions</h2>
                        <ul>
                            <li>All car listings must be accurate and truthful</li>
                            <li>We reserve the right to remove any listing that violates our policies</li>
                            <li>Transactions are between buyers and sellers; we facilitate but are not a party to the transaction</li>
                            <li>Prices and availability are subject to change</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>5. Payments</h2>
                        <ul>
                            <li>All payments are processed securely through trusted payment gateways</li>
                            <li>We do not store your payment information</li>
                            <li>Refunds are processed according to our refund policy</li>
                            <li>You agree to pay all fees and charges associated with your transactions</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>6. Intellectual Property</h2>
                        <ul>
                            <li>All content on this website is our property or licensed to us</li>
                            <li>You may not copy, reproduce, or distribute our content without permission</li>
                            <li>Logos, trademarks, and service marks belong to their respective owners</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>7. User Conduct</h2>
                        <p>You agree not to:</p>
                        <ul>
                            <li>Engage in fraudulent or deceptive activities</li>
                            <li>Post false or misleading information</li>
                            <li>Harass or abuse other users</li>
                            <li>Use the platform for illegal purposes</li>
                            <li>Attempt to gain unauthorized access to our systems</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>8. Disclaimer of Warranties</h2>
                        <ul>
                            <li>We provide our services "as is" without warranties of any kind</li>
                            <li>We do not guarantee the accuracy of listings</li>
                            <li>We are not responsible for transactions between users</li>
                            <li>Vehicle condition and specifications are the responsibility of sellers</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>9. Limitation of Liability</h2>
                        <p>We shall not be liable for:</p>
                        <ul>
                            <li>Direct, indirect, or consequential damages</li>
                            <li>Loss of profits or data</li>
                            <li>Any damages arising from use of our services</li>
                            <li>Third-party content or services</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>10. Termination</h2>
                        <p>We may terminate or suspend your account at our discretion, without prior notice, for conduct that violates these terms.</p>
                    </div>

                    <div className="legal-section">
                        <h2>11. Governing Law</h2>
                        <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of Nanded, Maharashtra.</p>
                    </div>

                    <div className="legal-section">
                        <h2>12. Changes to Terms</h2>
                        <p>We may update these terms periodically. Continued use constitutes acceptance of the updated terms.</p>
                    </div>

                    <div className="legal-footer">
                        <Link to="/" className="back-btn">← Back to Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;