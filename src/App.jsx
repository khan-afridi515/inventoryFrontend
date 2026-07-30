import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

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
import { NotificationProvider, useNotifications } from './context/notificationContext';


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
  const [activeTab, setActiveTab] = React.useState('dashboard');

  // Fetch notifications from backend on mount and initialize socket
  // useEffect(() => {
  //   let mounted = true;

  //   (async () => {
  //     try {
  //       const data = await ebayNotifications();
  //       const records = Array.isArray(data) ? data : (Array.isArray(data.notifications) ? data.notifications : []);
  //       const mapped = records.map((rec) => {
  //         const id = rec.orderId || rec.id || rec._id || `${rec.eventDate || Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  //         const items = rec.items || rec.skuItems || [];
  //         const units = items.reduce((s, it) => s + (it.quantity || it.qty || 1), 0);
  //         const productName = items.length ? (items[0].title || items[0].name || items[0].sku || items.map(i => i.title || i.name).join(', ')) : (rec.productName || 'Product');
  //         const remainingStock = rec.remainingStock ?? '-';
  //         const time = rec.eventDate ? formatShortDate(rec.eventDate) : 'Today';
  //         return {
  //           id,
  //           units,
  //           productName,
  //           action: 'sold',
  //           remainingStock,
  //           time,
  //           isUnread: true,
  //           type: 'Sales'
  //         };
  //       });

  //       if (mounted && mapped.length > 0) {
  //         setNotifications(prev => {
  //           // prepend new ones not already present
  //           const deduped = mapped.filter(m => !prev.some(p => p.id === m.id));
  //           return [...deduped, ...prev];
  //         });
  //       }
  //     } catch (err) {
  //       // silent fail; backend may be unavailable
  //       console.warn('Failed loading notifications', err);
  //     }
  //   })();

  //   // initialize socket client and subscribe to productSold events
  //   // const socket = initializeSocketClient(API_BASE_URL || window.location.origin);
  //   const unsubscribe = subscribeProductSold((payload) => {
  //     try {
  //       const id = payload.orderId || `${payload.eventDate || Date.now()}-${Math.random().toString(36).slice(2,8)}`;
  //       const items = payload.items || payload.skuItems || [];
  //       const units = items.reduce((s, it) => s + (it.quantity || it.qty || 1), 0);
  //       const productName = items.length ? (items[0].title || items[0].name || items[0].sku || items.map(i => i.title || i.name).join(', ')) : (payload.productName || payload.buyer || 'Product');
  //       const time = payload.eventDate ? formatShortDate(payload.eventDate) : 'Just now';
  //       const newNotif = {
  //         id,
  //         units,
  //         productName,
  //         action: 'sold',
  //         remainingStock: '-',
  //         time,
  //         isUnread: true,
  //         type: 'Sales'
  //       };
  //       setNotifications(prev => [newNotif, ...prev]);
  //     } catch (e) {
  //       console.warn('Error handling productSold payload', e);
  //     }
  //   });

  //   return () => {
  //     mounted = false;
  //     if (unsubscribe) unsubscribe();
  //     disconnectSocket();
  //   };
  // }, []);

  return (
    <Router>
      <NotificationProvider>
        <AppContent activeTab={activeTab} setActiveTab={setActiveTab} />
      </NotificationProvider>
    </Router>
  );
}

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function AppContent({ activeTab, setActiveTab }) {
  const location = useLocation();
  const { notifications, unreadCount } = useNotifications();

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
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />
      )}

      {/* Main Content Area */}
      <div className={hideLayout ? '' : 'pl-0 lg:pl-65'}>
        
        {/* Navbar rendered conditionally */}
        {!hideLayout && (
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} unreadCount={unreadCount} />
        )}

        <main className={hideLayout ? 'min-h-screen' : 'page-content min-h-[calc(100vh-64px)]'}>
          <Routes>
            {/* Core Dashboard & General Pages */}
            <Route path="/" element={<ProtectedRoute><Dashboard setActiveTab={setActiveTab} /></ProtectedRoute>} />
            <Route path="/home" element={<ProtectedRoute><Home setActiveTab={setActiveTab} /></ProtectedRoute>} />
            
            {/* Product Management */}
            <Route path="/products" element={<ProtectedRoute><Product setActiveTab={setActiveTab} /></ProtectedRoute>} />
            <Route path="/add-product" element={<ProtectedRoute><AddProduct setActiveTab={setActiveTab} /></ProtectedRoute>} />
            <Route path="/update-product/:id" element={<ProtectedRoute><UpdateProduct setActiveTab={setActiveTab} /></ProtectedRoute>} />
            <Route path="/performance" element={<ProtectedRoute><ProductPerformance setActiveTab={setActiveTab} /></ProtectedRoute>} />

            {/* Sales & Analytics */}
            <Route path="/sales" element={<ProtectedRoute><Sales setActiveTab={setActiveTab} /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Report /></ProtectedRoute>} />

            {/* Notifications & Settings */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications setActiveTab={setActiveTab} />
                </ProtectedRoute>
              }
            />
            <Route path="/settings" element={<ProtectedRoute><Settings setActiveTab={setActiveTab} /></ProtectedRoute>} />

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