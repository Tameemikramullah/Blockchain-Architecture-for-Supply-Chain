import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import {
  AiOutlineExclamationCircle,
  AiOutlineClockCircle,
} from "react-icons/ai";

const PendingOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch pending orders
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/order_flow/orders/pending-orders/",
        );
        setOrders(response.data);
      } catch (error) {
        setError("Failed to fetch pending orders.");
      }
    };
    fetchPendingOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee6] via-[#eee4da] to-[#e4d7ca] pb-16 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Main Hero Container - Glassy Clay Container */}
        <div className="border border-white/80 bg-white/40 p-6 sm:p-10 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl w-full">
          {/* Header Block */}
          <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-[#5d4b3c]/10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-[#3a2e24] flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-[#efe6db] text-[#5d4b3c] shadow-[4px_4px_10px_rgba(163,138,100,0.15),inset_1px_1px_2px_white]">
                  <AiOutlineExclamationCircle className="text-2xl" />
                </span>
                Pending Pipeline
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6f6257]/90 max-w-2xl">
                These orders require immediate processing. You can transition
                their status indicators directly via the operational progress
                link.
              </p>
            </div>
          </div>

          {/* Error State Banner */}
          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50/50 px-5 py-4 text-sm font-semibold text-red-800 shadow-sm backdrop-blur-sm">
              {error}
            </div>
          )}

          {/* Orders Render Stream */}
          {orders.length === 0 ? (
            <div className="w-full text-center py-16 rounded-2xl border border-white/60 bg-[#fbf9f6]/60 shadow-[inset_2px_2px_6px_rgba(124,92,68,0.04)]">
              <p className="text-[#6f6257] font-medium text-lg">
                No pending orders at the moment.
              </p>
            </div>
          ) : (
            <ul className="space-y-6">
              {orders.map((order) => (
                <li
                  key={order.order_id}
                  className="group relative bg-[#fbf9f6] border border-white/80 p-6 rounded-[2rem] shadow-[0_15px_35px_rgba(124,92,68,0.06),inset_1px_1px_0px_white] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_45px_rgba(124,92,68,0.1)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                >
                  {/* Order Meta Data Block */}
                  <div className="w-full sm:w-auto space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="inline-flex items-center rounded-full bg-[#5d4b3c] px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-[#f7f1e8] shadow-sm">
                        ID: {order.order_id}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-[#6f6257]/60">
                        {order.order_date}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 pt-1">
                      <p className="text-sm text-[#6f6257]">
                        <span className="font-semibold text-[#4f3f32]">
                          Customer:
                        </span>{" "}
                        {order.customer_name}
                      </p>
                      <p className="text-sm text-[#6f6257]">
                        <span className="font-semibold text-[#4f3f32]">
                          Total Valuation:
                        </span>{" "}
                        <span className="font-bold text-[#5d4b3c]">
                          ${order.total_cost}
                        </span>
                      </p>
                    </div>

                    {/* Products Sub-Groove Panel */}
                    <div className="mt-4 rounded-2xl bg-[#efe6db]/50 p-4 shadow-[inset_2px_2px_6px_rgba(124,92,68,0.06)] border border-white/40">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-[#4f3f32] mb-2">
                        Manifest Details
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#6f6257]">
                        {order.order_items.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-white/80 text-xs font-medium text-[#4f3f32]"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#5d4b3c]" />
                            {item.product.name}
                            <span className="ml-auto font-bold bg-[#efe6db] px-2 py-0.5 rounded-md text-[10px] text-[#5d4b3c]">
                              x{item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Action/Status Icon Block */}
                  <div className="flex sm:flex-col items-center justify-between sm:justify-center w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-[#5d4b3c]/5">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#a38a64]">
                      <AiOutlineClockCircle className="text-xl animate-pulse" />
                      Awaiting Staff
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

export default PendingOrders;
