import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password1: "",
    password2: "",
    phone: "",
    location: "",
  });

  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/delivery/locations/",
      );
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/register/", formData);
      navigate("/");
    } catch (error) {
      setErrors(error.response?.data || { general: "Registration failed." });
    }
  };

  const fieldClass =
    "w-full rounded-[1.2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-3 text-amber-50 placeholder:text-stone-400 outline-none transition-all duration-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.08)] focus:border-amber-300/30 focus:ring-2 focus:ring-amber-300/15 focus:bg-[linear-gradient(180deg,rgba(255,255,255,0.1),rgba(255,255,255,0.05))]";

  return (
    <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10 bg-[radial-gradient(circle_at_top,_rgba(255,215,140,0.12),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(120,80,40,0.22),_transparent_28%),linear-gradient(135deg,_#090909_0%,_#171311_48%,_#050505_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.03)_50%,rgba(255,255,255,0.03)_75%,transparent_75%,transparent)] bg-[length:24px_24px] opacity-20" />
        <div className="absolute left-8 top-10 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute right-10 bottom-14 h-56 w-56 rounded-full bg-orange-950/40 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] opacity-30" />
      </div>

      <div className="relative w-full max-w-2xl">
        <div className="overflow-hidden rounded-[2rem] border border-amber-100/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_30px_90px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
          <div className="relative border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,248,235,0.08),rgba(255,255,255,0.02))] px-8 py-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.14),transparent_40%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
            <div className="relative text-center">
              <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-amber-200/20 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.18),rgba(255,255,255,0.05)_45%,rgba(0,0,0,0.18)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_24px_rgba(0,0,0,0.35)]" />
              <h1 className="text-amber-50 text-xl font-semibold tracking-[0.22em] uppercase">
                Create Account
              </h1>
              <p className="mt-2 text-stone-300 text-sm">
                Join us and complete your details below
              </p>
            </div>
          </div>

          <div className="px-8 py-8 bg-[linear-gradient(180deg,rgba(18,14,12,0.88),rgba(10,8,8,0.96))]">
            {errors.general && (
              <div className="mb-5 rounded-[1.25rem] border border-red-400/20 bg-red-950/45 px-4 py-3 text-red-100 text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_18px_rgba(0,0,0,0.3)] text-center">
                {errors.general}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    className={`${fieldClass} text-gray-900 placeholder:text-gray-500`}
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    required
                  />
                  {errors.username && (
                    <p className="mt-2 text-center text-sm text-red-300">
                      {errors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className={`${fieldClass} text-gray-900 placeholder:text-gray-500`}
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                  {errors.email && (
                    <p className="mt-2 text-center text-sm text-red-300">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                    htmlFor="first_name"
                  >
                    First Name
                  </label>
                  <input
                    className={`${fieldClass} text-gray-900 placeholder:text-gray-500`}
                    id="first_name"
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                    htmlFor="last_name"
                  >
                    Last Name
                  </label>
                  <input
                    className={`${fieldClass} text-gray-900 placeholder:text-gray-500`}
                    id="last_name"
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                    htmlFor="password1"
                  >
                    Password
                  </label>
                  <input
                    className={`${fieldClass} text-gray-900 placeholder:text-gray-500`}
                    id="password1"
                    type="password"
                    name="password1"
                    value={formData.password1}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                  />
                  {errors.password1 && (
                    <p className="mt-2 text-center text-sm text-red-300">
                      {errors.password1}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                    htmlFor="password2"
                  >
                    Confirm Password
                  </label>
                  <input
                    className={`${fieldClass} text-gray-900 placeholder:text-gray-500`}
                    id="password2"
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    required
                  />
                  {errors.password2 && (
                    <p className="mt-2 text-center text-sm text-red-300">
                      {errors.password2}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label
                    className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <div className="relative">
                    <select
                      className={`${fieldClass} appearance-none pr-10 text-gray-90`}
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a location</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-300">
                      <svg
                        className="h-4 w-4 fill-current"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 12l-6-6 1.41-1.41L10 9.17l4.59-4.58L16 6l-6 6z" />
                      </svg>
                    </div>
                  </div>
                  {errors.location && (
                    <p className="mt-2 text-center text-sm text-red-300">
                      {errors.location}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className="block text-amber-100/80 text-xs font-semibold mb-2 uppercase tracking-[0.2em]"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <input
                    className={`${fieldClass} text-gray-900 placeholder:text-gray-500`}
                    id="phone"
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                  {errors.phone && (
                    <p className="mt-2 text-center text-sm text-red-300">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
                <button
                  className="w-full rounded-[1.25rem] border border-amber-200/10 bg-[linear-gradient(180deg,rgba(189,132,63,0.95),rgba(92,55,26,0.98))] px-6 py-4 text-amber-50 font-semibold uppercase tracking-[0.22em] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_12px_24px_rgba(0,0,0,0.55)] transition-all duration-300 hover:brightness-110 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_16px_28px_rgba(0,0,0,0.62)] active:translate-y-[1px] md:w-auto"
                  type="submit"
                >
                  Register
                </button>

                <Link
                  to="/"
                  className="text-center text-amber-100/80 hover:text-amber-50 text-sm font-medium underline underline-offset-4 decoration-amber-300/30 transition-colors"
                >
                  Already have an account?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
