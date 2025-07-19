import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: "", 
    description: "", 
    price: "", 
    salePrice: "",
    category: "",
    subCategory: "",
    brand: "",
    sku: "",
    stockQuantity: "",
    weight: "",
    dimensions: "",
    ingredients: "",
    imageUrl: "",
    additionalImages: ["", ""],
    tags: "",
    featured: false,
    inStock: true,
    shadeColor: "",
    skinType: "",
    concerns: "",
    ageGroup: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    {
      id: "skincare",
      name: "Skincare",
      subCategories: [
        "Cleansers",
        "Moisturizers",
        "Serums",
        "Masks",
        "Toners",
        "Sunscreen",
        "Anti-Aging",
        "Acne Treatment"
      ]
    },
    {
      id: "makeup",
      name: "Makeup",
      subCategories: [
        "Foundation",
        "Concealer",
        "Lipstick",
        "Eyeshadow",
        "Mascara",
        "Eyeliner",
        "Blush",
        "Highlighter",
        "Bronzer"
      ]
    },
    {
      id: "haircare",
      name: "Hair Care",
      subCategories: [
        "Shampoo",
        "Conditioner",
        "Hair Masks",
        "Hair Oils",
        "Styling Products",
        "Hair Tools"
      ]
    },
    {
      id: "fragrance",
      name: "Fragrance",
      subCategories: [
        "Perfumes",
        "Body Mists",
        "Deodorants",
        "Body Sprays"
      ]
    },
    {
      id: "tools",
      name: "Beauty Tools",
      subCategories: [
        "Brushes",
        "Sponges",
        "Applicators",
        "Tweezers",
        "Mirrors",
        "Organizers"
      ]
    },
    {
      id: "bodycare",
      name: "Body Care",
      subCategories: [
        "Body Lotions",
        "Body Scrubs",
        "Body Wash",
        "Hand Cream",
        "Foot Care"
      ]
    }
  ];

  const skinTypes = ["All Skin Types", "Dry", "Oily", "Combination", "Sensitive", "Normal", "Mature"];
  const concerns = ["Anti-Aging", "Acne", "Dark Spots", "Hydration", "Brightening", "Pore Minimizing", "Redness", "Fine Lines"];
  const ageGroups = ["Teen (13-19)", "Young Adult (20-29)", "Adult (30-39)", "Mature (40+)", "All Ages"];

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('additionalImage')) {
      const index = parseInt(name.split('_')[1]);
      const newAdditionalImages = [...form.additionalImages];
      newAdditionalImages[index] = value;
      setForm({ ...form, additionalImages: newAdditionalImages });
    } else {
      setForm({ 
        ...form, 
        [name]: type === 'checkbox' ? checked : value 
      });
    }
    
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!form.description.trim()) {
      setError("Product description is required");
      return false;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError("Please enter a valid price greater than 0");
      return false;
    }
    if (!form.category) {
      setError("Please select a category");
      return false;
    }
    if (!form.imageUrl.trim()) {
      setError("Main product image URL is required");
      return false;
    }
    
    try {
      new URL(form.imageUrl);
    } catch {
      setError("Please enter a valid main image URL");
      return false;
    }

    // Validate additional images if provided
    for (let i = 0; i < form.additionalImages.length; i++) {
      if (form.additionalImages[i].trim()) {
        try {
          new URL(form.additionalImages[i]);
        } catch {
          setError(`Please enter a valid URL for additional image ${i + 1}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const productData = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : null,
        category: form.category,
        subCategory: form.subCategory,
        brand: form.brand.trim(),
        sku: form.sku.trim() || `SKU-${Date.now()}`,
        stockQuantity: form.stockQuantity ? parseInt(form.stockQuantity) : 0,
        weight: form.weight.trim(),
        dimensions: form.dimensions.trim(),
        ingredients: form.ingredients.trim(),
        imageUrl: form.imageUrl.trim(),
        additionalImages: form.additionalImages.filter(img => img.trim() !== ""),
        tags: form.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ""),
        featured: form.featured,
        inStock: form.inStock,
        shadeColor: form.shadeColor.trim(),
        skinType: form.skinType,
        concerns: form.concerns,
        ageGroup: form.ageGroup,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, "products"), productData);
      
      setSuccess("Product added successfully!");
      setForm({ 
        name: "", 
        description: "", 
        price: "", 
        salePrice: "",
        category: "",
        subCategory: "",
        brand: "",
        sku: "",
        stockQuantity: "",
        weight: "",
        dimensions: "",
        ingredients: "",
        imageUrl: "",
        additionalImages: ["", ""],
        tags: "",
        featured: false,
        inStock: true,
        shadeColor: "",
        skinType: "",
        concerns: "",
        ageGroup: ""
      });
      
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
      
    } catch (error) {
      console.error("Error adding product:", error);
      
      if (error.code === 'permission-denied') {
        setError("Permission denied. Please check Firestore security rules.");
      } else if (error.code === 'unavailable') {
        setError("Service temporarily unavailable. Please try again.");
      } else {
        setError(`Error adding product: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (newCategory) => {
    try {
      await addDoc(collection(db, "categories"), {
        name: newCategory,
        icon: "🆕" // or let user pick
      });
      // Optionally, refetch categories here
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Replace the Firebase handleImageUpload with imgbb upload
  const handleImageUpload = async (e, type, index = null) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    
    try {
      // Create FormData for imgbb API
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload to imgbb (you can get a free API key from imgbb.com)
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        const imageUrl = data.data.url;
        
        if (type === "main") {
          setForm({ ...form, imageUrl: imageUrl });
        } else if (type === "additional" && index !== null) {
          const newAdditionalImages = [...form.additionalImages];
          newAdditionalImages[index] = imageUrl;
          setForm({ ...form, additionalImages: newAdditionalImages });
        }
        
        setSuccess("Image uploaded successfully!");
      } else {
        setError("Image upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError("Image upload failed. Please try again.");
    }
    
    setLoading(false);
  };

  const currentCategory = categories.find(cat => cat.id === form.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-200">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Add New Product
            </h1>
            <p className="text-rose-600 font-medium">Nainzaka Aesthetics Admin Panel</p>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mt-3 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Create Beautiful Product</h2>
                <p className="text-rose-100">Add a new product to your aesthetic collection</p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              
              {/* Alert Messages */}
              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-800">{success}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Basic Information Section */}
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-2xl border border-rose-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Basic Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Product Name
                        <span className="text-rose-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          name="name" 
                          placeholder="Enter your beautiful product name" 
                          value={form.name}
                          onChange={handleChange} 
                          className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                          required 
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Brand */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Brand
                      </label>
                      <input 
                        name="brand" 
                        placeholder="Brand name" 
                        value={form.brand}
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                        disabled={loading}
                      />
                    </div>

                    {/* SKU */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        SKU (Stock Keeping Unit)
                      </label>
                      <input 
                        name="sku" 
                        placeholder="Auto-generated if empty" 
                        value={form.sku}
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                        disabled={loading}
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Product Description
                        <span className="text-rose-500 ml-1">*</span>
                      </label>
                      <textarea 
                        name="description" 
                        placeholder="Describe what makes this product special and how it helps customers glow with confidence..." 
                        value={form.description}
                        onChange={handleChange} 
                        rows="5"
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400 resize-none" 
                        required 
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Category & Classification */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                    </svg>
                    Category & Classification
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Category
                        <span className="text-rose-500 ml-1">*</span>
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white"
                        required
                        disabled={loading}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Sub Category */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Sub Category
                      </label>
                      <select
                        name="subCategory"
                        value={form.subCategory}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white"
                        disabled={loading || !currentCategory}
                      >
                        <option value="">Select Sub Category</option>
                        {currentCategory?.subCategories.map((subCat) => (
                          <option key={subCat} value={subCat}>{subCat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Tags (comma separated)
                      </label>
                      <input 
                        name="tags" 
                        placeholder="e.g., bestseller, new arrival, organic, cruelty-free" 
                        value={form.tags}
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                    </svg>
                    Pricing & Inventory
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Regular Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Regular Price (PKR)
                        <span className="text-rose-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-rose-500 font-semibold">₨</span>
                        </div>
                        <input 
                          name="price" 
                          placeholder="0.00" 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={form.price}
                          onChange={handleChange} 
                          className="w-full pl-10 pr-4 py-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                          required 
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Sale Price */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Sale Price (PKR)
                        <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-rose-500 font-semibold">₨</span>
                        </div>
                        <input 
                          name="salePrice" 
                          placeholder="0.00" 
                          type="number" 
                          min="0"
                          step="0.01"
                          value={form.salePrice}
                          onChange={handleChange} 
                          className="w-full pl-10 pr-4 py-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Stock Quantity */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Stock Quantity
                      </label>
                      <input 
                        name="stockQuantity" 
                        placeholder="0" 
                        type="number" 
                        min="0"
                        value={form.stockQuantity}
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                        disabled={loading}
                      />
                    </div>

                    {/* Weight */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Weight
                      </label>
                      <input 
                        name="weight" 
                        placeholder="e.g., 50ml, 100g" 
                        value={form.weight}
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                        disabled={loading}
                      />
                    </div>

                    {/* Dimensions */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Dimensions
                      </label>
                      <input 
                        name="dimensions" 
                        placeholder="e.g., 10x5x3 cm" 
                        value={form.dimensions}
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                        disabled={loading}
                      />
                    </div>

                    {/* Shade/Color */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Shade/Color
                      </label>
                      <input 
                        name="shadeColor" 
                        placeholder="e.g., Fair, Medium, Dark" 
                        value={form.shadeColor}
                        onChange={handleChange} 
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400" 
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Product Status Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={form.inStock}
                        onChange={handleChange}
                        className="w-5 h-5 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
                        disabled={loading}
                      />
                      <label className="ml-3 text-sm font-semibold text-gray-700">
                        In Stock
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={form.featured}
                        onChange={handleChange}
                        className="w-5 h-5 text-rose-600 bg-gray-100 border-gray-300 rounded focus:ring-rose-500 focus:ring-2"
                        disabled={loading}
                      />
                      <label className="ml-3 text-sm font-semibold text-gray-700">
                        Featured Product
                      </label>
                    </div>
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    Product Specifications
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Skin Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Suitable for Skin Type
                      </label>
                      <select
                        name="skinType"
                        value={form.skinType}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white"
                        disabled={loading}
                      >
                        <option value="">Select Skin Type</option>
                        {skinTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>

                    {/* Concerns */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Addresses Concerns
                      </label>
                      <select
                        name="concerns"
                        value={form.concerns}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white"
                        disabled={loading}
                      >
                        <option value="">Select Concern</option>
                        {concerns.map((concern) => (
                          <option key={concern} value={concern}>{concern}</option>
                        ))}
                      </select>
                    </div>

                    {/* Age Group */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Age Group
                      </label>
                      <select
                        name="ageGroup"
                        value={form.ageGroup}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white"
                        disabled={loading}
                      >
                        <option value="">Select Age Group</option>
                        {ageGroups.map((age) => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>

                    {/* Ingredients */}
                    <div className="md:col-span-3">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Key Ingredients
                      </label>
                      <textarea 
                        name="ingredients" 
                        placeholder="List key ingredients separated by commas..." 
                        value={form.ingredients}
                        onChange={handleChange} 
                        rows="3"
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400 resize-none" 
                        disabled={loading}
                      />
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-2xl border border-yellow-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    Product Images
                  </h3>

                  {/* Main Image */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Main Product Image
                      <span className="text-rose-500 ml-1">*</span>
                    </label>
                    <div className="flex gap-4 items-center">
                      <input
                        name="imageUrl"
                        placeholder="https://example.com/main-product-image.jpg"
                        type="url"
                        value={form.imageUrl}
                        onChange={handleChange}
                        className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400"
                        required
                        disabled={loading}
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "main")}
                        className="block w-32 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Additional Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {form.additionalImages.map((img, index) => (
                      <div key={index}>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Additional Image {index + 1}
                          <span className="text-xs text-gray-500 ml-1">(Optional)</span>
                        </label>
                        <div className="flex gap-4 items-center">
                          <input
                            name={`additionalImage_${index}`}
                            placeholder={`https://example.com/image-${index + 1}.jpg`}
                            type="url"
                            value={img}
                            onChange={handleChange}
                            className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-white placeholder-rose-400"
                            disabled={loading}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "additional", index)}
                            className="block w-32 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Image Previews */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Main Image Preview */}
                    {form.imageUrl && (
                      <div className="bg-white p-4 rounded-xl border border-yellow-200">
                        <p className="text-sm font-semibold text-gray-700 mb-3">✨ Main Image</p>
                        <div className="flex justify-center">
                          <img 
                            src={form.imageUrl} 
                            alt="Main Product Preview" 
                            className="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-white"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                            onLoad={(e) => {
                              e.target.style.display = 'block';
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Additional Images Preview */}
                    {form.additionalImages.map((img, index) => (
                      img && (
                        <div key={index} className="bg-white p-4 rounded-xl border border-yellow-200">
                          <p className="text-sm font-semibold text-gray-700 mb-3">📷 Image {index + 1}</p>
                          <div className="flex justify-center">
                            <img 
                              src={img} 
                              alt={`Additional Preview ${index + 1}`} 
                              className="w-32 h-32 object-cover rounded-xl shadow-lg border-2 border-white"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                              onLoad={(e) => {
                                e.target.style.display = 'block';
                              }}
                            />
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Adding Magic...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add Product
                      </div>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => navigate("/admin/dashboard")}
                    disabled={loading}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-700 px-8 py-4 rounded-xl font-semibold transition-all duration-300 border-2 border-gray-200 hover:border-gray-300"
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                      </svg>
                      Cancel
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Brand Footer */}
          <div className="text-center mt-8">
            <p className="text-rose-600 font-medium">✨ Glow with confidence ✨</p>
            <p className="text-rose-400 text-sm mt-2">Nainzaka Aesthetics Admin Panel</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;