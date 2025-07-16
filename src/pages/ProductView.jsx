import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.id !== id)
          .sort(() => 0.5 - Math.random()) // randomize
          .slice(0, 3); // show 3 recommended
        setRecommended(productsData);
      } catch (error) {
        console.error("Error fetching recommended products:", error);
      }
    };
    if (id) fetchRecommended();
  }, [id]);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const message = `Hi! I'm interested in ${product.name} (₨${product.price}). Can you please provide more details?`;
    const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-rose-500 mx-auto mb-4"></div>
          <p className="text-lg text-rose-600 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
        <p className="text-xl text-rose-600 font-bold mb-4">Product not found.</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg"
        >
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="container mx-auto px-6 py-12">
        <button
          onClick={() => navigate("/products")}
          className="mb-8 bg-white border border-pink-200 text-pink-600 px-6 py-2 rounded-xl font-semibold shadow hover:bg-pink-50 transition-all"
        >
          ← Back to Products
        </button>
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row gap-10">
          <div className="flex-shrink-0 flex flex-col gap-4 items-center">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-80 h-80 object-cover rounded-2xl border-2 border-pink-200 shadow-lg"
              onError={e => { e.target.src = "https://via.placeholder.com/300x300/F3F4F6/9CA3AF?text=No+Image"; }}
            />
            {/* Show additional images if any */}
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex gap-4 flex-wrap justify-center">
                {product.additionalImages.map((img, idx) =>
                  img ? (
                    <img
                      key={idx}
                      src={img}
                      alt={`Additional ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded-xl border-2 border-pink-100 shadow"
                      onError={e => { e.target.src = "https://via.placeholder.com/128x128/F3F4F6/9CA3AF?text=No+Image"; }}
                    />
                  ) : null
                )}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-rose-600 mb-2">{product.name}</h1>
            <p className="text-lg text-gray-700 mb-4">{product.description}</p>
            <div className="mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                ₨{product.price?.toLocaleString()}
              </span>
              {product.salePrice && (
                <span className="ml-4 text-xl text-green-600 font-bold">
                  Sale: ₨{product.salePrice?.toLocaleString()}
                </span>
              )}
            </div>
            <div className="mb-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <button
              onClick={handleWhatsAppOrder}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              Order via WhatsApp
            </button>
          </div>
        </div>

        {/* Recommended Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recommended Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommended.map(rec => (
              <div key={rec.id} className="bg-white/90 rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <img
                  src={rec.imageUrl}
                  alt={rec.name}
                  className="w-full h-48 object-cover"
                  onError={e => { e.target.src = "https://via.placeholder.com/192x192/F3F4F6/9CA3AF?text=No+Image"; }}
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{rec.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{rec.description}</p>
                  <span className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    ₨{rec.price?.toLocaleString()}
                  </span>
                  <button
                    onClick={() => navigate(`/product/${rec.id}`)}
                    className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-all"
                  >
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductView;