import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmation = () => {
 const dispatch =useDispatch();
 const navigate = useNavigate();
 const { checkout } = useSelector((state) => state.checkout);

 //clear tthe cart when the order id confirmed

 useEffect(() => {
  if (checkout && checkout._id) {
    dispatch(clearCart());
    localStorage.removeItem("cart");

  } else {
    navigate("/my-orders");
  }
 },[checkout, dispatch, navigate])

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); 
    return orderDate.toLocaleDateString(); 
  };

  return (
    <div className="mx-auto max-w-4xl bg-white p-6">
      <h1 className="font-bold text-4xl text-emerald-700 text-center mb-8">
        Thank You for Your Order!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border">
          {/* Order ID & Date */}
          <div className="flex justify-between mb-6">
            <h2 className="text-xl font-medium">Order ID: {checkout.id}</h2>
            <p className="text-gray-500">
              Order Date: {new Date(checkout.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Estimated Delivery */}
          <p className="text-emerald-700 text-sm mb-4">
            Estimated Delivery: {calculateEstimatedDelivery(checkout.createdAt)}
          </p>

          {/* Order Items */}
          <div className="mb-6">
            {checkout.checkoutItems.map((item) => (
              <div key={item.productId} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="flex-1">
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-md">${item.price.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment & Shipping Info */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-2">Shipping Address</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}, {checkout.shippingAddress.city},{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Total</h4>
              <p className="text-gray-600">${checkout.totalPrice.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmation;
