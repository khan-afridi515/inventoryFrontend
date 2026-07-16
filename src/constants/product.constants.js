export const CATEGORY_OPTIONS = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'home-kitchen', label: 'Home & Kitchen' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'sports-fitness', label: 'Sports & Fitness' },
  { value: 'other', label: 'Other' },
];

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/png', 'image/jpeg'];

export const INITIAL_PRODUCT_FORM = {
  name: '',
  sku: '',
  category: CATEGORY_OPTIONS[0].value,
  supplierName: '',
  purchasePrice: '',
  sellingPrice: '',
  currentQuantity: '',
  minimumStock: '',
  description: '',
};
