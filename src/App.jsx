import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './component/sidebar';
import Navbar from './component/Navbar';
import Home from './pages/home';
import Product from './pages/product/products';
import AddProduct from './pages/addProduct/AddProduct';
import Dashboard from './pages/dashboard/Dashboard';
import Redirect from './redirect';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <div className="min-h-screen bg-slate-50/50">
        
        {/* Sidebar is global (rendered on all pages) */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area (shifted 260px right to make room for Sidebar) */}
        <div className="lg:pl-[260px]">
          
          {/* Top Navbar */}
          <Navbar activeTab={activeTab} />

          {/* Main Panel where pages swap out */}
          <main className="pt-16 p-8 min-h-[calc(100vh-64px)]">
            <Routes>
              {/* Home Page */}
              {/* <Route path="/" element={<Home />} /> */}
              
              {/* Products Page (Mapped to "/products" to match the Sidebar links) */}
              <Route path="/products" element={<Product />} />

              <Route path="/" element={<Dashboard />} />

              <Route path="/auth/ebay/callback" element={<Redirect />} />

              
              {/* Add Product Page */}
              <Route path="/add-product" element={<AddProduct />} />
            </Routes>
          </main>

        </div>
      </div>
    </Router>
  );
}