import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
  FaBoxOpen,
  FaCalendarAlt,
  FaUser,
  FaList,
  FaSyncAlt,
} from "react-icons/fa";

const UpdateOrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch all orders
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/order_flow/orders/order-details/",
        );
        setOrders(response.data);
      } catch (error) {
        setError("Failed to fetch orders.");
      }
    };
    fetchOrders();
  }, []);

  const handleOrderSelection = (order) => {
    setSelectedOrder(order);
    setStatus(order.order.status);
  };

  const handleStatusChange = async () => {
    try {
      await axios.patch(
        `http://localhost:8000/order_flow/orders/${selectedOrder.order.order_id}/update-status/`,
        { status },
      );
      setSelectedOrder({
        ...selectedOrder,
        order: { ...selectedOrder.order, status },
      });
    } catch (error) {
      setError("Failed to update order status.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee6] via-[#eee4da] to-[#e4d7ca] pb-16 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Master Glass-Clay Card */}
        <div className="border border-white/80 bg-white/40 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl w-full">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-[#5d4b3c]/10">
            <h2 className="text-3xl font-black tracking-tight text-[#3a2e24] flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-[#efe6db] text-[#5d4b3c] shadow-[4px_4px_10px_rgba(163,138,100,0.15)]">
                <FaSyncAlt className="text-xl" />
              </span>
              Update Order Status
            </h2>
            <p className="mt-2 text-sm text-[#6f6257]/80">
              Select a transaction from the active pipeline to alter its
              logistics tracking phase.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/50 px-5 py-4 text-sm font-semibold text-red-800 shadow-sm">
              {error}
            </div>
          )}

          {/* Order Dropdown Selection */}
          <div className="mb-8">
            <label className="text-xs uppercase tracking-widest font-bold text-[#6f6257]/80 mb-3 flex items-center gap-2">
              <FaList className="text-xs" /> Select Customer Order:
            </label>
            <div className="relative">
              <select
                onChange={(e) =>
                  handleOrderSelection(
                    e.target.value ? JSON.parse(e.target.value) : null,
                  )
                }
                className="block appearance-none w-full rounded-full border border-white/80 bg-white/60 px-5 py-3.5 pr-10 text-sm font-medium text-[#4f3f32] shadow-[0_8px_24px_rgba(124,92,68,0.04),inset_2px_2px_4px_white] focus:bg-white focus:outline-none transition-all duration-300"
              >
                <option value="">Select an active sequence...</option>
                {orders.map((order) => (
                  <option
                    key={order.order.order_id}
                    value={JSON.stringify(order)}
                  >
                    ID: {order.order.order_id} — {order.customer_name}
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
          </div>

          {selectedOrder && (
            <div className="space-y-6 animate-fadeIn">
              {/* Metadata Overview Matrix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-[#fbf9f6] p-4 shadow-sm">
                  <FaBoxOpen className="text-[#a38a64] text-lg flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                      Order ID
                    </p>
                    <p className="text-sm font-bold text-[#4f3f32]">
                      {selectedOrder.order.order_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-[#fbf9f6] p-4 shadow-sm">
                  <FaUser className="text-[#a38a64] text-lg flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                      Customer
                    </p>
                    <p className="text-sm font-bold text-[#4f3f32]">
                      {selectedOrder.customer_name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-[#fbf9f6] p-4 shadow-sm">
                  <FaCalendarAlt className="text-[#a38a64] text-lg flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                      Order Date
                    </p>
                    <p className="text-sm font-bold text-[#4f3f32]">
                      {selectedOrder.order.order_date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-white/60 bg-[#efe6db]/60 p-4 shadow-[inset_2px_2px_4px_rgba(124,92,68,0.05)]">
                  <FaSyncAlt className="text-[#5d4b3c] text-lg flex-shrink-0" />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5d4b3c]/80">
                      Current Status
                    </p>
                    <p className="text-sm font-extrabold capitalize text-[#5d4b3c]">
                      {selectedOrder.order.status}
                    </p>
                  </div>
                </div>
              </div>

              {/* Manifest Items Sub-Groove Panel */}
              <div className="rounded-[1.75rem] bg-[#efe6db]/40 p-5 shadow-[inset_3px_3px_8px_rgba(124,92,68,0.06)] border border-white/40">
                <label className="block text-xs uppercase tracking-widest font-bold text-[#4f3f32] mb-3">
                  Manifest Items Inventory:
                </label>
                <ul className="space-y-2">
                  {selectedOrder.products.map((product, index) => (
                    <li
                      key={`prod-${index}`}
                      className="flex items-center justify-between bg-white/70 px-4 py-2.5 rounded-xl border border-white/80 text-xs font-medium text-[#4f3f32] shadow-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#a38a64]" />
                        {product.name}
                      </span>
                      <span className="font-bold text-[#6f6257]">
                        ${product.price.toFixed(2)} ea
                      </span>
                    </li>
                  ))}
                  {selectedOrder.order_items.map((item, index) => (
                    <li
                      key={`item-${index}`}
                      className="flex items-center justify-between bg-white/70 px-4 py-2.5 rounded-xl border border-white/80 text-xs font-medium text-[#4f3f32] shadow-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#5d4b3c]" />
                        {item.product.name}
                      </span>
                      <span className="font-bold bg-[#efe6db] px-2 py-0.5 rounded-md text-[#5d4b3c]">
                        x{item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Dropdown Status Mutator Input */}
              <div>
                <label className="text-xs uppercase tracking-widest font-bold text-[#6f6257]/80 mb-3 flex items-center gap-2">
                  <FaSyncAlt className="text-xs" /> Assign Target Status:
                </label>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="block appearance-none w-full rounded-full border border-white/80 bg-white/60 px-5 py-3.5 pr-10 text-sm font-semibold capitalize text-[#4f3f32] shadow-[0_8px_24px_rgba(124,92,68,0.04),inset_2px_2px_4px_white] focus:bg-white focus:outline-none transition-all duration-300"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
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
              </div>

              {/* Action Button */}
              <button
                onClick={handleStatusChange}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-white/40 bg-[#5d4b3c] px-6 py-4 font-bold uppercase tracking-wider text-xs text-[#f7f1e8] shadow-[0_12px_24px_rgba(93,75,60,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4f3f32] hover:shadow-[0_16px_32px_rgba(93,75,60,0.3)]"
              >
                <FaSyncAlt className="text-xs animate-spin-slow" /> Push Status
                Transition
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UpdateOrderStatus;
