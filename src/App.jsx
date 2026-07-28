import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Layout Components
import Sidebar from './component/sidebar';
import Navbar from './component/Navbar';

// Page Components
import Home from './pages/home';
import Dashboard from './pages/dashboard/Dashboard';
import Product from './pages/product/products';
import AddProduct from './pages/addProduct/AddProduct';
import UpdateProduct from './pages/update/update';
import Sales from './pages/sales/sale';
import ProductPerformance from './pages/performance/productPerformance';
import Report from './pages/reports/Reports';
import Notifications from './pages/notification/notification';
import Settings from './pages/setting/setting';

// Auth Components & Callbacks
import Login from './pages/Auth/signin';
import Signup from './pages/Auth/signUp';
import VerifyEmail from './pages/Auth/verifyemail';
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
      <AppContent 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        notifications={notifications} 
        setNotifications={setNotifications} 
        unreadCount={unreadCount} 
      />
    </Router>
  );
}

function AppContent({ activeTab, setActiveTab, notifications, setNotifications, unreadCount }) {
  const location = useLocation();

  // Hide the global sidebar and navbar for auth routes
  const hideLayout = 
    location.pathname === '/login' || 
    location.pathname === '/signup' || 
    location.pathname === '/verifyemail' || 
    location.pathname.startsWith('/auth');

  return (
    <div className="min-h-screen bg-slate-50/50">
      
      {/* Sidebar rendered conditionally */}
      {!hideLayout && (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          unreadCount={unreadCount} 
        />
      )}

      {/* Main Content Area */}
      <div className={hideLayout ? '' : 'pl-0 lg:pl-65'}>
        
        {/* Navbar rendered conditionally */}
        {!hideLayout && (
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            unreadCount={unreadCount} 
          />
        )}

        <main className={hideLayout ? 'min-h-screen' : 'page-content min-h-[calc(100vh-64px)]'}>
          <Routes>
            {/* Core Dashboard & General Pages */}
            <Route path="/" element={<Dashboard setActiveTab={setActiveTab} />} />
            <Route path="/home" element={<Home setActiveTab={setActiveTab} />} />
            
            {/* Product Management */}
            <Route path="/products" element={<Product setActiveTab={setActiveTab} />} />
            <Route path="/add-product" element={<AddProduct setActiveTab={setActiveTab} />} />
            <Route path="/update-product/:id" element={<UpdateProduct setActiveTab={setActiveTab} />} />
            <Route path="/performance" element={<ProductPerformance setActiveTab={setActiveTab} />} />

            {/* Sales & Analytics */}
            <Route path="/sales" element={<Sales setActiveTab={setActiveTab} />} />
            <Route path="/reports" element={<Report />} />

            {/* Notifications & Settings */}
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

            {/* Authentication Routes (Layout Hidden) */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />
            <Route path="/auth/ebay/callback" element={<Redirect />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}