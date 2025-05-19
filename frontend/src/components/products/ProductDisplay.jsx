"use client";

import React from 'react';
import { BsCart3, BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useCart } from '../../app/context/CartContext';
import { useFavorites } from '../../app/context/FavoritesContext';
import Link from "next/link";
import { toast } from 'react-hot-toast';

const ProductDisplay = ({ product, favorite }) => {
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isFav, setIsFav] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    const checkFavorite = async () => {
      const status = await isFavorite(product.ID);
      setIsFav(status);
    };
    checkFavorite();
  }, [isFavorite, product.ID]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    const token = localStorage.getItem("usertoken");
    if (!token) {
      toast.error("Please sign in to manage favorites");
      return;
    }

    setIsLoading(true);
    try {
      if (isFav) {
        await removeFavorite(product.ID);
        setIsFav(false);
      } else {
        await addFavorite(product.ID);
        setIsFav(true);
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <article className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02]">
      {/* Image Container */}
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <Link href={`/product/${product.ID}`}>
          <div className="relative pt-[100%]">
            <img
              src={product.image || `/images/products/${product.ID}.jpg`}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                e.target.src = `/images/products/${product.ID}.jpg`;
              }}
            />
          </div>
        </Link>

        {/* Stock Badge */}
        {product.stock < 10 && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              {product.stock} remaining
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all duration-200 disabled:opacity-50"
        >
          {isFav ? (
            <BsBookmarkFill className="w-5 h-5 text-blue-600" />
          ) : (
            <BsBookmark className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
          )}
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Category */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-600">{product.category}</span>
          {product.stock >= 10 && (
            <span className="text-sm text-green-600">• In Stock</span>
          )}
        </div>

        {/* Title */}
        <Link href={`/product/${product.ID}`}>
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
          </div>

          {favorite ? (
            <div className="text-sm text-gray-500">
              Saved {new Date(favorite.createdAt).toLocaleDateString()}
            </div>
          ) : (
            <button
              onClick={() => addItem(product)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <BsCart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Add</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProductDisplay; 