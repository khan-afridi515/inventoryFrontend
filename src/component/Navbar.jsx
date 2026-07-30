import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

function getInitials(name) {
  if (!name) return 'U';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function Navbar({ activeTab, setActiveTab, unreadCount = 0 }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const userInitials = getInitials(user?.name);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <header className="sticky top-0 right-0 left-0 lg:left-65 h-16 bg-white border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 font-sans">
      
      {/* Left Side: Breadcrumb */}
      <div className="flex items-center gap-0.5 min-w-0 flex-1 justify-start -ml-2 sm:-ml-4 pl-12 lg:pl-0 transition-all duration-200 ">
        <span className="text-xs sm:text-2 font-medium text-muted truncate">
          Stockpile
        </span>
        <span className="text-xs sm:text-2 font-medium text-[#CBD5E1]">
          /
        </span>
        <span className="text-xs sm:text-2 font-bold text-text truncate">
          {currentPage}
        </span>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-2 sm:gap-4 ml-4 sm:ml-auto">
        
        {/* Desktop Search Bar */}
        <div className="relative w-56 md:w-64 hidden sm:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            placeholder="Search products, SKUs, orders..."
            className="w-full bg-bg border border-border rounded-xl pl-11 pr-4 py-2 text-[13px] text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-150"
          />
        </div>

        {/* Mobile Search Icon Toggle */}
        <button 
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="sm:hidden p-2 rounded-full hover:bg-slate-50 text-muted hover:text-text transition-colors"
          aria-label="Toggle Search"
        >
          <Search className="h-5 w-5" />
        </button>

        {/* Notifications Icon Link with Dynamic Badge */}
        <Link 
          to="/notifications" 
          onClick={() => setActiveTab && setActiveTab('notifications')}
          className="p-2 rounded-full hover:bg-slate-50 text-muted hover:text-text relative transition-colors duration-150 shrink-0"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-[18px] h-[18px] bg-negative text-white rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Profile Dropdown Container */}
        <div className="relative hidden sm:block" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#E8F0FE] border border-[#D0E1FD] text-[#1A73E8] hover:bg-[#D0E1FD] transition-colors duration-150 font-bold text-sm shrink-0"
          >
            {userInitials}
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-xl shadow-lg py-2 z-50">
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Mobile Dropdown Search Input */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-border px-4 py-3 sm:hidden shadow-md">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search products, SKUs, orders..."
              className="w-full bg-bg border border-border rounded-xl pl-11 pr-4 py-2 text-[13px] text-text placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-150"
            />
          </div>
        </div>
      )}

    </header>
  );
}