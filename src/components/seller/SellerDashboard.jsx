// src/components/seller/SellerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useSeller } from '../../context/SellerContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
    const { stats, loading, sellerCars } = useSeller();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Create recent activity from seller cars
        if (sellerCars && sellerCars.length > 0) {
            const activities = sellerCars.slice(0, 5).map(car => ({
                id: car.id,
                title: `${car.car_brand} ${car.car_model}`,
                status: car.approval_status,
                date: car.submitted_at,
                price: car.expected_price
            }));
            setRecentActivity(activities);
        }
    }, [sellerCars]);

    if (loading) {
        return (
            <div className="seller-dashboard">
                <div className="dashboard-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        { icon: '🚗', label: 'Total Cars', value: stats.total_cars, color: 'blue', bg: 'bg-blue' },
        { icon: '⏳', label: 'Pending Review', value: stats.pending, color: 'orange', bg: 'bg-orange' },
        { icon: '✅', label: 'Approved', value: stats.approved, color: 'green', bg: 'bg-green' },
        { icon: '❌', label: 'Rejected', value: stats.rejected, color: 'red', bg: 'bg-red' },
        { icon: '💰', label: 'Sold', value: stats.sold, color: 'purple', bg: 'bg-purple' }
    ];

    const getStatusIcon = (status) => {
        const icons = {
            pending: '⏳',
            approved: '✅',
            rejected: '❌',
            sold: '💰'
        };
        return icons[status] || '📌';
    };

    const getStatusClass = (status) => {
        const classes = {
            pending: 'status-pending',
            approved: 'status-approved',
            rejected: 'status-rejected',
            sold: 'status-sold'
        };
        return classes[status] || 'status-default';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) return 'Today';
        if (days === 1) return 'Yesterday';
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    return (
        <div className="seller-dashboard">
            {/* Welcome Section */}
            <div className="dashboard-welcome">
                <div className="welcome-content">
                    <div className="welcome-avatar">
                        {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                    </div>
                    <div className="welcome-text">
                        <h1>👋 Welcome back, {user?.name || 'Seller'}!</h1>
                        <p>Here's what's happening with your car listings today</p>
                    </div>
                </div>
                <Link to="/seller/add" className="btn btn-primary btn-large">
                    ➕ List New Car
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`stat-card ${stat.color}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                        <div className={`stat-bar ${stat.bg}`}></div>
                    </div>
                ))}
            </div>

            {/* Quick Actions + Tips Row */}
            <div className="dashboard-row">
                <div className="quick-actions">
                    <h3>⚡ Quick Actions</h3>
                    <div className="action-grid">
                        <Link to="/seller/add" className="action-card action-primary">
                            <span className="action-icon">➕</span>
                            <div>
                                <h4>List New Car</h4>
                                <p>Start selling your car today</p>
                            </div>
                            <span className="action-arrow">→</span>
                        </Link>
                        <Link to="/seller/cars" className="action-card action-secondary">
                            <span className="action-icon">📋</span>
                            <div>
                                <h4>My Cars</h4>
                                <p>View all your listings</p>
                            </div>
                            <span className="action-arrow">→</span>
                        </Link>
                        <Link to="/seller/profile" className="action-card action-tertiary">
                            <span className="action-icon">👤</span>
                            <div>
                                <h4>Profile</h4>
                                <p>Update your details</p>
                            </div>
                            <span className="action-arrow">→</span>
                        </Link>
                    </div>
                </div>

                <div className="seller-tips">
                    <h3>💡 Pro Tips</h3>
                    <ul>
                        <li>
                            <span className="tip-icon">📸</span>
                            <span>Upload high-quality images of your car</span>
                        </li>
                        <li>
                            <span className="tip-icon">📝</span>
                            <span>Provide accurate details and description</span>
                        </li>
                        <li>
                            <span className="tip-icon">💰</span>
                            <span>Set a competitive expected price</span>
                        </li>
                        <li>
                            <span className="tip-icon">🔄</span>
                            <span>Check your listing status regularly</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
                <div className="recent-activity">
                    <div className="activity-header">
                        <h3>🕐 Recent Activity</h3>
                        <Link to="/seller/cars" className="view-all">View All →</Link>
                    </div>
                    <div className="activity-list">
                        {recentActivity.map((activity) => (
                            <div 
                                key={activity.id} 
                                className={`activity-item ${getStatusClass(activity.status)}`}
                                onClick={() => navigate(`/seller/cars`)}
                            >
                                <div className="activity-icon">
                                    {getStatusIcon(activity.status)}
                                </div>
                                <div className="activity-content">
                                    <h4>{activity.title}</h4>
                                    <p>₹{activity.price?.toLocaleString()}</p>
                                </div>
                                <div className="activity-status">
                                    <span className={`status-badge ${activity.status}`}>
                                        {activity.status}
                                    </span>
                                    <span className="activity-date">{formatDate(activity.date)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {stats.total_cars === 0 && (
                <div className="empty-state-dashboard">
                    <div className="empty-icon">🚀</div>
                    <h3>No Cars Listed Yet</h3>
                    <p>Start your selling journey by listing your first car today!</p>
                    <Link to="/seller/add" className="btn btn-primary">
                        ➕ List Your First Car
                    </Link>
                </div>
            )}
        </div>
    );
};

export default SellerDashboard;