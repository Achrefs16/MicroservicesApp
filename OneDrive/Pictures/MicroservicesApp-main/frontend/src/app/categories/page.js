import Navbar from "@/components/Navbar";
import React from 'react'

const page = () => {
  const categories = [
    { 
      id: 1,
      name: 'Mobile Phones & Accessories',
      description: 'Latest smartphones, cases, chargers & more',
      image: 'https://via.placeholder.com/400x300?text=Phones+Accessories'
    },
    {
      id: 2,
      name: 'Laptops & Computers',
      description: 'Laptops, desktops, monitors & peripherals',
      image: 'https://via.placeholder.com/400x300?text=Laptops+Computers'
    },
    {
      id: 3,
      name: 'Audio & Headphones',
      description: 'Wireless earbuds, speakers & sound systems',
      image: 'https://via.placeholder.com/400x300?text=Audio+Headphones'
    },
    {
      id: 4,
      name: 'Smart Home Devices',
      description: 'Smart speakers, security cameras & automation',
      image: 'https://via.placeholder.com/400x300?text=Smart+Home'
    },
    {
      id: 5,
      name: 'Wearable Technology',
      description: 'Smartwatches, fitness trackers & VR gear',
      image: 'https://via.placeholder.com/400x300?text=Wearables'
    },
    {
      id: 6,
      name: 'TV & Home Theater',
      description: 'Smart TVs, soundbars & streaming devices',
      image: 'https://via.placeholder.com/400x300?text=TVs+Theater'
    },
    {
      id: 7,
      name: 'Gaming & Esports',
      description: 'Consoles, gaming PCs & accessories',
      image: 'https://via.placeholder.com/400x300?text=Gaming+Gear'
    },
    {
      id: 8,
      name: 'Cameras & Drones',
      description: 'DSLRs, action cams & photography gear',
      image: 'https://via.placeholder.com/400x300?text=Cameras+Drones'
    },
    {
      id: 9,
      name: 'Computer Accessories',
      description: 'Keyboards, mice & external storage',
      image: 'https://via.placeholder.com/400x300?text=PC+Accessories'
    },
    {
      id: 10,
      name: 'Networking & Connectivity',
      description: 'Routers, Wi-Fi extenders & cables',
      image: 'https://via.placeholder.com/400x300?text=Networking'
    }
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center border-b-2 pb-4">
        Categories
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img 
              src={category.image} 
              alt={category.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {category.name}
              </h2>
              <p className="text-gray-600 mb-4">
                {category.description}
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default page