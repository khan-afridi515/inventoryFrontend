import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../component/addProduct/layout/PageHeader';
import { ProductImagePanel } from '../../component/addProduct/product-form/ProductImagePanel';
import { ProductDetailsPanel } from '../../component/addProduct/product-form/ProductDetailsPanel';
import { ProductFormActions } from '../../component/addProduct/product-form/ProductFormActions';
import { useProductForm } from '../../hooks/useProductForm';


const ADD_PRODUCT_URL = 'http://localhost:3000/api/v1/add';
const UPDATE_PRODUCT_URL = 'http://localhost:3000/api/v1/update';

// Validate that required fields are not blank
function validateProductFields(payload) {
  const requiredFields = ['name', 'category', 'sellingPrice', 'purchasePrice', 'currentQuantity', 'sku', 'description'];
  const blankFields = requiredFields.filter(field => !payload[field] || String(payload[field]).trim() === '');
  
  if (blankFields.length > 0) {
    throw new Error(`The following fields cannot be blank: ${blankFields.join(', ')}`);
  }
}

async function saveProduct(payload) {
  validateProductFields(payload);
  
  const body = new FormData();
  body.append('productName', payload.name);
  body.append('qty', String(payload.currentQuantity ?? '0'));
  body.append('supplierCost', String(payload.purchasePrice ?? '0'));
  body.append('Category', payload.category);
  body.append('sellingPrice', String(payload.sellingPrice ?? '0'));
  if(payload.supplierName) body.append('supplierName', payload.supplierName);
  body.append('description', payload.description);
  body.append('sku', payload.sku);
  if (payload.image) {
    body.append('img', payload.image, payload.image.name);
  }

  const response = await fetch(ADD_PRODUCT_URL, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save product: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  const result = await response.json();

  console.log('Product saved:', result);
  return result;
}

async function updateProduct(productId, payload) {
  const body = new FormData();
  body.append('productName', payload.name);
  body.append('qty', String(payload.currentQuantity ?? '0'));
  body.append('supplierCost', String(payload.purchasePrice ?? '0'));
  body.append('Category', payload.category);
  body.append('sellingPrice', String(payload.sellingPrice ?? '0'));
  if(payload.supplierName) body.append('supplierName', payload.supplierName);
  body.append('description', payload.description);
  body.append('sku', payload.sku);
  if (payload.image) {
    body.append('img', payload.image, payload.image.name);
  }

  const response = await fetch(`${UPDATE_PRODUCT_URL}/${productId}`, {
    method: 'POST',
    body,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to update product: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  const result = await response.json();

  console.log('Product updated:', result);
  return result;
}

function AddProduct({ setActiveTab }) {

  useEffect(() => {
    if (setActiveTab) setActiveTab('add-product');
  }, [setActiveTab]);

  const navigate = useNavigate();
  const { id: productId } = useParams();

  const {
    formData,
    errors,
    imagePreviewUrl,
    imageError,
    isSubmitting,
    submitError,
    successMessage,
    setField,
    handleImageChange,
    handleSubmit,
    resetForm,
  } = useProductForm(saveProduct);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    if (productId) {
      try {
        await updateProduct(productId, formData);
        navigate(-1);
      } catch (error) {
        console.error('Update error:', error);
      }
    } else {
      handleSubmit(e);
    }
  };

  return (
    <div className="dashboard-page-container mx-auto max-w-5xl  px-6 lg:px-8 pt-1 pb-5 -mt-2">
      <PageHeader title={productId ? "Update Product" : "Add Product"} subtitle={productId ? "Update You Product":"Add a new item to your inventory catalog."} />

      <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {successMessage}
          </div>
        )}

        <ProductImagePanel
          imagePreviewUrl={imagePreviewUrl}
          error={imageError}
          onImageChange={handleImageChange}
        />

        <ProductDetailsPanel formData={formData} errors={errors} setField={setField} />

        <ProductFormActions
          isSubmitting={isSubmitting}
          onReset={resetForm}
          onCancel={() => navigate(-1)}
        />
      </form>
    </div>
  );
}

export default AddProduct;
