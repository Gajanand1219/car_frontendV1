// src/components/seller/SellerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const SellerProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            // ✅ FIXED: Correct endpoint for seller profile
            const response = await API.get('/seller/auth/profile');
            setProfile(response.data);
            console.log('✅ Seller Profile:', response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return 'S';
        return name.charAt(0).toUpperCase();
    };

    if (loading) {
        return (
            <div className="seller-profile-loading">
                <div className="loading-spinner"></div>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="seller-profile-page">
            {/* ========== PAGE HEADER ========== */}
            <div className="seller-profile-header">
                <div className="profile-avatar">
                    {profile?.name ? (
                        <span className="avatar-text">{getInitials(profile.name)}</span>
                    ) : (
                        <span className="avatar-text">S</span>
                    )}
                </div>
                <div className="header-info">
                    <h1>My Profile</h1>
                    <p>View your personal information</p>
                </div>
            </div>

            {/* ========== PROFILE CARD ========== */}
            <div className="profile-card">
                <div className="profile-info">
                    <div className="info-grid">
                        <div className="info-item">
                            <label>👤 Full Name</label>
                            <p>{profile?.name || 'Not set'}</p>
                        </div>
                        <div className="info-item">
                            <label>📧 Email Address</label>
                            <p>{profile?.email || 'Not set'}</p>
                        </div>
                        <div className="info-item">
                            <label>📱 Mobile Number</label>
                            <p>{profile?.mobile || 'Not set'}</p>
                        </div>
                        <div className="info-item">
                            <label>🔐 Verification Status</label>
                            <p>
                                {profile?.is_verified ? (
                                    <span className="status-verified">✅ Verified</span>
                                ) : (
                                    <span className="status-unverified">⚠️ Not Verified</span>
                                )}
                            </p>
                        </div>
                        <div className="info-item">
                            <label>👤 Role</label>
                            <p><span className="role-badge">{profile?.role || 'Seller'}</span></p>
                        </div>
                        {/* ✅ Business Name - Seller specific */}
                        {profile?.business_name && (
                            <div className="info-item">
                                <label>🏢 Business Name</label>
                                <p>{profile.business_name}</p>
                            </div>
                        )}
                        {/* ✅ GST Number - Seller specific */}
                        {profile?.gst_number && (
                            <div className="info-item">
                                <label>📋 GST Number</label>
                                <p>{profile.gst_number}</p>
                            </div>
                        )}
                        {/* ✅ Address - Seller specific */}
                        {profile?.address && (
                            <div className="info-item">
                                <label>📍 Address</label>
                                <p>{profile.address}</p>
                            </div>
                        )}
                        <div className="info-item">
                            <label>📅 Member Since</label>
                            <p>
                                {profile?.created_at ? 
                                    new Date(profile.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    }) : 
                                    'Today'
                                }
                            </p>
                        </div>
                        <div className="info-item">
                            <label>📊 Status</label>
                            <p>
                                {profile?.status === 'active' ? (
                                    <span className="status-active">🟢 Active</span>
                                ) : (
                                    <span className="status-inactive">🔴 Inactive</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== INLINE STYLES ========== */}
            <style>{`
                /* ============================================
                   SELLER PROFILE - COMPLETE STYLES
                   ============================================ */

                .seller-profile-page {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }

                /* Loading */
                .seller-profile-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 300px;
                    gap: 20px;
                }

                .seller-profile-loading .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid var(--border-color, #e8ecf1);
                    border-top: 4px solid #4A6CF7;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .seller-profile-loading p {
                    color: var(--text-muted, #888);
                    font-size: 1.1rem;
                }

                /* ========== HEADER ========== */
                .seller-profile-header {
                    display: flex;
                    align-items: center;
                    gap: 25px;
                    padding: 35px 40px;
                    background: linear-gradient(135deg, #4A6CF7, #6C5CE7);
                    border-radius: 20px;
                    color: white;
                    margin-bottom: 30px;
                    flex-wrap: wrap;
                }

                .profile-avatar {
                    width: 85px;
                    height: 85px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid rgba(255,255,255,0.3);
                    flex-shrink: 0;
                }

                .profile-avatar .avatar-text {
                    font-size: 2.4rem;
                    font-weight: 800;
                    color: white;
                }

                .header-info {
                    flex: 1;
                }

                .header-info h1 {
                    margin: 0;
                    font-size: 2rem;
                    font-weight: 800;
                }

                .header-info p {
                    margin: 4px 0 0;
                    opacity: 0.8;
                    font-size: 1rem;
                }

                /* ========== PROFILE CARD ========== */
                .profile-card {
                    background: var(--bg-card, white);
                    border-radius: 20px;
                    padding: 35px 40px;
                    border: 1px solid var(--border-color, #e8ecf1);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                    margin-bottom: 30px;
                }

                /* ========== VIEW MODE ========== */
                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px 35px;
                }

                .info-item {
                    padding: 14px 0;
                    border-bottom: 1px solid var(--border-color, #e8ecf1);
                }

                .info-item:nth-last-child(1),
                .info-item:nth-last-child(2) {
                    border-bottom: none;
                }

                .info-item label {
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: var(--text-muted, #888);
                    text-transform: uppercase;
                    letter-spacing: 0.8px;
                    display: block;
                    margin-bottom: 4px;
                }

                .info-item p {
                    margin: 0;
                    font-size: 1.05rem;
                    color: var(--text-primary, #1a1a2e);
                    font-weight: 500;
                }

                .status-verified {
                    color: #2ecc71;
                    font-weight: 700;
                }

                .status-unverified {
                    color: #f39c12;
                    font-weight: 700;
                }

                .status-active {
                    color: #2ecc71;
                    font-weight: 700;
                }

                .status-inactive {
                    color: #e74c3c;
                    font-weight: 700;
                }

                .role-badge {
                    background: linear-gradient(135deg, #4A6CF7, #6C5CE7);
                    color: white;
                    padding: 3px 16px;
                    border-radius: 14px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    display: inline-block;
                }

                /* ========== RESPONSIVE ========== */
                @media (max-width: 768px) {
                    .seller-profile-page {
                        padding: 12px;
                    }

                    .seller-profile-header {
                        flex-direction: column;
                        text-align: center;
                        padding: 25px 20px;
                    }

                    .profile-avatar {
                        width: 70px;
                        height: 70px;
                    }

                    .profile-avatar .avatar-text {
                        font-size: 1.8rem;
                    }

                    .header-info h1 {
                        font-size: 1.5rem;
                    }

                    .profile-card {
                        padding: 25px 20px;
                    }

                    .info-grid {
                        grid-template-columns: 1fr;
                        gap: 0;
                    }

                    .info-item {
                        padding: 12px 0;
                    }

                    .info-item:nth-last-child(1),
                    .info-item:nth-last-child(2) {
                        border-bottom: 1px solid var(--border-color, #e8ecf1);
                    }

                    .info-item:last-child {
                        border-bottom: none;
                    }
                }

                @media (max-width: 480px) {
                    .seller-profile-header {
                        padding: 20px 15px;
                    }

                    .profile-avatar {
                        width: 60px;
                        height: 60px;
                    }

                    .profile-avatar .avatar-text {
                        font-size: 1.5rem;
                    }

                    .header-info h1 {
                        font-size: 1.3rem;
                    }

                    .profile-card {
                        padding: 18px 15px;
                    }
                }

                /* ========== DARK THEME ========== */
                [data-theme="dark"] .profile-card {
                    background: #1f1f3a;
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .info-item {
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .info-item p {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .seller-profile-loading p {
                    color: #8888aa;
                }
            `}</style>
        </div>
    );
};

export default SellerProfile;