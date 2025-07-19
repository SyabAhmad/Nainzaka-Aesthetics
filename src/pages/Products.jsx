// filepath: h:\Code\Nainzaka Aesthetics\src\pages\Products.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("name");

  // Updated Categories
  const categories = [
    { id: "all", name: "All Products", icon: "🛍️" },
    { id: "cleansers", name: "Cleansers", icon: "🧴" },
    { id: "moisturizers", name: "Moisturizers", icon: "✨" },
    { id: "serums", name: "Serums & Treatments", icon: "💧" },
    { id: "sunscreens", name: "Sunscreens", icon: "☀️" },
    { id: "masks", name: "Face Masks", icon: "🎭" },
    { id: "lipbody", name: "Lip & Body Care", icon: "💋" }
  ];

  // Fetch products
  useEffect(() => {
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
    fetchProducts();
  }, []);

  // Fixed Filtering logic
  useEffect(() => {
    let filtered = [...products];
    
    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory !== "all") {
      const selectedCatObj = categories.find(c => c.id === selectedCategory);
      if (selectedCatObj) {
        filtered = filtered.filter(product =>
          product.category?.toLowerCase() === selectedCatObj.name.toLowerCase() ||
          product.category?.toLowerCase().includes(selectedCatObj.name.toLowerCase())
        );
      }
    }
    
    // Price filter
    filtered = filtered.filter(product => {
      const price = product.salePrice || product.price || 0;
      return price >= priceRange[0] && price <= priceRange[1];
    });
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          const priceA = a.salePrice || a.price || 0;
          const priceB = b.salePrice || b.price || 0;
          return priceA - priceB;
        case "price-high":
          const priceHighA = a.salePrice || a.price || 0;
          const priceHighB = b.salePrice || b.price || 0;
          return priceHighB - priceHighA;
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        default:
          return 0;
      }
    });
    
    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-[#660033] mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-light text-gray-900 mb-2">
              Our Collection
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover premium beauty products curated for your unique style
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Bar */}
        <div className="bg-white border border-gray-200 rounded-lg mb-8 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#660033] focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Category Dropdown */}
            <div className="lg:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#660033] focus:border-transparent bg-white"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="lg:w-48">
              <select
                value={`${priceRange[0]}-${priceRange[1]}`}
                onChange={(e) => {
                  const [min, max] = e.target.value.split('-').map(Number);
                  setPriceRange([min, max]);
                }}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#660033] focus:border-transparent bg-white"
              >
                <option value="0-50000">All Prices</option>
                <option value="0-1000">Under ₨1,000</option>
                <option value="1000-5000">₨1,000 - ₨5,000</option>
                <option value="5000-10000">₨5,000 - ₨10,000</option>
                <option value="10000-50000">Above ₨10,000</option>
              </select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#660033] focus:border-transparent bg-white"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-medium text-gray-900">
              {selectedCategory === "all" ? "All Products" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600 text-sm">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters</p>
            <button 
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setPriceRange([0, 50000]);
              }}
              className="bg-[#660033] hover:bg-[#4A0025] text-white px-6 py-2 rounded-md font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;