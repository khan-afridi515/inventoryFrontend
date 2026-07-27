import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import Report from './pages/reports/Reports'
import Redirect from './redirect';
import UpdateProduct from './pages/update/update';
import Login from './pages/Auth/signin';
import Signup from './pages/Auth/signUp';
import VerifyEmail from './pages/Auth/verifyemail';



export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <AppRoutes activeTab={activeTab} setActiveTab={setActiveTab} />
    </Router>
  );
}

function AppRoutes({ activeTab, setActiveTab }) {
  const location = useLocation();

  // Hide the global sidebar and navbar for auth/sign-in routes
  const hideLayout = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/verifyemail' || location.pathname.startsWith('/auth');

  return (
    <div className="min-h-screen bg-slate-50/50">

      {!hideLayout && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}

      <div className={hideLayout ? '' : 'pl-0 lg:pl-65'}>

        {!hideLayout && <Navbar activeTab={activeTab} />}

        <main className={hideLayout ? 'min-h-screen' : 'page-content min-h-[calc(100vh-64px)]'}>
          <Routes>
            <Route path="/" element={<Dashboard setActiveTab={setActiveTab} />} />
            <Route path="/home" element={<Home setActiveTab={setActiveTab} />} />
            <Route path="/products" element={<Product setActiveTab={setActiveTab} />} />
            <Route path="/update-product/:id" element={<UpdateProduct setActiveTab={setActiveTab} />} />
            <Route path="/add-product" element={<AddProduct setActiveTab={setActiveTab} />} />
            <Route path="/reports" element={<Report />} />

            {/* Sign-in route rendered without sidebar/navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verifyemail" element={<VerifyEmail />} />

            <Route path="/sales" element={<Sales setActiveTab={setActiveTab} />} />
            <Route path="/auth/ebay/callback" element={<Redirect />} />
            <Route path="/performance" element={<ProductPerformance setActiveTab={setActiveTab} />} />
            <Route path="/notifications" element={<Notifications setActiveTab={setActiveTab} />} />
            <Route path="/settings" element={<Settings setActiveTab={setActiveTab} />} />

            {/* Fallback duplicate routes preserved to avoid breaking other navigation */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Product />} />
          </Routes>
        </main>

      </div>
    </div>
  );
}