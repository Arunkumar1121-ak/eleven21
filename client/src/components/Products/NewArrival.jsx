import React, { useState, useRef, useEffect } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import axios from "axios";

const NewArrival = () => {
  



  const scrollRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };

    fetchNewArrivals();
  }, []);




  useEffect(() => {
    const checkScroll = () => {
      if (!scrollRef.current) return;
      setCanScrollLeft(scrollRef.current.scrollLeft > 0);
      setCanScrollRight(
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth <
          scrollRef.current.scrollWidth
      );
    };
    checkScroll();
    scrollRef.current?.addEventListener("scroll", checkScroll);
    return () => scrollRef.current?.removeEventListener("scroll", checkScroll);
  }, [newArrivals]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -250 : 250; // smaller scroll
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <section className="py-10 relative">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Explore New Arrivals
        </h2>
        <p className="text-md md:text-lg text-gray-600 mb-8">
          Discover the latest styles straight off the runway, freshly added to
          keep your wardrobe on the cutting edge of fashion
        </p>

        {/* Scroll buttons */}
        <div className="absolute top-1/2 left-2 transform -translate-y-1/2 z-20">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded-full bg-white shadow-lg hover:bg-gray-200 transition ${
              !canScrollLeft ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <AiOutlineLeft className="text-xl" />
          </button>
        </div>
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 z-20">
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded-full bg-white shadow-lg hover:bg-gray-200 transition ${
              !canScrollRight ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <AiOutlineRight className="text-xl" />
          </button>
        </div>

        {/* Scrollable container */}
        <div
          ref={scrollRef}
          className="overflow-x-auto flex space-x-4 relative scroll-smooth scrollbar-hide mt-16 cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          onMouseUp={handleMouseUp}
        >
          {newArrivals.map((product) => (
            <div
              key={product._id}
              className="min-w-[150px] sm:min-w-[180px] md:min-w-[200px] lg:min-w-[220px] relative flex-shrink-0"
            >
              <img
                src={product.images[0].Url}
                alt={product.name}
                className="w-full h-[200px] sm:h-[220px] md:h-[250px] lg:h-[280px] object-cover rounded-lg"
              />
              {/* Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 backdrop-blur-md rounded-b-lg">
                <Link to={`/product/${product._id}`} className="block">
                  <h2 className="font-medium text-xs sm:text-sm md:text-base">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm md:text-base">
                    ${product.price}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
