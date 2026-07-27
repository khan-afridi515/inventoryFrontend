import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, ShoppingBag } from 'lucide-react';

export default function Notifications({ setActiveTab, notifications, setNotifications }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  // Sync with Sidebar active state
  useEffect(() => {
    if (setActiveTab) {
      setActiveTab('notifications');
    }
  }, [setActiveTab]);

  // Dynamic unread count directly from props
  const unreadCount = useMemo(() => {
    return notifications ? notifications.filter(n => n.isUnread).length : 0;
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
    if (!notifications) return [];
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
    <div className="dashboard-page-container px-6 lg:px-8 py-5">
      
      {/* Title Header with manual positioning classes included */}
      <div className="flex items-start justify-between gap-4 mb-4 px-6 lg:px-8 pt-1 pb-5 -mt-2 -ml-2 sm:-ml-4">
        <div>
          <h1 className="text-[32px] font-bold text-text tracking-tight">Notifications</h1>
          <p className="text-[14px] text-muted mt-0.5 font-normal">
            {unreadCount} unread notifications
          </p>
        </div>
        
        <button 
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="px-5 py-2.5 bg-surface border border-border rounded-xl text-[14px] font-semibold text-text hover:bg-bg disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xs"
        >
          Mark all as read
        </button>
      </div>

      {/* Control Filters Area */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        
        {/* Search Input Box */}
        <div className="relative w-full sm:w-70">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#94A3B8]" />
          <input 
            type="text" 
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-xl text-[14px] font-medium placeholder-[#94A3B8] focus:outline-none focus:border-primary transition-colors bg-surface"
          />
        </div>

        {/* Dropdown Type Filter Selector */}
        <div className="relative w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full sm:w-auto appearance-none pl-4 pr-10 py-2 border border-border rounded-xl text-[14px] font-medium text-text bg-surface focus:outline-none focus:border-primary cursor-pointer min-w-27.5"
          >
            <option value="All">All</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="bg-surface border border-border rounded-2xl shadow-xs overflow-hidden top-10">
        <div className="flex flex-col divide-y divide-[#F1F5F9]">
          
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div 
                key={item.id}
                onClick={() => handleToggleRead(item.id)}
                className={`flex items-center justify-between p-4.5 transition-colors cursor-pointer ${
                  item.isUnread ? 'bg-surface hover:bg-bg/50' : 'bg-surface hover:bg-bg/30'
                }`}
              >
                {/* Content Left Side */}
                <div className="flex items-center gap-4">
                  
                  {/* Icon Box */}
                  <div className="w-10 h-10 bg-primary-light text-primary rounded-xl flex items-center justify-center shrink-0">
                    <ShoppingBag className="h-[18px] w-[18px] stroke-[2.2]" />
                  </div>
                  
                  {/* Text Content */}
                  <div className="flex flex-col">
                    <p className="text-[14px] font-normal text-[#334155] leading-snug">
                      <span className="font-bold text-text">{item.units} units</span> of <span className="font-bold text-text">{item.productName}</span> {item.action}
                    </p>
                    <p className="text-[13px] text-muted font-normal mt-0.5">
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