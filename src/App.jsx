import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout Components
import Sidebar from './component/sidebar';
import Navbar from './component/Navbar';

// Page Components
import Home from './pages/home';
// import Dashboard from './pages/dashboard/Dashboard';
import Product from './pages/product/products';
import AddProduct from './pages/addProduct/AddProduct';
import Dashboard from './pages/dashboard/Dashboard';
import Sales from './pages/sales/Sales';
import Notifications from './pages/notification/notification';
import Settings from './pages/setting/setting';

// Auth Components & Callbacks
import Login from './pages/Auth/signin';
import Signup from './pages/Auth/signUp';
import VerifyEmail from './pages/Auth/verifyemail';
import Redirect from './redirect';
import { NotificationProvider, useNotifications } from './context/notificationContext';
import UpdateProduct from './pages/update/update';
import ProductPerformance from './pages/performance/productPerformance';
import Report from './pages/reports/Reports';
import Welcome from './pages/welcome';

export default function App() {
  const [activeTab, setActiveTab] = React.useState('dashboard');

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
    location.pathname === '/welcome' || 
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

            {/* Welcome page after login */}
            <Route path="/welcome" element={<ProtectedRoute><Welcome setActiveTab={setActiveTab} /></ProtectedRoute>} />
          </Routes>
        </main>

      </div>
    </div>
  );
}