import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import Navbar from "./Navbar";
import {
  FaUser,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaBoxOpen,
  FaLayerGroup,
  FaTruckMoving,
} from "react-icons/fa";

const CustomerOrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/order_flow/orders/customer-order-details/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const formattedData = response.data.map((order) => ({
          ...order.order,
          order_items: order.order_items,
          total_cost: parseFloat(order.total_cost).toFixed(2),
        }));
        setOrderDetails(formattedData);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to fetch order details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  // Helper function to return distinct clay status badge styles
  const getStatusBadge = (status) => {
    const normalized = status?.toLowerCase() || "";
    if (normalized === "delivered") {
      return "bg-emerald-500/10 text-emerald-800 border-emerald-200/60";
    }
    if (normalized === "shipped") {
      return "bg-blue-500/10 text-blue-800 border-blue-200/60";
    }
    if (normalized === "processing") {
      return "bg-amber-500/10 text-amber-800 border-amber-200/60";
    }
    return "bg-neutral-500/10 text-neutral-700 border-neutral-200/60";
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee6] via-[#eee4da] to-[#e4d7ca] pb-16 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Claymorphic Layout Header Panel */}
        <div className="mb-10 p-6 sm:p-8 rounded-[2rem] border border-white/80 bg-white/40 shadow-[0_20px_50px_rgba(124,92,68,0.08)] backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="p-3 rounded-2xl bg-[#efe6db] text-[#5d4b3c] shadow-sm">
              <FaBoxOpen className="text-2xl" />
            </span>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#3a2e24]">
                Customer Logs
              </h1>
              <p className="text-sm mt-1 text-[#6f6257]/80">
                Audit complete history of item allocations, logistics pricing,
                and pipeline fulfillment states.
              </p>
            </div>
          </div>
        </div>

        {/* Dynamic State Layout Containers */}
        {error ? (
          <div className="w-full text-center py-12 rounded-[2rem] border border-red-200 bg-red-50/50 backdrop-blur-sm px-6">
            <p className="text-red-800 font-semibold text-sm">{error}</p>
          </div>
        ) : orderDetails.length === 0 ? (
          <div className="w-full text-center py-12 rounded-[2rem] border border-white/80 bg-white/30 backdrop-blur-sm px-6">
            <p className="text-[#6f6257] font-medium text-base">
              No distribution invoices logged in system pipeline.
            </p>
          </div>
        ) : (
          /* Main Master Card Layout block wrapping the clean grid */
          <div className="bg-white/40 border border-white/80 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl space-y-6">
            <div className="mb-2">
              <h2 className="text-xs uppercase tracking-widest font-black text-[#6f6257]/70">
                Active Order Ledger Manifest
              </h2>
            </div>

            {/* Structured Table Alternative Matrix Grid */}
            <div className="space-y-4">
              {orderDetails.map((order) =>
                order.order_items.map((item) => {
                  const combinedTotal = (
                    parseFloat(order.total_cost) +
                    parseFloat(item.delivery_fee || 0)
                  ).toFixed(2);

                  return (
                    <div
                      key={`${order.order_id}-${item.id}`}
                      className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white/70 border border-white/90 shadow-[0_8px_30px_rgb(124,92,68,0.03)] hover:shadow-[0_12px_40px_rgba(124,92,68,0.06)] transition-all duration-300"
                    >
                      {/* Left Block: Identity Keys */}
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2.5">
                          <span className="h-2 w-2 rounded-full bg-[#5d4b3c]" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                              Order ID
                            </p>
                            <p className="text-sm font-black text-[#3a2e24]">
                              #{order.order_id}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <FaUser className="text-[#a38a64] text-xs flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                              Customer
                            </p>
                            <p className="text-sm font-bold text-[#4f3f32]">
                              ID: {order.customer}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <FaCalendarAlt className="text-[#a38a64] text-xs flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                              Order Date
                            </p>
                            <p className="text-sm font-medium text-[#4f3f32]">
                              {order.order_date}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Middle Block: Product Composition Metadata */}
                      <div className="grid grid-cols-2 sm:flex sm:items-center gap-x-6 gap-y-2 border-t md:border-t-0 border-[#5d4b3c]/5 pt-3 md:pt-0">
                        <div className="flex items-center gap-2.5">
                          <FaLayerGroup className="text-[#a38a64] text-xs flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                              Product SKU
                            </p>
                            <p className="text-sm font-bold text-[#4f3f32]">
                              #{item.product}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                              Quantity
                            </p>
                            <p className="text-sm font-extrabold text-[#5d4b3c] bg-[#efe6db] px-2 py-0.5 rounded-md text-center text-xs">
                              x{item.quantity}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <FaTruckMoving className="text-[#a38a64] text-xs flex-shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                              Delivery Fee
                            </p>
                            <p className="text-sm font-medium text-[#4f3f32]">
                              ${parseFloat(item.delivery_fee || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Currency Total & Clean Pill Badges */}
                      <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 border-[#5d4b3c]/5 pt-3 md:pt-0">
                        <div className="flex items-center gap-2 bg-[#efe6db]/40 px-3.5 py-1.5 rounded-2xl border border-white/60 shadow-[inset_1px_1px_3px_rgba(124,92,68,0.04)]">
                          <FaMoneyBillWave className="text-[#5d4b3c] text-xs flex-shrink-0" />
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-wider text-[#5d4b3c]/70">
                              Gross Total
                            </p>
                            <p className="text-sm font-extrabold text-[#5d4b3c]">
                              ${combinedTotal}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end">
                          <span
                            className={`px-3 py-1 rounded-full border text-xs font-black uppercase tracking-widest ${getStatusBadge(order.status)} shadow-[0_2px_8px_rgba(0,0,0,0.01)]`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }),
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerOrderDetails;
