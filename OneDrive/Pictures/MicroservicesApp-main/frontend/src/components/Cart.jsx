"use client";
import React from "react";
import { useCart } from "../app/context/CartContext";
import { FiX } from "react-icons/fi";
const Cart = ({ closeCart,toggleLogin }) => {
const { cart, removeItem, clearCart, incrementItem, decrementItem, totalPrice } = useCart();

const increment = (quantity,id,Stock) => {
    
      if ( quantity < Stock) return incrementItem(id);

  };

  const decrement = (quantity,id) => {
    
           if (quantity >=1) return decrementItem(id);

  };
  const handleCheckout = () => {
  const token = localStorage.getItem("usertoken"); // Vérifier si le token est stocké

  if (!token) {
   
    toggleLogin()// Redirection vers la page de connexion
  } else {
    window.location.href = "/checkout/address"; // Redirection vers le formulaire d'adresse
  }
};

  return (

<div className="absolute inset-0 bg-black bg-opacity-50 z-20">
  <div className="bg-white shadow absolute p-8 z-30 right-0 h-full max-w-2xl w-full flex flex-col">
      <FiX   onClick={closeCart}  className="cursor-pointer p-0.5 text-3xl rounded hover:bg-gray-200"/>
    <div className="px-4 py-6 sm:px-8 sm:py-10 flex-1 overflow-auto"> 
    
      <div className="flow-root">
        {cart.length > 0 ? (
          <ul className="-my-8">
            {cart.map((item) => (
              <li key={item.ID} className="flex flex-col items-center space-y-3 py-4 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
                <div className="shrink-0">
                  <img className="h-20  w-20 max-w-full rounded-lg object-cover" src={item.ImageURL} alt={item.Name} />
                </div>

                <div className="relative flex flex-1 flex-col justify-between">
                  <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                    <div className="pr-8 sm:pr-5">
                      <p className="text-base font-semibold text-gray-900">{item.Name}</p>
                      <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">{item.size}</p>
                    </div>

                    <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                      <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
                        ${item.Price}
                      </p>

                      <div className="sm:order-1">
                        <div className="mx-auto flex h-8 items-stretch text-gray-600">
                          <button
                            className="flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-black hover:text-white"
                            onClick={() => decrement(item.quantity,item.ID)}  
                          >
                            -
                          </button>
                          <div className="flex w-full items-center justify-center bg-gray-100 px-4 text-xs uppercase transition">
                            {item.quantity}
                          </div>
                          <button
                            className="flex items-center justify-center rounded-r-md  bg-gray-200 px-4 transition hover:bg-black hover:text-white"
                            onClick={() => increment(item.quantity,item.ID,item.Stock)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        )}
      
      </div>
    </div>

    {/* Fixed Checkout Button at the Bottom */}
      <div className="flex justify-between px-4 items-center mt-6 mb-4 border-t pt-4">
          <p className="text-lg font-semibold text-gray-900">Total:</p>
          <p className="text-lg font-semibold text-gray-900">${totalPrice.toFixed(2)}</p>
        </div>
    <div className="flex justify-between mt-auto px-4 pb-4">
      
      <button onClick={handleCheckout} className="w-full py-2 bg-black text-white rounded-lg hover:bg-gray-900">
        Checkout
      </button>
    </div>
      <div className="flex justify-between mt-auto px-4 pb-4">
      
      <button onClick={clearCart} className="w-full py-2 bg-gray-200 text-red-600 rounded-lg hover:bg-gray-300">
        Clear All
      </button>
    </div>
  </div>
</div>

  );
};

export default Cart;
