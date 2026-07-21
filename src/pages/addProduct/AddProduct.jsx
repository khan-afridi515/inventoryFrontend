import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../component/addProduct/layout/PageHeader';
import { ProductImagePanel } from '../../component/addProduct/product-form/ProductImagePanel';
import { ProductDetailsPanel } from '../../component/addProduct/product-form/ProductDetailsPanel';
import { ProductFormActions } from '../../component/addProduct/product-form/ProductFormActions';
import { useProductForm } from '../../hooks/useProductForm';

/**
 * Placeholder save handler. Swap this for a real dashboardService/
 * productService call once a backend exists — nothing else in this
 * page needs to change, the same way Dashboard.jsx only talks to
 * dashboardService rather than fetching inline.
 */
async function saveProduct(payload) {
  // eslint-disable-next-line no-console
  console.log('Saving product:', payload);
}

function AddProduct({ setActiveTab }) {
  useEffect(() => {
    if (setActiveTab) setActiveTab('add-product');
  }, [setActiveTab]);

  const navigate = useNavigate();
  const {
    formData,
    errors,
    imagePreviewUrl,
    imageError,
    isSubmitting,
    setField,
    handleImageChange,
    handleSubmit,
    resetForm,
  } = useProductForm(saveProduct);

  return (
    <div className="dashboard-page-container mx-auto max-w-5xl  px-6 lg:px-8 pt-1 pb-5 -mt-2">
      <PageHeader title="Add Product" subtitle="Add a new item to your inventory catalog." />

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
