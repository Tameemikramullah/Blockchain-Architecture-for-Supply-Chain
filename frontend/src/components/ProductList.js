import Navbar from "./Navbar";
import { SearchIcon } from "@heroicons/react/outline";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "./Loader";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        const response = await axios.get(
          "http://localhost:8000/store/products/products-with-location",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = (query, productList = products) => {
    const normalized = query.toLowerCase().trim();

    const filtered = productList.filter(
      (product) =>
        product.product_code.toString().toLowerCase().includes(normalized) ||
        product.name.toLowerCase().includes(normalized) ||
        (product.location_name || "").toLowerCase().includes(normalized),
    );

    setFilteredProducts(filtered);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    filterProducts(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f4ede4] via-[#efe6db] to-[#e8dccf]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-[0_20px_60px_rgba(124,92,68,0.16)] backdrop-blur-md">
          <div className="border-b border-white/50 px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex rounded-full border border-[#c9b39f]/60 bg-[#f7f1e8] px-4 py-2 text-sm font-semibold text-[#6a5748] shadow-sm">
                  Product Catalog
                </span>
                <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[#4f3f32] sm:text-4xl">
                  Browse available products
                </h1>
                <p className="mt-3 text-sm leading-7 text-[#6f6257] sm:text-base">
                  These are the products we offer. Use the search bar to find a
                  product by code, name, or location.
                </p>
              </div>

              <div className="w-full lg:max-w-md">
                <label className="mb-2 block text-sm font-semibold text-[#5d4b3c]">
                  Search products
                </label>
                <div className="relative">
                  <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8a6e57]" />
                  <input
                    type="text"
                    placeholder="Search by code, name, or location..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    className="w-full rounded-full border border-white/70 bg-[#f9f4ed] py-3 pl-12 pr-4 text-[#4f3f32] shadow-[inset_4px_4px_8px_rgba(163,138,100,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] outline-none transition-all duration-300 placeholder:text-[#a7927f] focus:border-[#c9b39f]"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-8">
            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-[1.5rem] border border-white/60 bg-[#f7f1e8] p-8 text-center shadow-[10px_10px_20px_rgba(163,138,100,0.12),-10px_-10px_20px_rgba(255,255,255,0.85)]">
                <p className="text-lg font-semibold text-[#4f3f32]">
                  No products found
                </p>
                <p className="mt-2 text-sm text-[#6f6257]">
                  Try a different search term.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm text-[#6f6257]">
                    Showing{" "}
                    <span className="font-semibold text-[#4f3f32]">
                      {filteredProducts.length}
                    </span>{" "}
                    products
                  </p>
                </div>

                <div className="hidden rounded-[1.5rem] border border-white/60 bg-[#f7f1e8] shadow-[10px_10px_20px_rgba(163,138,100,0.12),-10px_-10px_20px_rgba(255,255,255,0.85)] md:block">
                  <div className="grid grid-cols-4 gap-4 border-b border-white/50 px-6 py-4 text-sm font-bold uppercase tracking-wide text-[#6a5748]">
                    <span>Product Code</span>
                    <span>Product Name</span>
                    <span>Location</span>
                    <span className="text-right">Price</span>
                  </div>

                  <div className="divide-y divide-white/40">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.product_code}
                        className="grid grid-cols-4 gap-4 px-6 py-4 text-[#4f3f32] transition-colors duration-300 hover:bg-[#efe6db]"
                      >
                        <span className="font-medium">
                          {product.product_code}
                        </span>
                        <span>{product.name}</span>
                        <span>{product.location_name || "N/A"}</span>
                        <span className="text-right font-semibold">
                          {product.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 md:hidden">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.product_code}
                      className="rounded-[1.5rem] border border-white/60 bg-[#f7f1e8] p-5 shadow-[10px_10px_20px_rgba(163,138,100,0.12),-10px_-10px_20px_rgba(255,255,255,0.85)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-[#8a6e57]">
                            Product Code
                          </p>
                          <p className="mt-1 text-lg font-bold text-[#4f3f32]">
                            {product.product_code}
                          </p>
                        </div>
                        <div className="rounded-full bg-[#efe6db] px-4 py-2 text-sm font-semibold text-[#5d4b3c] shadow-[inset_4px_4px_8px_rgba(163,138,100,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                          {product.price}
                        </div>
                      </div>

                      <div className="mt-4 space-y-3 text-sm text-[#6f6257]">
                        <div>
                          <span className="font-semibold text-[#5d4b3c]">
                            Name:
                          </span>{" "}
                          {product.name}
                        </div>
                        <div>
                          <span className="font-semibold text-[#5d4b3c]">
                            Location:
                          </span>{" "}
                          {product.location_name || "N/A"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductList;
