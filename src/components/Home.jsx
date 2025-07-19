// filepath: h:\Code\Nainzaka Aesthetics\src\components\Home.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import heroImage from "../assets/nainzaka logo.jpg";
import aboutLogo from "../assets/logo.jpg";
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Featured products
        const featured = productsData.filter(product => product.featured).slice(0, 8);
        setFeaturedProducts(featured);
        
        // Recent products (last 3)
        const recent = productsData
          .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
          .slice(0, 3);
        setRecentProducts(recent);
        
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-lg text-gray-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <h1 className="text-4xl lg:text-5xl font-light text-gray-900 mb-6 leading-tight">
                Beauty that
                <span className="block font-medium">Empowers You</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Discover premium skincare, makeup, and beauty tools carefully curated to enhance your natural radiance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 font-medium transition-colors text-center"
                >
                  Shop Collection
                </Link>
                <a
                  href="#about"
                  className="border border-gray-300 hover:border-[#660033] text-[#660033] px-8 py-3 font-medium transition-colors text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-50 flex items-center justify-center">
                {/* <div className="text-6xl">✨</div> */}
                <img
                  src={heroImage}
                  alt="Hero Image"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Products - 3 in a Row */}
      {recentProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                Latest Arrivals
              </h2>
              <p className="text-gray-600">
                New products just added to our collection
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {recentProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked favorites loved by our customers
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center text-gray-900 hover:text-gray-600 font-medium transition-colors"
              >
                View All Products
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Authentic Products</h3>
              <p className="text-gray-600 text-sm">
                100% authentic products sourced from authorized distributors
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                Quick delivery across Pakistan with cash on delivery
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Expert Care</h3>
              <p className="text-gray-600 text-sm">
                Beauty advice and product recommendations from experts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-light text-gray-900 mb-6">
                About Nainzaka Aesthetics
              </h2>
              <p className="text-gray-600 mb-6">
                We believe beauty is about feeling confident in your own skin. Our curated collection features premium beauty products for diverse needs.
              </p>
              <p className="text-gray-600 mb-8">
                From skincare essentials to makeup must-haves, each product is selected for quality, authenticity, and effectiveness.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center text-gray-900 hover:text-gray-600 font-medium transition-colors"
              >
                Learn More About Us
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-50 flex items-center justify-center">
                {/* <div className="text-4xl">💄</div> */}
                <img src={aboutLogo} alt="logo" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-[#660033] text-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Text Section */}
      <div>
        <h2 className="text-3xl font-light mb-6">We Deliver All Over Pakistan</h2>
        <p className="text-lg mb-8 leading-relaxed">
          No matter where you are, we ensure your favorite beauty products reach you quickly and safely. Experience fast delivery and exceptional service across the country.
        </p>
        <Link
          to="/products"
          className="bg-white text-[#660033] px-8 py-3 font-medium rounded-lg hover:bg-gray-100 transition-colors"
        >
          Explore Products
        </Link>
      </div>

      {/* Map Section */}
<div className="relative group">
  <div className="aspect-video bg-gray-50 rounded-xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3625525.422345692!2d66.3475365!3d27.8475805!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38db52d2f8fd751f%3A0x46b7a1f7e614925c!2sPakistan!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      className="rounded-xl"
      title="Interactive Pakistan Map"
    ></iframe>
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none"></div>
  </div>
  <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-1.5 rounded-lg shadow-sm">
    <p className="text-sm font-medium text-gray-800 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-[#660033]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      Pakistan
    </p>
  </div>
</div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light text-white mb-6">
            Ready to Glow?
          </h2>
          <p className="text-gray-300 mb-8">
            Start your beauty journey with us today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-[#660033] hover:bg-[#4A0025] text-white px-8 py-3 font-medium transition-colors text-center"
            >
              Shop Now
            </Link>
            <a
              href="https://wa.me/923404430083"
              className="border border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 font-medium transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;