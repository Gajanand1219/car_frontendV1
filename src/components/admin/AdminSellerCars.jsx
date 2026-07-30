// src/components/admin/AdminSellerCars.jsx
import React, { useState, useEffect } from 'react';
import API, { getImageUrl } from '../../api/axios';
import toast from 'react-hot-toast';

const AdminSellerCars = () => {
    const [sellerCars, setSellerCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCar, setSelectedCar] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionData, setActionData] = useState({
        status: '',
        admin_notes: '',
        admin_price: ''
    });

    useEffect(() => {
        fetchSellerCars();
    }, [filter]);

    const fetchSellerCars = async () => {
        try {
            setLoading(true);
            const url = filter === 'all' 
                ? '/seller/admin/cars' 
                : `/seller/admin/cars?status=${filter}`;
            const response = await API.get(url);
            console.log('📦 Seller Cars:', response.data);
            setSellerCars(response.data || []);
        } catch (error) {
            console.error('Error fetching seller cars:', error);
            toast.error('Failed to fetch seller cars');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (sellerCarId, action) => {
        try {
            const payload = {
                approval_status: action,
                admin_notes: actionData.admin_notes,
                admin_price: actionData.admin_price ? parseFloat(actionData.admin_price) : null
            };

            const response = await API.put(`/seller/admin/cars/${sellerCarId}`, payload);
            toast.success(`Car ${action} successfully!`);
            setShowActionModal(false);
            setActionData({ status: '', admin_notes: '', admin_price: '' });
            fetchSellerCars();
        } catch (error) {
            console.error('Error updating car:', error);
            toast.error(error.response?.data?.detail || 'Failed to update car');
        }
    };

    const handleDelete = async (sellerCarId) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return;
        try {
            await API.delete(`/seller/admin/cars/${sellerCarId}`);
            toast.success('Car deleted successfully!');
            fetchSellerCars();
        } catch (error) {
            console.error('Error deleting car:', error);
            toast.error('Failed to delete car');
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'badge-warning', text: '⏳ Pending' },
            approved: { class: 'badge-success', text: '✅ Approved' },
            rejected: { class: 'badge-danger', text: '❌ Rejected' },
            sold: { class: 'badge-info', text: '💰 Sold' }
        };
        return badges[status] || { class: 'badge-secondary', text: status };
    };

    const getFilterCount = (status) => {
        if (status === 'all') return sellerCars.length;
        return sellerCars.filter(c => c.approval_status === status).length;
    };

    const filteredCars = sellerCars.filter(car => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return (
            car.car_brand?.toLowerCase().includes(search) ||
            car.car_model?.toLowerCase().includes(search) ||
            car.seller_name?.toLowerCase().includes(search) ||
            car.seller_email?.toLowerCase().includes(search)
        );
    });

    const openActionModal = (car, status) => {
        setSelectedCar(car);
        setActionData({
            status: status,
            admin_notes: car.admin_notes || '',
            admin_price: car.admin_price || car.expected_price || ''
        });
        setShowActionModal(true);
    };

    // ✅ Open detail modal with all documents
    const openDetailModal = (car) => {
        setSelectedCar(car);
        setShowDetailModal(true);
    };

    if (loading) {
        return <div className="loading">Loading seller cars...</div>;
    }

    return (
        <div className="admin-seller-cars">
            <div className="admin-header">
                <h2>🏪 Seller Cars Management</h2>
                <span className="total-cars">Total: {sellerCars.length}</span>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button 
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    📋 All ({getFilterCount('all')})
                </button>
                <button 
                    className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    ⏳ Pending ({getFilterCount('pending')})
                </button>
                <button 
                    className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
                    onClick={() => setFilter('approved')}
                >
                    ✅ Approved ({getFilterCount('approved')})
                </button>
                <button 
                    className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setFilter('rejected')}
                >
                    ❌ Rejected ({getFilterCount('rejected')})
                </button>
                <button 
                    className={`filter-tab ${filter === 'sold' ? 'active' : ''}`}
                    onClick={() => setFilter('sold')}
                >
                    💰 Sold ({getFilterCount('sold')})
                </button>
            </div>

            {/* Search */}
            <div className="admin-toolbar">
                <input
                    type="text"
                    placeholder="🔍 Search by brand, model, seller..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <button className="btn-secondary" onClick={fetchSellerCars}>🔄 Refresh</button>
            </div>

            {filteredCars.length === 0 ? (
                <div className="admin-empty">
                    <p>No seller cars found</p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>Seller</th>
                                <th>Expected Price</th>
                                <th>Admin Price</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCars.map((car) => {
                                const status = getStatusBadge(car.approval_status);
                                return (
                                    <tr key={car.id}>
                                        <td>
                                            <div className="car-cell">
                                                <img
                                                    src={getImageUrl(car.car_images?.[0])}
                                                    alt={`${car.car_brand} ${car.car_model}`}
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/60'}
                                                />
                                                <div>
                                                    <strong>{car.car_brand} {car.car_model}</strong>
                                                    <span>{car.car_year || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="seller-info">
                                                <strong>{car.seller_name || 'Unknown'}</strong>
                                                <span>{car.seller_email || 'N/A'}</span>
                                                <span className="seller-phone">{car.seller_mobile || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td>₹{car.expected_price?.toLocaleString()}</td>
                                        <td>
                                            {car.admin_price ? (
                                                <span className="admin-price">₹{car.admin_price.toLocaleString()}</span>
                                            ) : (
                                                <span className="text-muted">Not set</span>
                                            )}
                                        </td>
                                        <td>
                                            <span className={`status-badge ${status.class}`}>
                                                {status.text}
                                            </span>
                                            {car.admin_notes && (
                                                <div className="admin-note-tooltip" title={car.admin_notes}>
                                                    📝
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div className="date-info">
                                                {new Date(car.submitted_at).toLocaleDateString()}
                                                <br />
                                                <small>{new Date(car.submitted_at).toLocaleTimeString()}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {/* ✅ View Details - Shows all documents */}
                                                <button
                                                    className="btn-view"
                                                    onClick={() => openDetailModal(car)}
                                                    title="View Details & Documents"
                                                >
                                                    👁️
                                                </button>
                                                
                                                {car.approval_status === 'pending' && (
                                                    <>
                                                        <button
                                                            className="btn-approve"
                                                            onClick={() => openActionModal(car, 'approved')}
                                                            title="Approve"
                                                        >
                                                            ✅
                                                        </button>
                                                        <button
                                                            className="btn-reject"
                                                            onClick={() => openActionModal(car, 'rejected')}
                                                            title="Reject"
                                                        >
                                                            ❌
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {car.approval_status === 'approved' && (
                                                    <button
                                                        className="btn-sold"
                                                        onClick={() => openActionModal(car, 'sold')}
                                                        title="Mark as Sold"
                                                    >
                                                        💰
                                                    </button>
                                                )}
                                                
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(car.id)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal with Documents */}
            {showDetailModal && selectedCar && (
                <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>🚗 Car Details - {selectedCar.car_brand} {selectedCar.car_model}</h2>
                            <button className="modal-close" onClick={() => setShowDetailModal(false)}>×</button>
                        </div>
                        <div className="car-detail-grid">
                            <div className="detail-section">
                                <h4>Car Information</h4>
                                <p><strong>Brand:</strong> {selectedCar.car_brand}</p>
                                <p><strong>Model:</strong> {selectedCar.car_model}</p>
                                <p><strong>Year:</strong> {selectedCar.car_year || 'N/A'}</p>
                                <p><strong>RTO:</strong> {selectedCar.car_rto || 'N/A'}</p>
                                <p><strong>Condition:</strong> {selectedCar.car_condition || 'N/A'}</p>
                                <p><strong>Expected Price:</strong> ₹{selectedCar.expected_price?.toLocaleString()}</p>
                                {selectedCar.admin_price && (
                                    <p><strong>Admin Price:</strong> ₹{selectedCar.admin_price.toLocaleString()}</p>
                                )}
                            </div>
                            <div className="detail-section">
                                <h4>Seller Information</h4>
                                <p><strong>Name:</strong> {selectedCar.seller_name || 'Unknown'}</p>
                                <p><strong>Email:</strong> {selectedCar.seller_email || 'N/A'}</p>
                                <p><strong>Mobile:</strong> {selectedCar.seller_mobile || 'N/A'}</p>
                            </div>
                            <div className="detail-section full-width">
                                <h4>Additional Details</h4>
                                <p><strong>Reason for Sale:</strong> {selectedCar.reason_for_sale || 'Not provided'}</p>
                                <p><strong>Pickup Address:</strong> {selectedCar.pickup_address || 'Not provided'}</p>
                                {selectedCar.admin_notes && (
                                    <p><strong>Admin Notes:</strong> {selectedCar.admin_notes}</p>
                                )}
                                <p><strong>Status:</strong> <span className={`status-badge ${getStatusBadge(selectedCar.approval_status).class}`}>
                                    {selectedCar.approval_status.toUpperCase()}
                                </span></p>
                                <p><strong>Submitted:</strong> {new Date(selectedCar.submitted_at).toLocaleString()}</p>
                                {selectedCar.approved_at && (
                                    <p><strong>Approved:</strong> {new Date(selectedCar.approved_at).toLocaleString()}</p>
                                )}
                            </div>

                            {/* ✅ Documents Section - Only in View Details */}
                            <div className="detail-section full-width documents-section">
                                <h4>📄 Documents</h4>
                                <div className="documents-grid">
                                    {selectedCar.rc_image ? (
                                        <div className="doc-item">
                                            <h5>📄 RC Document</h5>
                                            <img 
                                                src={selectedCar.rc_image} 
                                                alt="RC Document"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x250/4A6CF7/FFFFFF?text=RC+Document';
                                                }}
                                                className="doc-image"
                                            />
                                            <a href={selectedCar.rc_image} target="_blank" rel="noopener noreferrer" className="doc-link">
                                                🔗 View Full Image
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="doc-item no-doc">
                                            <span className="no-doc-icon">📄</span>
                                            <p>No RC Document uploaded</p>
                                        </div>
                                    )}
                                    
                                    {selectedCar.insurance_image ? (
                                        <div className="doc-item">
                                            <h5>📋 Insurance Document</h5>
                                            <img 
                                                src={selectedCar.insurance_image} 
                                                alt="Insurance Document"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/400x250/4A6CF7/FFFFFF?text=Insurance+Document';
                                                }}
                                                className="doc-image"
                                            />
                                            <a href={selectedCar.insurance_image} target="_blank" rel="noopener noreferrer" className="doc-link">
                                                🔗 View Full Image
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="doc-item no-doc">
                                            <span className="no-doc-icon">📋</span>
                                            <p>No Insurance Document uploaded</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Modal */}
            {showActionModal && selectedCar && (
                <div className="modal-overlay" onClick={() => setShowActionModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>
                                {actionData.status === 'approved' && '✅ Approve Car'}
                                {actionData.status === 'rejected' && '❌ Reject Car'}
                                {actionData.status === 'sold' && '💰 Mark as Sold'}
                            </h2>
                            <button className="modal-close" onClick={() => setShowActionModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="car-summary">
                                <p><strong>Car:</strong> {selectedCar.car_brand} {selectedCar.car_model}</p>
                                <p><strong>Seller:</strong> {selectedCar.seller_name || 'Unknown'}</p>
                                <p><strong>Expected Price:</strong> ₹{selectedCar.expected_price?.toLocaleString()}</p>
                            </div>
                            
                            <div className="form-group">
                                <label>Admin Notes</label>
                                <textarea
                                    value={actionData.admin_notes}
                                    onChange={(e) => setActionData({ ...actionData, admin_notes: e.target.value })}
                                    placeholder="Add notes for the seller..."
                                    rows="3"
                                />
                            </div>

                            {actionData.status === 'approved' && (
                                <div className="form-group">
                                    <label>Admin Price (Optional)</label>
                                    <input
                                        type="number"
                                        value={actionData.admin_price}
                                        onChange={(e) => setActionData({ ...actionData, admin_price: e.target.value })}
                                        placeholder="Set price for public listing"
                                    />
                                    <small>If set, this price will be shown on the website</small>
                                </div>
                            )}

                            {actionData.status === 'sold' && (
                                <div className="form-group">
                                    <label>Final Price</label>
                                    <input
                                        type="number"
                                        value={actionData.admin_price}
                                        onChange={(e) => setActionData({ ...actionData, admin_price: e.target.value })}
                                        placeholder="Enter final selling price"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setShowActionModal(false)}>Cancel</button>
                            <button 
                                className={`btn-${actionData.status}`}
                                onClick={() => handleAction(selectedCar.id, actionData.status)}
                            >
                                {actionData.status === 'approved' && '✅ Approve'}
                                {actionData.status === 'rejected' && '❌ Reject'}
                                {actionData.status === 'sold' && '💰 Mark Sold'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== INLINE STYLES ========== */}
            <style>{`
                /* Documents Section in Modal */
                .documents-section {
                    margin-top: 10px;
                    padding-top: 15px;
                    border-top: 2px solid var(--border-color, #e8ecf1);
                }

                .documents-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-top: 10px;
                }

                .doc-item {
                    background: var(--bg-hover, #f0f2f8);
                    border-radius: 12px;
                    padding: 15px;
                    text-align: center;
                }

                .doc-item h5 {
                    margin: 0 0 10px;
                    font-size: 0.9rem;
                    color: var(--text-primary, #1a1a2e);
                }

                .doc-item .doc-image {
                    width: 100%;
                    max-height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 1px solid var(--border-color, #dce0e5);
                }

                .doc-item .doc-link {
                    display: inline-block;
                    margin-top: 10px;
                    font-size: 0.85rem;
                    color: #4A6CF7;
                    text-decoration: none;
                    font-weight: 600;
                }

                .doc-item .doc-link:hover {
                    text-decoration: underline;
                }

                .doc-item.no-doc {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 150px;
                    background: var(--bg-secondary, #f8f9ff);
                    border: 2px dashed var(--border-color, #dce0e5);
                }

                .doc-item.no-doc .no-doc-icon {
                    font-size: 2.5rem;
                    opacity: 0.3;
                }

                .doc-item.no-doc p {
                    color: var(--text-muted, #888);
                    font-size: 0.9rem;
                    margin: 8px 0 0;
                }

                /* Modal Large */
                .modal-content.large {
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .car-detail-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    padding: 20px;
                }

                .detail-section {
                    background: var(--bg-secondary, #f8f9fa);
                    padding: 15px;
                    border-radius: 8px;
                }

                .detail-section h4 {
                    margin: 0 0 12px;
                    color: var(--text-primary, #1a1a2e);
                    border-bottom: 2px solid var(--border-color, #dce0e5);
                    padding-bottom: 8px;
                }

                .detail-section p {
                    margin: 6px 0;
                    font-size: 0.95rem;
                    color: var(--text-secondary, #2d2d44);
                }

                .detail-section.full-width {
                    grid-column: 1 / -1;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .documents-grid {
                        grid-template-columns: 1fr;
                    }

                    .car-detail-grid {
                        grid-template-columns: 1fr;
                        padding: 15px;
                    }

                    .modal-content.large {
                        padding: 15px;
                    }
                }

                @media (max-width: 480px) {
                    .doc-item .doc-image {
                        max-height: 150px;
                    }

                    .doc-item.no-doc {
                        min-height: 100px;
                    }

                    .doc-item.no-doc .no-doc-icon {
                        font-size: 2rem;
                    }
                }

                /* Dark Theme */
                [data-theme="dark"] .doc-item {
                    background: #2a2a4a;
                }

                [data-theme="dark"] .doc-item h5 {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .doc-item.no-doc {
                    background: #1a1a2e;
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .detail-section {
                    background: #1a1a2e;
                }

                [data-theme="dark"] .detail-section h4 {
                    color: #e8e8f0;
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .detail-section p {
                    color: #c0c0d8;
                }

                [data-theme="dark"] .documents-section {
                    border-color: #2a2a4a;
                }
            `}</style>
        </div>
    );
};

export default AdminSellerCars;