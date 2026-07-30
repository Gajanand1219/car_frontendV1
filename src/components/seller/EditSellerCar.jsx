// src/components/seller/EditSellerCar.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSeller } from '../../context/SellerContext';
import toast from 'react-hot-toast';
import API, { getImageUrl } from '../../api/axios';
import './SellerFormCommon.css';

const EditSellerCar = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { updateCar } = useSeller();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        rto: '',
        vehicle_condition: 'old',
        variant: '',
        year: '',
        registration_year: '',
        fuel: '',
        transmission: '',
        owner: '',
        kilometers: '',
        color: '',
        description: '',
        features: '',
        images: [],
        car_id: '',
        expected_price: '',
        reason_for_sale: '',
        pickup_address: '',
        approval_status: ''
    });

    useEffect(() => {
        fetchCarDetails();
    }, [id]);

    const fetchCarDetails = async () => {
        try {
            setLoading(true);
            const response = await API.get(`/seller/cars/${id}`);
            const data = response.data;
            
            setFormData({
                car_id: data.car_id || '',
                brand: data.car_brand || '',
                model: data.car_model || '',
                rto: data.car_rto || '',
                vehicle_condition: data.car_condition || 'old',
                variant: data.variant || '',
                year: data.car_year || '',
                registration_year: data.registration_year || '',
                fuel: data.fuel || '',
                transmission: data.transmission || '',
                owner: data.owner || '',
                kilometers: data.kilometers || '',
                color: data.color || '',
                description: data.description || '',
                features: data.features?.join(', ') || '',
                images: data.car_images || [],
                expected_price: data.expected_price || '',
                reason_for_sale: data.reason_for_sale || '',
                pickup_address: data.pickup_address || '',
                approval_status: data.approval_status || ''
            });
            
            if (data.car_images && data.car_images.length > 0) {
                setExistingImages(data.car_images);
                setImagePreviews(data.car_images);
            }
            
        } catch (error) {
            console.error('Error fetching car:', error);
            toast.error('Failed to load car details');
            navigate('/seller/cars');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let hasError = false;
        let errorMsg = "";

        const requiredFields = [
            { key: 'brand', label: 'Brand' },
            { key: 'model', label: 'Model' },
            { key: 'rto', label: 'RTO' },
            { key: 'expected_price', label: 'Expected Price' }
        ];

        requiredFields.forEach(field => {
            if (!formData[field.key] || formData[field.key].toString().trim() === '') {
                newErrors[field.key] = `${field.label} is required`;
                errorMsg += `• ${field.label}\n`;
                hasError = true;
            }
        });

        if (formData.expected_price && parseFloat(formData.expected_price) <= 0) {
            newErrors.expected_price = 'Price must be greater than 0';
            errorMsg += '• Valid Expected Price\n';
            hasError = true;
        }

        setErrors(newErrors);

        if (hasError) {
            setErrorMessage(`⚠️ Please fill the following required fields:\n\n${errorMsg}`);
            setShowErrorPopup(true);
            return false;
        }

        return true;
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const totalImages = imagePreviews.length + files.length;

        if (totalImages > 10) {
            toast.error('Maximum 10 images allowed');
            e.target.value = '';
            return;
        }

        const newFiles = files.filter(file => {
            return !imageFiles.some(existingFile =>
                existingFile.name === file.name && existingFile.size === file.size
            );
        });

        if (newFiles.length === 0) {
            toast.warning('Duplicate images detected');
            e.target.value = '';
            return;
        }

        setImageFiles([...imageFiles, ...newFiles]);

        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });

        toast.success(`${newFiles.length} image(s) added`);
        e.target.value = '';
    };

    const handleRemoveImage = (index) => {
        const previewToRemove = imagePreviews[index];

        if (previewToRemove.startsWith('data:image')) {
            const newFiles = imageFiles.filter((_, i) => i !== index);
            setImageFiles(newFiles);
        } else {
            setExistingImages(existingImages.filter((_, i) => i !== index));
        }

        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        setImagePreviews(newPreviews);
    };

    const uploadImages = async () => {
        if (imageFiles.length === 0) return [];

        setUploadingImages(true);
        try {
            const formData = new FormData();
            imageFiles.forEach(file => {
                formData.append('images', file);
            });

            const response = await API.post('/upload/images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return response.data.urls || [];
        } catch (error) {
            console.error('❌ Image upload error:', error);
            toast.error('Failed to upload images');
            return [];
        } finally {
            setUploadingImages(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            setSubmitting(true);
            
            let uploadedImageUrls = [];
            if (imageFiles.length > 0) {
                uploadedImageUrls = await uploadImages();
                if (uploadedImageUrls.length === 0 && imageFiles.length > 0) {
                    toast.error('Failed to upload some images');
                }
            }

            const allImages = [...existingImages, ...uploadedImageUrls];

            const updateData = {
                expected_price: parseFloat(formData.expected_price),
                reason_for_sale: formData.reason_for_sale,
                pickup_address: formData.pickup_address,
                approval_status: formData.approval_status === 'rejected' ? 'pending' : formData.approval_status,
                images: allImages.length > 0 ? allImages : undefined,
                features: formData.features ? formData.features.split(',').map(f => f.trim()).filter(f => f) : undefined
            };

            await updateCar(id, updateData);

            toast.success('✅ Car updated successfully!');
            navigate('/seller/cars');
            
        } catch (error) {
            console.error('Error updating car:', error);
            toast.error(error.response?.data?.detail || 'Failed to update car');
        } finally {
            setSubmitting(false);
        }
    };

    const closeErrorPopup = () => {
        setShowErrorPopup(false);
    };

    if (loading) {
        return (
            <div className="seller-form-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading car details...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="seller-form-container">
            {/* Page Header */}
            <div className="seller-form-header edit-header">
                <div className="header-icon">✏️</div>
                <h1>Edit Car Listing</h1>
                <p className="subtitle">Update the details of your car</p>
                {formData.approval_status === 'rejected' && (
                    <div className="status-banner rejected">
                        ⚠️ This car was rejected. Please update and resubmit for approval.
                    </div>
                )}
                {formData.approval_status === 'pending' && (
                    <div className="status-banner pending">
                        ⏳ This car is pending approval. You can still edit it.
                    </div>
                )}
                {formData.approval_status === 'approved' && (
                    <div className="status-banner approved">
                        ✅ This car is approved and visible to buyers.
                    </div>
                )}
                <div className="header-steps">
                    <span className="step-active">1. Details</span>
                    <span className="step-line">—</span>
                    <span>2. Images</span>
                    <span className="step-line">—</span>
                    <span>3. Update</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="seller-form">
                {/* Car Details Section */}
                <div className="form-section">
                    <div className="section-header">
                        <span className="section-icon">🚗</span>
                        <h3>Car Details</h3>
                        <span className="section-badge required">Required</span>
                    </div>
                    <div className="form-grid">
                        <div className={`form-group ${errors.brand ? 'has-error' : ''}`}>
                            <label>Brand <span className="required-star">*</span></label>
                            <input
                                type="text"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="e.g., Toyota, Honda, BMW"
                                className={errors.brand ? 'error-input' : ''}
                            />
                            {errors.brand && <span className="error-text">{errors.brand}</span>}
                        </div>

                        <div className={`form-group ${errors.model ? 'has-error' : ''}`}>
                            <label>Model <span className="required-star">*</span></label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleChange}
                                placeholder="e.g., Innova, City, X5"
                                className={errors.model ? 'error-input' : ''}
                            />
                            {errors.model && <span className="error-text">{errors.model}</span>}
                        </div>

                        <div className={`form-group ${errors.rto ? 'has-error' : ''}`}>
                            <label>RTO <span className="required-star">*</span></label>
                            <input
                                type="text"
                                name="rto"
                                value={formData.rto}
                                onChange={handleChange}
                                placeholder="e.g., MH-26, MH-12"
                                className={errors.rto ? 'error-input' : ''}
                            />
                            {errors.rto && <span className="error-text">{errors.rto}</span>}
                        </div>

                        <div className="form-group">
                            <label>Vehicle Condition</label>
                            <select name="vehicle_condition" value={formData.vehicle_condition} onChange={handleChange}>
                                <option value="new">✨ New</option>
                                <option value="old">🔄 Old / Used</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Variant</label>
                            <input type="text" name="variant" value={formData.variant} onChange={handleChange} placeholder="e.g., ZX, VX, Premium" />
                        </div>

                        <div className="form-group">
                            <label>Year</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="e.g., 2020" />
                        </div>

                        <div className="form-group">
                            <label>Registration Year</label>
                            <input type="number" name="registration_year" value={formData.registration_year} onChange={handleChange} placeholder="e.g., 2021" />
                        </div>

                        <div className="form-group">
                            <label>Fuel Type</label>
                            <select name="fuel" value={formData.fuel} onChange={handleChange}>
                                <option value="">-- Select Fuel --</option>
                                <option value="Petrol">⛽ Petrol</option>
                                <option value="Diesel">⛽ Diesel</option>
                                <option value="Electric">🔋 Electric</option>
                                <option value="Hybrid">🌿 Hybrid</option>
                                <option value="CNG">⛽ CNG</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Transmission</label>
                            <select name="transmission" value={formData.transmission} onChange={handleChange}>
                                <option value="">-- Select Transmission --</option>
                                <option value="Manual">⚙️ Manual</option>
                                <option value="Automatic">⚙️ Automatic</option>
                                <option value="CVT">⚙️ CVT</option>
                                <option value="DCT">⚙️ DCT</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Owner</label>
                            <select name="owner" value={formData.owner} onChange={handleChange}>
                                <option value="">-- Select Owner --</option>
                                <option value="First">👤 First Owner</option>
                                <option value="Second">👤 Second Owner</option>
                                <option value="Third">👤 Third Owner</option>
                                <option value="Multiple">👥 Multiple Owners</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Kilometers Driven</label>
                            <input type="number" name="kilometers" value={formData.kilometers} onChange={handleChange} placeholder="e.g., 50000" />
                        </div>

                        <div className="form-group">
                            <label>Color</label>
                            <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="e.g., White, Black, Red" />
                        </div>

                        <div className="form-group full-width">
                            <label>Features (comma separated)</label>
                            <input type="text" name="features" value={formData.features} onChange={handleChange} placeholder="e.g., ABS, Airbags, Power Steering" />
                            <div className="field-hint">
                                <span>💡 Separate features with commas</span>
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe your car in detail..." />
                        </div>
                    </div>
                </div>

                {/* Price & Details Section */}
                <div className="form-section">
                    <div className="section-header">
                        <span className="section-icon">💰</span>
                        <h3>Price & Details</h3>
                        <span className="section-badge required">Required</span>
                    </div>
                    <div className="form-grid">
                        <div className={`form-group full-width ${errors.expected_price ? 'has-error' : ''}`}>
                            <label>Expected Price (₹) <span className="required-star">*</span></label>
                            <input
                                type="number"
                                name="expected_price"
                                value={formData.expected_price}
                                onChange={handleChange}
                                placeholder="e.g., 500000"
                                className={errors.expected_price ? 'error-input' : ''}
                            />
                            {errors.expected_price && <span className="error-text">{errors.expected_price}</span>}
                            <div className="field-hint">
                                <span>💡 Tip: Research similar cars to set a competitive price</span>
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Reason for Sale</label>
                            <textarea name="reason_for_sale" value={formData.reason_for_sale} onChange={handleChange} rows="3" placeholder="Why are you selling this car?" />
                        </div>

                        <div className="form-group full-width">
                            <label>Pickup Address</label>
                            <textarea name="pickup_address" value={formData.pickup_address} onChange={handleChange} rows="2" placeholder="Where can the car be inspected?" />
                            <div className="field-hint">
                                <span>📍 Buyers will contact you to schedule inspection</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Images Section */}
                <div className="form-section">
                    <div className="section-header">
                        <span className="section-icon">📸</span>
                        <h3>Car Images ({imagePreviews.length}/10)</h3>
                        <span className="section-badge optional">Optional</span>
                    </div>
                    
                    <div className="image-upload-area">
                        <div className="upload-drop-zone">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                id="seller-image-upload"
                                className="file-input"
                            />
                            <label htmlFor="seller-image-upload" className="upload-label">
                                <span className="upload-icon">📤</span>
                                <span className="upload-text">Click or drag to upload images</span>
                                <span className="upload-hint">(Max 10 images, JPG, PNG, WebP)</span>
                            </label>
                        </div>
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="image-preview-grid">
                            {imagePreviews.map((url, index) => (
                                <div key={index} className="image-preview-item">
                                    <img
                                        src={url.startsWith('data:image') ? url : getImageUrl(url)}
                                        alt={`Car ${index + 1}`}
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/100/4A6CF7/FFFFFF?text=Car';
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="remove-image"
                                        onClick={() => handleRemoveImage(index)}
                                        title="Remove image"
                                    >
                                        ×
                                    </button>
                                    <span className="image-number">{index + 1}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="image-count-info">
                        <span className={`count-badge ${imagePreviews.length === 10 ? 'count-full' : ''}`}>
                            {imagePreviews.length} / 10 images added
                        </span>
                        {uploadingImages && <span className="uploading-status">⏳ Uploading...</span>}
                        {imageFiles.length > 0 && !uploadingImages && (
                            <span className="pending-upload">{imageFiles.length} pending upload</span>
                        )}
                    </div>
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                    <button type="button" onClick={() => navigate('/seller/cars')} className="btn btn-secondary btn-cancel">
                        ✕ Cancel
                    </button>
                    <button type="submit" className="btn btn-primary btn-submit" disabled={submitting || uploadingImages}>
                        {submitting || uploadingImages ? (
                            <>
                                <span className="spinner"></span> Updating...
                            </>
                        ) : (
                            <>
                                <span>💾</span> Update Car
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Error Popup */}
            {showErrorPopup && (
                <div className="error-popup-overlay" onClick={closeErrorPopup}>
                    <div className="error-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="error-popup-icon">⚠️</div>
                        <h3>Required Fields Missing</h3>
                        <div className="error-popup-message">
                            <pre>{errorMessage}</pre>
                        </div>
                        <button className="btn btn-primary" onClick={closeErrorPopup}>
                            Okay, I'll fill them
                        </button>
                    </div>
                </div>
            )}

            {/* Scroll to Top */}
            <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>
        </div>
    );
};

export default EditSellerCar;