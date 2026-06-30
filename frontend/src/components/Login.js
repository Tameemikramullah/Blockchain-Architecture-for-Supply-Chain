import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "./UserContext";

function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("customer");
  const navigate = useNavigate();
  const { updateUser } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleLoginTypeChange = (type) => {
    setLoginType(type);
    setFormData({ username: "", password: "" });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const loginEndpoint =
        loginType === "customer"
          ? "http://localhost:8000/api/token/"
          : "http://localhost:8000/api/staff/login/";

      const response = await axios.post(loginEndpoint, {
        username: formData.username,
        password: formData.password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem("accessToken", access);
      if (refresh) localStorage.setItem("refreshToken", refresh);

      const userInfoResponse = await axios.get(
        "http://localhost:8000/api/user-data/",
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        },
      );

      updateUser(userInfoResponse.data);
      navigate("/home");
    } catch (error) {
      if (error.response) {
        setError("Invalid username or password.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const isCustomer = loginType === "customer";

  const toggleActive =
    "bg-gradient-to-b from-amber-200 to-amber-400 text-stone-950 border-amber-100/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_18px_rgba(0,0,0,0.35)]";
  const toggleInactive =
    "bg-gradient-to-b from-stone-800 to-stone-900 text-stone-300 border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_6px_14px_rgba(0,0,0,0.28)]";

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(255,215,140,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(120,80,40,0.22),_transparent_28%),linear-gradient(135deg,_#090909_0%,_#171311_48%,_#050505_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-20" />
        <div className="absolute left-8 top-10 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute right-10 bottom-14 h-56 w-56 rounded-full bg-orange-950/40 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] opacity-30" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="rounded-[2rem] border border-amber-100/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_30px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl overflow-hidden">
          <div className="relative border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,248,235,0.08),rgba(255,255,255,0.02))] px-8 py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
            <div className="relative text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-amber-200/20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),rgba(255,255,255,0.05)_45%,rgba(0,0,0,0.18)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_rgba(0,0,0,0.35)]" />
              <h6 className="text-amber-50 text-sm font-semibold tracking-[0.28em] uppercase">
                Sign in as a
              </h6>
              <p className="mt-2 text-stone-300 text-sm">
                Choose your access type and continue
              </p>

              <div className="mt-7 inline-flex rounded-[1.4rem] border border-white/10 bg-black/25 p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_20px_rgba(0,0,0,0.35)]">
                <button
                  type="button"
                  onClick={() => handleLoginTypeChange("customer")}
                  className={`px-5 py-3 rounded-[1rem] border text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:translate-y-[1px] ${
                    isCustomer ? toggleActive : toggleInactive
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleLoginTypeChange("staff")}
                  className={`ml-2 px-5 py-3 rounded-[1rem] border text-xs font-semibold uppercase tracking-wider transition-all duration-300 active:translate-y-[1px] ${
                    !isCustomer ? toggleActive : toggleInactive
                  }`}
                >
                  Staff
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 py-8 bg-[linear-gradient(180deg,rgba(18,14,12,0.88),rgba(10,8,8,0.96))]">
            {error && (
              <div className="mb-5 rounded-[1.25rem] border border-red-400/20 bg-red-950/45 px-4 py-3 text-red-100 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(0,0,0,0.3)] text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full text-gray-900 rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-3 text-amber-50 placeholder:text-stone-400 outline-none transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.08)] focus:border-amber-300/30 focus:ring-2 focus:ring-amber-300/15 focus:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))]"
                />
              </div>

              <div>
                <label
                  className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full text-gray-900 rounded-[1.25rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-3 text-amber-50 placeholder:text-stone-400 outline-none transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.08)] focus:border-amber-300/30 focus:ring-2 focus:ring-amber-300/15 focus:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))]"
                />
              </div>

              <div className="pt-1 text-center">
                <Link
                  to="/register"
                  className="text-amber-100/80 hover:text-amber-50 text-sm font-medium underline underline-offset-4 decoration-amber-300/30 transition-colors"
                >
                  New here? Create an account
                </Link>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-[1.25rem] border border-amber-200/10 bg-[linear-gradient(180deg,rgba(189,132,63,0.95),rgba(92,55,26,0.98))] px-6 py-4 text-amber-50 font-semibold uppercase tracking-[0.22em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_12px_24px_rgba(0,0,0,0.55)] transition-all duration-300 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_16px_28px_rgba(0,0,0,0.62)] active:translate-y-[1px]"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;
