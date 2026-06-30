import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";
import Table from "./Table";
import Navbar from "./Navbar";
import { FaUserFriends } from "react-icons/fa";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8000/api/customers/",
        );
        setCustomers(response.data);
      } catch (err) {
        setError("An error occurred while fetching customers.");
        console.error(err);
      }
      setLoading(false);
    };

    fetchCustomers();
  }, []);

  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    // Add more columns as needed
  ];

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee6] via-[#eee4da] to-[#e4d7ca] pb-16 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Claymorphic Dashboard Header */}
        <div className="mb-10 p-6 sm:p-8 rounded-[2rem] border border-white/80 bg-white/40 shadow-[0_20px_50px_rgba(124,92,68,0.08)] backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="p-3 rounded-2xl bg-[#efe6db] text-[#5d4b3c] shadow-sm">
              <FaUserFriends className="text-2xl" />
            </span>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#3a2e24]">
                Customer Registry
              </h1>
              <p className="text-sm mt-1 text-[#6f6257]/80">
                View, audit, and coordinate client profiles across operations.
              </p>
            </div>
          </div>
        </div>

        {/* Error Handling State */}
        {error ? (
          <div className="w-full text-center py-12 rounded-[2rem] border border-red-200 bg-red-50/50 backdrop-blur-sm px-6">
            <p className="text-red-800 font-semibold text-sm">{error}</p>
          </div>
        ) : (
          /* Main Registry Content Block */
          <div className="bg-white/40 border border-white/80 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl w-full transition-all duration-300">
            <div className="mb-4">
              <h2 className="text-xs uppercase tracking-widest font-black text-[#6f6257]/70">
                Database Records
              </h2>
            </div>

            {/* Table Container - Wrapped inside an elegant clay frame */}
            <div className="overflow-hidden rounded-2xl border border-white/80 bg-white/60 shadow-[inset_1px_1px_4px_rgba(0,0,0,0.02)]">
              <Table data={customers} columns={columns} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerList;
