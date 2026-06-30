import React from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const Homepage = () => {
  const features = [
    {
      title: "Inventory Control",
      description:
        "Track stock levels accurately and reduce errors across your supply chain operations.",
    },
    {
      title: "Order & Logistics Management",
      description:
        "Streamline order processing, delivery coordination, and fulfillment workflows.",
    },
    {
      title: "Blockchain Transparency",
      description:
        "Improve trust and accountability with tamper-resistant product traceability.",
    },
    {
      title: "Operational Insights",
      description:
        "Make smarter decisions using clear visibility into inventory and order activity.",
    },
  ];

  const stats = [
    { value: "24/7", label: "Visibility" },
    { value: "100%", label: "Traceability Focus" },
    { value: "Faster", label: "Decision Making" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4ede4] via-[#efe6db] to-[#e8dccf]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-[0_20px_60px_rgba(124,92,68,0.18)] backdrop-blur-md">
          <div className="grid gap-10 p-6 md:grid-cols-2 md:p-10 lg:p-14">
            <section className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit rounded-full border border-[#c9b39f]/60 bg-[#f7f1e8] px-4 py-2 text-sm font-semibold text-[#6a5748] shadow-sm">
                Supply Chain Management System
              </span>

              <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-[#4f3f32] sm:text-5xl lg:text-6xl">
                Modern supply chain operations with transparency and control
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#6f6257]">
                Manage products, orders, inventory, and logistics from a single
                platform designed to improve efficiency, strengthen
                accountability, and support smarter business decisions.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/product-list"
                  className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-[#e8dccf] px-6 py-3 font-semibold text-[#5d4b3c] shadow-[8px_8px_18px_rgba(163,138,100,0.16),-8px_-8px_18px_rgba(255,255,255,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[12px_12px_22px_rgba(163,138,100,0.2),-12px_-12px_22px_rgba(255,255,255,0.95)]"
                >
                  View Products
                </Link>

                <Link
                  to="/create-order"
                  className="inline-flex items-center gap-2 rounded-full bg-[#5d4b3c] px-6 py-3 font-semibold text-white shadow-[8px_8px_18px_rgba(93,75,60,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#4f3f32]"
                >
                  Create Order
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
                {stats.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/60 bg-[#f7f1e8] p-4 text-center shadow-[8px_8px_16px_rgba(163,138,100,0.12),-8px_-8px_16px_rgba(255,255,255,0.85)]"
                  >
                    <div className="text-2xl font-bold text-[#4f3f32]">
                      {item.value}
                    </div>
                    <div className="mt-1 text-sm text-[#6f6257]">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-4">
              <div className="rounded-[1.75rem] border border-white/60 bg-[#f7f1e8] p-6 shadow-[10px_10px_20px_rgba(163,138,100,0.14),-10px_-10px_20px_rgba(255,255,255,0.9)]">
                <h2 className="text-2xl font-semibold text-[#5d4b3c]">
                  Platform Overview
                </h2>
                <p className="mt-4 leading-7 text-[#6f6257]">
                  This system is built to simplify day-to-day supply chain
                  activities by centralizing inventory management, order
                  handling, and logistics coordination in one intuitive
                  environment.
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-white/60 bg-[#f7f1e8] p-6 shadow-[10px_10px_20px_rgba(163,138,100,0.14),-10px_-10px_20px_rgba(255,255,255,0.9)]">
                <h2 className="text-2xl font-semibold text-[#5d4b3c]">
                  Key Capabilities
                </h2>

                <div className="mt-5 grid gap-4">
                  {features.map((feature) => (
                    <div
                      key={feature.title}
                      className="rounded-2xl bg-[#efe6db] p-4 shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]"
                    >
                      <h3 className="text-lg font-semibold text-[#4f3f32]">
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-[#6f6257]">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/60 bg-[#5d4b3c] p-6 text-white shadow-[10px_10px_20px_rgba(93,75,60,0.18)]">
                <h2 className="text-2xl font-semibold">Why it matters</h2>
                <p className="mt-3 leading-7 text-white/85">
                  A well-structured supply chain improves efficiency,
                  strengthens customer satisfaction, and supports reliable
                  growth through better visibility and control.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;
