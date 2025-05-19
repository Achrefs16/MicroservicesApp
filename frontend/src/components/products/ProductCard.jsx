"use client";

import React from 'react';
import { FaCartPlus, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useCart } from '../../app/context/CartContext';
import { useFavorites } from '../../app/context/FavoritesContext';
import Link from "next/link"
import { toast } from 'react-hot-toast';

const ProductCard = ({ product, favorite }) => {
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isFav, setIsFav] = React.useState(false);
  const [isRemoving, setIsRemoving] = React.useState(false);

  React.useEffect(() => {
    const checkFavorite = async () => {
      const status = await isFavorite(product.ID);
      setIsFav(status);
    };
    checkFavorite();
  }, [isFavorite, product.ID]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault(); // Prevent navigation when clicking the favorite button
    if (isRemoving) return;
    
    const token = localStorage.getItem("usertoken");
    if (!token) {
      toast.error("Please sign in to manage favorites");
      return;
    }

    setIsRemoving(true);
    try {
      if (isFav) {
        const success = await removeFavorite(product.ID);
        if (success) setIsFav(false);
      } else {
        const success = await addFavorite(product.ID);
        if (success) setIsFav(true);
      }
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 ease-in-out overflow-hidden">
      <Link href={`/product/${product.ID}`} passHref>
        <div className="relative h-60 overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.target.src = `/images/products/${product.ID}.jpg`;
            }}
          />
          
          {product.stock < 10 && (
            <span className="absolute top-2 left-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Low Stock ({product.stock} left)
            </span>
          )}
          <span className="absolute bottom-2 left-2 bg-black backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/product/${product.ID}`} passHref>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          <button
            onClick={handleFavoriteClick}
            disabled={isRemoving}
            className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isRemoving ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isFav ? (
              <FaHeart className="w-5 h-5 text-red-500" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>

        <Link href={`/product/${product.ID}`} passHref>
          <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1">
            {product.description}
          </p>
        </Link>

        <div className="flex items-center justify-between mt-auto">
          <Link href={`/product/${product.ID}`} passHref>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">
                ${product.price}
              </span>
              {product.stock >= 10 && (
                <span className="text-xs text-gray-500">In Stock</span>
              )}
            </div>
          </Link>
          
          {favorite ? (
            <div className="text-sm text-gray-500">
              Added on {new Date(favorite.createdAt).toLocaleDateString()}
            </div>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              <FaCartPlus className="w-5 h-5" />
              <span className="text-sm font-medium">Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;