import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import Navbar from "./Navbar";
import {
  FaHistory,
  FaCalendarAlt,
  FaUser,
  FaHashtag,
  FaCheckCircle,
} from "react-icons/fa";

const CustomerOrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/order_flow/orders/order-history",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setOrderHistory(response.data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  // Helper function to return distinct clay status badge styles
  const getStatusBadgeStyles = (status) => {
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

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Claymorphic Dashboard Header */}
        <div className="mb-10 p-6 sm:p-8 rounded-[2rem] border border-white/80 bg-white/40 shadow-[0_20px_50px_rgba(124,92,68,0.08)] backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="p-3 rounded-2xl bg-[#efe6db] text-[#5d4b3c] shadow-sm">
              <FaHistory className="text-2xl" />
            </span>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#3a2e24]">
                Order Archives
              </h1>
              <p className="text-sm mt-1 text-[#6f6257]/80">
                Review complete operational history, temporal timelines, and
                dispatch tracking pipelines.
              </p>
            </div>
          </div>
        </div>

        {/* Main Ledger Content Block */}
        <div className="bg-white/40 border border-white/80 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl w-full">
          <div className="mb-6">
            <h2 className="text-xs uppercase tracking-widest font-black text-[#6f6257]/70">
              Historical Sequence Log
            </h2>
          </div>

          {orderHistory.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-white/60 bg-white/30 backdrop-blur-sm">
              <p className="text-[#6f6257] font-medium text-sm">
                No historical tracking entries found.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {orderHistory.map((order) => (
                <li
                  key={order.order_id || order.order_Id}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/70 border border-white/90 shadow-[0_8px_30px_rgb(124,92,68,0.03)] hover:shadow-[0_12px_40px_rgba(124,92,68,0.06)] transition-all duration-300"
                >
                  {/* Left Block: Core Metadata Identity */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    <div className="flex items-center gap-2">
                      <FaHashtag className="text-[#a38a64] text-xs flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                          Order reference
                        </p>
                        <p className="text-sm font-black text-[#3a2e24]">
                          ID: {order.order_id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUser className="text-[#a38a64] text-xs flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#6f6257]/60">
                          Client Profile
                        </p>
                        <p className="text-sm font-bold text-[#4f3f32]">
                          User #{order.customer}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Block: Timestamp & Status Capsules */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-[#5d4b3c]/5 pt-3 sm:pt-0">
                    <div className="flex items-center gap-2 bg-[#efe6db]/40 px-3.5 py-1.5 rounded-2xl border border-white/60 shadow-[inset_1px_1px_3px_rgba(124,92,68,0.04)]">
                      <FaCalendarAlt className="text-[#5d4b3c] text-xs flex-shrink-0" />
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-[#5d4b3c]/70">
                          Logged Date
                        </p>
                        <p className="text-xs font-bold text-[#5d4b3c]">
                          {new Date(order.order_date).toLocaleDateString(
                            undefined,
                            { dateStyle: "medium" },
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span
                        className={`px-3.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusBadgeStyles(order.status)} shadow-[0_2px_8px_rgba(0,0,0,0.01)]`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerOrderHistory;
