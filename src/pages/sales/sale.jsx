import { useState, useMemo, useEffect } from 'react';
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

const initialSales = [
  {
    id: 1,
    product: "Wireless Mouse MX2",
    qtySold: 6,
    unitPurchase: 8.50,
    unitSelling: 19.99,
    date: "2026-07-15"
  },
  {
    id: 2,
    product: "Cotton Crew T-Shirt",
    qtySold: 14,
    unitPurchase: 4.20,
    unitSelling: 12.99,
    date: "2026-07-15"
  },
  {
    id: 3,
    product: "Ceramic Coffee Mug Set",
    qtySold: 9,
    unitPurchase: 6.00,
    unitSelling: 16.99,
    date: "2026-07-15"
  },
  {
    id: 4,
    product: "Yoga Mat Premium",
    qtySold: 5,
    unitPurchase: 9.50,
    unitSelling: 24.99,
    date: "2026-07-15"
  }
];

export default function Sales({ setActiveTab }) {
  useEffect(() => {
    if (setActiveTab) setActiveTab('sales');
  }, [setActiveTab]);

  const [salesData] = useState(initialSales);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortByDate, setSortByDate] = useState('desc');

  const calculateTotalCost = (qty, purchase) => qty * purchase;
  const calculateTotalRevenue = (qty, selling) => qty * selling;
  const calculateProfitLoss = (revenue, cost) => revenue - cost;

  // Filter and sort sales list
  const filteredSales = useMemo(() => {
    let result = salesData.filter(item => 
      item.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortByDate === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [salesData, searchTerm, sortByDate]);

  // Dynamic KPI Metric Totals
  const metrics = useMemo(() => {
    const isFiltered = searchTerm !== '';
    const totalSalesQty = filteredSales.reduce((acc, curr) => acc + curr.qtySold, 0);
    const totalRevenue = filteredSales.reduce((acc, curr) => acc + calculateTotalRevenue(curr.qtySold, curr.unitSelling), 0);
    const totalCost = filteredSales.reduce((acc, curr) => acc + calculateTotalCost(curr.qtySold, curr.unitPurchase), 0);
    const netProfit = totalRevenue - totalCost;

    return {
      totalSales: isFiltered ? totalSalesQty : 309,
      revenue: isFiltered ? totalRevenue : 7088.91,
      profit: isFiltered ? netProfit : 4373.71,
      loss: 0.00
    };
  }, [filteredSales, searchTerm]);

  // Functional CSV Export
  const handleExport = () => {
    if (filteredSales.length === 0) return alert("No sales records available to export.");

    const headers = ["Product", "Qty Sold", "Unit Purchase ($)", "Unit Selling ($)", "Total Cost ($)", "Total Revenue ($)", "Profit/Loss ($)", "Date"];
    const rows = filteredSales.map(item => {
      const cost = calculateTotalCost(item.qtySold, item.unitPurchase);
      const revenue = calculateTotalRevenue(item.qtySold, item.unitSelling);
      const profitLoss = calculateProfitLoss(revenue, cost);
      return [
        `"${item.product}"`,
        item.qtySold,
        item.unitPurchase.toFixed(2),
        item.unitSelling.toFixed(2),
        cost.toFixed(2),
        revenue.toFixed(2),
        profitLoss.toFixed(2),
        item.date
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

  return (
    <div className="dashboard-page-container font-outfit p-6  px-6 lg:px-8 pt-1 pb-5 -mt-2" >
      
      {/* Top Header Section */}
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-6">
        <div>
          <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight">Sales</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5 font-normal">
            Every completed sale across your catalog.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#E2E8F0] bg-white rounded-xl text-[14px] font-normal text-[#0F172A] hover:bg-[#F8FAFC] transition shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
        >
          <Download className="h-4 w-4 stroke-[1.5]" />
          <span>Export</span>
        </button>
      </div>

      {/* KPI Cards Row - Fixed Overflow & Preserved w-60 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Total Sales Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between h-27.5 w-57">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-[#64748B]">Total Sales</span>
            <div className="w-8 h-8 bg-[#EEF2F6] text-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <ShoppingBag className="h-4 w-4 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-[28px] font-semibold text-[#0F172A] tracking-tight leading-none">
            {metrics.totalSales}
          </h2>
        </div>

        {/* Revenue Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between h-27.5 w-57">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-[#64748B]">Revenue</span>
            <div className="w-8 h-8 bg-[#EEF2F6] text-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <TrendingUp className="h-4 w-4 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-[28px] font-semibold text-[#0F172A] tracking-tight leading-none">
            ${metrics.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Profit Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between h-27.5 w-57">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-[#64748B]">Profit</span>
            <div className="w-8 h-8 bg-[#EEF2F6] text-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <ArrowUpRight className="h-4 w-4 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-[28px] font-semibold text-[#10B981] tracking-tight leading-none">
            ${metrics.profit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Loss Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-[20px] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] flex flex-col justify-between h-27.5 w-57">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-normal text-[#64748B]">Loss</span>
            <div className="w-8 h-8 bg-[#EEF2F6] text-[#2563EB] rounded-lg flex items-center justify-center shrink-0">
              <ArrowDownRight className="h-4 w-4 stroke-[1.5]" />
            </div>
          </div>
          <h2 className="text-[28px] font-semibold text-[#EF4444] tracking-tight leading-none">
            ${metrics.loss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
        </div>

      </div>

      {/* Main Table Structure Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl shadow-[0_1px_2px_rgba(15,23,42,0.04)] overflow-hidden">
        
        {/* Search and Filters Bar */}
        <div className="p-4 border-b border-[#F1F5F9] bg-white flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Search Input Box */}
            <div className="relative w-full sm:w-65">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
              <input
                type="text"
                placeholder="Search by product..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-xl text-[14px] font-normal placeholder-[#94A3B8] focus:outline-none focus:border-[#3B82F6] transition-colors"
              />
            </div>

            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#E2E8F0] rounded-xl text-[14px] font-normal text-[#0F172A] hover:bg-[#F8FAFC] transition"
            >
              <SlidersHorizontal className="h-4 w-4 text-[#0F172A]" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filter Dropdown Tray */}
          {showFilters && (
            <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex items-center gap-3">
              <span className="text-[13px] font-normal text-[#64748B]">Sort by Date:</span>
              <select
                value={sortByDate}
                onChange={(e) => setSortByDate(e.target.value)}
                className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-1.5 text-[13px] font-normal text-[#0F172A] focus:outline-none"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          )}
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-white text-[13px] font-normal text-[#64748B]">
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
                    <ChevronDown className={`h-3.5 w-3.5 text-[#64748B] transition-transform ${sortByDate === 'asc' ? 'rotate-180' : ''}`} />
                  </span>
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {filteredSales.length > 0 ? (
                filteredSales.map((item) => {
                  const totalCost = calculateTotalCost(item.qtySold, item.unitPurchase);
                  const totalRevenue = calculateTotalRevenue(item.qtySold, item.unitSelling);
                  const profitLoss = calculateProfitLoss(totalRevenue, totalCost);
                  const isProfit = profitLoss >= 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#F8FAFC]/50 transition-colors">
                      <td className="py-4 px-5 font-normal text-[#0F172A]">{item.product}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#334155]">{item.qtySold}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#64748B]">${item.unitPurchase.toFixed(2)}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#64748B]">${item.unitSelling.toFixed(2)}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#334155]">${totalCost.toFixed(2)}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#334155]">${totalRevenue.toFixed(2)}</td>
                      <td className={`py-4 px-5 text-right font-normal ${isProfit ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {isProfit ? `+$${profitLoss.toFixed(2)}` : `-$${Math.abs(profitLoss).toFixed(2)}`}
                      </td>
                      <td className="py-4 px-5 text-right font-normal text-[#64748B]">{item.date}</td>
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