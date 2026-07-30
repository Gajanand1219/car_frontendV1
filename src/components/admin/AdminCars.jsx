// src/components/admin/AdminCars.jsx
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import API, { getImageUrl } from '../../api/axios';

const AdminCars = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingCar, setEditingCar] = useState(null);

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            console.log('🚗 Fetching cars...');
            const res = await API.get('/cars/');
            console.log('✅ Cars fetched:', res.data);
            setCars(res.data);
        } catch (error) {
            console.error('❌ Fetch cars error:', error.response?.data || error.message);
            toast.error('Failed to fetch cars');
        } finally {
            setLoading(false);
        }
    };

    const deleteCar = async (id) => {
        if (!window.confirm('Are you sure you want to delete this car?')) return;
        try {
            await API.delete(`/cars/${id}`);
            toast.success('Car deleted successfully');
            fetchCars();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete car');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            const car = cars.find(c => c.id === id);
            await API.put(`/cars/${id}`, { ...car, status });
            toast.success(`Status updated to ${status}`);
            fetchCars();
        } catch (error) {
            console.error('Update status error:', error);
            toast.error('Failed to update status');
        }
    };

    const filteredCars = cars.filter(car =>
        car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading">Loading cars...</div>;
    }

    return (
        <div className="admin-cars">
            <div className="admin-header">
                <h2>🚗 Car Management</h2>
                <div className="header-actions">
                    <span className="total-cars">Total: {cars.length}</span>
                    <button className="btn-primary" onClick={() => { setEditingCar(null); setShowModal(true); }}>
                        + Add Car
                    </button>
                </div>
            </div>

            <div className="admin-toolbar">
                <input
                    type="text"
                    placeholder="🔍 Search cars..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn-secondary" onClick={fetchCars}>🔄 Refresh</button>
            </div>

            {cars.length === 0 ? (
                <div className="admin-empty">No cars found. Add your first car!</div>
            ) : (
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Car</th>
                                <th>Year</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Condition</th>
                                <th>Images</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCars.map(car => (
                                <tr key={car.id}>
                                    <td>
                                        <div className="car-cell">
                                            <img
                                                src={getImageUrl(car.images?.[0])}
                                                alt={car.model}
                                                onError={(e) => e.target.src = 'https://via.placeholder.com/60'}
                                            />
                                            <div>
                                                <strong>{car.brand} {car.model}</strong>
                                                <span>{car.variant}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{car.year}</td>
                                   
                                    <td>₹{car.price?.toLocaleString()}</td>
                                    <td>
                                        <select value={car.status} onChange={(e) => updateStatus(car.id, e.target.value)}>
                                            <option value="available">Available</option>
                                            <option value="sold">Sold</option>
                                            <option value="hidden">Hidden</option>
                                            <option value="featured">Featured</option>
                                            <option value="unavailable">Unavailable</option>

                                        </select>
                                    </td>
                                     <td>
                                        {car.vehicle_condition === "new" ? (
                                            <span className="badge-new">🟢 New</span>
                                        ) : (
                                            <span className="badge-old">🟠 Old</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className="image-count">
                                            {car.images?.length || 0} 📷
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn-edit" onClick={() => { setEditingCar(car); setShowModal(true); }}>✏️ Edit</button>
                                        <button className="btn-delete" onClick={() => deleteCar(car.id)}>🗑️ Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <CarModal
                    car={editingCar}
                    onClose={() => setShowModal(false)}
                    onSave={() => { fetchCars(); setShowModal(false); }}
                />
            )}
        </div>
    );
};

const CarModal = ({ car, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        brand: car?.brand || '',
        model: car?.model || '',
        variant: car?.variant || '',
        year: car?.year || '',
        registration_year: car?.registration_year || '',
        fuel: car?.fuel || '',
        transmission: car?.transmission || '',
        owner: car?.owner || '',
        kilometers: car?.kilometers || '',
        color: car?.color || '',
        insurance: car?.insurance || '',
        insurance_validity: car?.insurance_validity || '',
        rto: car?.rto || '',
        engine: car?.engine || '',
        power: car?.power || '',
        mileage: car?.mileage || '',
        seats: car?.seats || '',
        vehicle_condition: car?.vehicle_condition || "",
        vin: car?.vin || '',
        registration_number: car?.registration_number || '',
        description: car?.description || '',
        price: car?.price || '',
        original_price: car?.original_price || '',
        offer_price: car?.offer_price || '',
        emi_available: car?.emi_available || false,
        emi_down_payment: car?.emi_down_payment || '',
        interest_rate: car?.interest_rate || '',
        loan_tenure_months: car?.loan_tenure_months || '',
        status: car?.status || 'available',
        meta_title: car?.meta_title || '',
        meta_description: car?.meta_description || '',
        slug: car?.slug || '',
        features: car?.features?.join(', ') || '',
        images: car?.images || []
    });
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploadingImages, setUploadingImages] = useState(false);
    const [existingImages, setExistingImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Load existing images from car
    useEffect(() => {
        if (car?.images && car.images.length > 0) {
            console.log('📸 Existing images:', car.images);
            setExistingImages(car.images);
            setImagePreviews(car.images);
        }
    }, [car]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        let hasError = false;
        let errorMsg = "";

        if (!formData.brand.trim()) {
            newErrors.brand = "Brand is required";
            errorMsg += "• Brand\n";
            hasError = true;
        }

        if (!formData.model.trim()) {
            newErrors.model = "Model is required";
            errorMsg += "• Model\n";
            hasError = true;
        }

        if (!formData.rto.trim()) {
            newErrors.rto = "RTO is required";
            errorMsg += "• RTO\n";
            hasError = true;
        }

        // ✅ ADD THIS HERE
        if (!formData.vehicle_condition) {
            newErrors.vehicle_condition = "Vehicle Condition is required";
            errorMsg += "• Vehicle Condition\n";
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

    const closeErrorPopup = () => {
        setShowErrorPopup(false);
    };

    // Handle file upload
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

    // Handle image removal
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

    // Upload new images to server
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

            console.log('✅ Upload response:', response.data);
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

        setLoading(true);

        try {
            let newImageUrls = [];

            if (imageFiles.length > 0) {
                newImageUrls = await uploadImages();
                if (newImageUrls.length === 0 && imageFiles.length > 0) {
                    toast.error('Failed to upload some images');
                }
            }

            const allImages = [...existingImages, ...newImageUrls];

            // ✅ Build payload - Only required fields
            const payload = {
                brand: formData.brand.trim(),
                model: formData.model.trim(),
                rto: formData.rto.trim()
            };

            // ✅ Add optional fields only if they have values
            if (formData.variant?.trim()) payload.variant = formData.variant.trim();
            if (formData.year) payload.year = Number(formData.year);
            if (formData.registration_year) payload.registration_year = Number(formData.registration_year);
            if (formData.fuel) payload.fuel = formData.fuel;
            if (formData.transmission) payload.transmission = formData.transmission;
            if (formData.owner) payload.owner = formData.owner;
            if (formData.kilometers) payload.kilometers = Number(formData.kilometers);
            if (formData.color?.trim()) payload.color = formData.color.trim();
            if (formData.insurance?.trim()) payload.insurance = formData.insurance.trim();
            if (formData.insurance_validity) payload.insurance_validity = formData.insurance_validity;
            if (formData.engine?.trim()) payload.engine = formData.engine.trim();
            if (formData.power?.trim()) payload.power = formData.power.trim();
            if (formData.mileage?.trim()) payload.mileage = formData.mileage.trim();
            if (formData.seats) payload.seats = Number(formData.seats);
            if (formData.vin?.trim()) payload.vin = formData.vin.trim();
            if (formData.registration_number?.trim()) payload.registration_number = formData.registration_number.trim();
            if (formData.description?.trim()) payload.description = formData.description.trim();
            if (formData.price) payload.price = Number(formData.price);
            if (formData.original_price) payload.original_price = Number(formData.original_price);
            if (formData.offer_price) payload.offer_price = Number(formData.offer_price);
            if (formData.emi_available === true || formData.emi_available === 'true') {
                payload.emi_available = true;
            }
         
            if (formData.emi_down_payment) payload.emi_down_payment = Number(formData.emi_down_payment);
            if (formData.interest_rate) payload.interest_rate = Number(formData.interest_rate);
            if (formData.loan_tenure_months) payload.loan_tenure_months = Number(formData.loan_tenure_months);
            if (formData.status) payload.status = formData.status;
            payload.vehicle_condition = formData.vehicle_condition;
            if (formData.meta_title?.trim()) payload.meta_title = formData.meta_title.trim();
            if (formData.meta_description?.trim()) payload.meta_description = formData.meta_description.trim();
            if (formData.slug?.trim()) payload.slug = formData.slug.trim();
            if (formData.features) {
                payload.features = formData.features.split(',').map(f => f.trim()).filter(f => f);
            }
            if (allImages.length > 0) payload.images = allImages;

            console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));

            if (car) {
                await API.put(`/cars/${car.id}`, payload);
                toast.success('✅ Car updated successfully');
            } else {
                await API.post('/cars/', payload);
                toast.success('✅ Car added successfully');
            }
            onSave();
        } catch (error) {
            console.error('❌ Save error:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || (car ? 'Failed to update car' : 'Failed to add car');
            toast.error(`❌ ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-overlay" onClick={onClose}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>{car ? '✏️ Edit Car' : '➕ Add New Car'}</h2>
                        <button className="modal-close" onClick={onClose}>×</button>
                    </div>
                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="form-grid">
                            {/* Basic Info - Required */}
                            <div className="required-field">
                                <label>Brand <span className="required-star">*</span></label>
                                <input 
                                    name="brand" 
                                    value={formData.brand} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Toyota, Honda, BMW"
                                    className={errors.brand ? 'error-input' : ''}
                                />
                                {errors.brand && <span className="error-text">{errors.brand}</span>}
                            </div>

                            <div className="required-field">
                                <label>Model <span className="required-star">*</span></label>
                                <input 
                                    name="model" 
                                    value={formData.model} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Innova Crysta, City, X5"
                                    className={errors.model ? 'error-input' : ''}
                                />
                                {errors.model && <span className="error-text">{errors.model}</span>}
                            </div>

                            <div className="required-field">
                                <label>RTO <span className="required-star">*</span></label>
                                <input 
                                    name="rto" 
                                    value={formData.rto} 
                                    onChange={handleChange} 
                                    placeholder="e.g. MH26, MH12, DL01"
                                    className={errors.rto ? 'error-input' : ''}
                                />
                                {errors.rto && <span className="error-text">{errors.rto}</span>}
                            </div>

                            <div>
                            <label>Vehicle Condition *</label>
                            <select
                                name="vehicle_condition"
                                value={formData.vehicle_condition}
                                onChange={handleChange}
                            >
                                <option value="">-- Select Condition --</option>
                                <option value="new">🚘 New</option>
                                <option value="old">🚗 Old</option>
                            </select>

                            {errors.vehicle_condition && (
                                <span className="error-text">
                                    {errors.vehicle_condition}
                                </span>
                            )}
                        </div>

                            <div>
                                <label>Variant</label>
                                <input name="variant" value={formData.variant} onChange={handleChange} placeholder="e.g. ZX, VX, Premium Plus" />
                                
                            </div>

                            <div>
                                <label>Year</label>
                                <input type="number" name="year" value={formData.year} onChange={handleChange} placeholder="e.g. 2024" />
                            </div>

                            <div>
                                <label>Registration Year</label>
                                <input type="number" name="registration_year" value={formData.registration_year} onChange={handleChange} placeholder="e.g. 2024" />
                            </div>

                            {/* Vehicle Details */}
                            <div>
                                <label>Fuel Type</label>
                                <select name="fuel" value={formData.fuel} onChange={handleChange}>
                                    <option value="">Select Fuel</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="CNG">CNG</option>
                                </select>
                            </div>

                            <div>
                                <label>Transmission</label>
                                <select name="transmission" value={formData.transmission} onChange={handleChange}>
                                    <option value="">Select Transmission</option>
                                    <option value="Manual">Manual</option>
                                    <option value="Automatic">Automatic</option>
                                </select>
                            </div>

                            <div>
                                <label>Owner</label>
                                <select name="owner" value={formData.owner} onChange={handleChange}>
                                    <option value="">Select Owner</option>
                                    <option value="1st Owner">1st Owner</option>
                                    <option value="2nd Owner">2nd Owner</option>
                                    <option value="3rd Owner">3rd Owner</option>
                                </select>
                            </div>

                            <div>
                                <label>Kilometers Driven</label>
                                <input type="number" name="kilometers" value={formData.kilometers} onChange={handleChange} placeholder="e.g. 25000" />
                            </div>

                            <div>
                                <label>Color</label>
                                <input name="color" value={formData.color} onChange={handleChange} placeholder="e.g. White, Black, Red" />
                            </div>

                            <div>
                                <label>Seats</label>
                                <input type="number" name="seats" value={formData.seats} onChange={handleChange} placeholder="e.g. 5, 7, 8" />
                            </div>

                            {/* Pricing */}
                            <div>
                                <label>Price (₹)</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 1500000" />
                            </div>

                            <div>
                                <label>Original Price</label>
                                <input type="number" name="original_price" value={formData.original_price} onChange={handleChange} placeholder="e.g. 1600000" />
                            </div>

                            <div>
                                <label>Offer Price</label>
                                <input type="number" name="offer_price" value={formData.offer_price} onChange={handleChange} placeholder="e.g. 1450000" />
                            </div>

                            {/* EMI */}
                            <div>
                                <label>EMI Available</label>
                                <select name="emi_available" value={formData.emi_available} onChange={handleChange}>
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>

                            <div>
                                <label>EMI Down Payment</label>
                                <input type="number" name="emi_down_payment" value={formData.emi_down_payment} onChange={handleChange} placeholder="e.g. 200000" />
                            </div>

                            <div>
                                <label>Interest Rate (%)</label>
                                <input type="number" step="0.1" name="interest_rate" value={formData.interest_rate} onChange={handleChange} placeholder="e.g. 8.5" />
                            </div>

                            <div>
                                <label>Loan Tenure (months)</label>
                                <input type="number" name="loan_tenure_months" value={formData.loan_tenure_months} onChange={handleChange} placeholder="e.g. 60" />
                            </div>

                            {/* Status */}
                            <div>
                                <label>Status</label>
                                <select name="status" value={formData.status} onChange={handleChange}>
                                    <option value="available">Available</option>
                                    <option value="sold">Sold</option>
                                    <option value="hidden">Hidden</option>
                                    <option value="featured">Featured</option>
                                    <option value="unavailable">Unavailable</option>
                                </select>
                            </div>
                            

                            {/* Registration */}
                            <div>
                                <label>Registration Number</label>
                                <input name="registration_number" value={formData.registration_number} onChange={handleChange} placeholder="e.g. MH26AB1234" />
                            </div>

                            <div>
                                <label>VIN</label>
                                <input name="vin" value={formData.vin} onChange={handleChange} placeholder="e.g. MBJ12345678998765" />
                            </div>

                            {/* Engine */}
                            <div>
                                <label>Engine</label>
                                <input name="engine" value={formData.engine} onChange={handleChange} placeholder="e.g. 2393 cc, 2.4L Diesel" />
                            </div>

                            <div>
                                <label>Power (BHP)</label>
                                <input name="power" value={formData.power} onChange={handleChange} placeholder="e.g. 148 BHP, 120 PS" />
                            </div>

                            <div>
                                <label>Mileage</label>
                                <input name="mileage" value={formData.mileage} onChange={handleChange} placeholder="e.g. 15.6 kmpl, 22 km/kg" />
                            </div>

                            {/* Insurance */}
                            <div>
                                <label>Insurance</label>
                                <input name="insurance" value={formData.insurance} onChange={handleChange} placeholder="e.g. Comprehensive, Third Party" />
                            </div>

                            <div>
                                <label>Insurance Validity</label>
                                <input type="datetime-local" name="insurance_validity" value={formData.insurance_validity} onChange={handleChange} />
                            </div>

                            {/* SEO */}
                            <div>
                                <label>Meta Title</label>
                                <input name="meta_title" value={formData.meta_title} onChange={handleChange} placeholder="e.g. Best Toyota Innova 2024" />
                            </div>

                            <div>
                                <label>Slug</label>
                                <input name="slug" value={formData.slug} onChange={handleChange} placeholder="e.g. toyota-innova-2024" />
                            </div>

                            {/* Text Areas */}
                            <div className="full-width">
                                <label>Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    placeholder="Write a detailed description about the car..."
                                />
                            </div>

                            <div className="full-width">
                                <label>Meta Description</label>
                                <textarea 
                                    name="meta_description" 
                                    value={formData.meta_description} 
                                    onChange={handleChange} 
                                    placeholder="SEO meta description for the car..."
                                />
                            </div>

                            <div className="full-width">
                                <label>Features (comma separated)</label>
                                <input 
                                    name="features" 
                                    value={formData.features} 
                                    onChange={handleChange} 
                                    placeholder="ABS, Airbags, Power Steering, Touchscreen, Reverse Camera"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="full-width image-upload-section">
                                <label>📷 Car Images ({imagePreviews.length}/10)</label>
                                <div className="image-upload-area">
                                    <div className="upload-drop-zone">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            id="image-upload"
                                            className="file-input"
                                        />
                                        <label htmlFor="image-upload" className="upload-label">
                                            <span className="upload-icon">📤</span>
                                            <span>Click to upload images</span>
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
                                                        e.target.src = 'https://via.placeholder.com/100';
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
                                    <span>{imagePreviews.length} / 10 images added</span>
                                    {uploadingImages && <span className="uploading-status">⏳ Uploading...</span>}
                                    {imageFiles.length > 0 && (
                                        <span className="pending-upload">{imageFiles.length} pending upload</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn-primary" disabled={loading || uploadingImages}>
                                {loading || uploadingImages ? '⏳ Saving...' : (car ? '✅ Update Car' : '➕ Add Car')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* ✅ Error Popup */}
            {showErrorPopup && (
                <div className="error-popup-overlay" onClick={closeErrorPopup}>
                    <div className="error-popup" onClick={(e) => e.stopPropagation()}>
                        <div className="error-popup-icon">⚠️</div>
                        <h3>Required Fields Missing</h3>
                        <div className="error-popup-message">
                            <pre>{errorMessage}</pre>
                        </div>
                        <button className="btn-primary" onClick={closeErrorPopup}>
                            Okay, I'll fill them
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AdminCars;