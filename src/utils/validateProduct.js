import { MAX_IMAGE_SIZE_BYTES, ACCEPTED_IMAGE_TYPES } from '../constants/product.constants';

const isBlank = (value) => !value || value.trim().length === 0;

/**
 * Validates a non-negative number field (price/quantity inputs).
 * Empty string is treated as invalid — callers decide if empty is
 * required or should default to 0 before calling this.
 */
function isValidNonNegativeNumber(value) {
  if (isBlank(String(value ?? ''))) return false;
  const num = Number(value);
  return Number.isFinite(num) && num >= 0;
}

/**
 * Validates the Add Product form. Returns an object keyed by field
 * name — empty object means the form is valid.
 * @param {object} formData
 */
export function validateProductForm(formData) {
  const errors = {};

  if (isBlank(formData.name)) errors.name = 'Product name is required.';
  if (isBlank(formData.sku)) errors.sku = 'SKU is required.';
  if (isBlank(formData.category)) errors.category = 'Category is required.';
  if (isBlank(formData.supplierName)) errors.supplierName = 'Supplier name is required.';

  if (!isValidNonNegativeNumber(formData.purchasePrice)) {
    errors.purchasePrice = 'Enter a valid purchase price (0 or more).';
  }
  if (!isValidNonNegativeNumber(formData.sellingPrice)) {
    errors.sellingPrice = 'Enter a valid selling price (0 or more).';
  }
  if (!isValidNonNegativeNumber(formData.currentQuantity)) {
    errors.currentQuantity = 'Enter a valid quantity (0 or more).';
  }
  if (!isValidNonNegativeNumber(formData.minimumStock)) {
    errors.minimumStock = 'Enter a valid minimum stock (0 or more).';
  }

  return errors;
}

/**
 * Validates an uploaded image file against type/size constraints
 * before it's ever attached to a request. Returns an error message,
 * or null if the file passes.
 * @param {File} file
 */
export function validateImageFile(file) {
  if (!file) return null;
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    return 'Only PNG or JPG images are allowed.';
  }
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return 'Image must be 5MB or smaller.';
  }
  return null;
}
