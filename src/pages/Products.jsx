import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, doc, updateDoc, increment } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("name");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([
    { id: "all", name: "All Products", icon: "🛍️" }
  ]);

  const navigate = useNavigate();

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const cats = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories([{ id: "all", name: "All Products", icon: "🛍️" }, ...cats]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filtering logic
  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      const selectedCatObj = categories.find(c => c.id === selectedCategory);
      if (selectedCatObj) {
        filtered = filtered.filter(product =>
          product.category === selectedCatObj.name // Filter by category name
        );
      }
    }
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, categories]);

  const handleViewProduct = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        views: increment(1), // Increment views by 1
        clicks: increment(1), // Increment views by 1
      });
      navigate(`/product/${productId}`);
    } catch (error) {
      console.error("Error updating product views:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-pink-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading our collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white py-8 border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">Our Premium Collection</h1>
            <div className="relative">
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 pl-12 rounded-lg text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent shadow-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-72 flex-shrink-0">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden w-full mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-between"
            >
              <span className="font-medium text-gray-700">Filters & Sorting</span>
              <svg className={`w-5 h-5 text-gray-500 transform transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            <div className={`${isFilterOpen ? 'block' : 'hidden'} lg:block space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200`}>
              {/* Categories */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center space-x-2 text-sm ${
                        selectedCategory === category.id
                          ? 'bg-pink-50 text-pink-700 font-medium'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-base">{category.icon || "🛍️"}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Price Range (PKR)
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>₨{priceRange[0].toLocaleString()}</span>
                    <span>₨{priceRange[1].toLocaleString()}</span>
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-1 bg-gray-200 rounded-full appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Min</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Max</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 50000])}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCategory === "all" ? "All Products" : categories.find(c => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-sm text-gray-500">{filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}</p>
              </div>
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products match your search</h3>
                <p className="text-gray-500 max-w-md mx-auto">Try adjusting your filters or search for something different</p>
                <button 
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange([0, 50000]);
                  }}
                  className="mt-4 px-4 py-2 text-sm font-medium text-pink-600 hover:text-pink-700"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100">
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300/F3F4F6/9CA3AF?text=No+Image';
                        }}
                      />
                      {!product.inStock && (
                        <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-semibold text-gray-900">
                          ₨{product.price?.toLocaleString()}
                        </span>
                        <button 
                          onClick={() => handleViewProduct(product.id)}
                          className="text-sm font-medium px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md transition-colors duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;