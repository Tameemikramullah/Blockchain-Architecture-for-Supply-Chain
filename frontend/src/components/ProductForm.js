import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { ExclamationCircleIcon, CheckCircleIcon } from "@heroicons/react/solid";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    product_code: "",
    name: "",
    price: "",
    quantity: "",
    location: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [locations, setLocations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/delivery/locations/",
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setErrorMessage("Failed to load locations.");
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const validateProductCode = (value) => {
    return /^\d+$/.test(value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateProductCode(formData.product_code)) {
      setErrorMessage("Product code must be an integer.");
      return;
    }

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setErrorMessage("No access token found. Please login.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:8000/store/products/create-product/",
        data: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response.data);

      setSuccessMessage("Product created successfully.");
      setFormData({
        product_code: "",
        name: "",
        price: "",
        quantity: "",
        location: "",
      });
    } catch (error) {
      console.error("Error creating product:", error);
      setErrorMessage("Failed to create product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-white/70 bg-[#f9f4ed] px-4 py-3 text-[#4f3f32] shadow-[inset_4px_4px_8px_rgba(163,138,100,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] outline-none transition-all duration-300 placeholder:text-[#a7927f] focus:border-[#c9b39f]";

  const labelClass = "mb-2 block text-sm font-semibold text-[#5d4b3c]";

  const actionBtnBase =
    "w-full rounded-full px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4ede4] via-[#efe6db] to-[#e8dccf]">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-[0_20px_60px_rgba(124,92,68,0.18)] backdrop-blur-md">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <aside className="border-b border-white/50 bg-[#f7f1e8] p-8 md:border-b-0 md:border-r">
              <span className="inline-flex rounded-full border border-[#c9b39f]/60 bg-[#f7f1e8] px-4 py-2 text-sm font-semibold text-[#6a5748] shadow-sm">
                Product Management
              </span>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[#4f3f32]">
                Create a new product
              </h1>

              <p className="mt-4 max-w-md text-base leading-7 text-[#6f6257]">
                Add products to your inventory with a code, name, price,
                quantity, and location so they are ready for tracking and order
                fulfillment.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-[#efe6db] p-4 shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                  <p className="text-sm font-semibold text-[#5d4b3c]">Tip</p>
                  <p className="mt-1 text-sm text-[#6f6257]">
                    Use a numeric product code that is easy to search and
                    identify.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#efe6db] p-4 shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                  <p className="text-sm font-semibold text-[#5d4b3c]">
                    Location
                  </p>
                  <p className="mt-1 text-sm text-[#6f6257]">
                    Assign a warehouse or delivery point to keep stock
                    organized.
                  </p>
                </div>
              </div>
            </aside>

            <section className="p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-[#5d4b3c]">
                  Product details
                </h2>
                <p className="mt-1 text-sm text-[#6f6257]">
                  Fill in the form below to create a product record.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                  <ExclamationCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0" />
                  <span className="text-sm font-medium">{successMessage}</span>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="grid gap-5 md:grid-cols-2"
              >
                <div>
                  <label className={labelClass} htmlFor="product_code">
                    Product Code
                  </label>
                  <input
                    id="product_code"
                    name="product_code"
                    type="text"
                    value={formData.product_code}
                    onChange={handleChange}
                    placeholder="e.g. 1001"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="name">
                    Product Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Wheat Flour"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="price">
                    Price
                  </label>
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 250"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass} htmlFor="quantity">
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 20"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="location">
                    Location
                  </label>
                  <div className="relative">
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-12`}
                      required
                      disabled={isLoadingLocations}
                    >
                      <option value="">
                        {isLoadingLocations
                          ? "Loading locations..."
                          : "Select location"}
                      </option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#8a6e57]">
                      <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${actionBtnBase} bg-[#5d4b3c] text-white shadow-[8px_8px_18px_rgba(93,75,60,0.22)] hover:bg-[#4f3f32]`}
                  >
                    {isSubmitting ? "Submitting..." : "Create Product"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductForm;
