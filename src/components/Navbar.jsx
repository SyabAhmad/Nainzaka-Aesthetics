// src/components/Navbar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-rose-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-full flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                Nainzaka Aesthetics
              </h1>
              <p className="text-xs text-rose-500 font-medium -mt-1">Glow with confidence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors duration-300 relative group"
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <Link 
              to="/products" 
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors duration-300 relative group"
            >
              Products
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-rose-600 font-medium transition-colors duration-300 relative group"
            >
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-400 to-pink-400 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            

            {/* Admin Link */}
            <Link 
              to="/admin/login" 
              className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 text-white px-6 py-2 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-rose-100 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-rose-600 font-medium px-4 py-2 rounded-lg hover:bg-rose-50 transition-all duration-300"
              >
                Home
              </Link>
              
              <Link 
                to="/products" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-rose-600 font-medium px-4 py-2 rounded-lg hover:bg-rose-50 transition-all duration-300"
              >
                Products
              </Link>
              
              <Link 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-rose-600 font-medium px-4 py-2 rounded-lg hover:bg-rose-50 transition-all duration-300"
              >
                About Us
              </Link>
              

              <Link 
                to="/admin/login" 
                onClick={() => setIsMenuOpen(false)}
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium mx-4 text-center transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Admin Panel
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
