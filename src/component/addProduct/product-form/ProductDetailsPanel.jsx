import { Panel } from '../common/Panel';
import { TextField } from '../form/TextField';
import { SelectField } from '../form/SelectField';
import { TextareaField } from '../form/TextareaField';
import { CATEGORY_OPTIONS } from '../../../constants/product.constants';

/**
 * @param {{
 *   formData: object,
 *   errors: object,
 *   setField: (field: string, value: string) => void,
 * }} props
 */
export function ProductDetailsPanel({ formData, errors, setField }) {
  return (
    <Panel title="Product Details">
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
        <TextField
          id="name"
          label="Product Name"
          value={formData.name}
          onChange={(v) => setField('name', v)}
          placeholder="e.g. Wireless Mouse MX2"
          required
          error={errors.name}
        />
        <TextField
          id="sku"
          label="SKU"
          value={formData.sku}
          onChange={(v) => setField('sku', v)}
          placeholder="e.g. SKU-EL-1001"
          required
          error={errors.sku}
        />

        <SelectField
          id="category"
          label="Category"
          value={formData.category}
          onChange={(v) => setField('category', v)}
          options={CATEGORY_OPTIONS}
          required
          error={errors.category}
        />
        <TextField
          id="supplierName"
          label="Supplier Name"
          value={formData.supplierName}
          onChange={(v) => setField('supplierName', v)}
          placeholder="e.g. NovaTech Supplies"
          required
          error={errors.supplierName}
        />

        <TextField
          id="purchasePrice"
          label="Purchase Price"
          type="number"
          prefix="$"
          value={formData.purchasePrice}
          onChange={(v) => setField('purchasePrice', v)}
          placeholder="0.00"
          required
          error={errors.purchasePrice}
        />
        <TextField
          id="sellingPrice"
          label="Selling Price"
          type="number"
          prefix="$"
          value={formData.sellingPrice}
          onChange={(v) => setField('sellingPrice', v)}
          placeholder="0.00"
          required
          error={errors.sellingPrice}
        />

        <TextField
          id="currentQuantity"
          label="Current Quantity"
          type="number"
          value={formData.currentQuantity}
          onChange={(v) => setField('currentQuantity', v)}
          placeholder="0"
          required
          error={errors.currentQuantity}
        />
        <TextField
          id="minimumStock"
          label="Minimum Stock"
          type="number"
          value={formData.minimumStock}
          onChange={(v) => setField('minimumStock', v)}
          placeholder="0"
          required
          error={errors.minimumStock}
        />

        <div className="md:col-span-2">
          <TextareaField
            id="description"
            label="Description"
            value={formData.description}
            onChange={(v) => setField('description', v)}
            placeholder="Short description of the product..."
            rows={4}
          />
        </div>
      </div>
    </Panel>
  );
}
