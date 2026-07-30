// src/pages/Copyright.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

const Copyright = () => {
    return (
        <div className="legal-page">
            <div className="container">
                <div className="legal-content">
                    <h1>© Copyright Notice</h1>
                    <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

                    <div className="legal-section">
                        <h2>Copyright Ownership</h2>
                        <p>All content on this website, including text, graphics, logos, images, software, and design, is the property of Garud Property & Auto Consultancy and is protected by Indian and international copyright laws.</p>
                    </div>

                    <div className="legal-section">
                        <h2>What is Protected</h2>
                        <ul>
                            <li><strong>Text Content:</strong> All written content, articles, descriptions, and information</li>
                            <li><strong>Visual Content:</strong> Images, graphics, logos, and design elements</li>
                            <li><strong>Code:</strong> HTML, CSS, JavaScript, and other code</li>
                            <li><strong>Layout:</strong> The overall design and structure of the website</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>Authorized Use</h2>
                        <p>You may:</p>
                        <ul>
                            <li>View and access the content for personal use</li>
                            <li>Share links to our content</li>
                            <li>Use the content for informational purposes with proper attribution</li>
                        </ul>
                        <p>You may not:</p>
                        <ul>
                            <li>Copy, reproduce, or distribute content without permission</li>
                            <li>Modify or create derivative works</li>
                            <li>Use content for commercial purposes without authorization</li>
                            <li>Remove copyright notices</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>Third-Party Content</h2>
                        <ul>
                            <li>Some content may belong to third parties</li>
                            <li>We respect the intellectual property rights of others</li>
                            <li>If you believe your work has been used without permission, please contact us</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>Content Submission</h2>
                        <ul>
                            <li>Any content you submit to our website remains your property</li>
                            <li>By submitting, you grant us a non-exclusive license to use, display, and distribute it</li>
                            <li>You represent that you have the right to submit the content</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>Reporting Infringement</h2>
                        <p>If you believe your copyrighted work has been infringed, please contact us with:</p>
                        <ul>
                            <li>Identification of the copyrighted work</li>
                            <li>Identification of the infringing material</li>
                            <li>Your contact information</li>
                            <li>A statement of good faith belief</li>
                            <li>Your signature</li>
                        </ul>
                    </div>

                    <div className="legal-section">
                        <h2>Contact Information</h2>
                        <p>For copyright matters, please contact:</p>
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

export default Copyright;