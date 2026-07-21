import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutGrid, 
  Package, 
  PlusCircle, 
  CheckSquare, 
  BarChart3, 
  TrendingUp, 
  Bell, 
  Settings
} from 'lucide-react';

// Exact SVG matching the double-loop blue briefcase logo in your design
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

export default function Sidebar({ activeTab, setActiveTab }) {
  
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

  return (
    <aside className="fixed left-0 top-0 h-screen w-[260px] bg-white border-r border-[#E2E8F0] hidden lg:flex flex-col justify-between py-6 z-30 font-sans">
      
      {/* Top Container: Contains only logo and menu so they stack tightly at the top */}
      <div className="flex flex-col">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 pb-8">
          <div className="w-11 h-11 rounded-[14px] bg-[#3B82F6] flex items-center justify-center shadow-sm flex-shrink-0">
            <StockpileLogoIcon />
          </div>
          <span className="text-lg font-bold text-[#0F172A]">
            Stockpile
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col space-y-0.5 px-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon; 
            const isActive = activeTab === item.id;

            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-[#E3F2FD] text-[#3B82F6]' 
                    : 'text-[#475569] hover:bg-[#F1F5F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComponent className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-[#3B82F6]' : 'text-[#64748B]'
                  }`} />
                  <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                </div>
                
                {item.badge && (
                  <span className="bg-[#EF4444] text-white text-xs font-bold px-2.5 py-0.5 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Container: Stays pushed all the way to the bottom, leaving a wide space above it */}
      <div className="px-3">
        <div className="flex items-center gap-3 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl">
          <div className="w-10 h-10 rounded-lg bg-[#DBEAFE] text-[#3B82F6] font-bold text-sm flex items-center justify-center flex-shrink-0">
            AR
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-[#0F172A] truncate">Amara Reyes</span>
            <span className="text-[11px] text-[#64748B] mt-0.5 truncate">Inventory Manager</span>
          </div>
        </div>
      </div>
    </aside>
  );
}