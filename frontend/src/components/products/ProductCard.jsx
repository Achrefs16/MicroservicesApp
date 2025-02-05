"use client";

import React from 'react';
import { FaCartPlus } from 'react-icons/fa';
import { useCart } from '../../app/context/CartContext';
import Link from "next/link"
const ProductCard = ({ product }) => {
  
  const { addItem } = useCart();

  return (

    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden">
       <Link href={`/product/${product.ID}`} passHref>
      <div className="relative h-60 overflow-hidden">
          
        <img
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          src={product.ImageURL}
          alt={product.Name}
        />
    
        {product.Stock < 10 && (
          <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            Low Stock ({product.Stock} left)
          </span>
        )}
        <span className="absolute bottom-2 left-2 bg-black backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
          {product.Category}
        </span>
      </div>
</Link>
      <div className="flex flex-col flex-1 p-4">
           <Link href={`/product/${product.ID}`} passHref>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
       
            {product.Name}
         
        </h3>
        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
          {product.Description}
        </p>
  </Link>
        <div className="flex items-center justify-between">
             <Link href={`/product/${product.ID}`} passHref>
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900">
              ${product.Price}
            </span>
            {product.Stock >= 10 && (
              <span className="text-xs text-gray-500">In Stock</span>
            )}
          </div> 
          </Link> 
          
          <button
            onClick={() => addItem(product)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
          >
            <FaCartPlus className="w-5 h-5" />
            <span className="text-sm font-medium">Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  
  );
};

export default ProductCard;