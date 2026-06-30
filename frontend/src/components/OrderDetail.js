import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import Table from "./Table";
import Navbar from "./Navbar";
import { FaSearch } from "react-icons/fa";

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/order_flow/orders/order-details",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setOrderDetails(response.data);
        setFilteredOrders(response.data);
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  useEffect(() => {
    const results = orderDetails.filter((order) =>
      order.order.order_id.toString().includes(searchTerm),
    );
    setFilteredOrders(results);
  }, [searchTerm, orderDetails]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee6] via-[#eee4da] to-[#e4d7ca] pb-16 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header and Search Area - Floating minimal block */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[#3a2e24]">
              Order Dashboard
            </h1>
            <p className="text-sm mt-1 text-[#6f6257]/80">
              Manage, trace, and audit live logistics streams.
            </p>
          </div>

          {/* Super Clean Pill Search */}
          <div className="flex items-center w-full md:w-80 rounded-full border border-white/80 bg-white/50 px-5 py-3 shadow-[0_8px_24px_rgba(124,92,68,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8)] focus-within:bg-white focus-within:shadow-[0_12px_28px_rgba(124,92,68,0.1)] transition-all duration-300">
            <FaSearch className="text-[#6f6257]/60 mr-3 text-sm" />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none w-full text-sm font-medium text-[#4f3f32] placeholder-[#6f6257]/50"
            />
          </div>
        </div>

        {/* Orders Stream */}
        <div className="space-y-10">
          {filteredOrders.length === 0 ? (
            <div className="w-full text-center py-16 rounded-[2rem] border border-white/60 bg-white/30 backdrop-blur-md shadow-[0_20px_40px_rgba(124,92,68,0.05)]">
              <p className="text-[#6f6257] font-medium">
                No active orders match your search.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.order.id}
                className="group relative bg-white/40 border border-white/80 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl w-full transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_80px_rgba(124,92,68,0.18)]"
              >
                {/* Accent Badge for the Modern Card */}
                <div className="absolute -top-3 left-8 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-[#5d4b3c] px-4 py-1 text-xs font-bold tracking-wider uppercase text-[#f7f1e8] shadow-md">
                  ID: {order.order.order_id}
                </div>

                {/* 2-Column Responsive Layout for Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 mb-6">
                  {/* Order Summary Block */}
                  <div className="flex flex-col justify-between rounded-2xl border border-white/60 bg-[#fbf9f6] p-5 shadow-[4px_4px_12px_rgba(163,138,100,0.04)]">
                    <div>
                      <h2 className="text-xs uppercase tracking-widest font-bold text-[#6f6257]/70 mb-3">
                        Metadata
                      </h2>
                      <div className="overflow-hidden rounded-xl border border-[#efe6db]/60 bg-white/50">
                        <Table
                          data={[
                            {
                              order_id: order.order.order_id,
                              order_date: order.order.order_date,
                              total_cost: `$${order.total_cost.toFixed(2)}`,
                            },
                          ]}
                          columns={[
                            { key: "order_id", label: "Order ID" },
                            { key: "order_date", label: "Date" },
                            { key: "total_cost", label: "Total Cost" },
                          ]}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Customer Details Block */}
                  <div className="flex flex-col justify-between rounded-2xl border border-white/60 bg-[#fbf9f6] p-5 shadow-[4px_4px_12px_rgba(163,138,100,0.04)]">
                    <div>
                      <h3 className="text-xs uppercase tracking-widest font-bold text-[#6f6257]/70 mb-3">
                        Client Information
                      </h3>
                      <div className="overflow-hidden rounded-xl border border-[#efe6db]/60 bg-white/50">
                        <Table
                          data={[
                            {
                              customer_name: order.customer_name,
                              customer_email: order.customer_email,
                              customer_phone: order.customer_phone,
                            },
                          ]}
                          columns={[
                            { key: "customer_name", label: "Name" },
                            { key: "customer_email", label: "Email" },
                            { key: "customer_phone", label: "Phone" },
                          ]}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Block - The Focus Area (Soft Inset Groove) */}
                <div className="rounded-[1.75rem] bg-[#efe6db]/60 p-5 shadow-[inset_3px_3px_8px_rgba(124,92,68,0.08),inset_-3px_-3px_8px_rgba(255,255,255,0.7)] border border-white/40">
                  <h3 className="text-xs uppercase tracking-widest font-bold text-[#4f3f32] mb-3">
                    Manifest Items
                  </h3>
                  <div className="overflow-hidden rounded-xl border border-white/80 bg-white/70 shadow-sm">
                    <Table
                      data={order.products.map((product) => ({
                        name: product.name,
                        quantity: product.quantity,
                        price: `$${product.price.toFixed(2)}`,
                      }))}
                      columns={[
                        { key: "name", label: "Product Name" },
                        { key: "quantity", label: "Quantity" },
                        { key: "price", label: "Price" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderDetails;
