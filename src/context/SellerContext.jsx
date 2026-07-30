// src/context/SellerContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const SellerContext = createContext();

export const useSeller = () => {
    const context = useContext(SellerContext);
    if (!context) {
        throw new Error('useSeller must be used within SellerProvider');
    }
    return context;
};

export const SellerProvider = ({ children }) => {
    const [sellerCars, setSellerCars] = useState([]);
    const [stats, setStats] = useState({
        total_cars: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        sold: 0
    });
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // ✅ Check if user is authenticated
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
    }, []);

    const fetchSellerCars = async () => {
        try {
            const response = await API.get('/seller/cars');
            setSellerCars(response.data || []);
            return response.data;
        } catch (error) {
            // ✅ If 401, just return empty array - don't show error
            if (error.response?.status === 401) {
                console.log('⏳ Please login to view your cars');
                return [];
            }
            console.error('Error fetching seller cars:', error);
            return [];
        }
    };

    const fetchStats = async () => {
        try {
            const response = await API.get('/seller/stats');
            setStats(response.data);
            return response.data;
        } catch (error) {
            // ✅ If 401, just return default stats - don't show error
            if (error.response?.status === 401) {
                console.log('⏳ Please login to view stats');
                return null;
            }
            console.error('Error fetching stats:', error);
            return null;
        }
    };

    const createCar = async (carData) => {
        try {
            const response = await API.post('/seller/cars', carData);
            toast.success('Car submitted for approval!');
            await fetchSellerCars();
            await fetchStats();
            return response.data;
        } catch (error) {
            console.error('Error creating car:', error);
            if (error.response?.status === 401) {
                toast.error('Please login to sell your car');
            } else {
                toast.error(error.response?.data?.detail || 'Failed to create car');
            }
            throw error;
        }
    };

    const updateCar = async (id, data) => {
        try {
            const response = await API.put(`/seller/cars/${id}`, data);
            toast.success('Car updated successfully!');
            await fetchSellerCars();
            await fetchStats();
            return response.data;
        } catch (error) {
            console.error('Error updating car:', error);
            if (error.response?.status === 401) {
                toast.error('Please login to update your car');
            } else {
                toast.error(error.response?.data?.detail || 'Failed to update car');
            }
            throw error;
        }
    };

    const deleteCar = async (id) => {
        try {
            await API.delete(`/seller/cars/${id}`);
            toast.success('Car deleted successfully!');
            await fetchSellerCars();
            await fetchStats();
            return true;
        } catch (error) {
            console.error('Error deleting car:', error);
            if (error.response?.status === 401) {
                toast.error('Please login to delete your car');
            } else {
                toast.error('Failed to delete car');
            }
            throw error;
        }
    };

    // ✅ Only load data if authenticated
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            if (token) {
                await Promise.all([fetchSellerCars(), fetchStats()]);
            } else {
                // ✅ Reset data when not authenticated
                setSellerCars([]);
                setStats({
                    total_cars: 0,
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    sold: 0
                });
            }
            setLoading(false);
        };
        loadData();
    }, []);

    const value = {
        sellerCars,
        stats,
        loading,
        isAuthenticated,
        fetchSellerCars,
        fetchStats,
        createCar,
        updateCar,
        deleteCar
    };

    return (
        <SellerContext.Provider value={value}>
            {children}
        </SellerContext.Provider>
    );
};