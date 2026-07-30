// src/components/user/FloatingContact.jsx
import React, { useState, useEffect } from 'react';

const FloatingContact = () => {
    const [visible, setVisible] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    // Auto-hide after 1 minute (60000 ms)
    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 6000000); // 1 minute

        return () => clearTimeout(timer);
    }, []);

    const handleCall = () => {
        window.location.href = 'tel:+918468853896';
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(
            "नमस्कार, मला तुमच्या कारबद्दल माहिती हवी आहे."
        );

        window.open(`https://wa.me/918468853896?text=${message}`, "_blank");
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setVisible(false);
            setIsClosing(false);
        }, 400);
    };

    // Re-show after 5 minutes if closed
    useEffect(() => {
        if (!visible) {
            const timer = setTimeout(() => {
                setVisible(true);
            }, 3000000); // 5 minutes
            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <div className={`floating-contact ${isClosing ? 'closing' : ''}`}>
            {/* Close Button */}
            <button className="floating-close" onClick={handleClose} aria-label="Close">
                <i className="bi bi-x-lg"></i>
            </button>

            {/* WhatsApp Button */}
            <div
                className="floating-btn whatsapp-btn"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={handleWhatsApp}
            >
                <i className="bi bi-whatsapp"></i>
                {showTooltip && (
                    <span className="floating-tooltip">Chat on WhatsApp</span>
                )}
                <span className="floating-badge">1</span>
            </div>

            {/* Call Button */}
            <div
                className="floating-btn call-btn"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={handleCall}
            >
                <i className="bi bi-telephone-fill"></i>
                {showTooltip && (
                    <span className="floating-tooltip">Call Now</span>
                )}
            </div>

            {/* Pulse Animation Ring */}
            <div className="floating-pulse"></div>
        </div>
    );
};

export default FloatingContact;