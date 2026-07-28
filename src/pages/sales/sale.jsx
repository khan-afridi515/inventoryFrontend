import { useState, useMemo, useEffect } from 'react';
import { ebayAuth } from '../../context/ebayContext';
import { dummyData } from '../../data/dummyData';
import {
  Search,
  Download,
  TrendingUp,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';

export default function Sales({ setActiveTab }) {
  useEffect(() => {
    if (setActiveTab) setActiveTab('sales');
  }, [setActiveTab]);

  const [salesData] = useState(dummyData);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortByDate, setSortByDate] = useState('desc');
  const [ebayOrdersData, setEbayOrdersData] = useState(null);
  const [localEbayError, setLocalEbayError] = useState(null);
  const [localEbayMessage, setLocalEbayMessage] = useState('');

  const { getEbayOrders, ebayError, ebayMessage } = ebayAuth();

  // Normalize Data Source (handles both raw arrays and nested API responses)
  const dataSource = useMemo(() => {
    if (Array.isArray(ebayOrdersData)) return ebayOrdersData;
    if (Array.isArray(ebayOrdersData?.orders)) return ebayOrdersData.orders;
    return salesData;
  }, [ebayOrdersData, salesData]);

  // Safe Math Helpers (Guards against undefined/NaN values)
  const calculateTotalCost = (qty = 0, purchase = 0) => Number(qty) * Number(purchase);
  const calculateTotalRevenue = (qty = 0, selling = 0) => Number(qty) * Number(selling);
  const calculateProfitLoss = (revenue = 0, cost = 0) => revenue - cost;

  // Filter and sort sales list cleanly
  const filteredSales = useMemo(() => {
    let result = (dataSource || []).filter(item => {
      const productName = item?.product || item?.title || '';
      return productName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    result.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return sortByDate === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [dataSource, searchTerm, sortByDate]);

  // Dynamic KPI Metric Totals
  const metrics = useMemo(() => {
    const totalSalesQty = filteredSales.reduce((acc, curr) => acc + (Number(curr.qtySold) || 0), 0);
    const totalRevenue = filteredSales.reduce((acc, curr) => acc + calculateTotalRevenue(curr.qtySold, curr.unitSelling), 0);
    const totalCost = filteredSales.reduce((acc, curr) => acc + calculateTotalCost(curr.qtySold, curr.unitPurchase), 0);
    const netProfit = totalRevenue - totalCost;

    return {
      totalSales: totalSalesQty,
      revenue: totalRevenue,
      profit: Math.max(netProfit, 0),
      loss: Math.max(-netProfit, 0),
    };
  }, [filteredSales]);

  // Functional CSV Export
  const handleExport = () => {
    if (filteredSales.length === 0) return alert("No sales records available to export.");

    const headers = ["Product", "Qty Sold", "Unit Purchase ($)", "Unit Selling ($)", "Total Cost ($)", "Total Revenue ($)", "Profit/Loss ($)", "Date"];
    const rows = filteredSales.map(item => {
      const qty = item.qtySold || 0;
      const purchase = item.unitPurchase || 0;
      const selling = item.unitSelling || 0;
      
      const cost = calculateTotalCost(qty, purchase);
      const revenue = calculateTotalRevenue(qty, selling);
      const profitLoss = calculateProfitLoss(revenue, cost);
      
      return [
        `"${item.product || 'Unknown Product'}"`,
        qty,
        purchase.toFixed(2),
        selling.toFixed(2),
        cost.toFixed(2),
        revenue.toFixed(2),
        profitLoss.toFixed(2),
        item.date || 'N/A'
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch eBay orders on mount
  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      setLocalEbayError(null);
      setLocalEbayMessage('');

      try {
        if (typeof getEbayOrders === 'function') {
          const response = await getEbayOrders();
          if (isMounted) {
            setEbayOrdersData(response?.data || response);
            setLocalEbayMessage(response?.message || 'eBay orders loaded successfully.');
          }
        }
      } catch (error) {
        if (isMounted) {
          setLocalEbayError(error.message || 'Failed to fetch eBay orders.');
        }
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, []); // Run once on component mount

  return (
    <div className="dashboard-page-container font-outfit p-6 px-6 lg:px-8 pt-1 pb-5 -mt-2">

      {/* Top Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-text tracking-tight">Sales</h1>
          <p className="text-[14px] text-muted mt-0.5 font-normal">
            Every completed sale across your catalog.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border bg-white rounded-xl text-[14px] font-normal text-text hover:bg-bg transition shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <Download className="h-4 w-4 stroke-[1.5]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* API Status Messages */}
      {(localEbayMessage || localEbayError || ebayError || ebayMessage) && (
        <div className="mb-6 rounded-2xl border border-border bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {localEbayError || ebayError ? (
            <p className="text-sm font-medium text-negative">{localEbayError || ebayError}</p>
          ) : (
            <p className="text-sm font-medium text-[#16A34A]">{localEbayMessage || ebayMessage}</p>
          )}
          {ebayOrdersData && (
            <pre className="mt-3 max-h-40 overflow-auto text-xs text-[#334155] bg-bgd-lg p-3 rounded-xl">
              {JSON.stringify(ebayOrdersData, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        {/* Total Sales Card */}
        <div className="bg-white border border-border rounded-[20px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between h-27.5">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-muted">Total Sales</span>
            <div className="w-8 h-8 bg-[#EEF2F6] text-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-[28px] font-semibold text-text tracking-tight leading-none">
            {metrics.totalSales}
          </h2>
        </div>

        {/* Revenue Card */}
        <div className="bg-white border border-border rounded-[20px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between h-27.5">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-muted">Revenue</span>
            <div className="w-8 h-8 bg-[#EEF2F6] text-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-[28px] font-semibold text-text tracking-tight leading-none">
            ${metrics.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Profit Card */}
        <div className="bg-white border border-border rounded-[20px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between h-27.5">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-muted">Profit</span>
            <div className="w-8 h-8 bg-[#EEF2F6] text-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <ArrowUpRight className="h-4 w-4 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-[28px] font-semibold text-positive tracking-tight leading-none">
            ${metrics.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Loss Card */}
        <div className="bg-white border border-border rounded-[20px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between h-27.5">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-muted">Loss</span>
            <div className="w-8 h-8 bg-[#EEF2F6] text-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <ArrowDownRight className="h-4 w-4 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-[28px] font-semibold text-negative tracking-tight leading-none">
            ${metrics.loss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

      </div>

      {/* Main Table Container */}
      <div className="bg-white border border-border rounded-3xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">

        {/* Controls Bar */}
        <div className="p-4 border-b border-[#F1F5F9] bg-white flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">

            <div className="relative w-full sm:w-65">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search by product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-xl text-[14px] font-normal placeholder-[#94A3B8] focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-border rounded-xl text-[14px] font-normal text-text hover:bg-bg transition"
            >
              <SlidersHorizontal className="h-4 w-4 text-text" />
              <span>Filters</span>
            </button>
          </div>

          {showFilters && (
            <div className="p-3 bg-bg border border-border rounded-xl flex items-center gap-3">
              <span className="text-[13px] font-normal text-muted">Sort by Date:</span>
              <select
                value={sortByDate}
                onChange={(e) => setSortByDate(e.target.value)}
                className="bg-white border border-border rounded-lg px-3 py-1.5 text-[13px] font-normal text-texts:outline-none"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          )}
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-white text-[13px] font-normal text-muted">
                <th className="py-3.5 px-5 font-normal">Product</th>
                <th className="py-3.5 px-5 text-right font-normal">Qty Sold</th>
                <th className="py-3.5 px-5 text-right font-normal">Unit Purchase</th>
                <th className="py-3.5 px-5 text-right font-normal">Unit Selling</th>
                <th className="py-3.5 px-5 text-right font-normal">Total Cost</th>
                <th className="py-3.5 px-5 text-right font-normal">Total Revenue</th>
                <th className="py-3.5 px-5 text-right font-normal">Profit / Loss</th>
                <th
                  className="py-3.5 px-5 text-right cursor-pointer select-none font-normal"
                  onClick={() => setSortByDate(sortByDate === 'desc' ? 'asc' : 'desc')}
                >
                  <span className="inline-flex items-center justify-end gap-1">
                    Date
                    <ChevronDown className={`h-3.5 w-3.5 text-muted transition-transform ${sortByDate === 'asc' ? 'rotate-180' : ''}`} />
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {filteredSales.length > 0 ? (
                filteredSales.map((item, index) => {
                  const qty = Number(item.qtySold) || 0;
                  const purchase = Number(item.unitPurchase) || 0;
                  const selling = Number(item.unitSelling) || 0;

                  const totalCost = calculateTotalCost(qty, purchase);
                  const totalRevenue = calculateTotalRevenue(qty, selling);
                  const profitLoss = calculateProfitLoss(totalRevenue, totalCost);
                  const isProfit = profitLoss >= 0;

                  return (
                    <tr key={item.id || index} className="hover:bg-bg/50 transition-colors">
                      <td className="py-4 px-5 font-normal text-text">{item.product || item.title || 'N/A'}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#334155]">{qty}</td>
                      <td className="py-4 px-5 text-right font-normal text-muted">${purchase.toFixed(2)}</td>
                      <td className="py-4 px-5 text-right font-normal text-muted">${selling.toFixed(2)}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#334155]">${totalCost.toFixed(2)}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#334155]">${totalRevenue.toFixed(2)}</td>
                      <td className={`py-4 px-5 text-right font-normal ${isProfit ? 'text-positive' : 'text-negative'}`}>
                        {isProfit ? `+$${profitLoss.toFixed(2)}` : `-$${Math.abs(profitLoss).toFixed(2)}`}
                      </td>
                      <td className="py-4 px-5 text-right font-normal text-muted">{item.date || 'N/A'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-[14px] font-normal text-[#94A3B8]">
                    No sales records found matching your query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}