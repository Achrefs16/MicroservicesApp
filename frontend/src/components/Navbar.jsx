"use client";
import { toast } from "react-hot-toast";
import React, { useState } from "react";
import Link from "next/link";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import Cart from "./Cart"; // Import the Cart component
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Replace with your actual backend URL

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Toggle profile modal
  const toggleProfile = () => {
    if (isSignedIn) {
      window.location.href = "/profile"; // Redirect to profile page if signed in
    } else {
      setIsProfileOpen(true); // Show login modal
    }
  };

  // Toggle sign-up modal
  const toggleSignup = () => {
    setIsProfileOpen(false);
    setIsSignUpOpen(!isSignUpOpen);
  };

  // Toggle login modal
  const toggleLogin = () => {
    setIsSignUpOpen(false);
    setIsProfileOpen(!isProfileOpen);
  };

  // Handle sign-in process and make API call
  const handleSignIn = async (userCredentials) => {
  try {
    const response = await axios.post(`${API_URL}/signin`, userCredentials);
    if (response.data.success) {
       
        
      // Store the JWT token in localStorage or cookies
      localStorage.setItem('token', response.data.token);

      // Update the state to indicate the user is signed in
      setIsSignedIn(true);
      setIsProfileOpen(false);

      // Show success message
      toast.success("Connexion réussie !");
    } else {
      toast.error("Identifiants invalides.");
    }
  } catch (error) {
    console.error(error);  // Log error for debugging
    toast.error("Échec de la connexion. Veuillez réessayer.");
  }
};
  // Handle sign-up process and make API call
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

  // Toggle cart modal visibility
  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-lg font-bold">
              All Products
            </Link>
            <Link href="/" className="text-lg font-bold">
              Contact
            </Link>
            <Link href="/" className="text-lg font-bold">
              About
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="px-3 py-2 rounded-md text-sm bg-gray-300 focus:outline-none focus:ring focus:ring-gray-600"
              />
            </div>
            <button className="focus:outline-none" onClick={handleCartToggle}>
              <FiShoppingCart size={24} />
            </button>
            <button
              onClick={toggleProfile}
              className="bg-gray-300 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span className="sr-only">Open profile</span>
              <FaUser />
            </button>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {isCartOpen && <Cart closeCart={() => setIsCartOpen(false)} />}

      {/* Display the login modal */}
      {isProfileOpen && !isSignedIn && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-10" />
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <LoginModal
              onClose={() => setIsProfileOpen(false)}
              onSignIn={handleSignIn}
              onSignupClick={toggleSignup}
            />
          </div>
        </>
      )}

      {/* Display the sign-up modal */}
      {isSignUpOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-10" />
          <div className="fixed inset-0 flex items-center justify-center z-20">
            <SignUpModal
              onClose={() => setIsSignUpOpen(false)}
              onSignUp={handleSignUp}
              onLoginClick={toggleLogin}
            />
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
