import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Upload, 
  Plus, 
  ChevronDown, 
  Edit2, 
  Trash2,
  X
} from 'lucide-react';

const initialProducts = [
  // 1. Electronics
  {
    id: 1,
    name: "Bluetooth Speaker Mini",
    category: "Electronics",
    initials: "BS",
    bgInitials: "bg-[#EBF3FF] text-[#2563EB]",
    purchasePrice: 15.00,
    quantity: 0, // Out of Stock
  },
  {
    id: 2,
    name: "Wireless Charging Pad",
    category: "Electronics",
    initials: "WP",
    bgInitials: "bg-[#EBF3FF] text-[#2563EB]",
    purchasePrice: 12.50,
    quantity: 8, // Low Stock
  },
  // 2. Apparel
  {
    id: 3,
    name: "Cotton Crew T-Shirt",
    category: "Apparel",
    initials: "CC",
    bgInitials: "bg-[#F3E8FF] text-[#9333EA]",
    purchasePrice: 4.20,
    quantity: 320, // In Stock
  },
  {
    id: 4,
    name: "Denim Jacket",
    category: "Apparel",
    initials: "DJ",
    bgInitials: "bg-[#F3E8FF] text-[#9333EA]",
    purchasePrice: 22.00,
    quantity: 15, // Low Stock
  },
  // 3. Sports
  {
    id: 5,
    name: "Yoga Mat Premium",
    category: "Sports",
    initials: "YM",
    bgInitials: "bg-[#E0F2FE] text-[#0369A1]",
    purchasePrice: 10.00,
    quantity: 85, // In Stock
  },
  // 4. Home & Kitchen
  {
    id: 6,
    name: "Ceramic Coffee Mug Set",
    category: "Home & Kitchen",
    initials: "CC",
    bgInitials: "bg-[#FEF3C7] text-[#D97706]",
    purchasePrice: 6.00,
    quantity: 210, // In Stock
  },
  // 5. Office Supplies
  {
    id: 7,
    name: "Leather Journal Notebook",
    category: "Office Supplies",
    initials: "LN",
    bgInitials: "bg-[#D1FAE5] text-[#065F46]",
    purchasePrice: 5.50,
    quantity: 12, // Low Stock
  },
  {
    id: 8,
    name: "Gel Pen Set (12 Pack)",
    category: "Office Supplies",
    initials: "GP",
    bgInitials: "bg-[#D1FAE5] text-[#065F46]",
    purchasePrice: 3.10,
    quantity: 110, // In Stock
  },
  // 6. Beauty
  {
    id: 9,
    name: "Hydrating Face Serum",
    category: "Beauty",
    initials: "FS",
    bgInitials: "bg-[#FCE7F3] text-[#9D174D]",
    purchasePrice: 14.00,
    quantity: 0, // Out of Stock
  }
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Helper to dynamically calculate current status based on quantity
  const getStatus = (qty) => {
    if (qty === 0) return "Out of Stock";
    if (qty > 0 && qty <= 20) return "Low Stock";
    return "In Stock";
  };

  // Explicit static list matching the filter structure in your screenshot
  const categoriesList = ['All Categories', 'Electronics', 'Apparel', 'Sports', 'Home & Kitchen', 'Office Supplies', 'Beauty'];

  // Handle Delete Action
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.id !== id));
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  // Save changes
  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProducts(products.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...editingProduct,
          quantity: parseInt(editingProduct.quantity, 10),
          purchasePrice: parseFloat(editingProduct.purchasePrice)
        };
      }
      return p;
    }));
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = (filtered) => {
    if (selectedRows.length === filtered.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filtered.map(p => p.id));
    }
  };

  // Filter products by name, category, and custom status rules
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      
      const currentStatus = getStatus(product.quantity);
      const matchesStatus = selectedStatus === 'All Statuses' || currentStatus === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  return (
    // Applied elegant UI font settings (Plus Jakarta Sans vibe)
    <div className="w-full bg-[#F8FAFC] p-6 font-sans antialiased tracking-tight">
      
      {/* Title and Action Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Products</h1>
          <p className="text-xs text-[#64748B] mt-1 font-semibold">
            {filteredProducts.length} products across {categoriesList.length - 1} categories
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] bg-white rounded-full text-xs font-bold text-[#334155] hover:bg-slate-50 transition">
            <Upload className="h-3.5 w-3.5" />
            <span>Import</span>
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] bg-white rounded-full text-xs font-bold text-[#334155] hover:bg-slate-50 transition">
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button>

          <button className="flex items-center gap-1 px-4.5 py-2.5 bg-[#2563EB] text-white rounded-full text-xs font-extrabold hover:bg-[#1D4ED8] transition shadow-sm">
            <Plus className="h-3.5 w-3.5 stroke-[3]" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters and Table Container Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        
        {/* Filters bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 p-5 border-b border-[#F1F5F9] bg-white">
          <div className="relative w-full md:w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold placeholder-[#94A3B8] focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          {/* Category Dropdown styled to perfectly match screenshot */}
          <div className="relative w-full md:w-[200px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-[#E2E8F0] rounded-2xl text-[14px] font-semibold text-[#0F172A] bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#3B82F6] transition-all hover:bg-slate-50"
            >
              {categoriesList.map((cat, idx) => (
                <option key={idx} value={cat} className="text-[#334155] py-2">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F172A] pointer-events-none stroke-[2.5]" />
          </div>

          {/* Status Dropdown styled to perfectly match screenshot */}
          <div className="relative w-full md:w-[200px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-[#E2E8F0] rounded-2xl text-[14px] font-semibold text-[#0F172A] bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#3B82F6] transition-all hover:bg-slate-50"
            >
              <option value="All Statuses" className="text-[#334155] py-2">All Statuses</option>
              <option value="In Stock" className="text-[#334155] py-2">In Stock</option>
              <option value="Low Stock" className="text-[#334155] py-2">Low Stock</option>
              <option value="Out of Stock" className="text-[#334155] py-2">Out of Stock</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F172A] pointer-events-none stroke-[2.5]" />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-[#FAFCFE] text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">
                <th className="py-3.5 px-5 w-[50px]">
                  <input 
                    type="checkbox"
                    checked={filteredProducts.length > 0 && selectedRows.length === filteredProducts.length}
                    onChange={() => handleSelectAll(filteredProducts)}
                    className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] h-3.5 w-3.5 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4 text-[#475569]">Product</th>
                <th className="py-3.5 px-4 text-[#475569]">Purchase Price</th>
                <th className="py-3.5 px-4 text-[#475569]">Quantity</th>
                <th className="py-3.5 px-4 text-[#475569]">Status</th>
                <th className="py-3.5 px-5 text-center w-[100px] text-[#475569]">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredProducts.map((product) => {
                const isChecked = selectedRows.includes(product.id);
                const currentStatus = getStatus(product.quantity);
                
                return (
                  <tr key={product.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                    <td className="py-3 px-5">
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleSelectRow(product.id)}
                        className="rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] h-3.5 w-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${product.bgInitials}`}>
                          {product.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#0F172A] leading-tight">{product.name}</span>
                          <span className="text-[11px] text-[#64748B] font-medium mt-0.5">{product.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-bold text-[#0F172A]">${product.purchasePrice.toFixed(2)}</td>
                    <td className="py-3.5 px-4 text-xs font-bold text-[#475569]">{product.quantity}</td>
                    <td className="py-3.5 px-4">
                      {currentStatus === 'In Stock' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#10B981]">
                          In Stock
                        </span>
                      )}
                      {currentStatus === 'Low Stock' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFFBEB] text-[#D97706]">
                          Low Stock
                        </span>
                      )}
                      {currentStatus === 'Out of Stock' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#EF4444]">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button 
                          onClick={() => handleOpenEdit(product)}
                          className="p-1 text-[#64748B] hover:text-[#2563EB] hover:bg-slate-50 rounded transition"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-1 text-[#EF4444] hover:bg-[#FEF2F2] rounded transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A]">Edit Product</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-[#64748B] hover:bg-slate-100 p-1 rounded-lg transition">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#3B82F6]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">Category</label>
                <input 
                  type="text" 
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#3B82F6]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">Purchase Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={editingProduct.purchasePrice}
                    onChange={(e) => setEditingProduct({ ...editingProduct, purchasePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#3B82F6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">Quantity</label>
                  <input 
                    type="number" 
                    value={editingProduct.quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#3B82F6]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F1F5F9] mt-4">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#E2E8F0] rounded-full text-xs font-semibold text-[#334155] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-full text-xs font-bold hover:bg-[#1D4ED8]"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}