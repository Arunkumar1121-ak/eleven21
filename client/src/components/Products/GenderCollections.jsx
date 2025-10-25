import React from "react";
import { Link } from "react-router-dom";
import menImage from "../../assets/men.jpg";
import womenImage from "../../assets/women.jpg";

const GenderCollections = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* ===== Men Collection ===== */}
        <div className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src={menImage}
            alt="Men Collection"
            className="w-full h-[400px] object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h2 className="text-white text-2xl font-bold mb-4">Men Collection</h2>
            <Link
              to="/shop/men"
              className="bg-white text-gray-900 px-6 py-2 rounded-sm font-medium hover:bg-gray-200 transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* ===== Women Collection ===== */}
        <div className="relative group overflow-hidden rounded-lg shadow-lg">
          <img
            src={womenImage}
            alt="Women Collection"
            className="w-full h-[400px] object-cover transform transition-transform duration-500 group-hover:scale-105"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <h2 className="text-white text-2xl font-bold mb-4">Women Collection</h2>
            <Link
              to="/shop/women"
              className="bg-white text-gray-900 px-6 py-2 rounded-sm font-medium hover:bg-gray-200 transition-all"
            >
              Shop Now
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GenderCollections;
