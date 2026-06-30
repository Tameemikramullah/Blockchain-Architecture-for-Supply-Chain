import Navbar from "./Navbar";
import React from "react";
import { FaQuestionCircle, FaTruck, FaBoxes } from "react-icons/fa";

const FAQ = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5eee6] via-[#eee4da] to-[#e4d7ca] pb-16 font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Claymorphic Dashboard Header */}
        <div className="mb-12 p-6 sm:p-10 rounded-[2rem] border border-white/80 bg-white/40 shadow-[0_20px_50px_rgba(124,92,68,0.08)] backdrop-blur-md text-center">
          <p className="text-xs uppercase tracking-widest font-black text-[#6f6257]/70 mb-2">
            Knowledge Hub
          </p>
          <h2 className="text-4xl font-black tracking-tight text-[#3a2e24] sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-xl mx-auto mt-3 text-sm text-[#6f6257]/80">
            Find immediate insights into distribution logic, package tracking
            pipelines, and active operational infrastructure.
          </p>
        </div>

        {/* FAQ Grid Layout Block */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2">
          {/* FAQ Item 1 */}
          <div className="group bg-white/40 border border-white/80 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl hover:shadow-[0_40px_80px_rgba(124,92,68,0.16)] transition-all duration-300">
            <div className="mb-4 flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#efe6db] text-[#5d4b3c] shadow-sm group-hover:scale-105 transition-transform duration-300">
                <FaBoxes className="text-lg" />
              </span>
              <h3 className="text-lg font-bold text-[#3a2e24]">
                What supply chain services do we offer?
              </h3>
            </div>
            {/* Inset pillow shading effect for the answer content */}
            <div className="rounded-2xl bg-[#efe6db]/30 p-4 border border-white/40 shadow-[inset_2px_2px_6px_rgba(124,92,68,0.04)]">
              <p className="text-sm leading-relaxed text-[#6f6257]">
                We specialize in providing comprehensive supply chain solutions
                for small businesses, including inventory management, order
                fulfillment, and logistics support to streamline your
                distribution process.
              </p>
            </div>
          </div>

          {/* FAQ Item 2 */}
          <div className="group bg-white/40 border border-white/80 p-6 sm:p-8 rounded-[2.5rem] shadow-[0_30px_70px_rgba(124,92,68,0.12),inset_2px_2px_0px_rgba(255,255,255,0.6)] backdrop-blur-xl hover:shadow-[0_40px_80px_rgba(124,92,68,0.16)] transition-all duration-300">
            <div className="mb-4 flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-[#efe6db] text-[#5d4b3c] shadow-sm group-hover:scale-105 transition-transform duration-300">
                <FaTruck className="text-lg" />
              </span>
              <h3 className="text-lg font-bold text-[#3a2e24]">
                How can I track my order?
              </h3>
            </div>
            {/* Inset pillow shading effect for the answer content */}
            <div className="rounded-2xl bg-[#efe6db]/30 p-4 border border-white/40 shadow-[inset_2px_2px_6px_rgba(124,92,68,0.04)]">
              <p className="text-sm leading-relaxed text-[#6f6257]">
                After placing an order, you can monitor its progress through our
                online tracking system. You'll receive real-time updates as your
                order moves from our warehouse to your business location.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FAQ;
