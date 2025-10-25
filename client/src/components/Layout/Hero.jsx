import React from "react";
import hero from "../../assets/hero.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={hero}
        alt="Img banner"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />

      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
        {/* Content */}
        <div className="text-center text-white px-6">
          <h1 className="text-4xl md:text-7xl lg:text-9xl font-bold tracking-tighter uppercase mb-4">
            vacation <br /> Ready
          </h1>
          <p className="text-sm md:text-lg mb-6 tracking-tight">
            Discover your perfect getaway with our exclusive vacation collection
          </p>

          <Link
            to="#"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg font-medium hover:bg-gray-200 transition-all"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
