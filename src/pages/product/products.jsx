import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Download,
  Upload,
  Plus,
  ChevronDown,
  Edit2,
  Trash2,
  X,
  RefreshCw,
  WifiOff
} from 'lucide-react';

const API_URL = 'http://localhost:3000/api/v1/get';

/** Static product data */
const STATIC_PRODUCTS = [
  {
    id: 'fallback-1',
    name: 'Bluetooth Speaker Mini',
    category: 'Electronics',
    img: null,
    supplierName: 'Sample Supplier',
    description: 'Demo product — API unavailable',
    sku: 'DEMO-001',
    sellingPrice: 20.00,
    purchasePrice: 15.00,
    quantity: 0,
  },
  {
    id: 'fallback-2',
    name: 'Wireless Charging Pad',
    category: 'Electronics',
    img: null,
    supplierName: 'Sample Supplier',
    description: 'Demo product — API unavailable',
    sku: 'DEMO-002',
    sellingPrice: 18.00,
    purchasePrice: 12.50,
    quantity: 8,
  },
  {
    id: 'fallback-3',
    name: 'Cotton Crew T-Shirt',
    category: 'Apparel',
    img: null,
    supplierName: 'Sample Supplier',
    description: 'Demo product — API unavailable',
    sku: 'DEMO-003',
    sellingPrice: 6.00,
    purchasePrice: 4.20,
    quantity: 320,
  },
  {
    id: 'fallback-4',
    name: 'Denim Jacket',
    category: 'Apparel',
    img: null,
    supplierName: 'Sample Supplier',
    description: 'Demo product — API unavailable',
    sku: 'DEMO-004',
    sellingPrice: 30.00,
    purchasePrice: 22.00,
    quantity: 15,
  },
  {
    id: 'fallback-5',
    name: 'Yoga Mat Premium',
    category: 'Sports',
    img: null,
    supplierName: 'Sample Supplier',
    description: 'Demo product — API unavailable',
    sku: 'DEMO-005',
    sellingPrice: 14.00,
    purchasePrice: 10.00,
    quantity: 85,
  },
  {
    id: 'fallback-6',
    name: 'Ceramic Coffee Mug Set',
    category: 'Home & Kitchen',
    img: null,
    supplierName: 'Sample Supplier',
    description: 'Demo product — API unavailable',
    sku: 'DEMO-006',
    sellingPrice: 9.00,
    purchasePrice: 6.00,
    quantity: 210,
  },
  {
    id: 'fallback-7',
    name: 'Leather Journal Notebook',
    category: 'Office Supplies',
    img: null,
    supplierName: 'Sample Supplier',
    description: 'Demo product — API unavailable',
    sku: 'DEMO-007',
    sellingPrice: 8.00,
    purchasePrice: 5.50,
    quantity: 12,
  },
  {
    id: 'fallback-8',
    name: 'Hydrating Face Serum',
    category: 'Beauty',
    img: null,
    supplierName: 'Sample Supplier',
    description: 'Demo product — API unavailable',
    sku: 'DEMO-008',
    sellingPrice: 20.00,
    purchasePrice: 14.00,
    quantity: 0,
  },
];

/** Map a single API product record → internal component shape */
const mapApiProduct = (p) => ({
  id:            p._id,
  name:          p.productName ?? 'Unnamed Product',
  category:      p.Category   ?? 'Uncategorized',
  img:           p.img        ?? null,
  supplierName:  p.supplierName ?? '',
  description:   p.description  ?? '',
  sku:           p.sku          ?? '',
  sellingPrice:  Number(p.sellingPrice)  || 0,
  purchasePrice: Number(p.supplierCost)  || 0,
  quantity:      Number(p.qty)           || 0,
});

export default function Products({ setActiveTab }) {
  const [products,   setProducts]   = useState(STATIC_PRODUCTS);
  const [loading,    setLoading]    = useState(true);
  const [apiError,   setApiError]   = useState(null);   // null = no error
  const [isApiData,  setIsApiData]  = useState(false);  // true = live data shown

  useEffect(() => {
    if (setActiveTab) setActiveTab('products');
  }, [setActiveTab]);

  /** Fetch products from the real API; fall back silently on any failure */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setApiError(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const json = await res.json();
      const items = Array.isArray(json.data) ? json.data : [];
      if (items.length === 0) throw new Error('Empty product list from API');
      setProducts(items.map(mapApiProduct));
      setIsApiData(true);
    } catch (err) {
      // Keep the static fallback data already in state
      setApiError(err.message ?? 'Could not reach the server');
      setIsApiData(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');
  const [selectedRows, setSelectedRows] = useState([]);

  // Modals States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // State for Add Product Form
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Electronics',
    purchasePrice: '',
    quantity: ''
  });

  const fileInputRef = useRef(null);

  const getStatus = (qty) => {
    if (qty === 0) return "Out of Stock";
    if (qty > 0 && qty <= 20) return "Low Stock";
    return "In Stock";
  };

  const categoriesList = ['All Categories', 'Electronics', 'Apparel', 'Sports', 'Home & Kitchen', 'Office Supplies', 'Beauty'];

  // Helper styling lookup context based on added Category 
  const getCategoryStyles = (category) => {
    switch (category) {
      case 'Electronics': return "bg-[#EBF3FF] text-[#2563EB]";
      case 'Apparel': return "bg-[#F3E8FF] text-[#9333EA]";
      case 'Sports': return "bg-[#E0F2FE] text-[#0369A1]";
      case 'Home & Kitchen': return "bg-[#FEF3C7] text-[#D97706]";
      case 'Office Supplies': return "bg-[#D1FAE5] text-[#065F46]";
      case 'Beauty': return "bg-[#FCE7F3] text-[#9D174D]";
      default: return "bg-[#F1F5F9] text-[#475569]";
    }
  };

  // Extract custom initials helper
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "PR";
  };

  // Handle Export Action (Generates clean standard CSV download layout)
  const handleExport = () => {
    if (filteredProducts.length === 0) return alert("No data available to export.");

    const headers = ["Product Name", "Category", "Purchase Price ($)", "Quantity", "Status"];
    const rows = filteredProducts.map(p => [
      `"${p.name}"`,
      `"${p.category}"`,
      p.purchasePrice.toFixed(2),
      p.quantity,
      `"${getStatus(p.quantity)}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle CSV Import upload pipeline
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);

      // Skip top column layout headings row
      const importedItems = [];
      for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // Advanced CSV regex boundary splitter
        if (columns.length >= 4) {
          const name = columns[0].replace(/"/g, "").trim();
          const category = columns[1].replace(/"/g, "").trim();
          const purchasePrice = parseFloat(columns[2]);
          const quantity = parseInt(columns[3], 10);

          if (name && category && !isNaN(purchasePrice) && !isNaN(quantity)) {
            importedItems.push({
              id: Date.now() + i,
              name,
              category,
              initials: getInitials(name),
              bgInitials: getCategoryStyles(category),
              purchasePrice,
              quantity
            });
          }
        }
      }

      if (importedItems.length > 0) {
        setProducts(prev => [...importedItems, ...prev]);
        alert(`Successfully imported ${importedItems.length} products!`);
      } else {
        alert("Could not discover valid products. Use format: Name, Category, Price, Quantity");
      }
    };
    reader.readAsText(file);
    e.target.value = ""; // Clear file selector buffer
  };

  // Create Product Action Form Submission execution
  const handleAddProduct = (e) => {
    e.preventDefault();
    const qtyParsed = parseInt(newProduct.quantity, 10) || 0;
    const priceParsed = parseFloat(newProduct.purchasePrice) || 0.00;

    const createdRecord = {
      id: Date.now(),
      name: newProduct.name,
      category: newProduct.category,
      initials: getInitials(newProduct.name),
      bgInitials: getCategoryStyles(newProduct.category),
      purchasePrice: priceParsed,
      quantity: qtyParsed
    };

    setProducts([createdRecord, ...products]);
    setIsAddModalOpen(false);
    setNewProduct({ name: '', category: 'Electronics', purchasePrice: '', quantity: '' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(product => product.id !== id));
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    }
  };

  const handleOpenEdit = (product) => {
    setEditingProduct({ ...product });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProducts(products.map(p => {
      if (p.id === editingProduct.id) {
        return {
          ...editingProduct,
          initials: getInitials(editingProduct.name),
          bgInitials: getCategoryStyles(editingProduct.category),
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

  /** Derive unique categories from API data for the filter dropdown */
  const dynamicCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category).filter(Boolean));
    return ['All Categories', ...Array.from(cats).sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;

      const currentStatus = getStatus(product.quantity);
      const matchesStatus = selectedStatus === 'All Statuses' || currentStatus === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  /** ── Shimmer skeleton rows shown while loading ── */
  if (loading) {
    return (
      <div className="dashboard-page-container bg-[#F8FAFC] font-sans antialiased tracking-tight">
        {/* Header placeholder */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-6 lg:px-8 pt-1 pb-5 -mt-2">
          <div>
            <div className="h-8 w-32 bg-[#E2E8F0] rounded-lg animate-pulse" />
            <div className="h-3.5 w-48 bg-[#E2E8F0] rounded mt-2 animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-[#BFDBFE] rounded-full animate-pulse" />
        </div>

        {/* Table card placeholder */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
          {/* Filters */}
          <div className="flex flex-col md:flex-row items-center gap-4 p-5 border-b border-[#F1F5F9]">
            <div className="h-9 w-full md:w-70 bg-[#F1F5F9] rounded-xl animate-pulse" />
            <div className="h-9 w-full md:w-50 bg-[#F1F5F9] rounded-2xl animate-pulse" />
            <div className="h-9 w-full md:w-50 bg-[#F1F5F9] rounded-2xl animate-pulse" />
          </div>

          {/* Loading indicator centred */}
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-[#DBEAFE] border-t-[#2563EB] animate-spin" />
            </div>
            <p className="text-xs font-semibold text-[#64748B]">Loading products…</p>
          </div>

          {/* Skeleton rows */}
          <div className="divide-y divide-[#F1F5F9] px-5 pb-5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 py-3.5" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="h-3.5 w-3.5 bg-[#E2E8F0] rounded animate-pulse" />
                <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] animate-pulse shrink-0" />
                <div className="flex flex-col gap-1.5 flex-1">
                  <div className="h-3 w-36 bg-[#E2E8F0] rounded animate-pulse" />
                  <div className="h-2.5 w-20 bg-[#F1F5F9] rounded animate-pulse" />
                </div>
                <div className="h-3 w-16 bg-[#E2E8F0] rounded animate-pulse" />
                <div className="h-3 w-10 bg-[#E2E8F0] rounded animate-pulse" />
                <div className="h-5 w-16 bg-[#F1F5F9] rounded-full animate-pulse" />
                <div className="h-6 w-14 bg-[#F1F5F9] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page-container bg-[#F8FAFC] font-sans antialiased tracking-tight">


      {/* Hidden natively mapped file upload anchor tag element context */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv"
        className="hidden"
      />

      {/* Title and Action Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6  px-6 lg:px-8 pt-1 pb-5 -mt-2">
        <div>
          <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight -ml-2 sm:-ml-4">
            Products
          </h1>
          <div className="flex items-center gap-2 mt-1 -ml-2 sm:-ml-4">
            <p className="text-xs text-[#64748B] font-semibold">
              {filteredProducts.length} products across {dynamicCategories.length - 1} categories
            </p>
            {/* Live / Offline badge */}
            {isApiData ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ECFDF5] text-[#10B981]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] inline-block animate-pulse" />
                Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FFF7ED] text-[#D97706]">
                <WifiOff className="w-2.5 h-2.5" />
                Offline
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh button */}
          <button
            onClick={fetchProducts}
            title="Refresh from API"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-[#E2E8F0] bg-white rounded-full text-xs font-bold text-[#334155] hover:bg-slate-50 transition shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh</span>
          </button>

          {/* <button
            onClick={handleImportClick}
            className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] bg-white rounded-full text-xs font-bold text-[#334155] hover:bg-slate-50 transition"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Import</span>
          </button> */}

          {/* <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] bg-white rounded-full text-xs font-bold text-[#334155] hover:bg-slate-50 transition"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export</span>
          </button> */}

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1 px-4.5 py-2.5 bg-[#2563EB] text-white rounded-full text-xs font-extrabold hover:bg-[#1D4ED8] transition shadow-sm"
          >
            <Plus className="h-3.5 w-3.5 stroke-3" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* API error banner (shown when we fell back to static data) */}
      {apiError && (
        <div className="flex items-center gap-3 mx-6 lg:mx-8 mb-4 px-4 py-3 rounded-xl bg-[#FFF7ED] border border-[#FDE68A] text-xs font-semibold text-[#92400E]">
          <WifiOff className="h-4 w-4 text-[#D97706] shrink-0" />
          <span>
            <strong>Couldn't reach the server</strong> — showing cached demo data.
            &nbsp;({apiError})
          </span>
        </div>
      )}

      {/* Filters and Table Container Card */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">

        {/* Filters bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 p-5 border-b border-[#F1F5F9] bg-white">
          <div className="relative w-full md:w-70">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-xs font-semibold placeholder-[#94A3B8] focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          <div className="relative w-full md:w-50">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-[#E2E8F0] rounded-2xl text-[14px] font-semibold text-[#0F172A] bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#3B82F6] transition-all hover:bg-slate-50"
            >
              {dynamicCategories.map((cat, idx) => (
                <option key={idx} value={cat} className="text-[#334155] py-2">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F172A] pointer-events-none stroke-[2.5]" />
          </div>

          <div className="relative w-full md:w-50">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-4 pr-10 py-2.5 border border-[#E2E8F0] rounded-2xl text-[14px] font-semibold text-[#0F172A] bg-white appearance-none cursor-pointer focus:outline-none focus:border-[#3B82F6] transition-all hover:bg-slate-50"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0F172A] pointer-events-none stroke-[2.5]" />
          </div>
        </div>

        {/* Table View Layout Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-[#FAFCFE] text-[11px] font-extrabold text-[#64748B] uppercase tracking-wider">
                <th className="py-3.5 px-5 w-12.5">
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
                <th className="py-3.5 px-5 text-center w-25 text-[#475569]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
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
                          {product.img ? (
                            <img
                              src={product.img}
                              alt={product.name}
                              className="w-9 h-9 rounded-xl object-cover shrink-0 border border-[#E2E8F0]"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-9 h-9 rounded-xl items-center justify-center font-bold text-xs shrink-0 ${getCategoryStyles(product.category)}`}
                            style={{ display: product.img ? 'none' : 'flex' }}
                          >
                            {getInitials(product.name)}
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
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-xs font-semibold text-[#94A3B8]">
                    No inventory metrics match your current search constraints.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal Sheet */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9]">
              <h3 className="text-sm font-bold text-[#0F172A]">Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[#64748B] hover:bg-slate-100 p-1 rounded-lg transition">
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="p-5 space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Mechanical Keyboard"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#3B82F6]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">Category Selection</label>
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium bg-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
                >
                  {dynamicCategories.filter(c => c !== 'All Categories').map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">Purchase Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={newProduct.purchasePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#3B82F6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#475569] uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium focus:outline-none focus:border-[#3B82F6]"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F1F5F9] mt-4">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-[#E2E8F0] rounded-full text-xs font-semibold text-[#334155] hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2563EB] text-white rounded-full text-xs font-bold hover:bg-[#1D4ED8]"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-xs font-medium bg-white focus:outline-none focus:border-[#3B82F6]"
                >
                  {dynamicCategories.filter(c => c !== 'All Categories').map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </select>
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