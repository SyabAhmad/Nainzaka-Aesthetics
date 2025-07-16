import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({ name: "", description: "", price: "", imageUrl: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }

    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setForm({
            name: data.name,
            description: data.description,
            price: data.price.toString(),
            imageUrl: data.imageUrl,
          });
        } else {
          console.log("No such document!");
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const docRef = doc(db, "products", id);
      await updateDoc(docRef, {
        name: form.name.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price),
        imageUrl: form.imageUrl.trim(),
        updatedAt: new Date().toISOString(),
      });
      
      setSuccess("Product updated successfully!");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-rose-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-rose-200">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Edit Product
            </h1>
            <p className="text-rose-600 font-medium">Nainzaka Aesthetics Admin Panel</p>
            <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mt-3 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          
          {/* Form Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            
            {/* Card Header */}
            <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Update Beautiful Product</h2>
                <p className="text-rose-100">Make your product even more stunning</p>
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
                
                {/* Product Name */}
                <div className="group">
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
                      className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-rose-50/50 placeholder-rose-400" 
                      required 
                      disabled={submitting}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                      </svg>
                    </div>
                  </div>
                </div>
                
                {/* Description */}
                <div className="group">
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
                    className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-rose-50/50 placeholder-rose-400 resize-none" 
                    required 
                    disabled={submitting}
                  />
                </div>
                
                {/* Price */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Price (PKR)
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
                      className="w-full pl-10 pr-4 py-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-rose-50/50 placeholder-rose-400" 
                      required 
                      disabled={submitting}
                    />
                  </div>
                </div>
                
                {/* Image URL */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Product Image URL
                    <span className="text-rose-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input 
                      name="imageUrl" 
                      placeholder="https://example.com/beautiful-product-image.jpg" 
                      type="url"
                      value={form.imageUrl}
                      onChange={handleChange} 
                      className="w-full p-4 border-2 border-rose-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-rose-200 focus:border-rose-400 transition-all duration-300 bg-rose-50/50 placeholder-rose-400" 
                      required 
                      disabled={submitting}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {form.imageUrl && (
                    <div className="mt-6 p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200">
                      <p className="text-sm font-semibold text-gray-700 mb-3">✨ Current Image</p>
                      <div className="flex justify-center">
                        <img 
                          src={form.imageUrl} 
                          alt="Product Preview" 
                          className="w-48 h-48 object-cover rounded-2xl shadow-lg border-4 border-white"
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
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <button 
                    type="submit" 
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 hover:from-rose-600 hover:via-pink-600 hover:to-purple-600 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Updating...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        Update Product
                      </div>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => navigate("/admin/dashboard")}
                    disabled={submitting}
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

export default EditProduct;