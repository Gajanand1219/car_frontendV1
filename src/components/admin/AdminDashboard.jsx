// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCars: 0,
        available: 0,
        sold: 0,
        totalUsers: 0,
        pendingEnquiries: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentCars, setRecentCars] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            console.log('📊 Fetching dashboard data...');

            // ✅ Use correct endpoints
            const [carsRes, usersRes, enquiriesRes] = await Promise.all([
                API.get('/cars/'),           // GET /api/v1/cars/
                API.get('/admin/users'),      // GET /api/v1/admin/users
                API.get('/admin/enquiries')   // GET /api/v1/admin/enquiries
            ]);

            console.log('✅ Cars response:', carsRes.data);
            console.log('✅ Users response:', usersRes.data);
            console.log('✅ Enquiries response:', enquiriesRes.data);

            const cars = carsRes.data || [];
            const users = usersRes.data || [];
            const enquiries = enquiriesRes.data || [];

            setStats({
                totalCars: cars.length,
                available: cars.filter(c => c.status === 'available').length,
                sold: cars.filter(c => c.status === 'sold').length,
                totalUsers: users.length,
                pendingEnquiries: enquiries.filter(e => e.status === 'pending').length
            });
            setRecentCars(cars.slice(0, 5));
        } catch (error) {
            console.error('❌ Dashboard error:', error);
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { icon: '🚗', label: 'Total Cars', value: stats.totalCars },
        { icon: '✅', label: 'Available', value: stats.available, color: 'green' },
        { icon: '🔴', label: 'Sold', value: stats.sold, color: 'red' },
        { icon: '👥', label: 'Users', value: stats.totalUsers },
        { icon: '📩', label: 'Pending Enquiries', value: stats.pendingEnquiries, color: 'orange' }
    ];

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h1>Dashboard</h1>
            <p>Welcome back, Admin! Here's what's happening today.</p>

            <div className="stats-grid">
                {statCards.map((s, i) => (
                    <div key={i} className={`stat-card ${s.color || ''}`}>
                        <div className="stat-icon">{s.icon}</div>
                        <div className="stat-info">
                            <h3>{s.value}</h3>
                            <p>{s.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="recent-cars">
                <h3>Recent Cars</h3>
                {recentCars.length === 0 ? (
                    <p>No cars added yet</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr><th>Car</th><th>Price</th><th>Status</th><th>Date</th></tr>
                        </thead>
                        <tbody>
                            {recentCars.map(car => (
                                <tr key={car.id}>
                                    <td>{car.brand} {car.model}</td>
                                    <td>₹{car.price?.toLocaleString()}</td>
                                    <td><span className={`status-badge ${car.status}`}>{car.status}</span></td>
                                    <td>{new Date(car.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};


export default AdminDashboard;