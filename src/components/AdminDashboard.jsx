import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    const email = localStorage.getItem("adminEmail");
    
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

    setAdminEmail(email || "Admin");
    fetchProducts();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminEmail");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminEmail");
      navigate("/");
    }
  };

  // Filter products by search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-rose-500 mx-auto mb-4"></div>
          <p className="text-lg text-rose-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center bg-gradient-to-r from-pink-400 to-purple-400 text-white px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-all duration-300 mb-4"
              >
                <FaArrowLeft className="mr-2" />
                Back to Home
              </button>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Admin Dashboard
              </h1>
              <p className="text-rose-600 font-medium">Welcome back, {adminEmail}</p>
              <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mt-3 rounded-full"></div>
            </div>
            <div className="flex gap-4">
              <Link 
                to="/admin/add"
                className="bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span>Add Product</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-6 py-4">
        <div className="max-w-lg mx-auto">
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-4 rounded-xl border-2 border-pink-200 focus:outline-none focus:ring-4 focus:ring-pink-100 text-lg shadow"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 px-8 py-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              Products Collection ({filteredProducts.length})
            </h2>
            <p className="text-rose-100 mt-1">Manage your beautiful product collection</p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">No products found</h3>
              <p className="text-gray-600 mb-8">Try searching for another product or add a new one.</p>
              <Link 
                to="/admin/add"
                className="inline-flex items-center bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-rose-50 to-pink-50">
                  <tr>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-rose-100">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-rose-50/50 transition-colors">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="h-16 w-16 rounded-2xl object-cover mr-6 border-2 border-rose-200"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x64/F3F4F6/9CA3AF?text=No+Image';
                            }}
                          />
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              Added {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm text-gray-700 max-w-xs truncate">
                          {product.description}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                          ₨{product.price}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-3">
                          <Link
                            to={`/admin/edit/${product.id}`}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                            </svg>
                            <span>Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;