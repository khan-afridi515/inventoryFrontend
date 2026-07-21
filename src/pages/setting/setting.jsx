import { useState, useEffect } from 'react';

export default function Settings({ setActiveTab }) {
  // Functional toggle states initialized exactly as seen in the image (all active/true)
  const [settings, setSettings] = useState({
    lowStockAlerts: true,
    dailySalesSummary: true,
    newSaleNotifications: true,
    autoExportReports: true,
  });

  // Sync with your master Sidebar layout tab highlighting state
  useEffect(() => {
    if (setActiveTab) {
      setActiveTab('settings');
    }
  }, [setActiveTab]);

  // Handler to toggle switch state dynamically
  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="dashboard-page-container bg-[#F8FAFC] font-sans  px-6 lg:px-8 pt-1 pb-5 -mt-2">
      
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-[#0F172A] tracking-tight">Settings</h1>
        <p className="text-[14px] text-[#64748B] mt-0.5 font-normal">
          Manage your workspace preferences.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* SECTION 1: Notifications */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-5 tracking-tight">Notifications</h2>
          
          <div className="divide-y divide-[#F1F5F9]">
            
            {/* Low stock alerts */}
            <div className="flex items-center justify-between py-4 first:pt-0 pb-4">
              <div className="flex flex-col pr-4">
                <span className="text-[14px] font-bold text-[#0F172A]">Low stock alerts</span>
                <span className="text-[13px] text-[#64748B] font-normal mt-0.5">
                  Get notified when a product falls below minimum stock.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('lowStockAlerts')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.lowStockAlerts ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.lowStockAlerts ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Daily sales summary */}
            <div className="flex items-center justify-between py-4">
              <div className="flex flex-col pr-4">
                <span className="text-[14px] font-bold text-[#0F172A]">Daily sales summary</span>
                <span className="text-[13px] text-[#64748B] font-normal mt-0.5">
                  Receive a summary of the day's sales every evening.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('dailySalesSummary')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.dailySalesSummary ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.dailySalesSummary ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* New sale notifications */}
            <div className="flex items-center justify-between py-4 last:pb-0">
              <div className="flex flex-col pr-4">
                <span className="text-[14px] font-bold text-[#0F172A]">New sale notifications</span>
                <span className="text-[13px] text-[#64748B] font-normal mt-0.5">
                  Notify instantly whenever a product is sold.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleToggle('newSaleNotifications')}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.newSaleNotifications ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    settings.newSaleNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* SECTION 2: Workspace */}
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm">
          <h2 className="text-[18px] font-bold text-[#0F172A] mb-5 tracking-tight">Workspace</h2>
          
          <div className="flex items-center justify-between py-1">
            <div className="flex flex-col pr-4">
              <span className="text-[14px] font-bold text-[#0F172A]">Auto-export reports</span>
              <span className="text-[13px] text-[#64748B] font-normal mt-0.5">
                Automatically export monthly reports to PDF.
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('autoExportReports')}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                settings.autoExportReports ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.autoExportReports ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}