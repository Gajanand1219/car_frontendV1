// src/components/seller/SellerCars.jsx
import React, { useState } from 'react';
import { useSeller } from '../../context/SellerContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerCars = () => {
    const { sellerCars, deleteCar, loading } = useSeller();
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [carToDelete, setCarToDelete] = useState(null);
    const [selectedCar, setSelectedCar] = useState(null);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);

    if (loading) {
        return (
            <div className="seller-cars-loading">
                <div className="loading-spinner"></div>
                <p>Loading your cars...</p>
            </div>
        );
    }

    // Filter cars by status
    const filteredCars = filter === 'all' 
        ? sellerCars 
        : sellerCars.filter(car => car.approval_status === filter);

    // Search filter
    const searchedCars = filteredCars.filter(car => {
        const search = searchTerm.toLowerCase();
        return (
            car.car_brand?.toLowerCase().includes(search) ||
            car.car_model?.toLowerCase().includes(search) ||
            car.car_year?.toString().includes(search)
        );
    });

    const getStatusBadge = (status) => {
        const badges = {
            pending: { class: 'badge-pending', icon: '⏳', text: 'Pending' },
            approved: { class: 'badge-approved', icon: '✅', text: 'Approved' },
            rejected: { class: 'badge-rejected', icon: '❌', text: 'Rejected' },
            sold: { class: 'badge-sold', icon: '💰', text: 'Sold' }
        };
        return badges[status] || { class: 'badge-default', icon: '📌', text: status };
    };

    const getStatusCount = (status) => {
        if (status === 'all') return sellerCars.length;
        return sellerCars.filter(c => c.approval_status === status).length;
    };

    const handleDelete = async (id) => {
        try {
            await deleteCar(id);
            toast.success('Car deleted successfully!');
            setShowDeleteModal(false);
            setCarToDelete(null);
        } catch (error) {
            console.error('Error deleting car:', error);
            toast.error('Failed to delete car');
        }
    };

    const openDeleteModal = (car) => {
        setCarToDelete(car);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setCarToDelete(null);
    };

    const openDocumentsModal = (car) => {
        setSelectedCar(car);
        setShowDocumentsModal(true);
    };

    const closeDocumentsModal = () => {
        setShowDocumentsModal(false);
        setSelectedCar(null);
    };

    return (
        <div className="seller-cars-page">
            {/* ========== PAGE HEADER ========== */}
            <div className="seller-cars-header">
                <div className="header-left">
                    <h1>🚗 My Cars</h1>
                    <p className="subtitle">Manage all your car listings in one place</p>
                </div>
                <Link to="/seller/add" className="btn btn-primary btn-add">
                    <span>➕</span> List New Car
                </Link>
            </div>

            {/* ========== SEARCH & FILTERS ========== */}
            <div className="seller-cars-toolbar">
                <div className="search-wrapper">
                    <span className="search-icon">🔍</span>
                    <input
                        type="text"
                        placeholder="Search by brand, model or year..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    {searchTerm && (
                        <button 
                            className="search-clear"
                            onClick={() => setSearchTerm('')}
                        >
                            ×
                        </button>
                    )}
                </div>
                <div className="toolbar-right">
                    <span className="total-count">{sellerCars.length} Total</span>
                    <button 
                        className="btn-refresh" 
                        onClick={() => window.location.reload()}
                        title="Refresh"
                    >
                        🔄
                    </button>
                </div>
            </div>

            {/* ========== FILTER TABS ========== */}
            <div className="filter-tabs">
                <button 
                    className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                    onClick={() => setFilter('all')}
                >
                    📋 All
                    <span className="tab-count">{getStatusCount('all')}</span>
                </button>
                <button 
                    className={`filter-tab pending ${filter === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilter('pending')}
                >
                    ⏳ Pending
                    <span className="tab-count">{getStatusCount('pending')}</span>
                </button>
                <button 
                    className={`filter-tab approved ${filter === 'approved' ? 'active' : ''}`}
                    onClick={() => setFilter('approved')}
                >
                    ✅ Approved
                    <span className="tab-count">{getStatusCount('approved')}</span>
                </button>
                <button 
                    className={`filter-tab rejected ${filter === 'rejected' ? 'active' : ''}`}
                    onClick={() => setFilter('rejected')}
                >
                    ❌ Rejected
                    <span className="tab-count">{getStatusCount('rejected')}</span>
                </button>
                <button 
                    className={`filter-tab sold ${filter === 'sold' ? 'active' : ''}`}
                    onClick={() => setFilter('sold')}
                >
                    💰 Sold
                    <span className="tab-count">{getStatusCount('sold')}</span>
                </button>
            </div>

            {/* ========== CARS GRID ========== */}
            {searchedCars.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">🚗</div>
                    <h3>No Cars Found</h3>
                    <p>
                        {searchTerm 
                            ? `No results found for "${searchTerm}"` 
                            : 'Start listing your cars to sell on our platform'}
                    </p>
                    {searchTerm ? (
                        <button 
                            className="btn btn-secondary" 
                            onClick={() => setSearchTerm('')}
                        >
                            Clear Search
                        </button>
                    ) : (
                        <Link to="/seller/add" className="btn btn-primary">
                            ➕ List Your First Car
                        </Link>
                    )}
                </div>
            ) : (
                <div className="cars-grid">
                    {searchedCars.map((car) => {
                        const status = getStatusBadge(car.approval_status);
                        return (
                            <div key={car.id} className="car-card">
                                {/* Car Image */}
                                <div className="car-image-wrapper">
                                    {car.car_images && car.car_images.length > 0 ? (
                                        <img 
                                            src={car.car_images[0]} 
                                            alt={`${car.car_brand} ${car.car_model}`}
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/400x300/4A6CF7/FFFFFF?text=Car';
                                            }}
                                        />
                                    ) : (
                                        <div className="no-image">🚗</div>
                                    )}
                                    <span className={`status-badge ${status.class}`}>
                                        {status.icon} {status.text}
                                    </span>
                                </div>

                                {/* Car Info */}
                                <div className="car-details">
                                    <div className="car-title">
                                        <h3>{car.car_brand} {car.car_model}</h3>
                                        <span className="car-year">{car.car_year || 'N/A'}</span>
                                    </div>
                                    
                                    <div className="car-price-section">
                                        <p className="expected-price">₹{car.expected_price?.toLocaleString()}</p>
                                        {car.admin_price && (
                                            <p className="admin-price">Admin: ₹{car.admin_price.toLocaleString()}</p>
                                        )}
                                    </div>

                                    <div className="car-meta">
                                        <span className="meta-item">
                                            <span className="meta-icon">📅</span>
                                            {new Date(car.submitted_at).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        {car.admin_notes && (
                                            <span className="meta-item admin-note" title={car.admin_notes}>
                                                📝 Notes
                                            </span>
                                        )}
                                    </div>

                                    {/* ✅ Documents Section - RC & Insurance */}
                                    <div className="car-documents">
                                        {car.rc_image && (
                                            <button 
                                                className="doc-btn rc-doc"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDocumentsModal(car);
                                                }}
                                            >
                                                📄 RC Document
                                            </button>
                                        )}
                                        {car.insurance_image && (
                                            <button 
                                                className="doc-btn insurance-doc"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDocumentsModal(car);
                                                }}
                                            >
                                                📋 Insurance
                                            </button>
                                        )}
                                        {!car.rc_image && !car.insurance_image && (
                                            <span className="no-docs">📎 No documents uploaded</span>
                                        )}
                                    </div>
                                </div>

                                {/* Car Actions */}
                                <div className="car-actions">
                                    {car.approval_status === 'pending' && (
                                        <>
                                            <Link 
                                                to={`/seller/edit/${car.id}`} 
                                                className="btn-action btn-edit"
                                            >
                                                ✏️ Edit
                                            </Link>
                                            <button 
                                                onClick={() => openDeleteModal(car)} 
                                                className="btn-action btn-delete"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                    {car.approval_status === 'rejected' && (
                                        <>
                                            <Link 
                                                to={`/seller/edit/${car.id}`} 
                                                className="btn-action btn-edit"
                                            >
                                                ✏️ Edit
                                            </Link>
                                            <button 
                                                onClick={() => openDeleteModal(car)} 
                                                className="btn-action btn-delete"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                    {car.approval_status === 'approved' && (
                                        <span className="status-message success">
                                            ✅ Approved & Visible on Website
                                        </span>
                                    )}
                                    {car.approval_status === 'sold' && (
                                        <span className="status-message sold">
                                            💰 Sold
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ========== DELETE CONFIRMATION MODAL ========== */}
            {showDeleteModal && carToDelete && (
                <div className="delete-modal-overlay" onClick={closeDeleteModal}>
                    <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="delete-modal-icon">🗑️</div>
                        <h3>Delete Car</h3>
                        <p>
                            Are you sure you want to delete 
                            <strong> {carToDelete.car_brand} {carToDelete.car_model}</strong>?
                        </p>
                        <p className="delete-warning">This action cannot be undone.</p>
                        <div className="delete-modal-actions">
                            <button 
                                className="btn btn-secondary" 
                                onClick={closeDeleteModal}
                            >
                                Cancel
                            </button>
                            <button 
                                className="btn btn-danger" 
                                onClick={() => handleDelete(carToDelete.id)}
                            >
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== DOCUMENTS MODAL ========== */}
            {showDocumentsModal && selectedCar && (
                <div className="documents-modal-overlay" onClick={closeDocumentsModal}>
                    <div className="documents-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📄 Documents - {selectedCar.car_brand} {selectedCar.car_model}</h2>
                            <button className="modal-close" onClick={closeDocumentsModal}>×</button>
                        </div>
                        <div className="documents-content">
                            {selectedCar.rc_image && (
                                <div className="doc-item">
                                    <h4>📄 RC Document</h4>
                                    <img 
                                        src={selectedCar.rc_image} 
                                        alt="RC Document"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300/4A6CF7/FFFFFF?text=RC+Document';
                                        }}
                                        className="doc-image"
                                    />
                                    <a href={selectedCar.rc_image} target="_blank" rel="noopener noreferrer" className="doc-link">
                                        🔗 View Full Image
                                    </a>
                                </div>
                            )}
                            {selectedCar.insurance_image && (
                                <div className="doc-item">
                                    <h4>📋 Insurance Document</h4>
                                    <img 
                                        src={selectedCar.insurance_image} 
                                        alt="Insurance Document"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x300/4A6CF7/FFFFFF?text=Insurance+Document';
                                        }}
                                        className="doc-image"
                                    />
                                    <a href={selectedCar.insurance_image} target="_blank" rel="noopener noreferrer" className="doc-link">
                                        🔗 View Full Image
                                    </a>
                                </div>
                            )}
                            {!selectedCar.rc_image && !selectedCar.insurance_image && (
                                <p className="no-docs-text">No documents uploaded for this car.</p>
                            )}
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={closeDocumentsModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ========== INLINE STYLES ========== */}
            <style>{`
                /* ============================================
                   SELLER CARS PAGE - COMPLETE STYLES
                   ============================================ */

                .seller-cars-page {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 20px;
                }

                /* Loading */
                .seller-cars-loading {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    min-height: 400px;
                    gap: 20px;
                }

                .seller-cars-loading .loading-spinner {
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

                .seller-cars-loading p {
                    color: var(--text-muted, #888);
                    font-size: 1.1rem;
                }

                /* ========== HEADER ========== */
                .seller-cars-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid var(--border-color, #e8ecf1);
                }

                .seller-cars-header .header-left h1 {
                    margin: 0;
                    font-size: 2rem;
                    font-weight: 800;
                    color: var(--text-primary, #1a1a2e);
                }

                .seller-cars-header .header-left .subtitle {
                    margin: 4px 0 0;
                    color: var(--text-muted, #888);
                    font-size: 0.95rem;
                }

                .btn-add {
                    padding: 12px 28px;
                    border-radius: 12px;
                    font-weight: 700;
                    background: linear-gradient(135deg, #4A6CF7, #6C5CE7);
                    color: white;
                    border: none;
                    box-shadow: 0 4px 20px rgba(74, 108, 247, 0.3);
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }

                .btn-add:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(74, 108, 247, 0.4);
                    color: white;
                }

                /* ========== TOOLBAR ========== */
                .seller-cars-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .search-wrapper {
                    position: relative;
                    flex: 1;
                    min-width: 250px;
                    max-width: 450px;
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
                    padding: 11px 40px 11px 38px;
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
                    padding: 0 4px;
                }

                .search-wrapper .search-clear:hover {
                    color: #e74c3c;
                }

                .toolbar-right {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .total-count {
                    font-size: 0.9rem;
                    color: var(--text-muted, #888);
                    font-weight: 600;
                }

                .btn-refresh {
                    background: none;
                    border: 2px solid var(--border-color, #dce0e5);
                    border-radius: 10px;
                    padding: 8px 12px;
                    cursor: pointer;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    background: var(--bg-card, white);
                }

                .btn-refresh:hover {
                    border-color: #4A6CF7;
                    transform: rotate(180deg);
                }

                /* ========== FILTER TABS ========== */
                .filter-tabs {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-bottom: 25px;
                    padding-bottom: 15px;
                    border-bottom: 2px solid var(--border-color, #e8ecf1);
                }

                .filter-tab {
                    padding: 8px 20px;
                    border: 2px solid var(--border-color, #dce0e5);
                    border-radius: 25px;
                    background: transparent;
                    color: var(--text-secondary, #2d2d44);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .filter-tab:hover {
                    border-color: #4A6CF7;
                    color: #4A6CF7;
                    transform: translateY(-2px);
                }

                .filter-tab.active {
                    background: linear-gradient(135deg, #4A6CF7, #6C5CE7);
                    color: white;
                    border-color: #4A6CF7;
                    box-shadow: 0 4px 15px rgba(74, 108, 247, 0.3);
                }

                .filter-tab .tab-count {
                    background: rgba(0,0,0,0.08);
                    padding: 1px 10px;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .filter-tab.active .tab-count {
                    background: rgba(255,255,255,0.2);
                }

                .filter-tab.pending.active { background: linear-gradient(135deg, #f39c12, #e67e22); }
                .filter-tab.approved.active { background: linear-gradient(135deg, #2ecc71, #27ae60); }
                .filter-tab.rejected.active { background: linear-gradient(135deg, #e74c3c, #c0392b); }
                .filter-tab.sold.active { background: linear-gradient(135deg, #9b59b6, #8e44ad); }

                /* ========== EMPTY STATE ========== */
                .empty-state {
                    text-align: center;
                    padding: 80px 20px;
                    background: var(--bg-card, white);
                    border-radius: 20px;
                    border: 2px dashed var(--border-color, #dce0e5);
                }

                .empty-state .empty-icon {
                    font-size: 5rem;
                    margin-bottom: 15px;
                }

                .empty-state h3 {
                    font-size: 1.5rem;
                    margin: 0 0 10px;
                    color: var(--text-primary, #1a1a2e);
                }

                .empty-state p {
                    color: var(--text-muted, #888);
                    font-size: 1.05rem;
                    margin-bottom: 25px;
                }

                /* ========== CARS GRID ========== */
                .cars-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 25px;
                }

                .car-card {
                    background: var(--bg-card, white);
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid var(--border-color, #e8ecf1);
                    transition: all 0.3s ease;
                }

                .car-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
                    border-color: #4A6CF7;
                }

                /* ========== CAR IMAGE ========== */
                .car-image-wrapper {
                    position: relative;
                    height: 220px;
                    background: var(--bg-secondary, #f0f2f8);
                    overflow: hidden;
                }

                .car-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .car-image-wrapper .no-image {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    font-size: 5rem;
                    color: var(--text-muted, #888);
                }

                .car-image-wrapper .status-badge {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    padding: 5px 16px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.15);
                }

                .badge-pending { background: #f39c12; color: white; }
                .badge-approved { background: #2ecc71; color: white; }
                .badge-rejected { background: #e74c3c; color: white; }
                .badge-sold { background: #9b59b6; color: white; }
                .badge-default { background: #95a5a6; color: white; }

                /* ========== CAR DETAILS ========== */
                .car-details {
                    padding: 18px 20px;
                }

                .car-title {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .car-title h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--text-primary, #1a1a2e);
                }

                .car-title .car-year {
                    font-size: 0.85rem;
                    color: var(--text-muted, #888);
                    background: var(--bg-hover, #f0f2f8);
                    padding: 2px 12px;
                    border-radius: 12px;
                }

                .car-price-section {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 10px;
                }

                .expected-price {
                    font-size: 1.3rem;
                    font-weight: 800;
                    color: #4A6CF7;
                    margin: 0;
                }

                .admin-price {
                    font-size: 0.85rem;
                    color: var(--text-muted, #888);
                    margin: 0;
                }

                .car-meta {
                    display: flex;
                    gap: 15px;
                    flex-wrap: wrap;
                }

                .meta-item {
                    font-size: 0.85rem;
                    color: var(--text-muted, #888);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .meta-item .meta-icon {
                    font-size: 0.9rem;
                }

                .meta-item.admin-note {
                    background: rgba(74, 108, 247, 0.08);
                    padding: 2px 10px;
                    border-radius: 12px;
                    color: #4A6CF7;
                    cursor: help;
                }

                /* ========== CAR DOCUMENTS ========== */
                .car-documents {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid var(--border-color, #e8ecf1);
                }

                .doc-btn {
                    padding: 4px 14px;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .doc-btn.rc-doc {
                    background: rgba(74, 108, 247, 0.12);
                    color: #4A6CF7;
                }

                .doc-btn.rc-doc:hover {
                    background: #4A6CF7;
                    color: white;
                    transform: translateY(-2px);
                }

                .doc-btn.insurance-doc {
                    background: rgba(46, 204, 113, 0.12);
                    color: #2ecc71;
                }

                .doc-btn.insurance-doc:hover {
                    background: #2ecc71;
                    color: white;
                    transform: translateY(-2px);
                }

                .no-docs {
                    font-size: 0.75rem;
                    color: var(--text-muted, #888);
                }

                /* ========== DOCUMENTS MODAL ========== */
                .documents-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                }

                .documents-modal {
                    background: var(--bg-card, white);
                    border-radius: 20px;
                    padding: 30px;
                    max-width: 700px;
                    width: 90%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: scaleIn 0.3s ease;
                }

                .documents-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin: 20px 0;
                }

                .doc-item {
                    background: var(--bg-hover, #f0f2f8);
                    border-radius: 12px;
                    padding: 15px;
                    text-align: center;
                }

                .doc-item h4 {
                    margin: 0 0 10px;
                    font-size: 0.95rem;
                    color: var(--text-primary, #1a1a2e);
                }

                .doc-image {
                    width: 100%;
                    max-height: 250px;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 1px solid var(--border-color, #dce0e5);
                }

                .doc-link {
                    display: inline-block;
                    margin-top: 10px;
                    font-size: 0.85rem;
                    color: #4A6CF7;
                    text-decoration: none;
                    font-weight: 600;
                }

                .doc-link:hover {
                    text-decoration: underline;
                }

                .no-docs-text {
                    grid-column: 1 / -1;
                    text-align: center;
                    color: var(--text-muted, #888);
                    padding: 40px 0;
                    font-size: 1.1rem;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 15px;
                    border-bottom: 2px solid var(--border-color, #e8ecf1);
                }

                .modal-header h2 {
                    margin: 0;
                    font-size: 1.3rem;
                    color: var(--text-primary, #1a1a2e);
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.8rem;
                    cursor: pointer;
                    color: var(--text-muted, #888);
                    padding: 0 8px;
                }

                .modal-close:hover {
                    color: #e74c3c;
                }

                .modal-actions {
                    padding-top: 15px;
                    border-top: 2px solid var(--border-color, #e8ecf1);
                    display: flex;
                    justify-content: flex-end;
                    gap: 15px;
                }

                /* ========== CAR ACTIONS ========== */
                .car-actions {
                    padding: 14px 20px;
                    border-top: 1px solid var(--border-color, #e8ecf1);
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                    align-items: center;
                }

                .btn-action {
                    padding: 6px 16px;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                }

                .btn-edit {
                    background: rgba(74, 108, 247, 0.1);
                    color: #4A6CF7;
                }

                .btn-edit:hover {
                    background: #4A6CF7;
                    color: white;
                    transform: translateY(-2px);
                }

                .btn-delete {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                }

                .btn-delete:hover {
                    background: #e74c3c;
                    color: white;
                    transform: translateY(-2px);
                }

                .status-message {
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .status-message.success { color: #2ecc71; }
                .status-message.sold { color: #9b59b6; }

                /* ========== DELETE MODAL ========== */
                .delete-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.6);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                }

                .delete-modal {
                    background: var(--bg-card, white);
                    border-radius: 24px;
                    padding: 40px 45px;
                    max-width: 450px;
                    width: 90%;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                    animation: scaleIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .delete-modal-icon {
                    font-size: 4rem;
                    margin-bottom: 12px;
                }

                .delete-modal h3 {
                    font-size: 1.5rem;
                    margin: 0 0 10px;
                    color: var(--text-primary, #1a1a2e);
                }

                .delete-modal p {
                    color: var(--text-secondary, #2d2d44);
                    margin-bottom: 8px;
                    line-height: 1.6;
                }

                .delete-modal .delete-warning {
                    color: #e74c3c;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .delete-modal-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 25px;
                }

                .btn-danger {
                    background: #e74c3c;
                    color: white;
                    border: none;
                    padding: 12px 28px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-danger:hover {
                    background: #c0392b;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 20px rgba(231, 76, 60, 0.4);
                }

                .btn-secondary {
                    background: var(--bg-secondary, #f0f2f8);
                    color: var(--text-primary, #1a1a2e);
                    border: 2px solid var(--border-color, #dce0e5);
                    padding: 12px 28px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-secondary:hover {
                    background: var(--bg-hover, #e8ecf1);
                }

                /* ========== RESPONSIVE ========== */
                @media (max-width: 768px) {
                    .seller-cars-page {
                        padding: 12px;
                    }

                    .seller-cars-header {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .seller-cars-header .header-left h1 {
                        font-size: 1.5rem;
                    }

                    .btn-add {
                        width: 100%;
                        justify-content: center;
                    }

                    .seller-cars-toolbar {
                        flex-direction: column;
                    }

                    .search-wrapper {
                        max-width: 100%;
                        width: 100%;
                    }

                    .filter-tabs {
                        gap: 6px;
                    }

                    .filter-tab {
                        font-size: 0.75rem;
                        padding: 6px 14px;
                    }

                    .cars-grid {
                        grid-template-columns: 1fr 1fr;
                        gap: 15px;
                    }

                    .car-image-wrapper {
                        height: 160px;
                    }

                    .delete-modal {
                        padding: 28px 20px;
                    }

                    .delete-modal-actions {
                        flex-direction: column;
                    }

                    .delete-modal-actions .btn {
                        width: 100%;
                        justify-content: center;
                    }

                    .documents-modal {
                        padding: 20px;
                    }

                    .documents-content {
                        grid-template-columns: 1fr;
                    }

                    .doc-image {
                        max-height: 180px;
                    }
                }

                @media (max-width: 480px) {
                    .cars-grid {
                        grid-template-columns: 1fr;
                    }

                    .car-image-wrapper {
                        height: 200px;
                    }

                    .filter-tabs {
                        overflow-x: auto;
                        flex-wrap: nowrap;
                        padding-bottom: 10px;
                    }

                    .filter-tab {
                        white-space: nowrap;
                        font-size: 0.7rem;
                        padding: 5px 12px;
                    }

                    .seller-cars-header .header-left h1 {
                        font-size: 1.3rem;
                    }

                    .expected-price {
                        font-size: 1.1rem;
                    }

                    .documents-modal {
                        padding: 15px;
                    }

                    .doc-image {
                        max-height: 150px;
                    }

                    .modal-header h2 {
                        font-size: 1rem;
                    }
                }

                /* ========== DARK THEME ========== */
                [data-theme="dark"] .car-card {
                    background: #1f1f3a;
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .car-title h3 {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .search-wrapper .search-input {
                    background: #2a2a4a;
                    border-color: #3a3a5a;
                    color: #e8e8f0;
                }

                [data-theme="dark"] .filter-tab {
                    color: #c0c0d8;
                }

                [data-theme="dark"] .filter-tab.active {
                    color: white;
                }

                [data-theme="dark"] .delete-modal {
                    background: #1f1f3a;
                }

                [data-theme="dark"] .delete-modal h3 {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .delete-modal p {
                    color: #c0c0d8;
                }

                [data-theme="dark"] .btn-secondary {
                    background: #2a2a4a;
                    color: #e8e8f0;
                    border-color: #3a3a5a;
                }

                [data-theme="dark"] .btn-secondary:hover {
                    background: #3a3a5a;
                }

                [data-theme="dark"] .empty-state {
                    background: #1f1f3a;
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .empty-state h3 {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .seller-cars-header {
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .car-actions {
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .filter-tabs {
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .car-image-wrapper {
                    background: #1a1a2e;
                }

                [data-theme="dark"] .meta-item.admin-note {
                    background: rgba(74, 108, 247, 0.15);
                }

                [data-theme="dark"] .btn-refresh {
                    background: #1f1f3a;
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .total-count {
                    color: #8888aa;
                }

                [data-theme="dark"] .documents-modal {
                    background: #1f1f3a;
                }

                [data-theme="dark"] .doc-item {
                    background: #2a2a4a;
                }

                [data-theme="dark"] .doc-item h4 {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .modal-header {
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .modal-header h2 {
                    color: #e8e8f0;
                }

                [data-theme="dark"] .modal-actions {
                    border-color: #2a2a4a;
                }

                [data-theme="dark"] .doc-btn.rc-doc {
                    background: rgba(74, 108, 247, 0.2);
                }

                [data-theme="dark"] .doc-btn.insurance-doc {
                    background: rgba(46, 204, 113, 0.2);
                }
            `}</style>
        </div>
    );
};

export default SellerCars;