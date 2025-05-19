"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getUserId, isTokenValid } from "../../utils/auth";
import { toast } from "react-hot-toast";
import axios from "axios";

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // 1️⃣ Define isFavorite first, so it's available to others
  const isFavorite = useCallback(async (productId) => {
    const id = getUserId();
    if (!id || !productId) return false;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_FAVORITES_API_URL}/api/favorites/${id}/product/${productId}/check`
      );
      return response.data === true;
    } catch (err) {
      console.error("Error checking favorite status:", err);
      return false;
    }
  }, []);

  // 2️⃣ Fetch the list of favorites
  const fetchFavorites = useCallback(async () => {
    const id = getUserId();
    if (!id) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_FAVORITES_API_URL}/api/favorites/${id}`
      );
      const favoritesData = Array.isArray(response.data) ? response.data : [];
      const uniqueFavorites = favoritesData.reduce((acc, current) => {
        if (!acc.find(item => item.productId === current.productId)) {
          acc.push(current);
        }
        return acc;
      }, []);
      setFavorites(uniqueFavorites);
      setLastUpdate(Date.now());
    } catch (err) {
      console.error("Error fetching favorites:", err);
      setError(err.response?.data?.message || "Failed to fetch favorites");
      toast.error("Failed to load favorites");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3️⃣ Now it's safe to reference isFavorite inside add/remove
  const addFavorite = useCallback(async (productId) => {
    const id = getUserId();
    if (!id) {
      toast.error("Please sign in to add favorites");
      return false;
    }
    if (!productId) {
      toast.error("Invalid product");
      return false;
    }
    if (isUpdating) return false;

    setIsUpdating(true);
    try {
      if (await isFavorite(productId)) {
        toast.error("Product already in favorites");
        return false;
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_FAVORITES_API_URL}/api/favorites/${id}/product/${productId}`
      );
      setFavorites(prev =>
        prev.some(f => f.productId === productId)
          ? prev
          : [...prev, response.data]
      );
      setLastUpdate(Date.now());
      toast.success("Added to favorites");
      return true;
    } catch (err) {
      console.error("Error adding favorite:", err);
      if (err.response?.status === 409) {
        toast.error("Product already in favorites");
        await fetchFavorites();
      } else {
        toast.error(err.response?.data?.message || "Failed to add to favorites");
      }
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating, isFavorite, fetchFavorites]);

  const removeFavorite = useCallback(async (productId) => {
    const id = getUserId();
    if (!id || !productId) return false;
    if (isUpdating) return false;

    setIsUpdating(true);
    try {
      if (!(await isFavorite(productId))) {
        toast.error("Product is not in favorites");
        return false;
      }

      await axios.delete(
        `${process.env.NEXT_PUBLIC_FAVORITES_API_URL}/api/favorites/${id}/product/${productId}`
      );
      setFavorites(prev => prev.filter(f => f.productId !== productId));
      setLastUpdate(Date.now());
      toast.success("Removed from favorites");
      return true;
    } catch (err) {
      console.error("Error removing favorite:", err);
      toast.error("Failed to remove from favorites");
      await fetchFavorites();
      return false;
    } finally {
      setIsUpdating(false);
    }
  }, [isUpdating, isFavorite, fetchFavorites]);

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      if (isTokenValid()) fetchFavorites();
    }, 30_000);
    return () => clearInterval(interval);
  }, [fetchFavorites]);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        error,
        lastUpdate,
        fetchFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
