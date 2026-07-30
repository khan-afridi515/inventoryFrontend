import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Download,
  TrendingUp,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { useSalesData } from './hooks/useSalesData';
import { usePagination } from '../../shared/hooks/usePagination';
import { Pagination } from '../../shared/components/common/Pagination';
import { ebayAuth } from '../../context/ebayContext';


export default function Sales({ setActiveTab }) {
  useEffect(() => {
    if (setActiveTab) setActiveTab('sales');
  }, [setActiveTab]);

  const { data: salesData, loading, error, refetch } = useSalesData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortByDate, setSortByDate] = useState('desc');

  const { getEbayOrders, ebayError, ebayMessage, ebayData } = ebayAuth();

  // const dataSource = ebayData && ebayData.length > 0 ? ebayData : salesData;
  const dataSource = ebayData;


  // Safe Math Helpers (Guards against undefined/NaN values)
  const calculateTotalCost = (qty = 0, purchase = 0) => Number(qty) * Number(purchase);
  const calculateTotalRevenue = (qty = 0, selling = 0) => Number(qty) * Number(selling);
  const calculateProfitLoss = (revenue = 0, cost = 0) => revenue - cost;

  // Filter and sort sales list cleanly
  const filteredSales = useMemo(() => {
    let result = salesData.filter((item) =>
      item.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

    result.sort((a, b) => {
      const dateA = new Date(a.date || 0);
      const dateB = new Date(b.date || 0);
      return sortByDate === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [dataSource, searchTerm, sortByDate]);

  // Pagination operates on the filtered/sorted set — so page numbers,
  // "showing X of Y", etc. always reflect the current search, not the
  // full 3-month dataset.
  const pagination = usePagination(filteredSales, 10);
  const { resetToFirstPage } = pagination;

  // A new search or sort order changes what "page 1" even means, so
  // jump back to it rather than leaving the person stranded on, say,
  // page 12 of a 2-row search result.
  useEffect(() => {
    resetToFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, sortByDate]);

  // Dynamic KPI Metric Totals — always computed from whatever rows are
  // currently visible (full 3-month dataset when unfiltered, matching
  // subset when searched). No hardcoded fallback numbers anymore: with
  // the real 3-month dataset behind this page, "unfiltered" IS the
  // real total, not a placeholder.
  const metrics = useMemo(() => {
    const totalSalesQty = filteredSales.reduce((acc, curr) => acc + curr.qtySold, 0);
    const totalRevenue = filteredSales.reduce(
      (acc, curr) => acc + calculateTotalRevenue(curr.qtySold, curr.unitSelling),
      0
    );
    const totalCost = filteredSales.reduce(
      (acc, curr) => acc + calculateTotalCost(curr.qtySold, curr.unitPurchase),
      0
    );
    const netProfit = totalRevenue - totalCost;

    return {
      totalSales: totalSalesQty,
      revenue: totalRevenue,
      profit: netProfit,
      loss: 0.0, // no loss scenarios modeled in the mock dataset yet
    };
  }, [filteredSales]);

  // Functional CSV Export
  const handleExport = () => {
    if (filteredSales.length === 0) return alert('No sales records available to export.');

    const headers = [
      'Product',
      'Qty Sold',
      'Unit Purchase ($)',
      'Unit Selling ($)',
      'Total Cost ($)',
      'Total Revenue ($)',
      'Profit/Loss ($)',
      'Date',
    ];
    const rows = filteredSales.map((item) => {
      const cost = calculateTotalCost(item.qtySold, item.unitPurchase);
      const revenue = calculateTotalRevenue(item.qtySold, item.unitSelling);
      const profitLoss = calculateProfitLoss(revenue, cost);

      return [
        `"${item.product || 'Unknown Product'}"`,
        qty,
        purchase.toFixed(2),
        selling.toFixed(2),
        cost.toFixed(2),
        revenue.toFixed(2),
        profitLoss.toFixed(2),
        item.date,
      ];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="p-6 text-[#64748B]">Loading sales…</div>;
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="font-semibold text-[#EF4444]">Couldn't load sales data: {error}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page-container font-outfit p-6  px-6 lg:px-8 pt-1 pb-5 -mt-2">
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

      {/* {(ebayError || ebayMessage) && (
        <div className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {ebayError ? (
            <p className="text-sm font-medium text-[#EF4444]">{ebayError}</p>
          ) : (
            <p className="text-sm font-medium text-[#16A34A]">{ebayMessage}</p>
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
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-[#64748B] transition-transform ${
                        sortByDate === 'asc' ? 'rotate-180' : ''
                      }`}
                    />
                  </span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F1F5F9] text-[14px]">
              {pagination.pageItems.length > 0 ? (
                pagination.pageItems.map((item) => {
                  const totalCost = calculateTotalCost(item.qtySold, item.unitPurchase);
                  const totalRevenue = calculateTotalRevenue(item.qtySold, item.unitSelling);
                  const profitLoss = calculateProfitLoss(totalRevenue, totalCost);
                  const isProfit = profitLoss >= 0;
                  // Use item.id if available, otherwise fallback to product+date+index combination
                  const uniqueKey = item.id || `${item.product}-${item.date}-${index}`;

                  return (
                    <tr key={uniqueKey} className="hover:bg-[#F8FAFC]/50 transition-colors">
                      <td className="py-4 px-5 font-normal text-[#0F172A]">{item.product}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#334155]">{item.qtySold}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#64748B]">
                        ${item.unitPurchase.toFixed(2)}
                      </td>
                      <td className="py-4 px-5 text-right font-normal text-[#64748B]">
                        ${item.unitSelling.toFixed(2)}
                      </td>
                      <td className="py-4 px-5 text-right font-normal text-[#334155]">${totalCost.toFixed(2)}</td>
                      <td className="py-4 px-5 text-right font-normal text-[#334155]">
                        ${totalRevenue.toFixed(2)}
                      </td>
                      <td
                        className={`py-4 px-5 text-right font-normal ${
                          isProfit ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}
                      >
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

        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          startIndex={pagination.startIndex}
          endIndex={pagination.endIndex}
          totalItems={pagination.totalItems}
          pageSize={pagination.pageSize}
          onPageChange={pagination.goToPage}
          onPrevious={pagination.prevPage}
          onNext={pagination.nextPage}
          onPageSizeChange={pagination.changePageSize}
        />
      </div>
    </div>
  );
}
