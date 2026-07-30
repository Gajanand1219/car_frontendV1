// src/components/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const { login, register, verifyOTP } = useAuth();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState('credentials');
    const [formData, setFormData] = useState({
        name: '',
        email: 'admin@gmail.com',
        mobile: '',
        password: 'admin1234',
        role: 'admin'
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [backendOTP, setBackendOTP] = useState('');

    // src/components/admin/AdminLogin.jsx - handleLogin function मध्ये

const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const result = await login(formData.email, formData.password);

        if (result?.success) {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (currentUser?.role === 'admin' || currentUser?.role === 'RoleEnum.admin') {
                toast.success('🎉 Welcome Admin!');
                navigate('/admin', { replace: true });
            } else if (currentUser?.role === 'seller' || currentUser?.role === 'RoleEnum.seller') {
                toast.error('❌ You are registered as Seller. Please use Seller Portal.');
                setError('You are registered as Seller. Please use Seller Portal.');
                setLoading(false);
                return;
            } else {
                toast.error('❌ You are not authorized as Admin.');
                setError('You are not authorized as Admin.');
                setLoading(false);
                return;
            }
        } else {
            // ✅ Wrong credentials - show error, stay on page
            const errorMsg = result?.error || 'Invalid credentials. Please try again.';
            setError(`❌ ${errorMsg}`);
            toast.error(`❌ ${errorMsg}`);
            setLoading(false);
            // ✅ IMPORTANT: Don't redirect, just stay on page
            return;
        }
    } catch (err) {
        console.error('Login error:', err);
        setError('❌ Something went wrong. Please try again.');
        toast.error('❌ Login failed. Please try again.');
        setLoading(false);
        return;
    }
    setLoading(false);
};

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await register(formData);
            if (result?.success) {
                setStep('otp');
                const otpFromBackend = result.otp || '123456';
                setBackendOTP(otpFromBackend);
                toast.success('📱 OTP sent to your mobile!');
            } else {
                const errorMsg = result?.error || 'Registration failed';
                setError(`❌ ${errorMsg}`);
                toast.error(`❌ ${errorMsg}`);
            }
        } catch (err) {
            console.error('Register error:', err);
            setError('❌ Registration failed. Please try again.');
            toast.error('❌ Registration failed. Please try again.');
        }
        setLoading(false);
    };

    const handleOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await verifyOTP(formData.mobile, otp);
            if (result?.success) {
                toast.success('✅ Admin registered successfully!');
                setIsLogin(true);
                setStep('credentials');
                setOtp('');
                toast.success('Please login with your credentials');
            } else {
                const errorMsg = result?.error || 'Invalid OTP';
                setError(`❌ ${errorMsg}`);
                toast.error(`❌ ${errorMsg}`);
            }
        } catch (err) {
            console.error('OTP error:', err);
            setError('❌ OTP verification failed');
            toast.error('❌ OTP verification failed');
        }
        setLoading(false);
    };

    const handleResendOTP = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await register(formData);
            if (result?.success) {
                const newOTP = result.otp || '123456';
                setBackendOTP(newOTP);
                toast.success('📱 OTP resent successfully!');
            } else {
                const errorMsg = result?.error || 'Failed to resend OTP';
                setError(`❌ ${errorMsg}`);
                toast.error(`❌ ${errorMsg}`);
            }
        } catch (error) {
            setError('❌ Failed to resend OTP');
            toast.error('❌ Failed to resend OTP');
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const switchMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setFormData({ ...formData, password: '' });
        toast.dismiss();
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <span className="admin-login-icon">🚗</span>
                        <h1>{isLogin ? 'Admin Login' : 'Admin Register'}</h1>
                        <p>
                            {isLogin
                                ? 'Enter your credentials to access the admin panel'
                                : 'Create your admin account'}
                        </p>
                    </div>

                    {step === 'otp' ? (
                        <div className="admin-otp-section">
                            <div className="otp-display-box">
                                <div className="otp-label">📨 Your OTP Code</div>
                                <div className="otp-code-display">{backendOTP || '123456'}</div>
                                <p className="otp-hint">Enter this OTP to verify your admin account</p>
                            </div>

                            <form onSubmit={handleOTP}>
                                <input
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    maxLength={6}
                                    className="otp-input"
                                />
                                {error && <div className="error-message">{error}</div>}
                                <button type="submit" className="btn-primary" disabled={loading}>
                                    {loading ? 'Verifying...' : '✅ Verify OTP'}
                                </button>
                            </form>

                            <div className="otp-footer">
                                <p>
                                    Didn't receive OTP?
                                    <span className="resend-link" onClick={handleResendOTP}>
                                        Resend OTP
                                    </span>
                                </p>
                                <p className="back-link" onClick={() => { setStep('credentials'); setOtp(''); }}>
                                    ← Back to Register
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={isLogin ? handleLogin : handleRegister}>
                            {!isLogin && (
                                <>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name *"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        name="mobile"
                                        placeholder="Mobile Number *"
                                        value={formData.mobile}
                                        onChange={handleChange}
                                        required
                                    />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="role-select"
                                        disabled
                                    >
                                        <option value="admin">🛡️ Admin</option>
                                    </select>
                                </>
                            )}

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address *"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password *"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />

                            {error && <div className="error-message">{error}</div>}
                            
                            <button
                                type="submit"
                                className="btn-primary login-btn login-sticker"
                                disabled={loading}
                            >
                                {loading ? (
                                    "⏳ Loading..."
                                ) : (
                                    <>
                                        <span className="login-arrow left">🔥</span>
                                        <span className="login-text">LOGIN NOW</span>
                                        <span className="login-arrow right">👉</span>
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {/* {step !== 'otp' && (
                        <div className="admin-toggle">
                            <p>
                                {isLogin
                                    ? "Don't have an admin account?"
                                    : "Already have an admin account?"}
                                <span className="toggle-link" onClick={switchMode}>
                                    {isLogin ? ' Register as Admin' : ' Login'}
                                </span>
                            </p>
                        </div>
                    )} */}

                    <p className="admin-footer">🔒 Secure Admin Access Only</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;