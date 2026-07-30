// src/pages/Disclaimer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

const Disclaimer = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-content">
                    <h1>⚠️ Disclaimer</h1>
                    <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="legal-section">
                        <h2>General Information</h2>
                        <p>The information provided on Garud Property & Auto Consultancy's website is for general informational purposes only. While we strive to keep the information accurate and up to date, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information, products, services, or related graphics contained on the website.</p>
                    </div>

                    <div className="legal-section">
                        <h2>Vehicle Listings</h2>
                        <ul>
                            <li><strong>Accuracy:</strong> We do not guarantee the accuracy of vehicle listings. Specifications, prices, and availability may change without notice.</li>
                            <li><strong>Condition:</strong> We are not responsible for the condition of vehicles listed on our platform. We recommend independent inspection before purchase.</li>
                            <li><strong>Prices:</strong> Prices are indicative and subject to change. Final prices are as agreed between buyer and seller.</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>Third-Party Links</h2>
                        <p>Our website may contain links to third-party websites. These links are provided for convenience and do not imply endorsement. We have no control over the content of linked websites and are not responsible for them.</p>
                    </div>

                    <div className="legal-section">
                        <h2>Professional Advice</h2>
                        <ul>
                            <li>The content on this website is not intended as professional advice</li>
                            <li>You should consult with qualified professionals for specific advice</li>
                            <li>We are not liable for any decisions made based on information from this site</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>Limitations of Liability</h2>
                        <ul>
                            <li>We are not liable for any loss or damage arising from use of this website</li>
                            <li>We do not guarantee uninterrupted or error-free service</li>
                            <li>Your use of the website is at your own risk</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>Transactions</h2>
                        <ul>
                            <li>We facilitate connections between buyers and sellers but are not a party to transactions</li>
                            <li>We do not guarantee the performance of sellers or the quality of vehicles</li>
                            <li>All transactions are between the buyer and seller</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>Changes to Disclaimer</h2>
                        <p>We may update this disclaimer at any time. Please check this page periodically for changes.</p>
                    </div>

                    <div className="legal-section">
                        <h2>Contact</h2>
                        <p>If you have questions about this disclaimer, please contact us at:</p>
                        <ul>
                            <li><strong>Email:</strong> akashrathod62872@gmail.com</li>
                            <li><strong>Phone:</strong> +91 8468853896</li>
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

export default Disclaimer;