// src/components/user/LoginModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginModal = ({ isOpen, onClose, onSuccess, mode = 'login' }) => {
    const { login, register, verifyOTP } = useAuth();
    const [step, setStep] = useState('credentials');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
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

    const handleResendOTP = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await register(formData);
            if (result.success) {
                const newOTP = result.otp || '123456';
                setBackendOTP(newOTP);
                toast.success('📱 OTP resent successfully!');
                console.log('📱 New OTP:', newOTP);
            } else {
                setError(result.error);
            }
        } catch (error) {
            setError('Failed to resend OTP');
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (currentMode === 'login') {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
                const userRole = currentUser?.role || 'user';
                
                if (userRole === 'seller') {
                    toast.error('❌ This is User Portal. Please use Seller Portal.');
                    setError('You are registered as Seller. Please use Seller Portal.');
                    setLoading(false);
                    return;
                }
                
                if (userRole === 'admin') {
                    toast.error('❌ This is User Portal. Please use Admin Portal.');
                    setError('You are registered as Admin. Please use Admin Portal.');
                    setLoading(false);
                    return;
                }
                
                toast.success('🎉 Login successful!');
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
            const result = await register(formData);
            if (result.success) {
                setStep('otp');
                setShowOTPInput(true);
                const otpFromBackend = result.otp || '123456';
                setBackendOTP(otpFromBackend);
                toast.success('📱 OTP sent to your mobile!');
                console.log('📱 OTP from backend:', otpFromBackend);
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

        const result = await verifyOTP(formData.mobile, otp);
        if (result.success) {
            toast.success('✅ Verified successfully!');
            onClose();
            if (onSuccess) onSuccess();
        } else {
            setError(result.error || 'Invalid OTP. Please try again.');
            toast.error(result.error || 'Invalid OTP. Please try again.');
        }
        setLoading(false);
    };

    const toggleMode = () => {
        setCurrentMode(currentMode === 'login' ? 'register' : 'login');
        setError('');
        setFormData({ ...formData, password: '' });
        setStep('credentials');
        setShowOTPInput(false);
    };

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal login-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>

                {step === 'credentials' ? (
                    <>
                        <div className="modal-header">
                            <div className="modal-icon">👤</div>
                            <h3>{currentMode === 'login' ? 'User Login' : 'User Registration'}</h3>
                            <p>
                                {currentMode === 'login'
                                    ? 'Login to your user account'
                                    : 'Create your user account'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {currentMode === 'register' && (
                                <>
                                    <div className="form-group">
                                        <label>👤 Full Name</label>
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
                                        <label>📱 Mobile Number</label>
                                        <input
                                            type="tel"
                                            name="mobile"
                                            placeholder="Enter mobile number"
                                            value={formData.mobile}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                            <div className="form-group">
                                <label>✉️ Email Address</label>
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
                                <label>🔒 Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
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
                                ? "Don't have an account?"
                                : "Already have an account?"}
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMode(); }}>
                                {currentMode === 'login' ? ' Register' : ' Login'}
                            </a>
                        </p>
                        
                        <p className="portal-hint">🔵 This is User Portal. For Seller, use Seller Portal.</p>
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

export default LoginModal;