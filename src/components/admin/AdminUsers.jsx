// src/components/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const [admins, setAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [sellers, setSellers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        try {
            setLoading(true);
            
            const usersRes = await API.get('/admin/users');
            const usersData = usersRes.data || [];
            
            const adminData = usersData.filter(u => u.role === 'admin' || u.role === 'RoleEnum.admin');
            const userData = usersData.filter(u => u.role !== 'admin' && u.role !== 'RoleEnum.admin');
            
            setAdmins(adminData);
            setUsers(userData);

            const sellersRes = await API.get('/admin/sellers');
            const sellersData = sellersRes.data || [];
            setSellers(sellersData);

            const combined = [
                ...adminData.map(u => ({ ...u, type: 'admin' })),
                ...userData.map(u => ({ ...u, type: 'user' })),
                ...sellersData.map(s => ({ ...s, type: 'seller' }))
            ];
            setAllUsers(combined);
            
            console.log('✅ Admins:', adminData.length, 'Users:', userData.length, 'Sellers:', sellersData.length);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const blockUser = async (id, currentStatus, type) => {
        const newStatus = currentStatus === 'active' ? 'blocked' : 'active';
        try {
            let endpoint;
            if (type === 'seller') {
                endpoint = `/admin/sellers/${id}/status`;
            } else {
                endpoint = `/admin/users/${id}`;
            }
            
            await API.put(endpoint, { status: newStatus });
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${newStatus === 'active' ? 'unblocked' : 'blocked'}`);
            fetchAllUsers();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleCall = (phone) => {
        if (phone) {
            window.location.href = `tel:${phone}`;
        } else {
            toast.error('No phone number available');
        }
    };

    const getFilteredData = () => {
        let data = allUsers;
        if (activeTab === 'admins') {
            data = allUsers.filter(item => item.type === 'admin');
        } else if (activeTab === 'users') {
            data = allUsers.filter(item => item.type === 'user');
        } else if (activeTab === 'sellers') {
            data = allUsers.filter(item => item.type === 'seller');
        }
        
        return data.filter(item =>
            item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.mobile?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredData = getFilteredData();

    const getRoleBadge = (role, type) => {
        const displayRole = type === 'seller' ? 'seller' : role;
        
        const badges = {
            admin: { class: 'role-admin', icon: '🛡️', label: 'Admin' },
            user: { class: 'role-user', icon: '👤', label: 'User' },
            seller: { class: 'role-seller', icon: '🏪', label: 'Seller' }
        };
        return badges[displayRole] || badges.user;
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    return (
        <div className="admin-users-container">
            <div className="admin-users">
                {/* ========== HEADER ========== */}
                <div className="users-header">
                    <div className="header-left">
                        <h2>👥 User Management</h2>
                        <span className="header-subtitle">Manage all users, sellers and admins</span>
                    </div>
                    <div className="header-right">
                        <span className="total-badge">
                            <span className="total-number">{allUsers.length}</span>
                            <span className="total-label">Total</span>
                        </span>
                    </div>
                </div>

                {/* ========== TABS ========== */}
                <div className="users-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        <span className="tab-icon">📋</span>
                        All
                        <span className="tab-count">{allUsers.length}</span>
                    </button>
                    <button 
                        className={`tab-btn tab-admin ${activeTab === 'admins' ? 'active' : ''}`}
                        onClick={() => setActiveTab('admins')}
                    >
                        <span className="tab-icon">🛡️</span>
                        Admins
                        <span className="tab-count">{admins.length}</span>
                    </button>
                    <button 
                        className={`tab-btn tab-user ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <span className="tab-icon">👤</span>
                        Users
                        <span className="tab-count">{users.length}</span>
                    </button>
                    <button 
                        className={`tab-btn tab-seller ${activeTab === 'sellers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sellers')}
                    >
                        <span className="tab-icon">🏪</span>
                        Sellers
                        <span className="tab-count">{sellers.length}</span>
                    </button>
                </div>

                {/* ========== SEARCH ========== */}
                <div className="users-toolbar">
                    <div className="search-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Search by name, email or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button className="search-clear" onClick={() => setSearchTerm('')}>
                                ✕
                            </button>
                        )}
                    </div>
                    <button className="btn-refresh" onClick={fetchAllUsers}>
                        <span className="refresh-icon">🔄</span> Refresh
                    </button>
                </div>

                {/* ========== TABLE ========== */}
                {filteredData.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No Records Found</h3>
                        <p>Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <div className="table-wrapper">
                        <table className="users-table">
                            <thead>
                                <tr>
                                    <th>User / Seller</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map(item => {
                                    const roleInfo = getRoleBadge(item.role, item.type);
                                    const isAdmin = item.type === 'admin';
                                    
                                    return (
                                        <tr key={`${item.type}-${item.id}`} className={`user-row ${item.type}`}>
                                            <td>
                                                <div className="user-info">
                                                    <div className="user-avatar">
                                                        {item.name?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="user-details">
                                                        <div className="user-name">{item.name}</div>
                                                        <div className="user-meta">
                                                            <span className="user-id">ID: {item.id}</span>
                                                            {item.type === 'seller' && item.business_name && (
                                                                <span className="user-business">🏢 {item.business_name}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="user-email">
                                                    <span className="email-icon">✉️</span>
                                                    {item.email}
                                                </div>
                                            </td>
                                            <td>
                                                {item.mobile ? (
                                                    <div className="user-phone">
                                                        <span className="phone-number">{item.mobile}</span>
                                                        <button
                                                            className="btn-call"
                                                            onClick={() => handleCall(item.mobile)}
                                                            title="Call now"
                                                        >
                                                            📞
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="no-phone">N/A</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`role-badge ${roleInfo.class}`}>
                                                    <span className="role-icon">{roleInfo.icon}</span>
                                                    {roleInfo.label}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${item.status}`}>
                                                    <span className="status-dot"></span>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>
                                                {isAdmin ? (
                                                    <span className="admin-protected">
                                                        <span className="protected-icon">🛡️</span>
                                                        Protected
                                                    </span>
                                                ) : (
                                                    <button
                                                        className={`btn-action ${item.status === 'active' ? 'btn-block' : 'btn-unblock'}`}
                                                        onClick={() => blockUser(item.id, item.status, item.type)}
                                                    >
                                                        {item.status === 'active' ? '🔒 Block' : '🔓 Unblock'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ========== INLINE STYLES ========== */}
            <style>{`
                /* ============================================
                   ADMIN USERS - COMPLETE STYLES
                   ============================================ */

                .admin-users-container {
                    padding: 20px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .admin-users {
                    background: var(--bg-card, #ffffff);
                    border-radius: 20px;
                    padding: 30px;
                    box-shadow: 0 4px 25px rgba(0,0,0,0.05);
                    border: 1px solid var(--border-color, #e8ecf1);
                }

                /* ========== HEADER ========== */
                .users-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid var(--border-color, #e8ecf1);
                }

                .header-left h2 {
                    margin: 0;
                    font-size: 1.8rem;
                    font-weight: 800;
                    color: var(--text-primary, #1a1a2e);
                }

                .header-subtitle {
                    color: var(--text-muted, #888);
                    font-size: 0.95rem;
                    display: block;
                    margin-top: 4px;
                }

                .header-right .total-badge {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: linear-gradient(135deg, #4A6CF7, #6C5CE7);
                    padding: 10px 22px;
                    border-radius: 14px;
                    color: white;
                }

                .total-badge .total-number {
                    font-size: 1.8rem;
                    font-weight: 800;
                }

                .total-badge .total-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                /* ========== TABS ========== */
                .users-tabs {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-bottom: 22px;
                }

                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 22px;
                    border: 2px solid var(--border-color, #dce0e5);
                    border-radius: 12px;
                    background: transparent;
                    color: var(--text-secondary, #666);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .tab-btn:hover {
                    border-color: #4A6CF7;
                    color: #4A6CF7;
                    transform: translateY(-2px);
                }

                .tab-btn .tab-icon {
                    font-size: 1rem;
                }

                .tab-btn .tab-count {
                    background: var(--bg-hover, #f0f2f8);
                    padding: 1px 10px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-left: 2px;
                }

                .tab-btn.active {
                    background: linear-gradient(135deg, #4A6CF7, #6C5CE7);
                    color: white;
                    border-color: #4A6CF7;
                    box-shadow: 0 4px 15px rgba(74, 108, 247, 0.3);
                }

                .tab-btn.active .tab-count {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }

                .tab-btn.tab-admin.active { background: linear-gradient(135deg, #e74c3c, #c0392b); border-color: #e74c3c; }
                .tab-btn.tab-user.active { background: linear-gradient(135deg, #2ecc71, #27ae60); border-color: #2ecc71; }
                .tab-btn.tab-seller.active { background: linear-gradient(135deg, #4A6CF7, #6C5CE7); border-color: #4A6CF7; }

                /* ========== SEARCH ========== */
                .users-toolbar {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                    margin-bottom: 25px;
                }

                .search-wrapper {
                    position: relative;
                    flex: 1;
                    min-width: 250px;
                }

                .search-wrapper .search-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 1rem;
                    opacity: 0.5;
                }

                .search-wrapper .search-input {
                    width: 100%;
                    padding: 12px 45px 12px 40px;
                    border: 2px solid var(--border-color, #dce0e5);
                    border-radius: 12px;
                    background: var(--bg-input, #f5f7fa);
                    color: var(--text-primary, #1a1a2e);
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                }

                .search-wrapper .search-input:focus {
                    border-color: #4A6CF7;
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
                }

                .search-wrapper .search-clear {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: var(--text-muted, #888);
                    padding: 4px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                }

                .search-wrapper .search-clear:hover {
                    color: #e74c3c;
                    background: rgba(231, 76, 60, 0.1);
                }

                .btn-refresh {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 24px;
                    border: 2px solid var(--border-color, #dce0e5);
                    border-radius: 12px;
                    background: var(--bg-card, white);
                    color: var(--text-primary, #1a1a2e);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .btn-refresh:hover {
                    border-color: #4A6CF7;
                    color: #4A6CF7;
                    transform: translateY(-2px);
                }

                .btn-refresh .refresh-icon {
                    font-size: 1.1rem;
                }

                /* ========== TABLE ========== */
                .table-wrapper {
                    overflow-x: auto;
                    border-radius: 16px;
                    border: 1px solid var(--border-color, #e8ecf1);
                }

                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.95rem;
                }

                .users-table thead {
                    background: linear-gradient(135deg, #f8f9ff, #f0f2f8);
                }

                .users-table thead th {
                    padding: 16px 20px;
                    text-align: left;
                    font-weight: 700;
                    color: var(--text-secondary, #2d2d44);
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    border-bottom: 2px solid var(--border-color, #dce0e5);
                }

                .users-table tbody tr {
                    transition: all 0.3s ease;
                }

                .users-table tbody tr:hover {
                    background: var(--bg-hover, #f5f7fa);
                    transform: scale(1.001);
                }

                .users-table tbody tr:not(:last-child) td {
                    border-bottom: 1px solid var(--border-color, #e8ecf1);
                }

                .users-table tbody td {
                    padding: 16px 20px;
                    vertical-align: middle;
                    color: var(--text-primary, #1a1a2e);
                }

                /* ========== USER INFO ========== */
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .user-avatar {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 1.1rem;
                    color: white;
                    flex-shrink: 0;
                }

                .user-row.admin .user-avatar { background: linear-gradient(135deg, #e74c3c, #c0392b); }
                .user-row.user .user-avatar { background: linear-gradient(135deg, #2ecc71, #27ae60); }
                .user-row.seller .user-avatar { background: linear-gradient(135deg, #4A6CF7, #6C5CE7); }

                .user-details .user-name {
                    font-weight: 700;
                    font-size: 1rem;
                    color: var(--text-primary, #1a1a2e);
                }

                .user-details .user-meta {
                    display: flex;
                    gap: 12px;
                    flex-wrap: wrap;
                    margin-top: 2px;
                    font-size: 0.8rem;
                    color: var(--text-muted, #888);
                }

                .user-details .user-meta .user-business {
                    color: #4A6CF7;
                }

                /* ========== EMAIL ========== */
                .user-email {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text-secondary, #2d2d44);
                }

                .user-email .email-icon {
                    opacity: 0.5;
                }

                /* ========== PHONE ========== */
                .user-phone {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-phone .phone-number {
                    font-weight: 500;
                }

                .btn-call {
                    width: 34px;
                    height: 34px;
                    border: none;
                    border-radius: 50%;
                    background: rgba(46, 204, 113, 0.12);
                    color: #2ecc71;
                    cursor: pointer;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-call:hover {
                    background: #2ecc71;
                    color: white;
                    transform: scale(1.1);
                }

                .no-phone {
                    color: var(--text-muted, #888);
                    font-size: 0.85rem;
                }

                /* ========== ROLE BADGE ========== */
                .role-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                }

                .role-badge .role-icon {
                    font-size: 0.85rem;
                }

                .role-badge.role-admin {
                    background: rgba(231, 76, 60, 0.12);
                    color: #e74c3c;
                }

                .role-badge.role-user {
                    background: rgba(46, 204, 113, 0.12);
                    color: #2ecc71;
                }

                .role-badge.role-seller {
                    background: rgba(74, 108, 247, 0.12);
                    color: #4A6CF7;
                }

                /* ========== STATUS BADGE ========== */
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: capitalize;
                }

                .status-badge .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    display: inline-block;
                }

                .status-badge.active {
                    background: rgba(46, 204, 113, 0.12);
                    color: #2ecc71;
                }

                .status-badge.active .status-dot {
                    background: #2ecc71;
                }

                .status-badge.blocked {
                    background: rgba(231, 76, 60, 0.12);
                    color: #e74c3c;
                }

                .status-badge.blocked .status-dot {
                    background: #e74c3c;
                }

                /* ========== ACTIONS ========== */
                .btn-action {
                    padding: 6px 18px;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-action:hover {
                    transform: translateY(-2px);
                }

                .btn-block {
                    background: rgba(231, 76, 60, 0.12);
                    color: #e74c3c;
                }

                .btn-block:hover {
                    background: #e74c3c;
                    color: white;
                    box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);
                }

                .btn-unblock {
                    background: rgba(46, 204, 113, 0.12);
                    color: #2ecc71;
                }

                .btn-unblock:hover {
                    background: #2ecc71;
                    color: white;
                    box-shadow: 0 4px 15px rgba(46, 204, 113, 0.3);
                }

                .admin-protected {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    color: #e74c3c;
                    font-weight: 700;
                }

                .admin-protected .protected-icon {
                    font-size: 1rem;
                }

                /* ========== EMPTY STATE ========== */
                .empty-state {
                    text-align: center;
                    padding: 60px 20px;
                }

                .empty-state .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 15px;
                }

                .empty-state h3 {
                    font-size: 1.4rem;
                    margin: 0 0 8px;
                    color: var(--text-primary, #1a1a2e);
                }

                .empty-state p {
                    color: var(--text-muted, #888);
                    font-size: 1rem;
                }

                /* ========== RESPONSIVE ========== */
                @media (max-width: 992px) {
                    .admin-users {
                        padding: 20px;
                    }

                    .users-table tbody td {
                        padding: 12px 16px;
                    }

                    .users-table thead th {
                        padding: 12px 16px;
                        font-size: 0.75rem;
                    }

                    .user-avatar {
                        width: 36px;
                        height: 36px;
                        font-size: 0.9rem;
                    }
                }

                @media (max-width: 768px) {
                    .admin-users-container {
                        padding: 10px;
                    }

                    .admin-users {
                        padding: 16px;
                        border-radius: 14px;
                    }

                    .users-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .header-left h2 {
                        font-size: 1.4rem;
                    }

                    .header-right .total-badge {
                        padding: 8px 16px;
                    }

                    .total-badge .total-number {
                        font-size: 1.4rem;
                    }

                    .users-tabs {
                        gap: 6px;
                    }

                    .tab-btn {
                        padding: 6px 14px;
                        font-size: 0.75rem;
                    }

                    .tab-btn .tab-count {
                        font-size: 0.65rem;
                        padding: 0 8px;
                    }

                    .users-toolbar {
                        flex-direction: column;
                    }

                    .search-wrapper {
                        min-width: 100%;
                    }

                    .btn-refresh {
                        width: 100%;
                        justify-content: center;
                    }

                    .user-info {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 8px;
                    }

                    .user-avatar {
                        width: 32px;
                        height: 32px;
                        font-size: 0.8rem;
                    }

                    .user-details .user-meta {
                        font-size: 0.7rem;
                        gap: 8px;
                    }

                    .user-phone {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 4px;
                    }

                    .btn-call {
                        width: 28px;
                        height: 28px;
                        font-size: 0.7rem;
                    }

                    .btn-action {
                        padding: 4px 12px;
                        font-size: 0.7rem;
                    }

                    .role-badge {
                        padding: 3px 10px;
                        font-size: 0.7rem;
                    }

                    .status-badge {
                        padding: 3px 10px;
                        font-size: 0.65rem;
                    }

                    .users-table tbody td {
                        padding: 10px 12px;
                        font-size: 0.85rem;
                    }

                    .users-table thead th {
                        padding: 8px 12px;
                        font-size: 0.65rem;
                    }
                }

                @media (max-width: 480px) {
                    .admin-users {
                        padding: 12px;
                    }

                    .header-left h2 {
                        font-size: 1.2rem;
                    }

                    .header-subtitle {
                        font-size: 0.8rem;
                    }

                    .tab-btn {
                        padding: 4px 10px;
                        font-size: 0.65rem;
                    }

                    .tab-btn .tab-icon {
                        font-size: 0.8rem;
                    }

                    .users-table tbody td {
                        padding: 8px 10px;
                        font-size: 0.75rem;
                    }

                    .users-table thead th {
                        padding: 6px 10px;
                        font-size: 0.6rem;
                    }

                    .user-details .user-name {
                        font-size: 0.85rem;
                    }

                    .user-email {
                        font-size: 0.8rem;
                    }

                    .user-phone .phone-number {
                        font-size: 0.8rem;
                    }
                }

                /* ========== DARK THEME ========== */
                [data-theme="dark"] .admin-users {
                    background: #1f1f3a;
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .users-table thead {
                    background: #1a1a2e;
                }

                [data-theme="dark"] .users-table thead th {
                    color: #c0c0d8;
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .users-table tbody tr:not(:last-child) td {
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .users-table tbody tr:hover {
                    background: #2a2a4a;
                }

                [data-theme="dark"] .users-table tbody td {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .search-wrapper .search-input {
                    background: #2a2a4a;
                    border-color: #3a3a5a;
                    color: #e8e8f0;
                }

                [data-theme="dark"] .tab-btn {
                    color: #c0c0d8;
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .tab-btn .tab-count {
                    background: #2a2a4a;
                    color: #8888aa;
                }

                [data-theme="dark"] .btn-refresh {
                    background: #1f1f3a;
                    border-color: #2a2a4a;
                    color: #e8e8f0;
                }

                [data-theme="dark"] .empty-state h3 {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .users-header {
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .user-details .user-name {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .user-email {
                    color: #c0c0d8;
                }

                [data-theme="dark"] .table-wrapper {
                    border-color: #2a2a4a;
                }
            `}</style>
        </div>
    );
};

export default AdminUsers;