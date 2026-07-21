import React, { useState } from 'react';
import { Search, Bell } from 'lucide-react';

export default function Navbar({ activeTab }) {
  const [notificationCount] = useState(4);
  const [userInitials] = useState('AR');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const pageNames = {
    dashboard: 'Dashboard',
    products: 'Products',
    'add-product': 'Add Product',
    sales: 'Sales',
    reports: 'Reports',
    performance: 'Product Performance',
    notifications: 'Notifications',
    settings: 'Settings',
  };

  const currentPage = pageNames[activeTab] || 'Dashboard';

  return (
    <header className="sticky top-0 right-0 left-0 lg:left-[260px] h-16 bg-white border-b border-[#E2E8F0] flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 font-sans">
      
      {/* Left Side: Breadcrumb (Padded pl-12 on mobile to clear the floating menu icon) */}
      <div className="flex items-center gap-0.5 min-w-0 flex-1 justify-start -ml-2 sm:-ml-4 pl-12 lg:pl-0 transition-all duration-200 ">
        <span className="text-xs sm:text-2 font-medium text-[#64748B] truncate">
          Stockpile
        </span>
        <span className="text-xs sm:text-2 font-medium text-[#CBD5E1]">
          /
        </span>
        <span className="text-xs sm:text-2 font-bold text-[#0F172A] truncate">
          {currentPage}
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4 sm:ml-auto">
        
        {/* Desktop Search Bar */}
        <div className="relative w-56 md:w-64 hidden sm:block">
          <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search products, SKUs, orders..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] pl-11 pr-4 py-2 text-[13px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all duration-150"
          />
        </div>

        {/* Mobile Search Icon Toggle */}
        <button 
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="sm:hidden p-2 rounded-full hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] transition-colors"
          aria-label="Toggle Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications Icon with Badge */}
        <button className="p-2 rounded-full hover:bg-slate-50 text-[#64748B] hover:text-[#0F172A] relative transition-colors duration-150 shrink-0">
          <Bell className="h-5 w-5" />
          {notificationCount > 0 && (
            <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-[#EF4444] text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
              {notificationCount}
            </span>
          )}
        </button>

        {/* Circular Profile Avatar */}
        <button className="hidden sm:flex items-center justify-center w-10 h-10 rounded-lg bg-[#E8F0FE] border border-[#D0E1FD] text-[#1A73E8] hover:bg-[#D0E1FD] transition-colors duration-150 font-bold text-sm shrink-0">
          {userInitials}
        </button>

      </div>

      {/* Mobile Dropdown Search Input */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-[#E2E8F0] px-4 py-3 sm:hidden shadow-md">
          <div className="relative w-full">
            <Search className="absolute left-[16px] top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search products, SKUs, orders..."
              className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] pl-11 pr-4 py-2 text-[13px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/10 focus:border-[#3B82F6] transition-all duration-150"
            />
          </div>
        </div>
      )}

    </header>
  );
}