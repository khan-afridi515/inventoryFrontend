import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const initialPerformanceData = [
  {
    id: 1,
    product: "Bluetooth Speaker Mini",
    currentStock: 0,
    sales7d: 0,
    expected: 21,
    performance: 0,
    status: "Poor",
    recommendation: "Consider discontinuing or bundling with a bestseller."
  },
  {
    id: 2,
    product: "Running Shoes Pro",
    currentStock: 8,
    sales7d: 0,
    expected: 28,
    performance: 0,
    status: "Poor",
    recommendation: "Consider discontinuing or bundling with a bestseller."
  },
  {
    id: 3,
    product: "Notebook Set A5 (3-pack)",
    currentStock: 0,
    sales7d: 0,
    expected: 56,
    performance: 0,
    status: "Poor",
    recommendation: "Consider discontinuing or bundling with a bestseller."
  },
  {
    id: 4,
    product: "Matte Lipstick Duo",
    currentStock: 18,
    sales7d: 2,
    expected: 28,
    performance: 7,
    status: "Poor",
    recommendation: "Consider discontinuing or bundling with a bestseller."
  },
  {
    id: 5,
    product: "USB-C Hub 7-in-1",
    currentStock: 12,
    sales7d: 4,
    expected: 35,
    performance: 11,
    status: "Poor",
    recommendation: "Consider discontinuing or bundling with a bestseller."
  },
  {
    id: 6,
    product: "Wireless Gaming Mouse",
    currentStock: 45,
    sales7d: 42,
    expected: 40,
    performance: 105,
    status: "Excellent",
    recommendation: "Highly profitable. Maintain current stock levels and marketing."
  },
  {
    id: 7,
    product: "Ergonomic Office Chair",
    currentStock: 14,
    sales7d: 11,
    expected: 12,
    performance: 91,
    status: "Good",
    recommendation: "Steady sales velocity. Monitor inventory thresholds closely."
  },
  {
    id: 8,
    product: "Mechanical Keyboard RGB",
    currentStock: 25,
    sales7d: 13,
    expected: 20,
    performance: 65,
    status: "Average",
    recommendation: "Perform minor promotional discount to bump conversion rates."
  },
  {
    id: 9,
    product: "4K Ultra Wide Monitor",
    currentStock: 5,
    sales7d: 1,
    expected: 4,
    performance: 25,
    status: "Needs Attention",
    recommendation: "Sales are dropping. Review competitive pricing strategies."
  }
];

export default function ProductPerformance({ setActiveTab }) {
  const [performanceData] = useState(initialPerformanceData);
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
      case 'Excellent':
        return 'text-[#10B981] bg-[#EFF6FF] border border-[#D1FAE5]';
      case 'Good':
        return 'text-[#3B82F6] bg-[#EFF6FF] border border-[#DBEAFE]';
      case 'Average':
        return 'text-[#F59E0B] bg-[#FEF3C7] border border-[#FEF3C7]';
      case 'Needs Attention':
        return 'text-[#F97316] bg-[#FFEDD5] border border-[#FFEDD5]';
      case 'Poor':
      default:
        return 'text-[#EF4444] bg-[#FEF2F2] border border-[#FEE2E2]';
    }
  };

  // Dynamic Performance text colors matching row criteria
  const getPerformanceTextClass = (status) => {
    if (status === 'Excellent' || status === 'Good') return 'text-[#10B981]';
    if (status === 'Average') return 'text-[#F59E0B]';
    return 'text-[#EF4444]';
  };

  // Live filter and sort logic
  const filteredData = useMemo(() => {
    let result = performanceData.filter(item => {
      const matchesSearch = item.product.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All Statuses' || item.status === statusFilter;
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
        Products that underperformed against expected sales over the last 7 days.
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
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Needs Attention">Needs Attention</option>
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
                <th className="py-3.5 px-6 font-normal text-right text-[#64748B]">Sales (7d)</th>
                <th className="py-3.5 px-6 font-normal text-right text-[#475569]">Expected</th>
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