import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ShoppingBag } from 'lucide-react';

const initialNotifications = [
  {
    id: 1,
    units: 3,
    productName: "Hydrating Face Serum",
    action: "sold",
    remainingStock: 74,
    time: "Today",
    isUnread: true,
    type: "Sales"
  },
  {
    id: 2,
    units: 5,
    productName: "Yoga Mat Premium",
    action: "sold",
    remainingStock: 95,
    time: "Today",
    isUnread: true,
    type: "Sales"
  },
  {
    id: 3,
    units: 9,
    productName: "Ceramic Coffee Mug Set",
    action: "sold",
    remainingStock: 210,
    time: "Today",
    isUnread: true,
    type: "Sales"
  },
  {
    id: 4,
    units: 14,
    productName: "Cotton Crew T-Shirt",
    action: "sold",
    remainingStock: 320,
    time: "Today",
    isUnread: true,
    type: "Sales"
  },
  {
    id: 5,
    units: 6,
    productName: "Wireless Mouse MX2",
    action: "sold",
    remainingStock: 142,
    time: "Today",
    isUnread: false,
    type: "Sales"
  }
];

export default function Notifications({ setActiveTab }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Sync with Sidebar active state
  useEffect(() => {
    if (setActiveTab) {
      setActiveTab('notifications');
    }
  }, [setActiveTab]);

  // Dynamic unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => n.isUnread).length;
  }, [notifications]);

  // Handle Mark All As Read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isUnread: false })));
  };

  // Toggle single item between Read and Unread
  const handleToggleRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isUnread: !n.isUnread } : n))
    );
  };

  // Filter computation logic supporting All, Unread, and Read
  const filteredNotifications = useMemo(() => {
    return notifications.filter(n => {
      const matchesSearch = n.productName.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesFilter = true;
      if (filterType === 'Unread') {
        matchesFilter = n.isUnread;
      } else if (filterType === 'Read') {
        matchesFilter = !n.isUnread;
      }

      return matchesSearch && matchesFilter;
    });
  }, [notifications, searchTerm, filterType]);

  return (
    <div className="dashboard-page-container font-outfit px-6 lg:px-8 py-5">
      
      {/* Title Header */}
      <div className="flex items-start justify-between gap-4 mb-4  px-6 lg:px-8 pt-1 pb-5 -mt-2 -ml-2 sm:-ml-4">
        <div>
          <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight">Notifications</h1>
          <p className="text-[14px] text-[#64748B] mt-0.5 font-normal">
            {unreadCount} unread notifications
          </p>
        </div>
        
        <button 
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="px-5 py-2.5 bg-white border border-[#E2E8F0] rounded-xl text-[14px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
        >
          Mark all as read
        </button>
      </div>

      {/* Control Filters Area */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        
        {/* Search Input Box */}
        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input 
            type="text" 
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-xl text-[14px] font-medium placeholder-[#94A3B8] focus:outline-none focus:border-[#3B82F6] transition-colors bg-white"
          />
        </div>

        {/* Dropdown Type Filter Selector */}
        <div className="relative w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 border border-[#E2E8F0] rounded-xl text-[14px] font-medium text-[#0F172A] bg-white focus:outline-none focus:border-[#3B82F6] cursor-pointer min-w-[110px]"
          >
            <option value="All">All</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B] pointer-events-none" />
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col divide-y divide-[#F1F5F9]">
          
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleToggleRead(item.id)}
                className={`flex items-center justify-between p-4.5 transition-colors cursor-pointer ${
                  item.isUnread ? 'bg-white hover:bg-[#F8FAFC]/50' : 'bg-white hover:bg-[#F8FAFC]/30'
                }`}
              >
                {/* Content Left Side */}
                <div className="flex items-center gap-4">
                  
                  {/* Icon Box */}
                  <div className="w-10 h-10 bg-[#EBF3FF] text-[#2563EB] rounded-xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-[18px] w-[18px] stroke-[2.2]" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col">
                    <p className="text-[14px] font-normal text-[#334155] leading-snug">
                      <span className="font-bold text-[#0F172A]">{item.units} units</span> of <span className="font-bold text-[#0F172A]">{item.productName}</span> {item.action}
                    </p>
                    <p className="text-[13px] text-[#64748B] font-normal mt-0.5">
                      Remaining stock: {item.remainingStock} · {item.time}
                    </p>
                  </div>

                </div>

                {/* Unread Status Indicator Dot */}
                <div className="pr-2 shrink-0">
                  {item.isUnread && (
                    <span className="block h-2 w-2 bg-[#2563EB] rounded-full animate-pulse" />
                  )}
                </div>

              </div>
            ))
          ) : (
            <div className="py-12 text-center text-[14px] font-medium text-[#94A3B8]">
              No {filterType.toLowerCase()} notifications found.
            </div>
          )}

        </div>
      </div>

    </div>
  );
}