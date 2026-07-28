import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { dummyData } from '../../data/dummyData';

export default function ProductPerformance({ setActiveTab }) {
  // Generate performance data from dummyData
  const generatePerformanceData = () => {
    const productMap = {};

    dummyData.forEach((item) => {
      if (!productMap[item.product]) {
        productMap[item.product] = {
          product: item.product,
          currentStock: item.currentStock,
          actualSaleIn7Days: 0,
          expectedSaleIn7Days: item.expectedSaleIn7Days,
          totalRecords: 0,
        };
      }
      productMap[item.product].actualSaleIn7Days += item.actualSaleIn7Days;
      productMap[item.product].currentStock = item.currentStock; // Keep latest
      productMap[item.product].totalRecords += 1;
    });

    return Object.values(productMap).map((item, index) => {
      const performance =
        item.expectedSaleIn7Days > 0
          ? Math.round((item.actualSaleIn7Days / item.expectedSaleIn7Days) * 100)
          : 0;

      const status =
        item.actualSaleIn7Days < item.expectedSaleIn7Days ? 'Poor' : 'Good';

      const recommendation =
        status === 'Poor'
          ? 'Consider promotional strategies or product bundling to boost sales.'
          : 'Great performance! Maintain current inventory and marketing efforts.';

      return {
        id: index + 1,
        product: item.product,
        currentStock: item.currentStock,
        sales7d: item.actualSaleIn7Days,
        expected: item.expectedSaleIn7Days,
        performance,
        status,
        recommendation,
      };
    });
  };

  const [performanceData] = useState(generatePerformanceData);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortAsc, setSortAsc] = useState(true);

  // Sync with your top Navbar title
  useEffect(() => {
    if (setActiveTab) {
      setActiveTab('performance');
    }
  }, [setActiveTab]);

  // Dynamic Tailwind Badge Color Mapping
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Good':
        return 'text-[#10B981] bg-[#ECFDF5] border border-[#D1FAE5]';
      case 'Poor':
      default:
        return 'text-[#EF4444] bg-[#FEF2F2] border border-[#FEE2E2]';
    }
  };

  // Dynamic Performance text colors matching row criteria
  const getPerformanceTextClass = (status) => {
    if (status === 'Good') return 'text-[#10B981]';
    return 'text-[#EF4444]';
  };

  // Live filter and sort logic
  const filteredData = useMemo(() => {
    let result = performanceData.filter((item) => {
      const matchesSearch = item.product
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'All Statuses' || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      return sortAsc ? a.performance - b.performance : b.performance - a.performance;
    });

    return result;
  }, [performanceData, searchTerm, statusFilter, sortAsc]);

  return (
  <div className="dashboard-page-container bg-[#F8FAFC] px-6 lg:px-8 pt-1 pb-5 -mt-2">
    
    {/* Header Title Section - Moved upward closer to Navbar */}
    <div className="mb-6">
      <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight">Product Performance</h1>
      <p className="text-[14px] text-[#64748B] mt-0.5 font-normal">
        Products performance based on actual sales vs expected sales in the last 7 days.
      </p>
    </div>

 

      {/* Filter and Toolbar Card Shell */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        
        {/* Controls Toolbar Bar */}
        <div className="p-4 border-b border-[#F1F5F9] flex flex-wrap items-center gap-3 bg-white">
          
          {/* Input Box Wrapper */}
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-xl text-[14px] font-medium placeholder-[#94A3B8] focus:outline-none focus:border-[#3B82F6] transition-colors"
            />
          </div>

          {/* Status Dropdown Picker */}
          <div className="relative w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 border border-[#E2E8F0] rounded-xl text-[14px] font-medium text-[#0F172A] bg-white focus:outline-none focus:border-[#3B82F6] cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Good">Good</option>
              <option value="Poor">Poor</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
          </div>

        </div>

        {/* Data Grid Layout */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#F1F5F9] bg-white text-[#64748B] font-medium">
                <th className="py-3.5 px-6 font-normal text-[#64748B] w-[25%]">Product</th>
                <th className="py-3.5 px-6 font-normal text-right text-[#64748B]">Current Stock</th>
                <th className="py-3.5 px-6 font-normal text-right text-[#64748B]">Actual Sales (7d)</th>
                <th className="py-3.5 px-6 font-normal text-right text-[#475569]">Expected Sales</th>
                <th 
                  className="py-3.5 px-6 font-normal text-right text-[#64748B] cursor-pointer select-none"
                  onClick={() => setSortAsc(!sortAsc)}
                >
                  <div className="inline-flex items-center justify-end gap-1">
                    <span>Performance</span>
                    <span className="text-[11px] text-[#94A3B8]">{sortAsc ? '↑' : '↓'}</span>
                  </div>
                </th>
                <th className="py-3.5 px-6 font-normal text-center text-[#64748B]">Status</th>
                <th className="py-3.5 px-6 font-normal text-left text-[#64748B] w-[35%]">Recommendation</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-[#F1F5F9] font-medium text-[#0F172A]">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F8FAFC]/40 transition-colors">
                    
                    {/* Item Heading Row */}
                    <td className="py-4.5 px-6 font-semibold text-[#0F172A]">{item.product}</td>
                    
                    {/* Metrics Values row */}
                    <td className="py-4.5 px-6 text-right font-medium text-[#0F172A]">{item.currentStock}</td>
                    <td className="py-4.5 px-6 text-right font-medium text-[#0F172A]">{item.sales7d}</td>
                    <td className="py-4.5 px-6 text-right font-medium text-[#475569]">{item.expected}</td>
                    
                    {/* Performance percentage rendering with variant text indicators */}
                    <td className={`py-4.5 px-6 text-right font-bold ${getPerformanceTextClass(item.status)}`}>
                      {item.performance}%
                    </td>
                    
                    {/* Status dynamic pill badge configuration mapping */}
                    <td className="py-4.5 px-6 text-center">
                      <span className={`inline-block px-3 py-1 text-[12px] font-bold rounded-full ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    
                    {/* Recommendation Box */}
                    <td className="py-4.5 px-6 text-left font-normal text-[#475569] leading-relaxed">
                      {item.recommendation}
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[14px] font-semibold text-[#94A3B8]">
                    No performance metrics match your current filters.
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