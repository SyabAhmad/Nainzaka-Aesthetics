import React from 'react';
import logo from "../assets/logo.jpg";

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 mt-16">
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[#660033] to-[#AD1457] rounded-lg flex items-center justify-center">
              <img src={logo} alt="logo" className="h-full w-full object-cover rounded-lg" />
            </div>
            <div>
              <span className="block text-xl font-bold text-gray-800">Nainzaka Aesthetics</span>
              <span className="block text-xs text-pink-500 font-medium tracking-wider">GLOW WITH CONFIDENCE</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Premium aesthetic solutions tailored to enhance your natural beauty and boost your confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-gray-800 font-semibold uppercase tracking-wider text-sm">Quick Links</h3>
          <div className="space-y-2">
            <a href="/" className="block text-gray-500 hover:text-[#660033] transition-colors text-sm">Home</a>
            <a href="/about" className="block text-gray-500 hover:text-[#660033] transition-colors text-sm">About Us</a>
          </div>
        </div>

        {/* Featured Products */}
        <div className="space-y-4">
          <h3 className="text-gray-800 font-semibold uppercase tracking-wider text-sm">Categories</h3>
          <div className="space-y-2">
            <ul>
              <li>Skin Treatment</li>
              <li>Laser Therapy</li>
              <li>Injectables</li>
              <li>Body Contouring</li>
            </ul>
            {/* <a href="#" className="block text-gray-500 hover:text-pink-600 transition-colors text-sm">Skin Treatments</a>
            <a href="#" className="block text-gray-500 hover:text-pink-600 transition-colors text-sm">Laser Therapy</a>
            <a href="#" className="block text-gray-500 hover:text-pink-600 transition-colors text-sm">Injectables</a>
            <a href="#" className="block text-gray-500 hover:text-pink-600 transition-colors text-sm">Body Contouring</a>
            <a href="#" className="block text-gray-500 hover:text-pink-600 transition-colors text-sm">Wellness Packages</a> */}
          </div>
        </div>

        {/* /* Contact & Social */}
        <div className="space-y-4">
          <h3 className="text-gray-800 font-semibold uppercase tracking-wider text-sm">Connect With Us</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span className="text-gray-500 text-sm">+92 300 1234567</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span className="text-gray-500 text-sm">info@nainzaka.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span className="text-gray-500 text-sm">123 Beauty St, Karachi</span>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-2">
            <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-green-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.04 2.875 1.186 3.074.149.198 2.05 3.127 4.974 4.266.695.299 1.234.477 1.656.611.696.222 1.33.191 1.83.116.558-.083 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.07 4.849-.07zm0-2.163C8.741 0 8.332.013 7.052.072 2.668.272.273 2.668.072 7.052.013 8.332 0 8.741 0 12c0 3.259.013 3.668.072 4.948.201 4.384 2.596 6.78 6.98 6.98C8.332 23.987 8.741 24 12 24c3.259 0 3.668-.013 4.948-.072 4.384-.201 6.78-2.596 6.98-6.98.059-1.28.072-1.689.072-4.948 0-3.259-.013-3.668-.072-4.948-.201-4.354-2.596-6.78-6.98-6.98C15.668.013 15.259 0 12 0z"/>
              </svg>
            </a>
            <a href="https://instagram.com/nainzaka_aesthetics" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-pink-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.07 4.849-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://www.tiktok.com/@nainzaka_aesthetics" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 3a1 1 0 0 1 1 1c0 2.485 2.015 4.5 4.5 4.5a1 1 0 1 1 0 2c-2.019 0-3.813-.97-4.89-2.47V16a5.5 5.5 0 1 1-5.5-5.5 1 1 0 1 1 0 2A3.5 3.5 0 1 0 15 16V2.999a1 1 0 0 1 1-1h.5z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-500 text-xs md:text-sm">
          © {new Date().getFullYear()} Nainzaka Aesthetics. All rights reserved.
        </p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="/privacy" className="text-gray-500 hover:text-pink-600 text-xs md:text-sm">Privacy Policy</a>
          <a href="/terms" className="text-gray-500 hover:text-pink-600 text-xs md:text-sm">Terms of Service</a>
          <a href="/faq" className="text-gray-500 hover:text-pink-600 text-xs md:text-sm">FAQs</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;