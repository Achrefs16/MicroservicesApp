import React, { useEffect, useState } from 'react';
import ProductCard from "@/components/products/ProductCard";
import axios from "axios";
const Main = () => {

  // State to hold the products data, loading status, and potential errors
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [searchTerm, setSearchTerm] = useState('');

const productUrl = process.env.NEXT_PUBLIC_PRODUCT_URL;
  // useEffect to fetch products when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Adjust the URL to match your backend endpoint
        const response = await axios.get(`${productUrl}/products`);
        setProducts(response.data);
        console.log(response.data);
        
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []); 
const filteredProducts = products.filter(product => {
  const searchLower = searchTerm.toLowerCase();
  return (
    product.Name.toLowerCase().includes(searchLower) ||
    product.Description.toLowerCase().includes(searchLower)
  );
});
const categories = [
  { category: 'Smartphones & Accessories', image: '/images/smartphones.webp' },
  { category: 'Laptops & Computers', image: '/images/laptops.jpg' },
  { category: 'Gaming Electronics', image: '/images/gaming.jpg' },
  { category: 'Audio Devices', image: '/images/audio.jpg' }
];
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-700 h-96">
        <div className="absolute inset-0 opacity-75 bg-[url('https://via.placeholder.com/1920x600')] bg-cover bg-center"></div>
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-5xl font-bold mb-4">Next-Gen Electronics</h1>
            <p className="text-xl mb-8">Discover the latest tech innovations</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100">
              Shop Now
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Popular Categories</h2>
     <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {categories.map((cat, index) => (
        <div key={index} className="relative group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <img 
            src={cat.image}
            alt={cat.category}
            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <h3 className="text-white text-2xl font-bold">{cat.category}</h3>
          </div>
        </div>
      ))}
    </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
  <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Featured Products</h2>
  <div className="relative flex items-center justify-center w-full mb-4">
  <input
  type="text"
  placeholder="Search..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="px-3 w-96 py-2 rounded-md text-sm bg-gray-100 border-2 border-gray-600 focus:outline-none focus:ring focus:ring-gray-900"
/>
  </div>
  {filteredProducts.length === 0 ? (
    <div className="text-center py-8">
      <p className="text-gray-500 text-lg">No products found matching your search.</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {filteredProducts.map((product) => (
        <ProductCard key={product.ID} product={product} />
      ))}
    </div>
  )}
</div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8">Subscribe to our newsletter for latest updates and offers</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TechHub</h3>
            <p className="text-gray-400">Your destination for cutting-edge electronics and tech gadgets.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white">Returns & Exchanges</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">About Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Our Story</a></li>
              <li><a href="#" className="hover:text-white">Careers</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400">Facebook</a>
              <a href="#" className="hover:text-blue-400">Twitter</a>
              <a href="#" className="hover:text-blue-400">Instagram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Main;