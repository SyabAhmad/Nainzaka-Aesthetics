import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaArrowLeft, FaSearch, FaFilter, FaSort, FaEye, FaMousePointer, FaEdit, FaTrash } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Use AuthContext instead of localStorage
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("table");
  const [sortBy, setSortBy] = useState("views-high");
  const [productLimit, setProductLimit] = useState(10);

  // Remove the problematic useEffect that was causing the infinite loop
  useEffect(() => {
    fetchProducts();
  }, []); // Only run once on mount

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
      await logout(); // Use AuthContext logout
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      navigate("/");
    }
  };

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "views-high":
          return (b.views || 0) - (a.views || 0);
        case "views-low":
          return (a.views || 0) - (b.views || 0);
        case "clicks-high":
          return (b.clicks || 0) - (a.clicks || 0);
        case "clicks-low":
          return (a.clicks || 0) - (b.clicks || 0);
        case "name":
          return a.name.localeCompare(b.name);
        case "price-high":
          return (b.price || 0) - (a.price || 0);
        case "price-low":
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });

  const topProducts = filteredProducts.slice(0, productLimit);

  const chartData = {
    labels: topProducts.map(product => product.name.length > 15 ? product.name.substring(0, 15) + '...' : product.name),
    datasets: [
      {
        label: "Views",
        data: topProducts.map(product => product.views || 0),
        backgroundColor: "rgba(102, 0, 51, 0.6)",
        borderColor: "rgba(102, 0, 51, 1)",
        borderWidth: 1,
      },
      {
        label: "Clicks",
        data: topProducts.map(product => product.clicks || 0),
        backgroundColor: "rgba(168, 85, 247, 0.6)",
        borderColor: "rgba(168, 85, 247, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: `Top ${productLimit} Products Analytics`,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11
          },
          maxRotation: 45
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#660033] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-gray-600 hover:text-[#660033] transition-colors mr-6"
              >
                <FaArrowLeft className="w-4 h-4 mr-2" />
                Back to Store
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser?.email || 'Admin'}</span>
              <Link
                to="/admin/add-product"
                className="bg-[#660033] hover:bg-[#4A0025] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add Product
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-[#660033]/10 rounded-lg">
                <svg className="w-6 h-6 text-[#660033]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">{products.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaEye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.reduce((sum, product) => sum + (product.views || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaMousePointer className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.reduce((sum, product) => sum + (product.clicks || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h2a2 2 0 00-2-2z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Views</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {products.length ? Math.round(products.reduce((sum, product) => sum + (product.views || 0), 0) / products.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("table")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "table"
                    ? "border-[#660033] text-[#660033]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Products Table
              </button>
              <button
                onClick={() => setActiveTab("charts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "charts"
                    ? "border-[#660033] text-[#660033]"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Analytics Chart
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === "table" ? (
              <div>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#660033] focus:border-transparent"
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#660033] focus:border-transparent"
                    >
                      <option value="views-high">Views (High to Low)</option>
                      <option value="views-low">Views (Low to High)</option>
                      <option value="clicks-high">Clicks (High to Low)</option>
                      <option value="clicks-low">Clicks (Low to High)</option>
                      <option value="name">Name (A-Z)</option>
                      <option value="price-high">Price (High to Low)</option>
                      <option value="price-low">Price (Low to High)</option>
                    </select>
                  </div>
                </div>

                {/* Products Table */}
                <div className="overflow-hidden border border-gray-200 rounded-lg">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Analytics
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-16 w-16">
                                  <img
                                    className="h-16 w-16 rounded-lg object-cover border border-gray-200"
                                    src={product.imageUrl}
                                    alt={product.name}
                                    onError={(e) => {
                                      e.target.src = "https://via.placeholder.com/64x64/F3F4F6/9CA3AF?text=No+Image";
                                    }}
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900 max-w-xs">
                                    {product.name}
                                  </div>
                                  <div className="text-sm text-gray-500 max-w-xs truncate">
                                    {product.description}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                ₨{product.price?.toLocaleString()}
                              </div>
                              {product.salePrice && (
                                <div className="text-xs text-red-600">
                                  Sale: ₨{product.salePrice?.toLocaleString()}
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center text-sm text-gray-600">
                                  <FaEye className="w-3 h-3 mr-1" />
                                  {product.views || 0}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <FaMousePointer className="w-3 h-3 mr-1" />
                                  {product.clicks || 0}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                product.inStock 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <Link
                                  to={`/admin/edit-product/${product.id}`}
                                  className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                  title="Edit Product"
                                >
                                  <FaEdit className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="text-red-600 hover:text-red-900 p-1 rounded"
                                  title="Delete Product"
                                >
                                  <FaTrash className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8v2a1 1 0 01-1 1H7a1 1 0 01-1-1V5a1 1 0 011-1h10a1 1 0 011 1zM8 13h.01M16 13h.01" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Chart Controls */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Product Performance Analytics</h3>
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">Show Top:</label>
                    <select
                      value={productLimit}
                      onChange={(e) => setProductLimit(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-[#660033] focus:border-transparent"
                    >
                      <option value={5}>5 Products</option>
                      <option value={10}>10 Products</option>
                      <option value={15}>15 Products</option>
                      <option value={20}>20 Products</option>
                    </select>
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-white border border-gray-200 rounded-lg p-6" style={{ height: '500px' }}>
                  <Bar data={chartData} options={chartOptions} />
                </div>

                {/* Chart Legend */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#660033]/10 border border-[#660033]/20 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-[#660033] rounded mr-3"></div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Total Views</h4>
                        <p className="text-2xl font-bold text-[#660033]">
                          {topProducts.reduce((sum, product) => sum + (product.views || 0), 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-500 rounded mr-3"></div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Total Clicks</h4>
                        <p className="text-2xl font-bold text-purple-600">
                          {topProducts.reduce((sum, product) => sum + (product.clicks || 0), 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;