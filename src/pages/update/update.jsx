import React, { useState } from 'react';
import { useParams } from 'react-router-dom';


const UpdateProduct = () => {

    const { id } = useParams();
    console.log("id", id);
    
  const [formData, setFormData] = useState({
    productImage: null,
    productName: 'Wireless Mouse MX2',
    sku: 'SKU-EL-1001',
    category: 'Electronics',
    supplierName: 'NovaTech Supplies',
    purchasePrice: 45.99,
    currentQuantity: 150,
    minimumStock: 20,
    description: 'High-precision wireless mouse with ergonomic design and long battery life.'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Product Data:', formData);
    alert('Product updated successfully!');
    // Add your update logic here
  };

  const handleReset = () => {
    setFormData({
      productImage: null,
      productName: '',
      sku: '',
      category: '',
      supplierName: '',
      purchasePrice: 0,
      currentQuantity: 0,
      minimumStock: 0,
      description: ''
    });
    setImagePreview(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Update Product</h2>
        <p className="text-gray-600 mt-1">Update an existing item in your inventory catalog.</p>
      </div>

      <form onSubmit={handleSubmit}>
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
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Wireless Mouse MX2"
                required
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="SKU-EL-1001"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Furniture">Furniture</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Food">Food</option>
              </select>
            </div>

            {/* Supplier Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="supplierName"
                value={formData.supplierName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="NovaTech Supplies"
                required
              />
            </div>

            {/* Purchase Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purchase Price <span className="text-red-500">*</span>
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
                  required
                />
              </div>
            </div>

            {/* Current Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="currentQuantity"
                value={formData.currentQuantity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
              />
            </div>

            {/* Minimum Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="minimumStock"
                value={formData.minimumStock}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
                required
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
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Update Product
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