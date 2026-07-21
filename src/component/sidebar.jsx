import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Package, 
  PlusCircle, 
  CheckSquare, 
  BarChart3, 
  TrendingUp, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

const StockpileLogoIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="h-6 w-6 text-white"
  >
    <rect x="3" y="8" width="18" height="12" rx="4" />
    <path d="M8 8V6a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v2" />
    <path d="M8 12h8" />
  </svg>
);

export default function Sidebar({ activeTab, setActiveTab, isCollapsed = false, toggleCollapse }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, path: '/' },
    { id: 'products', label: 'Products', icon: Package, path: '/products' },
    { id: 'add-product', label: 'Add Product', icon: PlusCircle, path: '/add-product' },
    { id: 'sales', label: 'Sales', icon: CheckSquare, path: '/sales' },
    { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
    { id: 'performance', label: 'Product Performance', icon: TrendingUp, path: '/performance' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: 4, path: '/notifications' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
  ];

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleNavClick = (id) => {
    if (setActiveTab) setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Icon Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#0F172A] shadow-xs hover:bg-[#F8FAFC] transition"
        aria-label="Toggle Navigation"
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside 
        className={`fixed left-0 top-0 h-screen bg-white border-r border-[#E2E8F0] flex flex-col justify-between py-6 z-40 font-sans transition-all duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0 w-[260px]' : '-translate-x-full lg:translate-x-0'
        } ${
          isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'
        }`}
      >
        <div className="flex flex-col">
          <div className={`flex items-center pb-8 px-4 ${isCollapsed ? 'lg:justify-center' : 'justify-between px-6'}`}>
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-[14px] bg-[#3B82F6] flex items-center justify-center shadow-sm shrink-0">
                <StockpileLogoIcon />
              </div>
              {(!isCollapsed || mobileOpen) && (
                <span className="text-lg font-bold text-[#0F172A] truncate">
                  Stockpile
                </span>
              )}
            </div>

            {toggleCollapse && (
              <button
                onClick={toggleCollapse}
                className="hidden lg:flex p-1.5 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] transition-colors"
                title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </button>
            )}
          </div>

          <nav className="flex flex-col space-y-1 px-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon; 
              const isActive = activeTab === item.id || location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => handleNavClick(item.id)}
                  title={isCollapsed && !mobileOpen ? item.label : undefined}
                  className={`w-full flex items-center rounded-lg transition-all duration-200 group ${
                    isCollapsed && !mobileOpen ? 'lg:justify-center p-3' : 'justify-between px-4 py-3'
                  } ${
                    isActive 
                      ? 'bg-[#E3F2FD] text-[#3B82F6]' 
                      : 'text-[#475569] hover:bg-[#F1F5F9]'
                  }`}
                >
                  <div className={`flex items-center gap-3 ${isCollapsed && !mobileOpen ? 'lg:justify-center' : ''}`}>
                    <IconComponent className={`h-5 w-5 shrink-0 transition-colors ${
                      isActive ? 'text-[#3B82F6]' : 'text-[#64748B]'
                    }`} />
                    
                    {(!isCollapsed || mobileOpen) && (
                      <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                        {item.label}
                      </span>
                    )}
                  </div>
                  
                  {(!isCollapsed || mobileOpen) && item.badge && (
                    <span className="bg-[#EF4444] text-white text-xs font-bold px-2.5 py-0.5 rounded-full min-w-5 h-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-3">
          <div className={`flex items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl ${
            isCollapsed && !mobileOpen ? 'lg:justify-center p-2.5' : 'gap-3 p-4'
          }`}>
            <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] text-[#3B82F6] font-bold text-sm flex items-center justify-center shrink-0">
              AR
            </div>
            {(!isCollapsed || mobileOpen) && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#0F172A] truncate">Amara Reyes</span>
                <span className="text-[11px] text-[#64748B] mt-0.5 truncate">Inventory Manager</span>
              </div>
            )}
          </div>
        </div>

      </aside>
    </>
  );
}