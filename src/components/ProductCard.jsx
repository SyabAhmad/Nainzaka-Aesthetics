// src/components/ProductCard.jsx
import React from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleProductClick = async () => {
    try {
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, {
        clicks: increment(1),
        views: increment(1)
      });
      // Open WhatsApp
      const message = `Hi! I'm interested in ${product.name} (₨${product.price.toLocaleString()})`;
      const whatsappUrl = `https://wa.me/923404430083?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error("Error updating product stats:", error);
    }
  };

  const handleViewDetails = async () => {
    try {
      const productRef = doc(db, "products", product.id);
      await updateDoc(productRef, {
        views: increment(1)
      });
      navigate(`/product/${product.id}`);
    } catch (error) {
      console.error("Error updating product views:", error);
      // Still navigate even if update fails
      navigate(`/product/${product.id}`);
    }
  };

  return (
    <div className="group bg-white border border-gray-200 hover:border-gray-300 transition-colors">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300/F3F4F6/9CA3AF?text=No+Image";
          }}
        />
        {product.salePrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 text-xs font-medium">
            Sale
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          {product.salePrice ? (
            <>
              <span className="text-lg font-semibold text-red-600">
                ₨{product.salePrice.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ₨{product.price.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-lg font-semibold text-gray-900">
              ₨{product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 hover:border-gray-400 text-gray-700 py-2 px-3 text-sm font-medium transition-colors"
          >
            View Details
          </button>
          <button
            onClick={handleProductClick}
              className="flex-1 bg-[#660033] hover:bg-[#4A0025] text-white py-2 px-3 text-sm font-medium transition-colors"
          >
            Order Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
