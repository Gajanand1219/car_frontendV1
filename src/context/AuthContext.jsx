// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const role = currentUser?.role || 'user';
            setUserRole(role);
            
            // ✅ Different endpoints for different roles
            let response;
            if (role === 'seller') {
                // ✅ Seller profile fetch
                response = await API.get('/seller/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data) {
                    const userData = response.data;
                    // ✅ Set role as 'seller'
                    setUser({ ...userData, role: 'seller' });
                    localStorage.setItem('currentUser', JSON.stringify({ ...userData, role: 'seller' }));
                    console.log('✅ Seller loaded:', userData);
                }
            } else {
                // ✅ User profile fetch
                response = await API.get('/auth/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.data) {
                    const userData = response.data;
                    setUser(userData);
                    localStorage.setItem('currentUser', JSON.stringify({ ...userData, role: 'user' }));
                    console.log('✅ User loaded:', userData);
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // ✅ User Login
    const login = async (email, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await API.post('/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            if (response.data) {
                const { access_token, refresh_token } = response.data;
                setToken(access_token);
                localStorage.setItem('authToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);
                localStorage.setItem('currentUser', JSON.stringify({ role: 'user' }));

                const profileRes = await API.get('/auth/profile', {
                    headers: { 'Authorization': `Bearer ${access_token}` }
                });

                if (profileRes.data) {
                    let userData = profileRes.data;
                    setUser(userData);
                    localStorage.setItem('currentUser', JSON.stringify({ ...userData, role: 'user' }));
                    console.log('✅ User Login successful:', userData);
                }
                return { success: true, role: 'user' };
            }
        } catch (error) {
            console.error('❌ User Login error:', error);
            return {
                success: false,
                error: error.response?.data?.detail || 'Invalid credentials'
            };
        }
    };

    // ✅ Seller Login
    const sellerLogin = async (email, password) => {
        try {
            const formData = new URLSearchParams();
            formData.append('username', email);
            formData.append('password', password);

            const response = await API.post('/seller/auth/login', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            if (response.data) {
                const { access_token, refresh_token } = response.data;
                setToken(access_token);
                localStorage.setItem('authToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);
                localStorage.setItem('currentUser', JSON.stringify({ role: 'seller' }));

                const profileRes = await API.get('/seller/auth/profile', {
                    headers: { 'Authorization': `Bearer ${access_token}` }
                });

                if (profileRes.data) {
                    let userData = profileRes.data;
                    // ✅ Set role as 'seller'
                    setUser({ ...userData, role: 'seller' });
                    localStorage.setItem('currentUser', JSON.stringify({ ...userData, role: 'seller' }));
                    console.log('✅ Seller Login successful:', userData);
                }
                return { success: true, role: 'seller' };
            }
        } catch (error) {
            console.error('❌ Seller Login error:', error);
            return {
                success: false,
                error: error.response?.data?.detail || 'Invalid credentials'
            };
        }
    };

    // ✅ User Register
    const register = async (userData) => {
        try {
            const response = await API.post('/auth/register', userData);
            if (response.data) {
                console.log('✅ User Registration response:', response.data);
                return {
                    success: true,
                    data: response.data,
                    otp: response.data.otp || '123456'
                };
            }
        } catch (error) {
            console.error('User Register error:', error);
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed'
            };
        }
    };

    // ✅ Seller Register
    const sellerRegister = async (userData) => {
        try {
            const response = await API.post('/seller/auth/register', userData);
            if (response.data) {
                console.log('✅ Seller Registration response:', response.data);
                return {
                    success: true,
                    data: response.data,
                    otp: response.data.otp || '123456'
                };
            }
        } catch (error) {
            console.error('Seller Register error:', error);
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed'
            };
        }
    };

    // ✅ User OTP Verify
    const verifyOTP = async (mobile, otp) => {
        try {
            const response = await API.post('/auth/verify-otp', { mobile, otp });
            if (response.data) {
                const { access_token, refresh_token } = response.data;
                setToken(access_token);
                localStorage.setItem('authToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);
                localStorage.setItem('currentUser', JSON.stringify({ role: 'user' }));

                const profileRes = await API.get('/auth/profile', {
                    headers: { 'Authorization': `Bearer ${access_token}` }
                });
                if (profileRes.data) {
                    let userData = profileRes.data;
                    setUser(userData);
                    localStorage.setItem('currentUser', JSON.stringify({ ...userData, role: 'user' }));
                    console.log('✅ User OTP Verify:', userData);
                }
                return { success: true };
            }
        } catch (error) {
            console.error('User OTP verify error:', error);
            return { success: false, error: error.response?.data?.detail || 'Invalid OTP' };
        }
    };

    // ✅ Seller OTP Verify
    const sellerVerifyOTP = async (mobile, otp) => {
        try {
            const response = await API.post('/seller/auth/verify-otp', { mobile, otp });
            if (response.data) {
                const { access_token, refresh_token } = response.data;
                setToken(access_token);
                localStorage.setItem('authToken', access_token);
                localStorage.setItem('refreshToken', refresh_token);
                localStorage.setItem('currentUser', JSON.stringify({ role: 'seller' }));

                const profileRes = await API.get('/seller/auth/profile', {
                    headers: { 'Authorization': `Bearer ${access_token}` }
                });
                if (profileRes.data) {
                    let userData = profileRes.data;
                    setUser({ ...userData, role: 'seller' });
                    localStorage.setItem('currentUser', JSON.stringify({ ...userData, role: 'seller' }));
                    console.log('✅ Seller OTP Verify:', userData);
                }
                return { success: true };
            }
        } catch (error) {
            console.error('Seller OTP verify error:', error);
            return { success: false, error: error.response?.data?.detail || 'Invalid OTP' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setUserRole(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
        toast.success('Logged out successfully');
    };

    const isAdmin = user?.role === 'admin' || user?.role === 'RoleEnum.admin';
    const isSeller = user?.role === 'seller' || user?.role === 'RoleEnum.seller';
    const isAuthenticated = !!token && !!user;

    const value = {
        user,
        token,
        loading,
        userRole,
        login,
        sellerLogin,
        register,
        sellerRegister,
        verifyOTP,
        sellerVerifyOTP,
        logout,
        isAuthenticated,
        isAdmin,
        isSeller
    };

    console.log('🔐 Auth State - Role:', user?.role, 'User:', user);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};