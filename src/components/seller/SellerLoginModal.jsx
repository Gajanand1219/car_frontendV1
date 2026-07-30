// src/components/seller/SellerLoginModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SellerLoginModal = ({ isOpen, onClose, onSuccess, mode = 'login' }) => {
    const { sellerLogin, sellerRegister, sellerVerifyOTP } = useAuth();
    
    const [step, setStep] = useState('credentials');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        business_name: '',
        gst_number: '',
        address: ''
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [backendOTP, setBackendOTP] = useState('');
    const [currentMode, setCurrentMode] = useState(mode);
    const [showOTPInput, setShowOTPInput] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (currentMode === 'login') {
            const result = await sellerLogin(formData.email, formData.password);
            if (result.success) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                const userRole = currentUser?.role || 'user';
                
                if (userRole === 'admin') {
                    toast.error('❌ This is Seller Portal. Please use Admin Portal.');
                    setError('You are registered as Admin. Please use Admin Portal.');
                    setLoading(false);
                    return;
                }
                
                if (userRole === 'user') {
                    toast.error('❌ This is Seller Portal. Please use User Portal.');
                    setError('You are registered as User. Please use User Portal.');
                    setLoading(false);
                    return;
                }
                
                toast.success('🎉 Seller Login successful!');
                onClose();
                if (onSuccess) onSuccess();
            } else {
                const errorMsg = result.error || 'Invalid email or password. Please try again.';
                setError(errorMsg);
                toast.error(errorMsg);
                setLoading(false);
            }
        } else {
            // ✅ FIX: Register logic - was missing
            const result = await sellerRegister({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
                business_name: formData.business_name,
                gst_number: formData.gst_number,
                address: formData.address
            });
            if (result.success) {
                setStep('otp');
                setShowOTPInput(true);
                const otpFromBackend = result.otp || '123456';
                setBackendOTP(otpFromBackend);
                toast.success('📱 OTP sent to your mobile!');
                console.log('✅ Seller registered, OTP:', otpFromBackend);
            } else {
                setError(result.error || 'Registration failed');
                toast.error(result.error || 'Registration failed');
            }
        }
        setLoading(false);
    };

    const handleOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await sellerVerifyOTP(formData.mobile, otp);
        if (result.success) {
            toast.success('✅ Seller verified successfully!');
            onClose();
            if (onSuccess) onSuccess();
        } else {
            setError(result.error || 'Invalid OTP. Please try again.');
            toast.error(result.error || 'Invalid OTP. Please try again.');
        }
        setLoading(false);
    };

    const handleResendOTP = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await sellerRegister({
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                password: formData.password,
                business_name: formData.business_name,
                gst_number: formData.gst_number,
                address: formData.address
            });
            if (result.success) {
                const newOTP = result.otp || '123456';
                setBackendOTP(newOTP);
                toast.success('📱 OTP resent successfully!');
                console.log('📱 New OTP:', newOTP);
            } else {
                setError(result.error || 'Failed to resend OTP');
                toast.error(result.error || 'Failed to resend OTP');
            }
        } catch (error) {
            setError('Failed to resend OTP');
            toast.error('Failed to resend OTP');
        }
        setLoading(false);
    };

    const toggleMode = () => {
        setCurrentMode(currentMode === 'login' ? 'register' : 'login');
        setError('');
        setFormData({ ...formData, password: '' });
        setStep('credentials');
        setShowOTPInput(false);
        setOtp('');
    };

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal login-modal seller-login-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                {step === 'credentials' ? (
                    <>
                        <div className="modal-header">
                            <div className="modal-icon">🏪</div>
                            <h3>{currentMode === 'login' ? 'Seller Login' : 'Seller Registration'}</h3>
                            <p>
                                {currentMode === 'login'
                                    ? 'Login to your seller account'
                                    : 'Create your seller account'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {currentMode === 'register' && (
                                <>
                                    <div className="form-group">
                                        <label>👤 Full Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>📱 Mobile Number *</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="Enter mobile number"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>🏢 Business Name</label>
                                        <input
                                            type="text"
                                            name="business_name"
                                            placeholder="Enter business name (optional)"
                                            value={formData.business_name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>📋 GST Number</label>
                                        <input
                                            type="text"
                                            name="gst_number"
                                            placeholder="Enter GST number (optional)"
                                            value={formData.gst_number}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>📍 Address</label>
                                        <textarea
                                            name="address"
                                            placeholder="Enter your address (optional)"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="2"
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>✉️ Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>🔒 Password *</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password (min 6 characters)"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    minLength={6}
                                />
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <button type="submit" className="btn-primary btn-submit" disabled={loading}>
                                {loading ? (
                                    <span className="spinner">⏳</span>
                                ) : (
                                    currentMode === 'login' ? '🔐 Login' : '📝 Register'
                                )}
                            </button>
                        </form>

                        <p className="auth-switch">
                            {currentMode === 'login'
                                ? "Don't have a seller account?"
                                : "Already have a seller account?"}
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>
                                {currentMode === 'login' ? ' Register' : ' Login'}
                            </a>
                        </p>
                        
                        <p className="portal-hint">🟢 This is Seller Portal. For User, use User Portal.</p>
                    </>
                ) : (
                    <>
                        <div className="modal-header">
                            <div className="modal-icon">📱</div>
                            <h3>Verify OTP</h3>
                            <p>We sent a verification code to <strong>{formData.mobile}</strong></p>
                        </div>

                        <div className="otp-display-box">
                            <div className="otp-label">📨 Your OTP Code</div>
                            <div className="otp-code-display">{backendOTP || '123456'}</div>
                            <p className="otp-hint">Enter this OTP to verify your account</p>
                        </div>

                        <form onSubmit={handleOTP}>
                            <div className="form-group">
                                <label>Enter OTP</label>
                                <div className="otp-input-group">
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                        maxLength={6}
                                        className="otp-input"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <button type="submit" className="btn-primary btn-submit" disabled={loading}>
                                {loading ? <span className="spinner">⏳</span> : '✅ Verify OTP'}
                            </button>
                        </form>

                        <div className="otp-footer">
                            <p>
                                Didn't receive OTP?
                                <a href="#" onClick={(e) => { e.preventDefault(); handleResendOTP(); }}>
                                    Resend OTP
                                </a>
                            </p>
                            <p className="otp-back" onClick={() => { 
                                setStep('credentials'); 
                                setShowOTPInput(false);
                                setOtp('');
                            }}>
                                ← Back
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerLoginModal;