import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../component/addProduct/layout/PageHeader';
import { ProductImagePanel } from '../../component/addProduct/product-form/ProductImagePanel';
import { ProductDetailsPanel } from '../../component/addProduct/product-form/ProductDetailsPanel';
import { ProductFormActions } from '../../component/addProduct/product-form/ProductFormActions';
import { useProductContext } from '../../context/productContext';
import { useProductForm } from '../../hooks/useProductForm';
import { LoadingOverlay } from '../../component/common/LoadingOverlay';

function AddProduct({ setActiveTab }) {
  useEffect(() => {
    if (setActiveTab) setActiveTab('add-product');
  }, [setActiveTab]);

  const navigate = useNavigate();
  const { id: productId } = useParams();
  const { addNewProduct, productloading, producterror, productmessage } = useProductContext();

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
  } = useProductForm(async (payload) => addNewProduct(payload));

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(e);
  };

  const displayError = producterror || submitError;
  const displaySuccess = productmessage || successMessage;

  return (
    <div className="dashboard-page-container mx-auto max-w-5xl  px-6 lg:px-8 pt-1 pb-5 -mt-2">
      <LoadingOverlay show={isSubmitting || productloading} />
      <PageHeader
        title={productId ? 'Update Product' : 'Add Product'}
        subtitle={productId ? 'Update your product' : 'Add a new item to your inventory catalog.'}
      />

      <form onSubmit={handleFormSubmit} noValidate className="space-y-4">
        {displayError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {displayError}
          </div>
        )}
        {displaySuccess && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {displaySuccess}
          </div>
        )}

        <ProductImagePanel
          imagePreviewUrl={imagePreviewUrl}
          error={imageError}
          onImageChange={handleImageChange}
        />

        <ProductDetailsPanel formData={formData} errors={errors} setField={setField} />

        <ProductFormActions
          isSubmitting={isSubmitting || productloading}
          onReset={resetForm}
          onCancel={() => navigate(-1)}
        />
      </form>
    </div>
  );
}

export default AddProduct;
