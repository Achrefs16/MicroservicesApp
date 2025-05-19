"use client";
import axios from 'axios';
import { toast } from 'react-hot-toast';

// Match the backend Product model structure
export const fetchProductDetails = async (productId) => {
  if (!productId) {
    console.warn('Attempted to fetch product with undefined ID');
    return null;
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_PRODUCT_API_URL}/products/${productId}`
    );
    const product = response.data;
    
    // Transform the backend model to match frontend expectations
    return {
      ID: product.ID,
      name: product.Name,
      description: product.Description,
      category: product.Category,
      price: product.Price,
      stock: product.Stock,
      image: product.ImageURL || `/images/products/${product.ID}.jpg`,
      createdAt: product.CreatedAt,
      updatedAt: product.UpdatedAt
    };
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(`Product ${productId} not found`);
      toast.error(`Product not found`);
    } else {
      console.error('Error fetching product details:', error);
      toast.error('Failed to load product details');
    }
    return null;
  }
};

export const fetchMultipleProducts = async (productIds) => {
  if (!Array.isArray(productIds) || productIds.length === 0) {
    console.warn('No product IDs provided to fetchMultipleProducts');
    return [];
  }

  try {
    // Filter out any invalid IDs
    const validIds = productIds.filter(id => id && id !== 'undefined');
    
    if (validIds.length === 0) {
      console.warn('No valid product IDs provided');
      return [];
    }

    // Fetch all products in parallel
    const productPromises = validIds.map(id => fetchProductDetails(id));
    const products = await Promise.all(productPromises);
    
    // Filter out any null values (failed fetches) and sort by creation date
    return products
      .filter(product => product !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } catch (error) {
    console.error('Error fetching multiple products:', error);
    toast.error('Failed to load some products');
    return [];
  }
};

// Helper function to get all products
export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_PRODUCT_API_URL}/api/products`
    );
    return response.data.map(product => ({
      ID: product.ID,
      name: product.Name,
      description: product.Description,
      category: product.Category,
      price: product.Price,
      stock: product.Stock,
      image: product.ImageURL || `/images/products/${product.ID}.jpg`,
      createdAt: product.CreatedAt,
      updatedAt: product.UpdatedAt
    }));
  } catch (error) {
    console.error('Error fetching all products:', error);
    toast.error('Failed to load products');
    return [];
  }
}; 