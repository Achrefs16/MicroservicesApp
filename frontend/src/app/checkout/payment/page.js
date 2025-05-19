"use client";
import { useState, useEffect } from "react";
import { useAddress } from "../../context/AddressContext";
import { useCart } from "../../context/CartContext";
import Navbar from "../../../components/Navbar";
import axios from "axios";
import { toast } from "react-hot-toast";

const PaymentPage = () => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { address } = useAddress();
  const { totalPrice, clearCart, cart } = useCart();
  
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
  });

  const [errors, setErrors] = useState({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    name: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userToken = localStorage.getItem("usertoken");
      setToken(userToken);
    }
  }, []);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    const formattedValue = formatCardNumber(value);
    
    setCardDetails({ ...cardDetails, cardNumber: formattedValue });
    
    // Validate card number
    if (formattedValue.replace(/\s/g, "").length !== 16) {
      setErrors({ ...errors, cardNumber: "Card number must be 16 digits" });
    } else {
      setErrors({ ...errors, cardNumber: "" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
    
    // Reset the specific error
    setErrors({ ...errors, [name]: "" });
    
    // Validate specific inputs
    if (name === "cvv") {
      if (!/^\d{3}$/.test(value) && value.length > 0) {
        setErrors({ ...errors, cvv: "CVV must be 3 digits" });
      }
    } else if (name === "name") {
      if (value.length < 3 && value.length > 0) {
        setErrors({ ...errors, name: "Please enter your full name" });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Card number validation
    if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
      isValid = false;
    }
    
    // Expiry validation
    if (!cardDetails.expiryMonth) {
      newErrors.expiryMonth = "Required";
      isValid = false;
    }
    
    if (!cardDetails.expiryYear) {
      newErrors.expiryYear = "Required";
      isValid = false;
    }
    
    // CVV validation
    if (!/^\d{3}$/.test(cardDetails.cvv)) {
      newErrors.cvv = "CVV must be 3 digits";
      isValid = false;
    }
    
    // Name validation
    if (cardDetails.name.length < 3) {
      newErrors.name = "Please enter your full name";
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i < 10; i++) {
      years.push(currentYear + i);
    }
    return years;
  };

  const handlePayment = async () => {
    if (!token) {
      toast.error("User not authenticated. Please log in.");
      return;
    }

    if (!address.address || !address.city || !address.zip) {
      toast.error("Please provide a valid shipping address.");
      return;
    }

    if (!validateForm()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsLoading(true);

    const orderData = {
      token,
      address,
      items: cart,
      total: totalPrice,
    };

    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_ORDER_API_URL, orderData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Order placed successfully:", response.data);
      toast.success("Payment successful! Your order has been placed.");
      clearCart();
      window.location.href = "/";
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(error.response?.data?.message || "Error processing payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formattedCardNumber = cardDetails.cardNumber || "•••• •••• •••• ••••";
  const formattedExpiry = cardDetails.expiryMonth && cardDetails.expiryYear 
    ? `${cardDetails.expiryMonth}/${cardDetails.expiryYear.toString().slice(-2)}` 
    : "MM/YY";

  const isCartEmpty = !cart || cart.length === 0;

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Secure Payment</h2>

          {/* Shipping Address */}
          <div className="bg-gray-100 p-4 rounded-lg mb-4 border border-gray-200">
            <h3 className="text-lg font-medium mb-2">Shipping Address</h3>
            {address.address ? (
              <p className="text-gray-700">{address.address}, {address.city}, {address.zip}</p>
            ) : (
              <p className="text-gray-500 italic">No address saved</p>
            )}
          </div>

          {/* Total Price */}
          <div className="bg-green-50 p-4 rounded-lg mb-6 text-green-800 font-semibold text-lg text-center border border-green-100">
            Total: ${totalPrice.toFixed(2)}
          </div>

          {/* Card UI */}
          <div className="relative w-full p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-md mb-6">
            <div className="absolute top-4 right-4">
              <svg className="h-6 w-10" viewBox="0 0 40 24">
                <path fill="#fff" d="M38 0H2C.9 0 0 .9 0 2v20c0 1.1.9 2 2 2h36c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2z" opacity=".2"/>
                <path fill="#fff" d="M35 16H5c-1.1 0-2-.9-2-2V8c0-1.1.9-2 2-2h30c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2z" opacity=".2"/>
              </svg>
            </div>
            <div className="mb-6">
              <svg className="h-8" viewBox="0 0 48 16">
                <path fill="#fff" d="M44 0H4C1.8 0 0 1.8 0 4v8c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V4c0-2.2-1.8-4-4-4z" opacity="0"/>
                <path fill="#fff" d="M13 7H8v6h2v-2h3c1.7 0 3-1.3 3-3s-1.3-3-3-3zm0 4h-3V9h3c.6 0 1 .4 1 1s-.4 1-1 1zM18 13h2V7h-2v6zM24 9c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3zm0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zM34 9h-3c-1.7 0-3 1.3-3 3s1.3 3 3 3h3c1.7 0 3-1.3 3-3s-1.3-3-3-3zm0 4h-3c-.6 0-1-.4-1-1s.4-1 1-1h3c.6 0 1 .4 1 1s-.4 1-1 1z"/>
              </svg>
            </div>
            <div className="mb-4">
              <p className="text-xl tracking-widest leading-none">{formattedCardNumber}</p>
            </div>
            <div className="flex justify-between mt-4 text-sm opacity-80">
              <span className="uppercase">{cardDetails.name || "CARDHOLDER NAME"}</span>
              <span>{formattedExpiry}</span>
            </div>
          </div>

          {/* Payment Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Card Number</label>
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength="19"
                value={cardDetails.cardNumber}
                onChange={handleCardNumberChange}
                required
                className={`w-full p-3 border ${errors.cardNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
            </div>
            
            <div className="flex space-x-2">
              <div className="w-1/3">
                <label className="block text-gray-700 text-sm font-medium mb-1">Month</label>
                <select
                  name="expiryMonth"
                  value={cardDetails.expiryMonth}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border ${errors.expiryMonth ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">MM</option>
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1;
                    return (
                      <option key={month} value={month < 10 ? `0${month}` : month}>
                        {month < 10 ? `0${month}` : month}
                      </option>
                    );
                  })}
                </select>
                {errors.expiryMonth && <p className="text-red-500 text-xs mt-1">{errors.expiryMonth}</p>}
              </div>
              
              <div className="w-1/3">
                <label className="block text-gray-700 text-sm font-medium mb-1">Year</label>
                <select
                  name="expiryYear"
                  value={cardDetails.expiryYear}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border ${errors.expiryYear ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">YYYY</option>
                  {generateYearOptions().map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                {errors.expiryYear && <p className="text-red-500 text-xs mt-1">{errors.expiryYear}</p>}
              </div>
              
              <div className="w-1/3">
                <label className="block text-gray-700 text-sm font-medium mb-1">CVV</label>
                <input
                  type="password"
                  name="cvv"
                  placeholder="•••"
                  maxLength="3"
                  value={cardDetails.cvv}
                  onChange={handleChange}
                  required
                  className={`w-full p-3 border ${errors.cvv ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Cardholder Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={handleChange}
                required
                className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            
            <button
              onClick={handlePayment}
              disabled={isLoading || isCartEmpty}
              className={`w-full py-3 rounded-lg transition duration-300 font-medium text-lg mt-4 ${
                isLoading || isCartEmpty
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay ${isCartEmpty ? '$0.00' : '$' + totalPrice.toFixed(2)}`
              )}
            </button>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              <span className="flex items-center justify-center">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
                Secure payment - Your data is protected
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;