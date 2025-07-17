// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AddProduct from "./components/AddProduct";
import EditProduct from "./components/EditProduct";
import Home from "./components/Home";
import Products from "./pages/Products";
import About from "./pages/About";
import ProductView from "./pages/ProductView";
import Footer from "./components/Footer";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/products" element={<><Navbar /><Products /></>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/add" element={<><Navbar /><AddProduct /></>} />
          <Route path="/admin/edit/:id" element={<><EditProduct /></>} />
          <Route path="/about" element={<><Navbar /><About /></>} />
          <Route path="/product/:id" element={<><Navbar /><ProductView /></>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
