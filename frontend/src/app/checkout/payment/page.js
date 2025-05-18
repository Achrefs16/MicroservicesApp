"use client";
import { useState } from "react";
import { useAddress } from "../../context/AddressContext";
import { useCart } from "../../context/CartContext";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";
const PaymentPage = () => {

    const token = localStorage.getItem("usertoken");
  const { address } = useAddress();
  const { totalPrice,clearCart,cart } = useCart();
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const handleChange = (e) => {
    setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
  };


const handlePayment = async () => {
  if (!token) {
    alert("User not authenticated.");
    return;
  }

  if (!address.address || !address.city || !address.zip) {
    alert("Please provide a valid shipping address.");
    return;
  }



  const orderData = {
    token, // Send user token
    address, // Shipping address
    items: cart, // Cart items
    total: totalPrice, // Total price
  };
console.log(orderData);

  try {
    const response = await axios.post("http://ec2-51-20-188-242.eu-north-1.compute.amazonaws.com/api/orders/api/order", orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Order placed successfully:", response.data);
    toast.success("Order placed successfully:")
    clearCart(); // Clear cart after successful order
    window.location.href = "/";
 
  } catch (error) {
    console.error("Error processing order:", error);
   toast.error("Error processing order:", error)
  } 
};

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Secure Payment</h2>

          {/* Shipping Address */}
          <div className="bg-gray-200 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-medium">Shipping Address</h3>
            {address.address ? (
              <p className="text-gray-700">{address.address}, {address.city}, {address.zip}</p>
            ) : (
              <p className="text-gray-500">No address saved</p>
            )}
          </div>

          {/* Total Price */}
          <div className="bg-green-100 p-4 rounded-lg mb-4 text-green-800 font-semibold text-lg text-center">
            Total: ${totalPrice.toFixed(2)}
          </div>

          {/* Card UI */}
          <div className="relative w-full p-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md mb-6">
            <h3 className="text-lg font-semibold">Visa / Mastercard</h3>
            <p className="text-xl tracking-widest mt-2">
              {cardDetails.cardNumber || "•••• •••• •••• ••••"}
            </p>
            <div className="flex justify-between mt-4 text-sm">
              <span>{cardDetails.name || "CARDHOLDER NAME"}</span>
              <span>{cardDetails.expiry || "MM/YY"}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                value={cardDetails.cardNumber}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-2">
              <div className="w-1/2">
                <label className="block text-gray-600 text-sm font-medium mb-1">Expiry Date</label>
                <input
                  type="text"
                  name="expiry"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={cardDetails.expiry}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-gray-600 text-sm font-medium mb-1">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="•••"
                  maxLength="3"
                  value={cardDetails.cvv}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-gray-600 text-sm font-medium mb-1">Cardholder Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handlePayment}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300 font-medium text-lg"
            >
              Pay ${totalPrice.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
