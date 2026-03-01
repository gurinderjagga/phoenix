import React, { useState, useRef } from 'react';
import { supabase } from '../../utils/supabase';

// Icon Components
const XIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const UploadIcon = () => (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);

const AddCarModal = ({ isOpen, onClose, onSave, car }) => {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        brand: '',
        model: '',
        year: '',
        engine: '',
        horsepower: '',
        acceleration: '',
        topSpeed: '',
        price: '',
        transmission: 'automatic',
        fuelType: 'gasoline',
        color: '',
        description: '',
        images: [],
        category: 'Sedan', // Default
        stock: 1,
        featured: false
    });

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [alertModal, setAlertModal] = useState({ isOpen: false, message: '', isError: false });

    // Populate form data when car prop changes
    React.useEffect(() => {
        if (car) {
            setFormData({
                id: car.id,
                brand: car.brand || '',
                model: car.model || '',
                year: car.year || '',
                engine: car.specifications?.engine || '',
                horsepower: car.specifications?.horsepower || '',
                acceleration: car.specifications?.acceleration || '',
                topSpeed: car.specifications?.topSpeed || '',
                price: car.price || '',
                transmission: car.specifications?.transmission?.toLowerCase() || 'automatic',
                fuelType: car.specifications?.fuelType?.toLowerCase() || 'gasoline',
                color: car.specifications?.color || '',
                description: car.description || '',
                category: car.category || 'Sedan',
                stock: car.stock !== undefined ? car.stock : 1,
                featured: car.featured || false
            });
            setExistingImages(car.images || []);
        } else {
            // Reset form for add mode
            setFormData({
                brand: '',
                model: '',
                year: '',
                engine: '',
                horsepower: '',
                acceleration: '',
                topSpeed: '',
                price: '',
                transmission: 'automatic',
                fuelType: 'gasoline',
                color: '',
                description: '',
                category: 'Sedan',
                stock: 1,
                featured: false
            });
            setExistingImages([]);
        }
        setSelectedFiles([]);
        setUploadProgress('');
        setErrors({});
    }, [car, isOpen]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            // Validating file size (e.g., max 5MB)
            const validFiles = newFiles.filter(file => {
                if (file.size > 5 * 1024 * 1024) {
                    setAlertModal({ isOpen: true, message: `File ${file.name} is too large (max 5MB)`, isError: true });
                    return false;
                }
                return true;
            });
            setSelectedFiles(prev => [...prev, ...validFiles]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
        if (!formData.model.trim()) newErrors.model = 'Model is required';
        if (!formData.year) newErrors.year = 'Year is required';
        else if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            newErrors.year = 'Please enter a valid year';
        }
        if (!formData.engine.trim()) newErrors.engine = 'Engine is required';
        if (!formData.horsepower) newErrors.horsepower = 'Horsepower is required';
        if (!formData.price) newErrors.price = 'Price is required';
        else if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const uploadImages = async () => {
        if (selectedFiles.length === 0) return [];

        setUploadProgress('Uploading images...');
        const uploadedUrls = [];

        for (const file of selectedFiles) {
            try {
                // Create a unique file name
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error } = await supabase.storage
                    .from('car-images')
                    .upload(filePath, file);

                if (error) throw error;

                // Get public URL
                const { data: { publicUrl } } = supabase.storage
                    .from('car-images')
                    .getPublicUrl(filePath);

                uploadedUrls.push(publicUrl);
            } catch (error) {
                console.error('Error uploading image:', error);
                setAlertModal({ isOpen: true, message: `Failed to upload ${file.name}: ${error.message}`, isError: true });
                // Continue with other files or stop? Let's continue for now but warn
            }
        }
        return uploadedUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // 1. Upload new images
            let newImageUrls = [];
            if (selectedFiles.length > 0) {
                newImageUrls = await uploadImages();
            }

            // 2. Combine with existing images
            const finalImages = [...existingImages, ...newImageUrls].filter(img => img && typeof img === 'string' && img.trim() !== '');

            // 3. Transform data to match backend schema
            const payload = {
                id: formData.id, // Only for update
                name: `${formData.brand} ${formData.model} ${formData.year}`,
                brand: formData.brand,
                model: formData.model,
                year: parseInt(formData.year),
                price: parseFloat(formData.price),
                description: formData.description,
                images: finalImages,
                category: formData.category || 'Sedan',
                stock: formData.stock !== '' ? parseInt(formData.stock) : 1,
                featured: formData.featured,
                specifications: {
                    engine: formData.engine,
                    horsepower: formData.horsepower,
                    acceleration: formData.acceleration,
                    topSpeed: formData.topSpeed,
                    transmission: formData.transmission,
                    fuelType: formData.fuelType,
                    color: formData.color,
                    seats: 5
                }
            };

            // Remove id if it's undefined (create mode)
            if (!payload.id) delete payload.id;

            await onSave(payload);
            handleClose();
        } catch (error) {
            console.error('Error saving car:', error);
            setAlertModal({ isOpen: true, message: 'Failed to save car. See console for details.', isError: true });
        } finally {
            setIsSubmitting(false);
            setUploadProgress('');
        }
    };

    const handleClose = () => {
        onClose();
        setSelectedFiles([]);
        setUploadProgress('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-sm max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest">
                        {car ? 'Edit Car' : 'Add New Car'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400"
                    >
                        <XIcon />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
                                Basic Information
                            </h3>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Make *
                                </label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                    placeholder="e.g., Porsche"
                                />
                                {errors.brand && <p className="text-red-600 text-sm mt-1">{errors.brand}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Model *
                                </label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                    placeholder="e.g., 911 Carrera"
                                />
                                {errors.model && <p className="text-red-600 text-sm mt-1">{errors.model}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Year *
                                </label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                    placeholder="e.g., 2023"
                                />
                                {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                >
                                    <option value="Sedan">Sedan</option>
                                    <option value="SUV">SUV</option>
                                    <option value="Electric">Electric</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Engine *
                                </label>
                                <input
                                    type="text"
                                    name="engine"
                                    value={formData.engine}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                    placeholder="e.g., 3.0L Twin-Turbo"
                                />
                                {errors.engine && <p className="text-red-600 text-sm mt-1">{errors.engine}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Featured
                                </label>
                                <select
                                    name="featured"
                                    value={formData.featured ? 'true' : 'false'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.value === 'true' }))}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                >
                                    <option value="false">No</option>
                                    <option value="true">Yes</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Transmission
                                </label>
                                <select
                                    name="transmission"
                                    value={formData.transmission}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                >
                                    <option value="automatic">Automatic</option>
                                    <option value="manual">Manual</option>
                                    <option value="cvt">CVT</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Column: Performance and Pricing combined */}
                        <div className="space-y-6">
                            {/* Performance Specs */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
                                    Performance
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Horsepower *
                                        </label>
                                        <input
                                            type="number"
                                            name="horsepower"
                                            value={formData.horsepower}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                            placeholder="e.g., 379"
                                        />
                                        {errors.horsepower && <p className="text-red-600 text-sm mt-1">{errors.horsepower}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Top Speed
                                        </label>
                                        <input
                                            type="text"
                                            name="topSpeed"
                                            value={formData.topSpeed}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                            placeholder="e.g., 182 mph"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Acceleration
                                        </label>
                                        <input
                                            type="text"
                                            name="acceleration"
                                            value={formData.acceleration}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                            placeholder="0-60 mph"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pricing & Specs */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide">
                                    Pricing & Specifications
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Price *
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                        placeholder="e.g., 150000"
                                        min="0"
                                    />
                                    {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
                                </div>



                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                        placeholder="e.g., 5"
                                        min="0"
                                    />
                                </div>



                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Fuel Type
                                    </label>
                                    <select
                                        name="fuelType"
                                        value={formData.fuelType}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                    >
                                        <option value="gasoline">Gasoline</option>
                                        <option value="diesel">Diesel</option>
                                        <option value="electric">Electric</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Fields */}
                    <div className="mt-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Color
                            </label>
                            <input
                                type="text"
                                name="color"
                                value={formData.color}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                placeholder="e.g., Guards Red"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-3 py-2 border border-gray-300 focus:ring-0 focus:border-gray-900"
                                placeholder="Detailed description of the vehicle..."
                            />
                        </div>
                    </div>

                    {/* Media Upload */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-900 uppercase tracking-wide mb-4">
                            Media Upload
                        </h3>

                        {/* Current/Preview Images */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            {existingImages.map((url, index) => (
                                <div key={`existing-${index}`} className="relative group aspect-w-16 aspect-h-9 bg-gray-100 rounded-sm overflow-hidden">
                                    <img src={url} alt={`Car ${index + 1}`} className="object-cover w-full h-full" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-"
                                    >
                                        <XIcon />
                                    </button>
                                </div>
                            ))}
                            {selectedFiles.map((file, index) => (
                                <div key={`new-${index}`} className="relative group aspect-w-16 aspect-h-9 bg-gray-100 rounded-sm overflow-hidden border border-gray-200">
                                    <div className="flex items-center justify-center h-full text-xs text-center p-2 text-gray-500">
                                        {file.name}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-"
                                    >
                                        <XIcon />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-sm p-8 text-center">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                multiple
                                accept="image/*"
                                className="hidden"
                            />
                            <div className="mx-auto mb-4 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                <UploadIcon />
                            </div>
                            <p className="text-gray-600 mb-2">Drag and drop images here, or click to select files</p>
                            <p className="text-sm text-gray-500">PNG, JPG up to 5MB each</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="mt-4 bg-gray-100 text-gray-700 px-4 py-2"
                            >
                                Browse Files
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-8 flex justify-end space-x-4 items-center">
                        {uploadProgress && (
                            <span className="text-sm text-blue-600 animate-pulse">
                                {uploadProgress}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-black text-white px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Car'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Alert Modal */}
            {alertModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-sm p-8 shadow-2xl relative text-center border-t-4 border-black">
                        <div className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center border-2 ${alertModal.isError ? 'border-red-500 text-red-500' : 'border-black text-black'}`}>
                            {alertModal.isError ? (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
                            )}
                        </div>
                        <h2 className="text-lg font-bold uppercase tracking-widest text-gray-900 mb-2">
                            {alertModal.isError ? 'Error' : 'Notification'}
                        </h2>
                        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                            {alertModal.message}
                        </p>
                        <button
                            className="w-full bg-black text-white px-6 py-4 text-[10px] font-bold uppercase tracking-[0.15em]"
                            onClick={() => setAlertModal({ isOpen: false, message: '', isError: false })}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddCarModal;