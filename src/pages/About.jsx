import React from "react";

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-3xl mx-auto bg-white/90 rounded-3xl shadow-2xl p-10 text-center">
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500">
          About Nainzaka Aesthetics
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-pink-400 mx-auto mb-8 rounded-full"></div>
        <p className="text-lg text-gray-700 mb-6">
          Nainzaka Aesthetics is your destination for premium beauty and skincare products in Pakistan. 
          We believe everyone deserves to glow with confidence, and our curated collection is designed to empower you.
        </p>
        <p className="text-gray-600 mb-6">
          <span className="font-semibold text-pink-500">Why choose us?</span><br />
          - 100% original products<br />
          - Fast delivery nationwide<br />
          - Cash on delivery available<br />
          - Friendly support and easy returns
        </p>
        <p className="text-gray-600">
          Our mission is to help you discover your unique beauty and feel your best every day. 
          Thank you for trusting us with your glow!
        </p>
        <div className="mt-8 text-rose-500 font-semibold">✨ Glow with confidence ✨</div>
      </div>
    </div>
  </div>
);

export default About;