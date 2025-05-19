import Navbar from "@/components/Navbar";
import React from 'react'

const page = () => {
const products = [
    {
      id: 1,
      name: 'Wireless Noise-Canceling Headphones',
      price: 299.99,
      image: 'https://via.placeholder.com/400x300?text=Headphones+Pro+X',
      category: 'Audio',
      isNew: true,
    },
    {
      id: 2,
      name: '8K Ultra HD Smart TV',
      price: 2499.99,
      image: 'https://via.placeholder.com/400x300?text=8K+Smart+TV',
      category: 'TV & Home Theater',
      isNew: true,
    },
    {
      id: 3,
      name: 'Foldable Smartphone',
      price: 1799.99,
      image: 'https://via.placeholder.com/400x300?text=Fold+Phone+Z',
      category: 'Mobile',
      isNew: true,
    },
    {
      id: 4,
      name: 'Gaming Laptop',
      price: 1899.99,
      image: 'https://via.placeholder.com/400x300?text=Gamer+Pro+17',
      category: 'Computers',
      isNew: true,
    },
    {
      id: 5,
      name: 'Smart Fitness Watch',
      price: 199.99,
      image: 'https://via.placeholder.com/400x300?text=Fitness+Watch+2',
      category: 'Wearables',
      isNew: true,
    },
    {
      id: 6,
      name: '4K Action Camera',
      price: 399.99,
      image: 'https://via.placeholder.com/400x300?text=ActionCam+4K',
      category: 'Cameras',
      isNew: true,
    },
    {
      id: 7,
      name: 'Robot Vacuum Cleaner',
      price: 599.99,
      image: 'https://via.placeholder.com/400x300?text=RoboClean+V3',
      category: 'Smart Home',
      isNew: true,
    },
    {
      id: 8,
      name: 'Wireless Charging Pad',
      price: 49.99,
      image: 'https://via.placeholder.com/400x300?text=Qi+Charger+Max',
      category: 'Accessories',
      isNew: true,
    },
  ];

  return (
    <> 
   <Navbar /> 
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            New Arrivals
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our latest electronics and gadgets
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* New Badge */}
              {product.isNew && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  New!
                </div>
              )}

              {/* Product Image */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-60 object-cover"
              />

              {/* Product Details */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-gray-500 text-sm">
                    {product.category}
                  </span>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {product.name}
                  </h2>
                </div>

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <p className="text-2xl font-bold text-gray-900">
                    ${product.price}
                  </p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
export default page