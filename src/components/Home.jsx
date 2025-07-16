import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [sortBy, setSortBy] = useState("name");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [categories, setCategories] = useState([]);

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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "categories"));
        const cats = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category (for now, we'll use a simple keyword match)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        product.description.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by price range
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort products
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
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  const handleWhatsAppOrder = (product) => {
    const message = `Hi! I'm interested in ${product.name} (₨${product.price}). Can you please provide more details?`;
    const whatsappUrl = `https://wa.me/923001234567?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rose-200 border-t-rose-500 mx-auto mb-4"></div>
          <p className="text-lg text-rose-600 font-medium">Loading beautiful products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-pink-100 to-purple-100 flex items-center justify-center min-h-[60vh]">
        {/* Decorative Blobs */}
        <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] bg-rose-100 rounded-full opacity-40 blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-[36rem] h-[36rem] bg-purple-200 rounded-full opacity-30 blur-3xl"></div>
        <div className="container mx-auto px-6 py-16 relative z-10 flex flex-col items-center">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
              <span className="inline-block px-6 py-2 rounded-full bg-white/80 text-pink-500 font-semibold text-lg mb-4 shadow">Glow With Confidence</span>
              <h1 className="text-6xl md:text-7xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 drop-shadow-xl text-center leading-tight">
                Nainzaka<br className="hidden md:block" />
                <span className="text-purple-500">Aesthetics</span>
              </h1>
              <p className="text-lg md:text-xl font-medium mb-6 text-gray-700 max-w-xl mx-auto text-center">
                Discover beauty that empowers you.<br />
                <span className="text-pink-500">Premium products</span> for your unique glow.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-2">
              <a
                href="#products"
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 text-white px-10 py-4 rounded-2xl font-semibold shadow-xl text-lg transition-all duration-300"
              >
                Shop Now
              </a>
              <a
                href="#contact"
                className="bg-white border-2 border-pink-200 text-pink-600 px-10 py-4 rounded-2xl font-semibold shadow text-lg hover:bg-pink-50 transition-all duration-300"
              >
                Contact Us
              </a>
            </div>
            {/* Decorative underline */}
            <div className="w-32 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-rose-400 rounded-full mt-8 mx-auto"></div>
          </div>
        </div>
      </section>

      {/* FEATURED/DELIVERY/FAQS */}
      <section className="container mx-auto px-6 py-14">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white text-3xl shadow-lg">⭐</div>
            <h3 className="font-bold text-xl mb-2 text-pink-600">Featured Products</h3>
            <p className="text-gray-600">Handpicked bestsellers and new arrivals for your beauty routine.</p>
          </div>
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-green-600 text-white text-3xl shadow-lg">🚚</div>
            <h3 className="font-bold text-xl mb-2 text-green-600">Fast Delivery</h3>
            <p className="text-gray-600">All over Pakistan, 2-4 days delivery. Cash on Delivery available.</p>
          </div>
          <div className="bg-white/90 rounded-2xl shadow-xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="w-14 h-14 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-400 text-white text-3xl shadow-lg">❓</div>
            <h3 className="font-bold text-xl mb-2 text-purple-600">FAQs</h3>
            <p className="text-gray-600">Check our <a href="#faqs" className="text-pink-500 underline">FAQs</a> for info on orders, returns, and more.</p>
          </div>
        </div>
      </section>

      {/* PRODUCTS HERO */}
      <section className="bg-gradient-to-r from-pink-100 via-white to-purple-100 py-16 shadow-inner" id="products">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 drop-shadow-lg">
            Explore Our Products
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-6 max-w-2xl mx-auto">
            Shop the latest in beauty, skincare, and more. All products are 100% original and delivered to your doorstep!
          </p>
        </div>
      </section>
      {/* FAQ Section */}
      <div className="container mx-auto px-6 py-12" id="faqs">
        <h2 className="text-3xl font-bold text-center mb-8 text-pink-600">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white/90 rounded-xl shadow p-6">
            <h4 className="font-semibold text-lg mb-2 text-pink-600">How do I place an order?</h4>
            <p className="text-gray-700">Click "View & Order" on any product to see details and order via WhatsApp.</p>
          </div>
          <div className="bg-white/90 rounded-xl shadow p-6">
            <h4 className="font-semibold text-lg mb-2 text-pink-600">What payment methods do you accept?</h4>
            <p className="text-gray-700">We offer Cash on Delivery for all orders across Pakistan.</p>
          </div>
          <div className="bg-white/90 rounded-xl shadow p-6">
            <h4 className="font-semibold text-lg mb-2 text-pink-600">How long does delivery take?</h4>
            <p className="text-gray-700">Delivery usually takes 2-4 working days after order confirmation.</p>
          </div>
          <div className="bg-white/90 rounded-xl shadow p-6">
            <h4 className="font-semibold text-lg mb-2 text-pink-600">Are your products original?</h4>
            <p className="text-gray-700">Yes, all our products are 100% original and sourced from trusted suppliers.</p>
          </div>
        </div>
      </div>

      {/* CONTACT */}
      <section className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white py-16" id="contact">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Get in Touch</h3>
          <p className="text-lg mb-8 text-rose-100">Have questions? We're here to help you glow!</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
            <a href="https://wa.me/923001234567" className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span>WhatsApp</span>
            </a>
            <a href="https://instagram.com/nainzaka_aesthetics" className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </a>
            <a href="mailto:info@nainzakaaesthetics.com" className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span>Email</span>
            </a>
          </div>
          <p className="text-rose-100">✨ Glow with confidence ✨</p>
        </div>
      </section>
      
    </div>
  );
};

export default Home;