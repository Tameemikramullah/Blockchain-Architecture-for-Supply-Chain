import React from "react";
import { XIcon, LogoutIcon } from "@heroicons/react/outline";

const LogoutModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md rounded-[1.75rem] border border-white/60 bg-[#f7f1e8] p-6 shadow-[12px_12px_24px_rgba(163,138,100,0.16),-12px_-12px_24px_rgba(255,255,255,0.85)]">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 inline-flex items-center justify-center rounded-2xl border border-white/60 bg-[#e8dccf] p-2 text-[#5d4b3c] shadow-[8px_8px_16px_rgba(163,138,100,0.16),-8px_-8px_16px_rgba(255,255,255,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[12px_12px_20px_rgba(163,138,100,0.2),-12px_-12px_20px_rgba(255,255,255,0.9)] active:translate-y-0 active:shadow-[inset_4px_4px_8px_rgba(163,138,100,0.14),inset_-4px_-4px_8px_rgba(255,255,255,0.85)]"
          aria-label="Close modal"
        >
          <XIcon className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-white/60 bg-[#e8dccf] shadow-[8px_8px_18px_rgba(163,138,100,0.16),-8px_-8px_18px_rgba(255,255,255,0.9)]">
            <LogoutIcon className="h-8 w-8 text-[#8a5b4a]" />
          </div>

          <h2 className="text-2xl font-bold text-[#4f3f32]">Confirm Logout</h2>

          <p className="mt-3 text-sm leading-6 text-[#6f6257]">
            Are you sure you want to log out of your account? You will need to
            sign in again to continue.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={onCancel}
              className="flex-1 rounded-full border border-white/70 bg-[#e8dccf] px-5 py-3 font-semibold text-[#5d4b3c] shadow-[8px_8px_16px_rgba(163,138,100,0.16),-8px_-8px_16px_rgba(255,255,255,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[12px_12px_20px_rgba(163,138,100,0.2),-12px_-12px_20px_rgba(255,255,255,0.9)] active:translate-y-0 active:shadow-[inset_4px_4px_8px_rgba(163,138,100,0.14),inset_-4px_-4px_8px_rgba(255,255,255,0.85)]"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="flex-1 rounded-full border border-white/70 bg-[#e8dccf] px-5 py-3 font-semibold text-[#5d4b3c] shadow-[8px_8px_16px_rgba(163,138,100,0.16),-8px_-8px_16px_rgba(255,255,255,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[12px_12px_20px_rgba(163,138,100,0.2),-12px_-12px_20px_rgba(255,255,255,0.9)] active:translate-y-0 active:shadow-[inset_4px_4px_8px_rgba(163,138,100,0.14),inset_-4px_-4px_8px_rgba(255,255,255,0.85)]"
            >
              Yes, Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
