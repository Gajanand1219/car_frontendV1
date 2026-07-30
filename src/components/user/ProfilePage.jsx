import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
    const { user, logout, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" />;
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-card">
                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <h3 style={{ textAlign: 'center', marginBottom: '16px' }}>
                        {user?.name || 'User'}
                    </h3>
                    <div className="profile-field">
                        <span className="label">Email</span>
                        <span className="value">{user?.email || 'Not set'}</span>
                    </div>
                    <div className="profile-field">
                        <span className="label">Mobile</span>
                        <span className="value">{user?.mobile || 'Not set'}</span>
                    </div>
                    <div className="profile-field">
                        <span className="label">Role</span>
                        <span className="value">{user?.role || 'user'}</span>
                    </div>
                    <div className="profile-field">
                        <span className="label">Verified</span>
                        <span className="value">{user?.is_mobile_verified ? '✅ Yes' : '❌ No'}</span>
                    </div>
                    <div className="profile-field" style={{ borderBottom: 'none' }}>
                        <span className="label">Member Since</span>
                        <span className="value">
                            {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Today'}
                        </span>
                    </div>
                    <button
                        onClick={logout}
                        className="btn-logout"
                        style={{ width: '100%', marginTop: '24px', justifyContent: 'center' }}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;