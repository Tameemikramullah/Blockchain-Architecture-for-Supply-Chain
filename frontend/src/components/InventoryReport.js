import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "./Table";
import Loader from "./Loader";
import Navbar from "./Navbar";
import { FaBoxes, FaHistory } from "react-icons/fa";

const InventoryReport = () => {
  const [inventoryReport, setInventoryReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInventoryReport = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/store/inventories/inventory-report/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        setInventoryReport(response.data);
      } catch (error) {
        console.error("Error fetching inventory report:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryReport();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!inventoryReport) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f5eee6] via-[#eee4da] to-[#e4d7ca]">
        <Navbar />
        <div className="flex items-center justify-center pt-24">
          <div className="text-center py-12 px-8 rounded-2xl border border-white/60 bg-white/30 backdrop-blur-md shadow-[0_20px_40px_rgba(124,92,68,0.05)]">
            <p className="text-[#6f6257] font-medium text-lg">
              No analytical metrics available.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { inventory_levels, order_history } = inventoryReport;

  const inventoryLevelsColumns = [
    { key: "product__name", label: "Product Name" },
    { key: "product__product_code", label: "Product Code" },
    { key: "quantity", label: "Quantity" },
  ];

  const orderHistoryColumns = [
    { key: "status", label: "Order Status" },
    { key: "count", label: "Count" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee6] via-[#eee4da] to-[#e4d7ca] pb-16 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Top Header Panel */}
        <div className="mb-10 p-6 sm:p-8 rounded-[2rem] border border-white/80 bg-white/40 shadow-[0_20px_50px_rgba(124,92,68,0.08)] backdrop-blur-md">
          <h1 className="text-4xl font-black tracking-tight text-[#3a2e24]">
            Inventory Analytics
          </h1>
          <p className="text-sm mt-1 text-[#6f6257]/80">
            Real-time assessment of operational data streams and lifecycle
            metrics.
          </p>
        </div>

        {/* Dashboard Grid Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Block: Inventory Levels (Takes 2 columns on wide view) */}
          <div className="lg:col-span-2 group bg-white/40 border border-white/80 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl transition-all duration-300">
            <div className="mb-6 flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#efe6db] text-[#5d4b3c] shadow-sm">
                <FaBoxes className="text-lg" />
              </span>
              <div>
                <h2 className="text-xs uppercase tracking-widest font-black text-[#6f6257]/70">
                  Current Assets
                </h2>
                <h3 className="text-xl font-bold text-[#3a2e24]">
                  Inventory Levels
                </h3>
              </div>
            </div>

            {/* Table Container - Nested inside a clay frame */}
            <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-[inset_1px_1px_4px_rgba(0,0,0,0.02)]">
              <Table data={inventory_levels} columns={inventoryLevelsColumns} />
            </div>
          </div>

          {/* Secondary Block: Order History Metrics */}
          <div className="group bg-white/40 border border-white/80 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl transition-all duration-300">
            <div className="mb-6 flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#efe6db] text-[#5d4b3c] shadow-sm">
                <FaHistory className="text-lg" />
              </span>
              <div>
                <h2 className="text-xs uppercase tracking-widest font-black text-[#6f6257]/70">
                  Pipeline Summary
                </h2>
                <h3 className="text-xl font-bold text-[#3a2e24]">
                  Order History
                </h3>
              </div>
            </div>

            {/* Inset pillow shading effect around secondary table data */}
            <div className="rounded-2xl bg-[#efe6db]/40 p-4 border border-white/40 shadow-[inset_3px_3px_8px_rgba(124,92,68,0.06),inset_-3px_-3px_8px_rgba(255,255,255,0.7)]">
              <div className="overflow-hidden rounded-xl border border-white/80 bg-white/70 shadow-sm">
                <Table data={order_history} columns={orderHistoryColumns} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InventoryReport;
