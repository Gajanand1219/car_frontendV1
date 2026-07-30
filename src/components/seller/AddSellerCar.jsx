// src/components/seller/AddSellerCar.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSeller } from '../../context/SellerContext';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import './SellerFormCommon.css';

const AddSellerCar = () => {
    const navigate = useNavigate();
    const { createCar } = useSeller();
    const [loading, setLoading] = useState(false);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    
    // Document upload states
    const [rcFile, setRcFile] = useState(null);
    const [rcPreview, setRcPreview] = useState('');
    const [insuranceFile, setInsuranceFile] = useState(null);
    const [insurancePreview, setInsurancePreview] = useState('');
    const [uploadingDocs, setUploadingDocs] = useState(false);
    const [showDocPopup, setShowDocPopup] = useState(false);
    const [docErrors, setDocErrors] = useState({});

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
        features: [],
        images: [],
        expected_price: '',
        reason_for_sale: '',
        pickup_address: '',
        rc_image: '',
        insurance_image: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleRcUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            e.target.value = '';
            return;
        }
        
        setRcFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setRcPreview(reader.result);
        };
        reader.readAsDataURL(file);
        toast.success('RC Document uploaded');
        setDocErrors(prev => ({ ...prev, rc: false }));
    };

    const handleInsuranceUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            e.target.value = '';
            return;
        }
        
        setInsuranceFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setInsurancePreview(reader.result);
        };
        reader.readAsDataURL(file);
        toast.success('Insurance Document uploaded');
        setDocErrors(prev => ({ ...prev, insurance: false }));
    };

    const uploadDocuments = async () => {
        const uploadedUrls = {};
        
        if (rcFile) {
            const formData = new FormData();
            formData.append('images', rcFile);
            try {
                const response = await API.post('/upload/images', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data?.urls?.length > 0) {
                    uploadedUrls.rc_image = response.data.urls[0];
                }
            } catch (error) {
                console.error('RC upload error:', error);
                toast.error('Failed to upload RC document');
            }
        }
        
        if (insuranceFile) {
            const formData = new FormData();
            formData.append('images', insuranceFile);
            try {
                const response = await API.post('/upload/images', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data?.urls?.length > 0) {
                    uploadedUrls.insurance_image = response.data.urls[0];
                }
            } catch (error) {
                console.error('Insurance upload error:', error);
                toast.error('Failed to upload Insurance document');
            }
        }
        
        return uploadedUrls;
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

        // Check Documents
        const docErrorsList = [];
        if (!rcPreview && !rcFile) {
            docErrorsList.push('RC Document is required');
            setDocErrors(prev => ({ ...prev, rc: true }));
            hasError = true;
        }
        if (!insurancePreview && !insuranceFile) {
            docErrorsList.push('Insurance Document is required');
            setDocErrors(prev => ({ ...prev, insurance: true }));
            hasError = true;
        }

        if (docErrorsList.length > 0) {
            errorMsg += '\n📄 Documents Required:\n';
            docErrorsList.forEach(err => {
                errorMsg += `• ${err}\n`;
            });
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
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        const newFiles = imageFiles.filter((_, i) => i !== index);
        setImagePreviews(newPreviews);
        setImageFiles(newFiles);
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
            setLoading(true);
            setUploadingDocs(true);
            
            let uploadedImageUrls = [];
            if (imageFiles.length > 0) {
                uploadedImageUrls = await uploadImages();
                if (uploadedImageUrls.length === 0 && imageFiles.length > 0) {
                    toast.error('Failed to upload some images');
                }
            }

            const docUrls = await uploadDocuments();

            const data = {
                ...formData,
                expected_price: parseFloat(formData.expected_price),
                year: formData.year ? parseInt(formData.year) : null,
                registration_year: formData.registration_year ? parseInt(formData.registration_year) : null,
                kilometers: formData.kilometers ? parseInt(formData.kilometers) : null,
                images: uploadedImageUrls.length > 0 ? uploadedImageUrls : formData.images,
                rc_image: docUrls.rc_image || formData.rc_image,
                insurance_image: docUrls.insurance_image || formData.insurance_image
            };
            
            await createCar(data);
            navigate('/seller/cars');
        } catch (error) {
            console.error('Error submitting car:', error);
        } finally {
            setLoading(false);
            setUploadingDocs(false);
        }
    };

    const closeErrorPopup = () => {
        setShowErrorPopup(false);
    };

    const removeRcDocument = () => {
        setRcFile(null);
        setRcPreview('');
        setFormData(prev => ({ ...prev, rc_image: '' }));
        setDocErrors(prev => ({ ...prev, rc: false }));
    };

    const removeInsuranceDocument = () => {
        setInsuranceFile(null);
        setInsurancePreview('');
        setFormData(prev => ({ ...prev, insurance_image: '' }));
        setDocErrors(prev => ({ ...prev, insurance: false }));
    };

    return (
        <div className="seller-form-container">
            {/* Page Header */}
            <div className="seller-form-header add-header">
                <div className="header-icon">🚀</div>
                <h1>List Your Car for Sale</h1>
                <p className="subtitle">Fill in the details below and our team will review your listing</p>
                <div className="header-steps">
                    <span className="step-active">1. Details</span>
                    <span className="step-line">—</span>
                    <span>2. Images & Docs</span>
                    <span className="step-line">—</span>
                    <span>3. Submit</span>
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
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="4" placeholder="Describe your car in detail..." />
                            <div className="field-hint">
                                <span>💡 Tip: Provide detailed description to attract more buyers</span>
                            </div>
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

                {/* Documents Section */}
                <div className="form-section">
                    <div className="section-header">
                        <span className="section-icon">📄</span>
                        <h3>Documents (RC & Insurance) <span className="required-star">*</span></h3>
                        <span className="section-badge required">Required</span>
                        <button type="button" className="btn-add-docs" onClick={() => setShowDocPopup(true)}>
                            📎 Add Documents
                        </button>
                    </div>
                    
                    <div className="doc-summary">
                        <div className={`doc-status ${docErrors.rc ? 'has-error' : ''}`}>
                            <span className={`doc-status-icon ${rcPreview ? 'uploaded' : 'pending'}`}>
                                {rcPreview ? '✅' : '⏳'}
                            </span>
                            <span className="doc-status-label">RC Document</span>
                            <span className={`doc-status-text ${rcPreview ? 'uploaded' : 'pending'}`}>
                                {rcPreview ? 'Uploaded' : 'Not Uploaded'}
                            </span>
                            {docErrors.rc && <span className="doc-error-text">⚠️ Required</span>}
                        </div>
                        <div className={`doc-status ${docErrors.insurance ? 'has-error' : ''}`}>
                            <span className={`doc-status-icon ${insurancePreview ? 'uploaded' : 'pending'}`}>
                                {insurancePreview ? '✅' : '⏳'}
                            </span>
                            <span className="doc-status-label">Insurance Document</span>
                            <span className={`doc-status-text ${insurancePreview ? 'uploaded' : 'pending'}`}>
                                {insurancePreview ? 'Uploaded' : 'Not Uploaded'}
                            </span>
                            {docErrors.insurance && <span className="doc-error-text">⚠️ Required</span>}
                        </div>
                    </div>

                    {(rcPreview || insurancePreview) && (
                        <div className="doc-preview-grid">
                            {rcPreview && (
                                <div className="doc-preview-card">
                                    <div className="doc-preview-image">
                                        <img src={rcPreview} alt="RC Document" />
                                    </div>
                                    <div className="doc-preview-info">
                                        <span className="doc-preview-name">📄 RC Document</span>
                                        <button type="button" className="doc-preview-remove" onClick={removeRcDocument}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                            {insurancePreview && (
                                <div className="doc-preview-card">
                                    <div className="doc-preview-image">
                                        <img src={insurancePreview} alt="Insurance Document" />
                                    </div>
                                    <div className="doc-preview-info">
                                        <span className="doc-preview-name">📋 Insurance Document</span>
                                        <button type="button" className="doc-preview-remove" onClick={removeInsuranceDocument}>
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
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
                                    <img src={url} alt={`Car ${index + 1}`} />
                                    <button type="button" className="remove-image" onClick={() => handleRemoveImage(index)}>×</button>
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
                    <button type="submit" className="btn btn-primary btn-submit" disabled={loading || uploadingImages || uploadingDocs}>
                        {loading || uploadingImages || uploadingDocs ? (
                            <>
                                <span className="spinner"></span> Submitting...
                            </>
                        ) : (
                            <>
                                <span>🚀</span> Submit for Approval
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

            {/* Document Upload Popup */}
            {showDocPopup && (
                <div className="doc-popup-overlay" onClick={() => setShowDocPopup(false)}>
                    <div className="doc-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="doc-popup-header">
                            <span className="doc-popup-icon">📄</span>
                            <h3>Upload Documents <span className="required-star">*</span></h3>
                            <button className="doc-popup-close" onClick={() => setShowDocPopup(false)}>✕</button>
                        </div>
                        <div className="doc-popup-body">
                            <p className="doc-popup-subtitle">
                                <span className="required-star">*</span> RC and Insurance documents are required for verification
                            </p>
                            
                            <div className="doc-popup-grid">
                                <div className="doc-popup-item">
                                    <label className="doc-popup-label">📄 RC Document <span className="required-star">*</span></label>
                                    {rcPreview ? (
                                        <div className="doc-popup-preview">
                                            <img src={rcPreview} alt="RC Document" />
                                            <button type="button" className="doc-popup-remove" onClick={removeRcDocument}>Remove</button>
                                        </div>
                                    ) : (
                                        <div className="doc-popup-upload">
                                            <input type="file" accept="image/*,application/pdf" onChange={handleRcUpload} id="popup-rc-upload" className="doc-popup-input" />
                                            <label htmlFor="popup-rc-upload" className="doc-popup-upload-label">
                                                <span className="doc-popup-upload-icon">📤</span>
                                                <span>Click to upload RC</span>
                                                <span className="doc-popup-hint">JPG, PNG, PDF (Max 5MB)</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                <div className="doc-popup-item">
                                    <label className="doc-popup-label">📋 Insurance Document <span className="required-star">*</span></label>
                                    {insurancePreview ? (
                                        <div className="doc-popup-preview">
                                            <img src={insurancePreview} alt="Insurance Document" />
                                            <button type="button" className="doc-popup-remove" onClick={removeInsuranceDocument}>Remove</button>
                                        </div>
                                    ) : (
                                        <div className="doc-popup-upload">
                                            <input type="file" accept="image/*,application/pdf" onChange={handleInsuranceUpload} id="popup-insurance-upload" className="doc-popup-input" />
                                            <label htmlFor="popup-insurance-upload" className="doc-popup-upload-label">
                                                <span className="doc-popup-upload-icon">📤</span>
                                                <span>Click to upload Insurance</span>
                                                <span className="doc-popup-hint">JPG, PNG, PDF (Max 5MB)</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="doc-popup-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDocPopup(false)}>Close</button>
                                <button type="button" className="btn btn-primary" onClick={() => setShowDocPopup(false)}>✅ Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Scroll to Top */}
            <button className="scroll-top-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>↑</button>

            {/* Document Popup Styles */}
            <style>{`
                .doc-popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(45, 27, 105, 0.6);
                    backdrop-filter: blur(12px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease;
                }
                .doc-popup {
                    background: #fff;
                    border-radius: 24px;
                    max-width: 560px;
                    width: 92%;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
                    animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .doc-popup-header {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 22px 28px;
                    border-bottom: 2px solid rgba(74, 108, 247, 0.06);
                    position: sticky;
                    top: 0;
                    background: #fff;
                    border-radius: 24px 24px 0 0;
                    z-index: 10;
                }
                .doc-popup-icon { font-size: 2rem; }
                .doc-popup-header h3 {
                    flex: 1;
                    margin: 0;
                    font-size: 1.4rem;
                    font-weight: 800;
                    color: #2d1b69;
                }
                .doc-popup-close {
                    width: 36px;
                    height: 36px;
                    border: none;
                    border-radius: 50%;
                    background: rgba(225, 112, 85, 0.08);
                    color: #E17055;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .doc-popup-close:hover {
                    background: rgba(225, 112, 85, 0.15);
                    transform: rotate(90deg);
                }
                .doc-popup-body { padding: 28px; }
                .doc-popup-subtitle {
                    color: #6c5b7b;
                    font-size: 0.95rem;
                    margin: 0 0 24px;
                }
                .doc-popup-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .doc-popup-item {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .doc-popup-label {
                    font-weight: 600;
                    font-size: 0.9rem;
                    color: #2d1b69;
                }
                .doc-popup-upload {
                    border: 2px dashed rgba(74, 108, 247, 0.15);
                    border-radius: 12px;
                    padding: 25px 15px;
                    text-align: center;
                    transition: all 0.3s ease;
                    background: rgba(74, 108, 247, 0.02);
                    cursor: pointer;
                    min-height: 120px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .doc-popup-upload:hover {
                    border-color: #4A6CF7;
                    background: rgba(74, 108, 247, 0.04);
                }
                .doc-popup-input { display: none; }
                .doc-popup-upload-label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 6px;
                    cursor: pointer;
                    color: #2d1b69;
                }
                .doc-popup-upload-icon { font-size: 2.8rem; }
                .doc-popup-hint {
                    font-size: 0.7rem;
                    color: #6c5b7b;
                }
                .doc-popup-preview {
                    position: relative;
                    border-radius: 12px;
                    overflow: hidden;
                    border: 2px solid rgba(74, 108, 247, 0.08);
                }
                .doc-popup-preview img {
                    width: 100%;
                    height: 140px;
                    object-fit: cover;
                }
                .doc-popup-remove {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    width: 28px;
                    height: 28px;
                    border: none;
                    border-radius: 50%;
                    background: rgba(225, 112, 85, 0.9);
                    color: white;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .doc-popup-remove:hover {
                    background: #E17055;
                    transform: scale(1.1);
                }
                .doc-popup-actions {
                    display: flex;
                    gap: 14px;
                    justify-content: flex-end;
                    margin-top: 24px;
                    padding-top: 20px;
                    border-top: 2px solid rgba(74, 108, 247, 0.06);
                }
                .doc-popup-actions .btn {
                    padding: 10px 30px;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.95rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .doc-popup-actions .btn-secondary {
                    background: rgba(74, 108, 247, 0.06);
                    color: #2d1b69;
                }
                .doc-popup-actions .btn-secondary:hover {
                    background: rgba(74, 108, 247, 0.12);
                }
                .doc-popup-actions .btn-primary {
                    background: linear-gradient(135deg, #4A6CF7, #6C5CE7);
                    color: white;
                    box-shadow: 0 4px 20px rgba(74, 108, 247, 0.25);
                }
                .doc-popup-actions .btn-primary:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 8px 30px rgba(74, 108, 247, 0.35);
                }
                @media (max-width: 768px) {
                    .doc-popup-grid { grid-template-columns: 1fr; }
                    .doc-popup { max-width: 95%; }
                    .doc-popup-body { padding: 20px; }
                    .doc-popup-header { padding: 16px 20px; }
                    .doc-popup-header h3 { font-size: 1.2rem; }
                    .doc-popup-actions { flex-direction: column; }
                    .doc-popup-actions .btn { width: 100%; justify-content: center; }
                }
                [data-theme="dark"] .doc-popup {
                    background: rgba(30, 30, 60, 0.95);
                }
                [data-theme="dark"] .doc-popup-header {
                    background: rgba(30, 30, 60, 0.95);
                    border-color: rgba(255, 255, 255, 0.05);
                }
                [data-theme="dark"] .doc-popup-header h3 {
                    color: #e8e8f0;
                }
                [data-theme="dark"] .doc-popup-subtitle {
                    color: #8888aa;
                }
                [data-theme="dark"] .doc-popup-label {
                    color: #c0c0d8;
                }
                [data-theme="dark"] .doc-popup-upload {
                    background: rgba(45, 27, 105, 0.3);
                    border-color: rgba(255, 255, 255, 0.06);
                }
                [data-theme="dark"] .doc-popup-upload-label {
                    color: #c0c0d8;
                }
                [data-theme="dark"] .doc-popup-actions .btn-secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: #c0c0d8;
                }
                [data-theme="dark"] .doc-popup-actions .btn-secondary:hover {
                    background: rgba(255, 255, 255, 0.08);
                }
            `}</style>
        </div>
    );
};

export default AddSellerCar;