import React, { useState, useEffect } from "react";
import {useSearchParams } from "react-router-dom";

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  // --- Options ---
  const categories = ["Top wear","Bottom wear"];
  const genders = ["Men", "Women"];
  const colors = ["Red","Blue","Black","Green","Yellow","Gray","White","Pink","Beige","Navy"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Polyester", "Wool", "Leather"];
  const brands = ["Urban Threads","Modern Fit","Street Style","Beach Breeze","Fashionista","ChicStyle"];

  // --- Load filters from URL ---
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice ? Number(params.minPrice) : 0,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : 100,
    });
    setPriceRange([
      params.minPrice ? Number(params.minPrice) : 0,
      params.maxPrice ? Number(params.maxPrice) : 100,
    ]);
  }, [searchParams]);

  // --- FIXED SYNC: Filters → URL while preserving existing params ---
  useEffect(() => {
    const params = new URLSearchParams(searchParams); // ✅ start from existing params to preserve e.g., sortBy

    Object.keys(filters).forEach((key) => {
      if (Array.isArray(filters[key]) && filters[key].length > 0) {
        params.set(key, filters[key].join(",")); // ✅ use set() instead of append() to avoid duplicates
      } else if (filters[key] || filters[key] === 0) {
        params.set(key, filters[key]);
      } else {
        params.delete(key); // ✅ delete empty filters to clean URL
      }
    });

    setSearchParams(params, { replace: true }); // ✅ replace: true avoids navigation history issues
  }, [filters, searchParams, setSearchParams]);

  // --- Handle filter changes ---
  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFilters((prev) => {
      const newFilters = { ...prev };

      if (type === "checkbox") {
        if (checked) {
          newFilters[name] = [...(newFilters[name] || []), value];
        } else {
          newFilters[name] = newFilters[name].filter((item) => item !== value);
        }
      } else {
        newFilters[name] = value;
      }

      return newFilters;
    });
  };

  // --- Handle price range changes ---
  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setPriceRange([priceRange[0], value]);
    setFilters((prev) => ({
      ...prev,
      maxPrice: value,
    }));
  };

  return (
    <div className="p-4 ">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filters</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <label className="text-gray-600 font-medium block mb-2">Category</label>
        {categories.map((category) => (
          <div key={category} className="flex items-center mb-1">
            <input
              type="radio"
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-blue-500 hover:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>

      {/* Gender Filter */}
      <div className="mb-6">
        <label className="text-gray-600 font-medium block mb-2">Gender</label>
        {genders.map((gender) => (
          <div key={gender} className="flex items-center mb-1">
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={filters.gender === gender}
              onChange={handleFilterChange}
              className="mr-2 h-4 w-4 text-blue-500 hover:ring-blue-400 border-gray-300"
            />
            <span className="text-gray-700">{gender}</span>
          </div>
        ))}
      </div>

      {/* Color Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              name="color"
              value={color}
              onClick={handleFilterChange}
              className={`w-8 h-8 rounded-full border cursor-pointer transition hover:scale-105 ${
                filters.color === color ? "border-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            ></button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Size</label>
        {sizes.map((size) => (
          <div key={size} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="size"
              value={size}
              checked={filters.size.includes(size)}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-500 border-gray-300 mr-2 focus:ring-blue-400"
            />
            <span className="text-gray-700">{size}</span>
          </div>
        ))}
      </div>

      {/* Material Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Material</label>
        {materials.map((material) => (
          <div key={material} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="material"
              value={material}
              checked={filters.material.includes(material)}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-500 border-gray-300 mr-2 focus:ring-blue-400"
            />
            <span className="text-gray-700">{material}</span>
          </div>
        ))}
      </div>

      {/* Brand Filter */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Brand</label>
        {brands.map((brand) => (
          <div key={brand} className="flex items-center mb-1">
            <input
              type="checkbox"
              name="brand"
              value={brand}
              checked={filters.brand.includes(brand)}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-500 border-gray-300 mr-2 focus:ring-blue-400"
            />
            <span className="text-gray-700">{brand}</span>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <label className="block text-gray-600 font-medium mb-2">
          Price Range
        </label>
        <input
          type="range"
          name="maxPrice"
          min={0}
          max={100}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-600 mt-2">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
