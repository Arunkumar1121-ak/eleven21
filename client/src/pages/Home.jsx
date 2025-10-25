import React from "react";
import Hero from "../components/Layout/Hero";
import GenderCollections from "../components/Products/GenderCollections";
import NewArrival from "../components/Products/NewArrival";
import ProductDetails from "../components/Products/ProductDeatails"; // check spelling matches your file
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedSection from "../components/Products/FeaturedSection";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";
const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  // ✅ Initialize as null instead of [null]
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

     // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );

        // If API returns an array, take the first product
        if (Array.isArray(response.data) && response.data.length > 0) {
          setBestSellerProduct(response.data[0]);
        } else {
          setBestSellerProduct(response.data); // fallback
        }
      } catch (err) {
        console.error("Error fetching best seller product:", err);
      }
    };
    fetchBestSeller();
  }, [dispatch]);
  return (
    <>
      <Hero />
      <GenderCollections />
      <NewArrival />

      {/* Best seller section */}
      <h2 className="text-3xl font-bold mb-4 text-center">Best Sellers</h2>
      {bestSellerProduct && bestSellerProduct._id ? (
  <ProductDetails productId={bestSellerProduct._id} />
) : (
  <p className="text-center">Loading best seller product...</p>
)}


      <div className="container mx-auto">
        <h1 className="text-3xl text-center font-bold mb-4">Top wear for women</h1>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedSection />
    </>
  );
};

export default Home;
