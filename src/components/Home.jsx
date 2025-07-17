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
      
    </div>
  );
};

export default Home;