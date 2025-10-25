
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle adding or subtracting quantity
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;

    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };


  return (
    <div>
      {cart?.products?.length > 0 ? (
        cart.products.map((product, index) => (
          <div
            key={index}
            className="flex items-start justify-between py-4 border-b"
          >
            <div className="flex items-start">
              {/* ✅ FIXED IMAGE */}
              <img
                src={
                  product.image ||
                  product.productId?.images?.[0]?.Url ||
                  "https://via.placeholder.com/100"
                }
                alt={product.name || product.productId?.name || "Product image"}
                className="w-20 h-20 object-cover mr-4 rounded"
              />

              <div>
                {/* ✅ FIXED NAME */}
                <h3>{product.name || product.productId?.name}</h3>
                <p className="text-sm text-gray-500">
                  {product.size} | {product.color}
                </p>

                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId?._id || product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }
                    className="border rounded px-2 py-1 text-xl font-medium"
                  >
                    -
                  </button>
                  <span className="mx-4">{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId?._id || product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.color
                      )
                    }
                    className="border rounded px-2 py-1 text-xl font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div>
              {/* ✅ FIXED PRICE */}
              <p>${(product.price || product.productId?.price)?.toFixed(2)}</p>
              <button
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId?._id || product.productId,
                    product.size,
                    product.color
                  )
                }
              >
                <RiDeleteBin3Line className="h-6 w-6 text-red-600" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-6">Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartContents;
