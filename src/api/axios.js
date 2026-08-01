// src/api/axios.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'https://car-backendv1.onrender.com/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Add token interceptor
API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✅ Response interceptor - REMOVED automatic redirect on 401
API.interceptors.response.use(
    (response) => response,
    (error) => {
        // ✅ Only handle 401 for protected routes, not for login
        // Don't redirect automatically - let components handle errors
        if (error.response?.status === 401) {
            // Only clear storage if it's not a login attempt
            const isLoginAttempt = error.config?.url?.includes('/login') || 
                                   error.config?.url?.includes('/register') ||
                                   error.config?.url?.includes('/verify-otp');
            
            if (!isLoginAttempt) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('currentUser');
            }
            // ❌ REMOVE THIS LINE: window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/400x300/4A6CF7/FFFFFF?text=Car';
    if (url.startsWith('http')) return url;
    return url;
};

export default API;
