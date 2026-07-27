import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './component/sidebar';
import Navbar from './component/Navbar';
import Home from './pages/home';
import Product from './pages/product/products';
import AddProduct from './pages/addProduct/AddProduct';
import Dashboard from './pages/dashboard/Dashboard';
import Sales from './pages/sales/sale';
import Notifications from './pages/notification/notification';
import Settings from './pages/setting/setting';
import ProductPerformance from './pages/performance/productPerformance';

import Redirect from './redirect';

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
    isUnread: true,
    type: "Sales"
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load initial notifications from LocalStorage or fallback to default
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('app_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Calculate unread count dynamically
  const unreadCount = notifications.filter(n => n.isUnread).length;

  // Persist notifications to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('app_notifications', JSON.stringify(notifications));
  }, [notifications]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50/50">
        
        {/* Global Sidebar layout */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          unreadCount={unreadCount} 
        />

        {/* Shift layout right to account for sidebar */}
        <div className="pl-0 lg:pl-65">
          
          {/* Main Top Header Navigation */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            unreadCount={unreadCount} 
          />

          {/* Core App View Container */}
          <main className="page-content min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<Dashboard setActiveTab={setActiveTab} />} />
              <Route path="/home" element={<Home setActiveTab={setActiveTab} />} />
              <Route path="/products" element={<Product setActiveTab={setActiveTab} />} />
              <Route path="/add-product" element={<AddProduct setActiveTab={setActiveTab} />} />
              <Route path="/sales" element={<Sales setActiveTab={setActiveTab} />} />
              <Route path="/performance" element={<ProductPerformance setActiveTab={setActiveTab} />} />
              
              {/* Notifications route passing notifications & updater */}
              <Route 
                path="/notifications" 
                element={
                  <Notifications 
                    setActiveTab={setActiveTab} 
                    notifications={notifications}
                    setNotifications={setNotifications}
                  />
                } 
              />
              <Route path="/settings" element={<Settings setActiveTab={setActiveTab} />} />

              {/* Authentication Callback */}
              <Route path="/auth/ebay/callback" element={<Redirect />} />
            </Routes>
          </main>

        </div>
      </div>
    </Router>
  );
}