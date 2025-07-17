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
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
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
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-pink-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="max-w-md text-center p-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <svg className="w-16 h-16 text-rose-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist or may have been removed.</p>
          <button
            onClick={() => navigate("/products")}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white font-medium rounded-lg shadow transition-colors"
          >
            Browse Our Products
          </button>
        </div>
      </div>
    );
  }

  // Combine all product images (main + additional)
  const allImages = [
    product.imageUrl,
    ...(product.additionalImages || [])
  ].filter(img => img); // Remove any undefined/null images

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-pink-600 mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Products
        </button>

        {/* Main Product Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Large Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={allImages[activeImageIndex]}
                  alt={`${product.name} - ${activeImageIndex + 1}`}
                  className="w-full h-full object-contain"
                  onError={e => { e.target.src = "https://via.placeholder.com/600x600/F3F4F6/9CA3AF?text=No+Image"; }}
                />
                {!product.inStock && (
                  <div className="absolute top-4 right-4 bg-rose-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Out of Stock
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery (shows first 3 images) */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {allImages.slice(0, 3).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        activeImageIndex === idx 
                          ? 'border-pink-500 scale-105' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={e => { e.target.src = "https://via.placeholder.com/150x150/F3F4F6/9CA3AF?text=No+Image"; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                {product.category && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded">
                    {product.category}
                  </span>
                )}
              </div>

              <div className="flex items-center mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-gray-900 mr-3">
                      ₨{product.salePrice.toLocaleString()}
                    </span>
                    <span className="text-xl text-gray-500 line-through">
                      ₨{product.price.toLocaleString()}
                    </span>
                    <span className="ml-3 bg-rose-100 text-rose-800 text-sm font-medium px-2 py-0.5 rounded">
                      {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-gray-900">
                    ₨{product.price.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="prose max-w-none text-gray-600 mb-8">
                <p>{product.description}</p>
                {product.details && (
                  <ul className="mt-4 space-y-2">
                    {product.details.split('\n').filter(Boolean).map((detail, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="w-4 h-4 text-pink-500 mt-1 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={!product.inStock}
                  className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium text-white shadow-sm ${
                    product.inStock 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  } transition-colors`}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.04 2.875 1.186 3.074.149.198 2.05 3.127 4.974 4.266.695.299 1.234.477 1.656.611.696.222 1.33.191 1.83.116.558-.083 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  </svg>
                  {product.inStock ? 'Order via WhatsApp' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommended.length > 0 && (
          <div className="mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map(rec => (
                <div 
                  key={rec.id} 
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 cursor-pointer"
                  onClick={() => navigate(`/product/${rec.id}`)}
                >
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={rec.imageUrl}
                      alt={rec.name}
                      className="w-full h-full object-contain"
                      onError={e => { e.target.src = "https://via.placeholder.com/300x300/F3F4F6/9CA3AF?text=No+Image"; }}
                    />
                    {!rec.inStock && (
                      <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">{rec.name}</h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{rec.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        ₨{rec.price?.toLocaleString()}
                      </span>
                      <button className="text-sm text-pink-600 hover:text-pink-700 font-medium">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductView;