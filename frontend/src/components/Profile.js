import React, { useState } from "react";
import Navbar from "./Navbar";
import { useUser } from "./UserContext";

const Profile = () => {
  const { user, updateUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event) => {
    if (user) {
      updateUser({
        ...user,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setError("");
  };

  const handleCancel = async () => {
    setEditMode(false);
    setError("");

    const response = await fetch("http://localhost:8000/api/user-data/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (response.ok) {
      const freshUser = await response.json();
      updateUser(freshUser);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/user-data/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const updatedResponse = await fetch(
          "http://localhost:8000/api/user-data/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        const updatedUser = await updatedResponse.json();
        updateUser(updatedUser);
        setEditMode(false);
      } else {
        setError("Failed to update profile details.");
      }
    } catch (err) {
      setError("An error occurred while saving changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f4ede4] via-[#efe6db] to-[#e8dccf]">
          <div className="rounded-[2rem] border border-white/60 bg-white/40 px-8 py-6 text-[#5d4b3c] shadow-[0_20px_60px_rgba(124,92,68,0.16)] backdrop-blur-md">
            Loading profile...
          </div>
        </div>
      </>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-white/70 bg-[#f9f4ed] px-4 py-3 text-[#4f3f32] shadow-[inset_4px_4px_8px_rgba(163,138,100,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] outline-none transition-all duration-300 placeholder:text-[#a7927f] focus:border-[#c9b39f]";

  const labelClass = "mb-2 block text-sm font-semibold text-[#5d4b3c]";

  const actionBtnBase =
    "rounded-full px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-[#f4ede4] via-[#efe6db] to-[#e8dccf] px-4 py-10">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-[0_20px_60px_rgba(124,92,68,0.18)] backdrop-blur-md">
          <div className="grid gap-8 p-6 md:grid-cols-[0.9fr_1.1fr] md:p-10 lg:p-14">
            <aside className="rounded-[1.75rem] border border-white/60 bg-[#f7f1e8] p-6 shadow-[10px_10px_20px_rgba(163,138,100,0.14),-10px_-10px_20px_rgba(255,255,255,0.9)]">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/60 bg-[#e8dccf] text-2xl font-bold text-[#5d4b3c] shadow-[8px_8px_18px_rgba(163,138,100,0.16),-8px_-8px_18px_rgba(255,255,255,0.9)]">
                  {(user.firstname || user.username || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight text-[#4f3f32]">
                    Profile Details
                  </h1>
                  <p className="mt-1 text-sm text-[#6f6257]">
                    Manage your account information
                  </p>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-2xl bg-[#efe6db] p-4 shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#8a6e57]">
                    Username
                  </div>
                  <div className="mt-1 text-lg font-medium text-[#4f3f32]">
                    {user.username || "-"}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#efe6db] p-4 shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#8a6e57]">
                    Email
                  </div>
                  <div className="mt-1 text-lg font-medium text-[#4f3f32]">
                    {user.email || "-"}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#efe6db] p-4 shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                  <div className="text-xs font-semibold uppercase tracking-wide text-[#8a6e57]">
                    Phone
                  </div>
                  <div className="mt-1 text-lg font-medium text-[#4f3f32]">
                    {user.phone ? `+254 ${user.phone}` : "-"}
                  </div>
                </div>
              </div>
            </aside>

            <section className="rounded-[1.75rem] border border-white/60 bg-[#f7f1e8] p-6 shadow-[10px_10px_20px_rgba(163,138,100,0.14),-10px_-10px_20px_rgba(255,255,255,0.9)] md:p-8">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-[#5d4b3c]">
                    Account Information
                  </h2>
                  <p className="mt-1 text-sm text-[#6f6257]">
                    Update your personal details below.
                  </p>
                </div>

                {!editMode ? (
                  <button
                    onClick={handleEdit}
                    className={`${actionBtnBase} border border-white/70 bg-[#e8dccf] text-[#5d4b3c] shadow-[8px_8px_16px_rgba(163,138,100,0.16),-8px_-8px_16px_rgba(255,255,255,0.85)]`}
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className={`${actionBtnBase} border border-white/70 bg-[#e8dccf] text-[#5d4b3c] shadow-[8px_8px_16px_rgba(163,138,100,0.16),-8px_-8px_16px_rgba(255,255,255,0.85)]`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className={`${actionBtnBase} bg-[#5d4b3c] text-white shadow-[8px_8px_18px_rgba(93,75,60,0.22)] hover:bg-[#4f3f32]`}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="username">
                    Username
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="username"
                      value={user.username || ""}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  ) : (
                    <div className="rounded-2xl bg-[#efe6db] px-4 py-3 text-[#4f3f32] shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                      {user.username || "-"}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="firstname">
                    First Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="firstname"
                      value={user.firstname || ""}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  ) : (
                    <div className="rounded-2xl bg-[#efe6db] px-4 py-3 text-[#4f3f32] shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                      {user.firstname || "-"}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="lastname">
                    Last Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="lastname"
                      value={user.lastname || ""}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  ) : (
                    <div className="rounded-2xl bg-[#efe6db] px-4 py-3 text-[#4f3f32] shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                      {user.lastname || "-"}
                    </div>
                  )}
                </div>

                <div>
                  <label className={labelClass} htmlFor="email">
                    Email
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={user.email || ""}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  ) : (
                    <div className="text-sm rounded-2xl bg-[#efe6db] px-4 py-3 text-[#4f3f32] shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                      {user.email || "-"}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass} htmlFor="phone">
                    Phone
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={user.phone || ""}
                      onChange={handleInputChange}
                      className={inputClass}
                    />
                  ) : (
                    <div className="rounded-2xl bg-[#efe6db] px-4 py-3 text-[#4f3f32] shadow-[inset_4px_4px_8px_rgba(163,138,100,0.10),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]">
                      {user.phone ? `+254 ${user.phone}` : "-"}
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
