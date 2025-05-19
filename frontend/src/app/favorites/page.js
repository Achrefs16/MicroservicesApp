"use client";
import { useEffect, useState } from "react";
import { useFavorites } from "../context/FavoritesContext";
import { isTokenValid } from "../../utils/auth";
import { fetchMultipleProducts } from "../../utils/products";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ProductCard from "../../components/products/ProductCard";

const FavoritesPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { favorites, fetchFavorites } = useFavorites();
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      if (!isTokenValid()) {
        router.push("/login");
        return;
      }

      try {
        await fetchFavorites();
        if (favorites && favorites.length > 0) {
          const productIds = favorites.map((fav) => fav.productId);
          const productDetails = await fetchMultipleProducts(productIds);

          // Match each product with its favorite metadata
          const enrichedProducts = productDetails.map((product) => {
            const favorite = favorites.find((f) => f.productId === product.ID);
            return { ...product, favorite };
          });

          setProducts(enrichedProducts);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        toast.error("Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              No favorites yet
            </h2>
            <p className="text-gray-500 mb-8">
              Add some products to your favorites to see them here
            </p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.ID}
                product={product}
                favorite={product.favorite}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FavoritesPage;
