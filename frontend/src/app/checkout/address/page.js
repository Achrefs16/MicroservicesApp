"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAddress } from "../../context/AddressContext";
import Navbar from "../../../components/Navbar";

const CheckoutAddress = () => {
  const router = useRouter();
  const { saveAddress } = useAddress();
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    zip: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!/^\d{4}(-\d{3})?$/.test(formData.zip)) newErrors.zip = "Invalid ZIP code";
    return newErrors;
  };

  useEffect(() => {
    // Clear errors when user starts typing
    if (Object.keys(errors).length > 0) {
      setErrors({});
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await saveAddress(formData);
      router.push("/checkout/payment");
    } catch (error) {
      console.error("Failed to save address:", error);
      setErrors({ form: "Failed to save address. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-dvh">
      <Navbar />
      <main className="flex items-center justify-center  h-full bg-gray-100 p-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Shipping Details
          </h1>
          
          {errors.form && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="123 Main Street"
                value={formData.address}
                onChange={handleChange}
                autoComplete="address-line1"
                className={`w-full p-3 border ${
                  errors.address ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 ${
                  errors.address ? "focus:ring-red-500" : "focus:ring-blue-500"
                } transition duration-200`}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="New York"
                  value={formData.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  className={`w-full p-3 border ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    errors.city ? "focus:ring-red-500" : "focus:ring-blue-500"
                  } transition duration-200`}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="zip"
                  placeholder="10001"
                  value={formData.zip}
                  onChange={handleChange}
                  autoComplete="postal-code"
                  pattern="\d{4}(-\d{3})?"
                  className={`w-full p-3 border ${
                    errors.zip ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 ${
                    errors.zip ? "focus:ring-red-500" : "focus:ring-blue-500"
                  } transition duration-200`}
                />
                {errors.zip && (
                  <p className="text-red-500 text-sm mt-1">{errors.zip}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition duration-200 ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CheckoutAddress;