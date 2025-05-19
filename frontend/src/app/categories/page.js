import React from 'react';
import Navbar from "../../components/Navbar";
import Link from "next/link";
import { Search, ShoppingCart, ChevronRight, Filter } from "lucide-react";

const CategoriesPage = () => {
  const categories = [
    {
      id: 1,
      name: 'Smartphones & Accessories',
      description: 'Latest smartphones, cases, chargers & more',
      image: 'https://via.placeholder.com/400x300?text=Smartphones+Accessories',
      itemCount: 243
    },
    {
      id: 2,
      name: 'Laptops & Computers',
      description: 'Laptops, desktops, monitors & peripherals',
      image: 'https://via.placeholder.com/400x300?text=Laptops+Computers',
      itemCount: 187
    },
    {
      id: 3,
      name: 'Audio Devices',
      description: 'Wireless earbuds, speakers & sound systems',
      image: 'https://via.placeholder.com/400x300?text=Audio+Devices',
      itemCount: 156
    },
    {
      id: 4,
      name: 'Smart Home Devices',
      description: 'Smart speakers, security cameras & automation',
      image: 'https://via.placeholder.com/400x300?text=Smart+Home',
      itemCount: 124
    },
    {
      id: 5,
      name: 'Wearable & Health Tech',
      description: 'Smartwatches, fitness trackers & health monitors',
      image: 'https://via.placeholder.com/400x300?text=Wearable+Health+Tech',
      itemCount: 98
    },
    {
      id: 6,
      name: 'Televisions & Home Theater',
      description: 'Smart TVs, soundbars & streaming devices',
      image: 'https://via.placeholder.com/400x300?text=TVs+Home+Theater',
      itemCount: 112
    },
    {
      id: 7,
      name: 'Gaming Electronics',
      description: 'Consoles, gaming PCs & accessories',
      image: 'https://via.placeholder.com/400x300?text=Gaming+Electronics',
      itemCount: 176
    },
    {
      id: 8,
      name: 'Cameras & Camcorders',
      description: 'DSLRs, action cams & photography gear',
      image: 'https://via.placeholder.com/400x300?text=Cameras+Camcorders',
      itemCount: 85
    },
    {
      id: 9,
      name: 'Tablets & eReaders',
      description: 'Tablets, e-readers & accessories',
      image: 'https://via.placeholder.com/400x300?text=Tablets+eReaders',
      itemCount: 211
    },
    {
      id: 10,
      name: 'Automotive Electronics',
      description: 'Car audio, GPS systems & dash cams',
      image: 'https://via.placeholder.com/400x300?text=Automotive+Electronics',
      itemCount: 94
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Categories</h1>
          <p className="text-xl md:text-2xl max-w-2xl opacity-90">Find exactly what you're looking for from our extensive collection of premium tech products.</p>
          
          {/* Search Bar */}
          <div className="mt-8 max-w-xl flex">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full py-3 px-4 pr-10 rounded-l-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="absolute right-3 top-3 text-gray-500">
                <Search size={20} />
              </div>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 px-6 rounded-r-lg flex items-center">
              Search
            </button>
          </div>
        </div>
      </div>
      
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 flex items-center text-sm text-gray-600">
        <Link href="/">
          <span className="hover:text-blue-600">Home</span>
        </Link>
        <ChevronRight size={14} className="mx-2" />
        <span className="font-medium text-gray-900">Categories</span>
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {/* Page Header with Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Categories</h2>
            <p className="text-gray-600 mt-1">Browse through our tech collection</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center">
            <button className="flex items-center bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50">
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        
        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link href={`/categories/${category.id}`} key={category.id}>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 group">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {category.itemCount} items
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  <p className="text-gray-600 mb-4">{category.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium flex items-center group-hover:underline">
                      Explore category
                      <ChevronRight size={16} className="ml-1 group-hover:ml-2 transition-all" />
                    </span>
                    <div className="bg-gray-100 text-gray-800 p-2 rounded-lg">
                      <ShoppingCart size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Featured Promotion */}
        <div className="mt-16 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">New Products Added Weekly</h3>
              <p className="text-gray-700 mb-4">Subscribe to our newsletter to stay updated with the latest tech releases and exclusive deals.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="flex-grow py-2 px-4 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="mt-6 md:mt-0 md:w-1/3 md:pl-8">
              <div className="p-4 bg-white rounded-lg shadow-md">
                <div className="text-center">
                  <div className="inline-block p-3 rounded-full bg-blue-100 text-blue-600 mb-3">
                    <ShoppingCart size={24} />
                  </div>
                  <h4 className="font-bold">Special Offer</h4>
                  <p className="text-sm text-gray-600">Get 15% off your first order</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer Banner */}
      <div className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-xl font-semibold mb-4">Shop with confidence</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4">
              <div className="mb-2 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium">Fast Delivery</h4>
              <p className="text-sm text-gray-400">Free shipping on orders over $50</p>
            </div>
            <div className="p-4">
              <div className="mb-2 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-medium">Secure Payment</h4>
              <p className="text-sm text-gray-400">100% secure payment methods</p>
            </div>
            <div className="p-4">
              <div className="mb-2 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h4 className="font-medium">Money-Back Guarantee</h4>
              <p className="text-sm text-gray-400">30-day return policy</p>
            </div>
            <div className="p-4">
              <div className="mb-2 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-medium">24/7 Support</h4>
              <p className="text-sm text-gray-400">Customer service available 24/7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;