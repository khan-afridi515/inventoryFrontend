import React, { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <div className="min-h-screen bg-slate-50/50">
        
        {/* Global Sidebar layout */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Shift layout right to account for the sidebar container */}
        <div className="pl-0 lg:pl-65">
          
          {/* Main Top Header Navigation */}
          <Navbar activeTab={activeTab} />

          {/* Core App View Container */}
          <main className="page-content min-h-[calc(100vh-64px)]">
            <Routes>
              {/* Fallback layout views */}
              <Route path="/" element={<Dashboard setActiveTab={setActiveTab} />} />
              <Route path="/home" element={<Home setActiveTab={setActiveTab} />} />
              <Route path="/products" element={<Product setActiveTab={setActiveTab} />} />
              <Route path="/add-product" element={<AddProduct setActiveTab={setActiveTab} />} />
              
              {/* Sales page view layout route - Added setActiveTab prop */}
              <Route path="/sales" element={<Sales setActiveTab={setActiveTab} />} />
              {/* Home Page */}
              {/* <Route path="/" element={<Home />} /> */}
              
              {/* Products Page (Mapped to "/products" to match the Sidebar links) */}
              <Route path="/products" element={<Product />} />

              <Route path="/" element={<Dashboard />} />

              <Route path="/auth/ebay/callback" element={<Redirect />} />

              
              {/* Product Performance view layout route */}
              <Route path="/performance" element={<ProductPerformance setActiveTab={setActiveTab} />} />

              {/* Notifications and Settings routes (required for sidebar navigation) */}
              <Route path="/notifications" element={<Notifications setActiveTab={setActiveTab} />} />
              <Route path="/settings" element={<Settings setActiveTab={setActiveTab} />} />


            </Routes>
          </main>

        </div>
      </div>
    </Router>
  );
}