import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./home";
import Sidebar from './component/sidebar'
// import Dashboard from './pages/dashboard/dashboard'
import AddProduct from './pages/addProduct/AddProduct'
import Sidebar from './component/sidebar';
import Navbar from './component/Navbar';
import Home from './pages/home';
import Product from './pages/product/products'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <Router>
      <Routes>
       <Route path="/" element={<Home/>} />
       <Route path="/sidebar" element={<Sidebar/>} />
        <Route path="/add-product" element={<AddProduct/>}/>
     
      </Routes>
      <div className="min-h-screen bg-slate-50/50">
       
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        
        <div className="pl-[260px]">
          
          
          <Navbar activeTab={activeTab} />

          
          <main className="pt-16 p-8 min-h-[calc(100vh-64px)]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />} />
             
            </Routes>
          </main>

        </div>
      </div>
    </Router>
  );
}