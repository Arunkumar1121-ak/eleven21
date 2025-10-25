import React, { useEffect, useState } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import ProductGrid from "./ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  fetchSimilarProducts,
  fetchProductDetails,
} from "../../redux/slices/productsSlice";
import {
  addToCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

// ---------- Elegant Toast Component ----------
const Toast = ({ message, show }) => {
  return (
    show && (
      <div className="fixed top-4 right-4 bg-white text-black border border-black px-4 py-2 rounded shadow-md z-50 flex items-center gap-2 transition-all duration-300 animate-slide-in">
        <AiOutlineCheck className="text-black" />
        <span>{message}</span>
      </div>
    )
  );
};

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart); // ✅ Get cart

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].Url);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedSize && selectedColor && quantity > 0) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [selectedSize, selectedColor, quantity]);

  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleColorSelect = (color) => setSelectedColor(color);
  const handleDecreaseQuantity = () =>
    quantity > 1 && setQuantity(quantity - 1);
  const handleIncreaseQuantity = () => setQuantity(quantity + 1);

  // ---------- FIXED Add to Cart ----------
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;

    // Check if product already exists in cart
    const existingProduct = cart?.products?.find(
      (p) =>
        p.productId === productFetchId &&
        p.size === selectedSize &&
        p.color === selectedColor
    );

    if (existingProduct) {
      // Update quantity if exists
      dispatch(
        updateCartItemQuantity({
          productId: productFetchId,
          quantity: existingProduct.quantity + quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId: user?._id,
        })
      );
    } else {
      // Add new product if not exists
      dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          guestId,
          userId: user?._id,
          image: mainImage,
          name: selectedProduct.name,
          price: selectedProduct.price,
        })
      );
    }

    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-6">
      <Toast
        message={`${selectedProduct?.name} added to cart!`}
        show={showToast}
      />

      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images?.map((img, index) => (
                <img
                  key={index}
                  src={img.Url}
                  alt={img.altText}
                  onClick={() => setMainImage(img.Url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                    mainImage === img.Url ? "border-black" : "border-gray-300"
                  } hover:opacity-75`}
                />
              ))}
            </div>

            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt="Selected Product"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                )}
              </div>

              {/* Mobile Thumbnails */}
              <div className="md:hidden flex space-x-4 overflow-x-scroll mb-4">
                {selectedProduct.images?.map((img, index) => (
                  <img
                    key={index}
                    src={img.Url}
                    alt={img.altText}
                    onClick={() => setMainImage(img.Url)}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === img.Url ? "border-black" : "border-gray-300"
                    } hover:opacity-75`}
                  />
                ))}
              </div>
            </div>

            {/* Right Side Details */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {selectedProduct.name}
              </h1>

              <p className="text-lg text-gray-600 mb-1 line-through">
                {selectedProduct.originalPrice &&
                  `$${selectedProduct.originalPrice}`}
              </p>
              <p className="text-2xl text-gray-500 mb-2">
                ${selectedProduct.price}
              </p>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>

              <div className="mb-4">
                <p className="text-gray-700">Colors:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorSelect(color)}
                      className={`w-8 h-8 rounded-full border ${
                        selectedColor === color
                          ? "ring-2 ring-black"
                          : "border-gray-400"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.9)",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeSelect(size)}
                      className={`px-4 py-2 rounded border ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700">Quantity:</p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                    onClick={handleDecreaseQuantity}
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                    onClick={handleIncreaseQuantity}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                disabled={isButtonDisabled}
                onClick={handleAddToCart}
                className={`py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Add to cart
              </button>

              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Brand</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              You may also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
