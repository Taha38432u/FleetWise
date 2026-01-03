"use client";

import { useRouter } from "next/navigation";
import {
  IconMenu2,
  IconBell,
  IconSettings,
  IconLogout,
  IconUserCircle,
} from "@tabler/icons-react";
import { useState } from "react";
import clsx from "clsx";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header
      className={clsx(
        "w-full sticky top-0 z-40 flex items-center justify-between px-5 py-3 shadow-md transition-colors duration-300",
        "bg-primary text-white" // Header is lighter than sidebar
      )}
    >
      {/* Left: Menu Toggle + Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className={clsx(
            "p-2 rounded-md hover:bg-primary-dark transition",
            "text-white"
          )}
        >
          <IconMenu2 size={22} />
        </button>

        <h1 className="text-xl font-bold select-none">Expense Dashboard</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4 relative">
        <button
          className={clsx(
            "p-2 rounded-full hover:bg-primary-dark transition",
            "text-white"
          )}
        >
          <IconBell size={20} />
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={clsx(
              "flex items-center justify-center p-1 rounded-full hover:bg-primary-dark transition",
              "text-white"
            )}
          >
            <IconUserCircle size={28} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 overflow-hidden">
              <button
                onClick={() => router.push("/profile")}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <IconSettings size={16} className="mr-2 text-gray-500" />{" "}
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <IconLogout size={16} className="mr-2 text-red-500" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
