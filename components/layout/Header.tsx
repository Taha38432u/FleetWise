"use client";

import { useRouter } from "next/navigation";
import { IconMenu2, IconBell } from "@tabler/icons-react";
import { useState } from "react";
import clsx from "clsx";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {

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

        {/* Profile removed from header; logout moved to sidebar */}
      </div>
    </header>
  );
}
