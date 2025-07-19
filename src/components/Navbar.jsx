import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#660033] to-[#AD1457] rounded-lg flex items-center justify-center">
              <img src="src\assets\logo.jpg" alt="logo" />
              {/* <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg> */}
            </div>
            <div>
              <span className="text-xl font-bold text-gray-800">Nainzaka Aesthetics</span>
              <span className="block text-xs text-pink-500 font-medium tracking-wider">GLOW WITH CONFIDENCE</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#660033] transition-colors font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-[#660033] transition-colors font-medium">
              Products
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-[#660033] transition-colors font-medium">
              About
            </Link>
            
            {/* Admin Menu */}
            {currentUser && isAdmin && (
              <div className="relative group">
                <button className="text-gray-700 hover:text-[#660033] transition-colors font-medium flex items-center">
                  Admin
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/add-product"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Add Product
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
            
            {/* Login Link for non-admin users */}
            {!currentUser && (
              <Link 
                to="/admin/login" 
                className="text-gray-700 hover:text-[#660033] transition-colors font-medium"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link
                to="/"
                className="block px-3 py-2 text-gray-700 hover:text-[#660033] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="block px-3 py-2 text-gray-700 hover:text-[#660033] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link
                to="/about"
                className="block px-3 py-2 text-gray-700 hover:text-[#660033] transition-colors font-medium"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              
              {currentUser && isAdmin && (
                <>
                  <div className="border-t border-gray-200 pt-2">
                    <Link
                      to="/admin/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-[#660033] transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link
                      to="/admin/add-product"
                      className="block px-3 py-2 text-gray-700 hover:text-[#660033] transition-colors font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Add Product
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-[#660033] transition-colors font-medium"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
              
              {!currentUser && (
                <Link
                  to="/admin/login"
                  className="block px-3 py-2 text-gray-700 hover:text-[#660033] transition-colors font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;