import { useEffect, useState } from 'react';
import { Cog6ToothIcon, ArrowLeftOnRectangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function ProfileModal({onClose}) {

const handleLogout=()=>{
 localStorage.removeItem('usertoken');
}
  return (
    <div>
    
     
          {/* Modal Container */}
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 animate-scale-in">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Account Options</h3>
              <button
                onClick={() => onClose()}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Options List */}
            <div className="space-y-2">
              <button
                className="w-full flex items-center p-3 space-x-3 hover:bg-gray-50 rounded-lg transition-colors"
                onClick={() => {
                  // Handle settings click
                  console.log('Settings clicked');
                 onClose();
                }}
              >
                <Cog6ToothIcon className="w-5 h-5 text-gray-700" />
                <span className="text-gray-700">Settings</span>
              </button>

              <button
                className="w-full flex items-center p-3 space-x-3 hover:bg-gray-50 rounded-lg transition-colors text-red-600"
                onClick={() => {
                  // Handle logout click
                  handleLogout();
                  onClose();
                }}
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        
     
    </div>
  );
}