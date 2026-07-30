// src/components/admin/AdminPortal.jsx
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminCars from './AdminCars';
import AdminUsers from './AdminUsers';
import AdminEnquiries from './AdminEnquiries';
import AdminLogin from './AdminLogin';
import AdminSellerCars from './AdminSellerCars'; // ✅ ADD THIS

const AdminPortal = () => {
    const { isAdmin, isAuthenticated, logout, user, isSeller } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    // ✅ Close sidebar on route change (mobile)
    useEffect(() => {
        setSidebarOpen(false);
    }, [location]);

    console.log('🔐 AdminPortal - isAuthenticated:', isAuthenticated);
    console.log('🔐 AdminPortal - isAdmin:', isAdmin);
    console.log('🔐 AdminPortal - user:', user);

    if (!isAuthenticated || !isAdmin) {
        return <AdminLogin />;
    }

    if (isAuthenticated && isSeller) {
        return <Navigate to="/seller" />;
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className="admin-portal">
            {/* ✅ Mobile Hamburger Menu - Only show on mobile */}
            <button 
                className="admin-menu-toggle" 
                onClick={toggleSidebar}
                aria-label="Toggle menu"
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>

            {/* ✅ Sidebar Overlay - Only when sidebar is open */}
            {sidebarOpen && (
                <div 
                    className="admin-sidebar-overlay active" 
                    onClick={closeSidebar}
                />
            )}

            <div className="admin-container">
                {/* Sidebar */}
                <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
                    <div className="admin-logo">
                        <span>🚗</span>
                        <span>CarShowroom Admin</span>
                    </div>
                    <nav className="admin-nav">
                        <Link to="/admin" className="admin-nav-link" onClick={closeSidebar}>
                            📊 Dashboard
                        </Link>
                        <Link to="/admin/cars" className="admin-nav-link" onClick={closeSidebar}>
                            🚗 Cars
                        </Link>
                        {/* ✅ SELLER CARS - ADD THIS MENU ITEM */}
                        <Link to="/admin/seller-cars" className="admin-nav-link" onClick={closeSidebar}>
                            🏪 Seller Cars
                        </Link>
                        <Link to="/admin/users" className="admin-nav-link" onClick={closeSidebar}>
                            👥 Users
                        </Link>
                        <Link to="/admin/enquiries" className="admin-nav-link" onClick={closeSidebar}>
                            📩 Enquiries
                        </Link>
                    </nav>
                    <button onClick={() => { logout(); closeSidebar(); }} className="admin-logout">
                        🚪 Logout
                    </button>
                </aside>

                {/* Main Content */}
                <main className="admin-content">
                    <Routes>
                        <Route path="/" element={<AdminDashboard />} />
                        <Route path="/cars" element={<AdminCars />} />
                        {/* ✅ SELLER CARS - ADD THIS ROUTE */}
                        <Route path="/seller-cars" element={<AdminSellerCars />} />
                        <Route path="/users" element={<AdminUsers />} />
                        <Route path="/enquiries" element={<AdminEnquiries />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default AdminPortal;