import { useCallback, useRef, useState } from 'react';
import { INITIAL_PRODUCT_FORM } from '../constants/product.constants';
import { validateProductForm, validateImageFile } from '../utils/validateProduct';
import { sanitizeText } from '../utils/sanitize';

/**
 * Owns all state and behavior for the Add Product form: field values,
 * validation errors, image upload/preview, reset, and submit. Keeping
 * this in a hook (rather than inline in the page component) means the
 * form JSX stays declarative and this logic is independently testable.
 *
 * @param {(payload: object) => Promise<void> | void} onSave
 *   Called with the sanitized, validated form data on successful submit.
 */
export function useProductForm(onSave) {
  const [formData, setFormData] = useState(INITIAL_PRODUCT_FORM);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [imageError, setImageError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const objectUrlRef = useRef(null);

  const setField = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear the field's error as soon as the person edits it, rather
    // than making them wait for the next submit attempt.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const handleImageChange = useCallback((file) => {
    const validationError = validateImageFile(file);
    if (validationError) {
      setImageError(validationError);
      return;
    }
    setImageError(null);
    setImageFile(file);

    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setImagePreviewUrl(url);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_PRODUCT_FORM);
    setErrors({});
    setImageError(null);
    setImageFile(null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setImagePreviewUrl(null);
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event?.preventDefault();
      const validationErrors = validateProductForm(formData);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;

      // Sanitize free-text fields at the form boundary, before they
      // ever reach a request payload or get rendered elsewhere.
      const payload = {
        ...formData,
        name: sanitizeText(formData.name),
        supplierName: sanitizeText(formData.supplierName),
        description: sanitizeText(formData.description),
        purchasePrice: Number(formData.purchasePrice),
        sellingPrice: Number(formData.sellingPrice),
        currentQuantity: Number(formData.currentQuantity),
        minimumStock: Number(formData.minimumStock),
        image: imageFile,
      };

      setIsSubmitting(true);
      try {
        await onSave?.(payload);
        resetForm();
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, imageFile, onSave, resetForm]
  );

  return {
    formData,
    errors,
    imagePreviewUrl,
    imageError,
    isSubmitting,
    setField,
    handleImageChange,
    handleSubmit,
    resetForm,
  };
}
