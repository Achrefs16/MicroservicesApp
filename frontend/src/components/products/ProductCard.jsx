"use client";

import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { useCart } from "../../app/context/CartContext"; // Import du contexte

const ProductCard = ({ product }) => {
  const { addItem } = useCart(); // Récupération de la fonction addItem

  return (
    <div className="relative m-4 w-full max-w-xs overflow-hidden rounded-lg bg-white shadow-md">
      <a href="#">
        <img
          className="h-60 rounded-t-lg object-cover"
          src={product.image}
          alt={product.name}
        />
      </a>
      <div className="mt-4 px-5 pb-5">
        <h5 className="text-xl font-semibold tracking-tight text-slate-900">
          {product.name}
        </h5>
        <div className="flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-slate-900">
              ${product.price}
            </span>
          </p>
          <button
            onClick={() => addItem(product)}
            className="flex items-center rounded-md bg-black px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-700"
          >
            <FaCartPlus className="mr-2 h-5 w-5" />
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
