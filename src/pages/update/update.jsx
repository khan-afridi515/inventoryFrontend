import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductContext } from '../../context/productContext';
import { CATEGORY_OPTIONS } from '../../constants/product.constants';


const UpdateProduct = () => {

    const { id } = useParams();
    const navigate = useNavigate();
      const { updateProductById, updateLoading, updateError, updateMessage } = useProductContext();
    const [successLocalMessage, setSuccessLocalMessage] = useState('');
    
  const [formData, setFormData] = useState({
    productImage: null,
    productName: '',
    category: '',
    supplierName: '',
    purchasePrice: '',
    currentQuantity: '',
    minimumQuantity: '',
    description: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        productImage: file
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to read the selected image.'));
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {};

      if (formData.productName && String(formData.productName).trim() !== '') {
        payload.productName = String(formData.productName).trim();
      }
      if (formData.category) payload.category = formData.category;
      if (formData.supplierName && String(formData.supplierName).trim() !== '') {
        payload.supplierName = String(formData.supplierName).trim();
      }
      if (formData.purchasePrice !== '') payload.purchasePrice = Number(formData.purchasePrice);
      if (formData.currentQuantity !== '') payload.currentQuantity = Number(formData.currentQuantity);
      if (formData.minimumQuantity !== '') payload.minimumQuantity = Number(formData.minimumQuantity);
      if (formData.description && String(formData.description).trim() !== '') payload.description = String(formData.description).trim();
      if (formData.productImage) payload.image = await toBase64(formData.productImage);

      const res = await updateProductById(id, payload);
      const msg = res?.message || res?.msg || 'Product updated successfully.';
      setSuccessLocalMessage(msg);
      // show message briefly then navigate to products
     
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  const handleReset = () => {
    setFormData({
      productImage: null,
      productName: '',
      category: '',
      supplierName: '',
      purchasePrice: '',
      currentQuantity: '',
      minimumQuantity: '',
      description: ''
    });
    setImagePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Loading now shown only in submit button */}
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Product</h2>
        <p className="text-gray-600 mt-1">Update an existing item in your inventory catalog.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {updateError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4">
            {updateError}
          </div>
        )}
        {successLocalMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 mb-4">
            {successLocalMessage}
          </div>
        )}
        {/* Product Image Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Product Image</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="productImage"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="productImage" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Product Preview" 
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <p className="text-sm text-gray-500 mt-2">Click to change image</p>
                    </div>
                  ) : (
                    <div>
                      <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 font-medium">Upload Image</p>
                      <p className="text-sm text-gray-500">PNG or JPG, up to 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Product Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wireless Mouse MX2"
                
              />
            </div>

            {/* SKU removed */}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Supplier Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Name
              </label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="NovaTech Supplies"
                
              />
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  name="purchasePrice"
                  value={formData.purchasePrice}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                />
              </div>
            </div>

            {/* Current Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Quantity
              </label>
              <input
                type="number"
                name="currentQuantity"
                value={formData.currentQuantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                
              />
            </div>

            {/* Minimum Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Quantity
              </label>
              <input
                type="number"
                name="minimumQuantity"
                value={formData.minimumQuantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">Description</h3>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Short description of the product..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={updateLoading}
            className="flex items-center justify-center gap-2 flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {updateLoading ? (
              <>
                <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>Updating…</span>
              </>
            ) : (
              'Update Product'
            )}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;