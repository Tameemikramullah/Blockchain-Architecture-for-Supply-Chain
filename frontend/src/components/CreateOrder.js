import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useUser } from "./UserContext";
import { FaPlus, FaMinus, FaTrash, FaShoppingBag } from "react-icons/fa";

const CreateOrder = () => {
  const { user } = useUser();
  const [items, setItems] = useState([{ product_code: "", quantity: 1 }]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/store/products/");
      setProducts(response.data);
    } catch (error) {
      setError("Error fetching products");
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleQuantityChange = (index, change) => {
    const updatedItems = [...items];
    updatedItems[index].quantity = Math.max(
      updatedItems[index].quantity + change,
      1,
    );
    setItems(updatedItems);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { product_code: "", quantity: 1 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("accessToken");
      await axios.post(
        "http://localhost:8000/order_flow/orders/create-order/",
        { items },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      setSuccess("Order created successfully!");
      setItems([{ product_code: "", quantity: 1 }]);
    } catch (error) {
      setError("Failed to create order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee6] via-[#eee4da] to-[#e4d7ca] pb-16 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Master Glass-Clay Container Card */}
        <div className="border border-white/80 bg-white/40 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl w-full">
          {/* Header Block */}
          <div className="mb-8 pb-6 border-b border-[#5d4b3c]/10">
            <h2 className="text-3xl font-black tracking-tight text-[#3a2e24] flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-[#efe6db] text-[#5d4b3c] shadow-[4px_4px_10px_rgba(163,138,100,0.15)]">
                <FaShoppingBag className="text-xl" />
              </span>
              Create New Order
            </h2>
            <p className="mt-2 text-sm text-[#6f6257]/80">
              Compile items and quantities into the pipeline sequence below.
            </p>
          </div>

          {/* Status Message Banners */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/50 px-5 py-4 text-sm font-semibold text-red-800 shadow-sm animate-fadeIn">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 px-5 py-4 text-sm font-semibold text-emerald-800 shadow-sm animate-fadeIn">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="text-xs uppercase tracking-widest font-bold text-[#6f6257]/80 mb-1 block">
              Order Items Blueprint:
            </label>

            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-4 rounded-3xl bg-[#efe6db]/40 border border-white/40 shadow-[inset_2px_2px_6px_rgba(124,92,68,0.04)] animate-fadeIn"
              >
                {/* Product Selection Menu */}
                <div className="relative flex-grow">
                  <select
                    value={item.product_code}
                    onChange={(e) =>
                      handleItemChange(index, "product_code", e.target.value)
                    }
                    className="block appearance-none w-full rounded-full border border-white/80 bg-white/70 px-5 py-3 text-sm font-medium text-[#4f3f32] shadow-[0_4px_12px_rgba(124,92,68,0.02),inset_1px_1px_2px_white] focus:bg-white focus:outline-none transition-all duration-300"
                  >
                    <option value="">Select Product...</option>
                    {products.map((product) => (
                      <option
                        key={product.product_code}
                        value={product.product_code}
                      >
                        {product.name}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#6f6257]">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {/* Pill-Shaped Increment Section */}
                <div className="flex items-center justify-between rounded-full border border-white/80 bg-white/70 p-1 shadow-[0_4px_12px_rgba(124,92,68,0.02)]">
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(index, -1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#6f6257] hover:bg-[#efe6db] hover:text-[#5d4b3c] transition-all duration-200"
                  >
                    <FaMinus className="text-xs" />
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    readOnly
                    className="w-12 text-center bg-transparent text-sm font-bold text-[#4f3f32] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(index, 1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-[#6f6257] hover:bg-[#efe6db] hover:text-[#5d4b3c] transition-all duration-200"
                  >
                    <FaPlus className="text-xs" />
                  </button>
                </div>

                {/* Destructive Deletion Action */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="flex h-11 w-11 items-center justify-center flex-shrink-0 rounded-full border border-red-100 bg-red-50/40 text-red-600 hover:bg-red-50 hover:text-red-700 shadow-sm transition-all duration-200"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                )}
              </div>
            ))}

            {/* Sub-Action: Append Row Item */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleAddItem}
                className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/50 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#6f6257] shadow-sm hover:bg-white hover:text-[#5d4b3c] transition-all duration-200"
              >
                <FaPlus className="text-[10px]" /> Add Another Item
              </button>
            </div>

            {/* Master Submission Segment */}
            <div className="flex justify-end pt-8 border-t border-[#5d4b3c]/10">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-white/40 bg-[#5d4b3c] px-8 py-3.5 font-bold uppercase tracking-wider text-xs text-[#f7f1e8] shadow-[0_12px_24px_rgba(93,75,60,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4f3f32] hover:shadow-[0_16px_32px_rgba(93,75,60,0.3)]"
              >
                Submit Order Blueprint
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CreateOrder;
