"use client";
import { toast } from "react-hot-toast";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import Cart from "./Cart";
import axios from "axios";
import { useCart } from "../app/context/CartContext"; // Import useCart
import ProfileModal from "./ProfileModal";

const API_URL = "http://ec2-51-20-188-242.eu-north-1.compute.amazonaws.com/api/auth/api/auth";

const Navbar = () => {
  const { clientTotalItems } = useCart(); // Get total items from cart
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const storedToken = localStorage.getItem("usertoken");
    if (storedToken) {
      setToken(storedToken);
      setIsSignedIn(true);
    }
  }, []);


  const toggleProfile = () => {
    if (token) {
    setIsSignedIn(true)
    setIsOpen(true)
    } else {
       setIsSignedIn(false)
      setIsProfileOpen(true);
    }
  };


  const toggleSignup = () => {
    setIsProfileOpen(false);
    setIsSignUpOpen(!isSignUpOpen);
  };

  const toggleLogin = () => {
    setIsSignUpOpen(false);
    setIsProfileOpen(!isProfileOpen);
  };

  const handleSignIn = async (userCredentials) => {
    try {
      const response = await axios.post(`${API_URL}/signin`, userCredentials);
      if (response.data.success) {
        localStorage.setItem("usertoken", response.data.token);
        setIsSignedIn(true);
        setIsProfileOpen(false);
        toast.success("Connexion réussie !");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Échec de la connexion. Veuillez réessayer.");
    }
  };

  const handleSignUp = async (userCredentials) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, userCredentials);
      if (response.data.success) {
        toast.success("Inscription réussie !");
        setIsSignUpOpen(false);
      } else {
        toast.error(response.data.message || "Échec de l'inscription.");
      }
    } catch (error) {
      toast.error("Échec de l'inscription. Veuillez réessayer.");
    }
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
       
             <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">TechHub</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
             <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
             <Link href="/categories" className="text-gray-700 hover:text-blue-600">Categories</Link>
             <Link href="/NewArrivals" className="text-gray-700 hover:text-blue-600">New Arrivals</Link>
             <Link href="/contact" className="text-gray-700 hover:text-blue-600">Contact</Link>
            
          </div>
          <div className="hidden md:flex items-center space-x-4">
           

            {/* Cart Button with Badge */}
            <button className="relative focus:outline-none" onClick={handleCartToggle}>
              <FiShoppingCart size={24} />
              {clientTotalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {clientTotalItems}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={toggleProfile}
              className="bg-gray-300 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">Open profile</span>
              <FaUser />
            </button>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {isCartOpen && <Cart closeCart={() => setIsCartOpen(false)} toggleLogin={toggleLogin} />}

      {/* Login Modal */}
      {isProfileOpen && !isSignedIn && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <LoginModal
              onClose={() => setIsProfileOpen(false)}
              onSignIn={handleSignIn}
              onSignupClick={toggleSignup}
            />
          </div>
        </>
      )}

      {/* Sign-Up Modal */}
      {isSignUpOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <SignUpModal
              onClose={() => setIsSignUpOpen(false)}
              onSignUp={handleSignUp}
              onLoginClick={toggleLogin}
            />
          </div>
        </>
      )}
      {isOpen && isSignedIn && (
        <>
       
         <div className="fixed right-0 mt-1 flex items-center justify-center z-50">
            <ProfileModal
              onClose={() => setIsOpen(false)
                
              }
              
            />
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
