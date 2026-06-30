import React, { useState, useEffect, Fragment } from "react";
import { Link, useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";
import axios from "axios";
import { useUser } from "./UserContext";
import {
  HomeIcon,
  ShoppingCartIcon,
  ClipboardListIcon,
  ArchiveIcon,
  UserGroupIcon,
  ChevronDownIcon,
  UserIcon,
} from "@heroicons/react/outline";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import { Menu, Transition } from "@headlessui/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const { user } = useUser();

  const isCustomer = user?.groups?.includes("Customer");
  const isStaff = user?.is_staff;

  const DropdownLink = ({ to, children }) => (
    <Menu.Item>
      {({ active }) => (
        <Link
          to={to}
          className={`${
            active ? "bg-[#e7d8c7] text-[#4f3f32]" : "text-[#6a5748]"
          } block rounded-2xl px-4 py-2.5 text-sm transition-all duration-300`}
        >
          {children}
        </Link>
      )}
    </Menu.Item>
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const accessToken = localStorage.getItem("accessToken");
      setIsLoggedIn(!!accessToken);
    };

    handleStorageChange();
    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/logout/");
      localStorage.removeItem("accessToken");
      localStorage.clear();
      navigate("/");
      setShowLogoutModal(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const navBtn =
    "inline-flex items-center rounded-full border border-white/60 bg-[#e8dccf] px-4 py-2 text-[15px] font-medium text-[#5d4b3c] shadow-[8px_8px_16px_rgba(163,138,100,0.16),-8px_-8px_16px_rgba(255,255,255,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[12px_12px_20px_rgba(163,138,100,0.2),-12px_-12px_20px_rgba(255,255,255,0.9)] active:translate-y-0 active:shadow-[inset_4px_4px_8px_rgba(163,138,100,0.14),inset_-4px_-4px_8px_rgba(255,255,255,0.85)]";

  const menuPanel =
    "absolute right-0 mt-3 w-64 origin-top-right rounded-[1.5rem] border border-white/60 bg-[#f7f1e8] p-2 shadow-[12px_12px_24px_rgba(163,138,100,0.16),-12px_-12px_24px_rgba(255,255,255,0.85)] ring-1 ring-black/5 focus:outline-none";

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-white/40 bg-[#efe8df]/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="sm:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/60 bg-[#e8dccf] p-3 text-[#5d4b3c] shadow-[8px_8px_16px_rgba(163,138,100,0.16),-8px_-8px_16px_rgba(255,255,255,0.85)] transition-all duration-300 hover:scale-105 active:scale-95"
                  aria-controls="mobile-menu"
                  aria-expanded={isOpen}
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {isOpen ? (
                    <XIcon className="h-6 w-6" />
                  ) : (
                    <MenuIcon className="h-6 w-6" />
                  )}
                </button>
              </div>

              <Link to="/home" className={`${navBtn} hidden sm:inline-flex`}>
                <HomeIcon className="mr-2 h-5 w-5" />
                Home
              </Link>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Menu as="div" className="relative">
                <Menu.Button className={navBtn}>
                  <ClipboardListIcon className="mr-2 h-5 w-5" />
                  Products
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-100"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className={menuPanel}>
                    <DropdownLink to="/product-list">Product List</DropdownLink>
                    {isStaff && (
                      <DropdownLink to="/product-form">
                        Product Form
                      </DropdownLink>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>

              <Menu as="div" className="relative">
                <Menu.Button className={navBtn}>
                  <ShoppingCartIcon className="mr-2 h-5 w-5" />
                  Orders
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-100"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className={menuPanel}>
                    {isStaff && (
                      <>
                        <DropdownLink to="/order-details">
                          Order Details
                        </DropdownLink>
                        <DropdownLink to="/pending-orders">
                          Customer pending orders
                        </DropdownLink>
                        <DropdownLink to="/update-order-status">
                          Update Specific Order
                        </DropdownLink>
                      </>
                    )}
                    {isCustomer && (
                      <>
                        <DropdownLink to="/create-order">
                          Create Order
                        </DropdownLink>
                        <DropdownLink to="/customer-order-detail">
                          My Order Details
                        </DropdownLink>
                        <DropdownLink to="/customer-order-history">
                          My Order History
                        </DropdownLink>
                      </>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>

              {isStaff && (
                <Menu as="div" className="relative">
                  <Menu.Button className={navBtn}>
                    <ArchiveIcon className="mr-2 h-5 w-5" />
                    Inventory
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-150"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className={menuPanel}>
                      <DropdownLink to="/inventory-report">
                        Inventory Report
                      </DropdownLink>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}

              {isStaff && (
                <Menu as="div" className="relative">
                  <Menu.Button className={navBtn}>
                    <UserGroupIcon className="mr-2 h-5 w-5" />
                    Customers
                    <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Menu.Button>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-150"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className={menuPanel}>
                      <DropdownLink to="/customer-list">
                        Customer List
                      </DropdownLink>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}

              <Menu as="div" className="relative">
                <Menu.Button className={navBtn}>
                  <UserIcon className="mr-2 h-5 w-5" />
                  Account
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-150"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-100"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className={menuPanel}>
                    <DropdownLink to="/profile">View Profile</DropdownLink>
                    <DropdownLink to="/faq">FAQ</DropdownLink>
                    {isLoggedIn && (
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? "bg-red-500 text-white" : "text-red-500"
                            } mt-1 block w-full rounded-2xl px-4 py-2.5 text-left text-sm transition-all duration-300`}
                          >
                            Log Out
                          </button>
                        )}
                      </Menu.Item>
                    )}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div
            className={`sm:hidden ${isOpen ? "block" : "hidden"} pb-4`}
            id="mobile-menu"
          >
            <div className="space-y-2 rounded-[1.5rem] border border-white/60 bg-[#f7f1e8] p-3 shadow-[12px_12px_24px_rgba(163,138,100,0.14),-12px_-12px_24px_rgba(255,255,255,0.85)]">
              <Link
                to="/product-list"
                className="block rounded-2xl px-4 py-3 text-[#6a5748]"
              >
                Products
              </Link>
              <Link
                to="/orders"
                className="block rounded-2xl px-4 py-3 text-[#6a5748]"
              >
                Orders
              </Link>
              {isStaff && (
                <Link
                  to="/inventory"
                  className="block rounded-2xl px-4 py-3 text-[#6a5748]"
                >
                  Inventory
                </Link>
              )}
              <Link
                to="/customers"
                className="block rounded-2xl px-4 py-3 text-[#6a5748]"
              >
                Customers
              </Link>
              <Link
                to="/reports"
                className="block rounded-2xl px-4 py-3 text-[#6a5748]"
              >
                Reports
              </Link>
              <Link
                to="/home"
                className="block rounded-2xl px-4 py-3 text-[#6a5748]"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <LogoutModal
        isOpen={showLogoutModal}
        onConfirm={handleConfirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
};

export default Navbar;
