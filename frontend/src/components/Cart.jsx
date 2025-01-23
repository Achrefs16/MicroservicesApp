import React, { useState } from "react";

const Cart = ({ closeCart }) => {
  const [quantity, setQuantity] = useState(4);
  const itemPrice = 0.0; // Example price, replace as needed
  const shippingCost = 0.0; // Example free shipping
  const taxes = 0.0; // Taxes are calculated at checkout
  const total = itemPrice * quantity + taxes + shippingCost;

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-10">
      <div className="fixed right-0 top-0 w-72 bg-white h-full p-6 shadow-lg transform transition-all duration-300 ease-in-out">
        <button
          className="absolute top-4 right-4 text-xl font-bold"
          onClick={closeCart} // Close the cart when clicked
        >
          X
        </button>
        <h2 className="text-xl font-semibold mb-4">My Cart</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-lg"></div>
          <div className="flex flex-col">
            <span className="font-medium">Sticker</span>
            <span className="text-sm text-gray-600">Color</span>
          </div>
          <span className="ml-auto text-lg font-semibold">${itemPrice}</span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <button onClick={decreaseQuantity} className="px-4 py-2 border rounded-lg">-</button>
          <input type="text" value={quantity} readOnly className="w-12 text-center border rounded-lg" />
          <button onClick={increaseQuantity} className="px-4 py-2 border rounded-lg">+</button>
        </div>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Subtotal</span>
            <span>${(itemPrice * quantity).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Taxes</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        <button className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-900">
          PROCEED TO CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Cart;
