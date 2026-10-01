"use client";

import { usePathname } from "next/navigation";
import { IconMenu2 } from "@tabler/icons-react";
import clsx from "clsx";
import { useAuthState } from "@/components/auth/AuthProvider";
import { NotificationBell } from "@/components/notifications/NotificationBell";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const pathname = usePathname();
  const { user } = useAuthState();

  const titleMap: Record<string, string> = {
    "/owner": "SaaS Owner",
    "/dashboard": "FleetWise Command Center",
    "/live-tracking": "Live Tracking",
    "/vehicles": "Vehicle Operations",
    "/drivers": "Driver Operations",
    "/staff": "Staff Management",
    "/mechanics": "Mechanics Management",
    "/maintenance": "Maintenance Operations",
    "/routes": "Route Dispatch",
    "/fuel": "Fuel Logs",
    "/my-routes": "My Routes",
    "/finance": "Fleet Costs",
    "/reports": "Fleet Reports",
    "/billing": "Subscription",
    "/settings": "Settings",
  };

  const title = titleMap[pathname] || "FleetWise";

  return (
    <header
      className={clsx(
        "sticky top-0 z-40 flex w-full items-center justify-between border-b border-line bg-white px-4 py-3 transition-colors sm:px-5"
      )}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className={clsx(
            "rounded-xl border border-line p-2 text-slate-700 transition-colors hover:border-green-200 hover:bg-green-50 hover:text-primary active:scale-[0.99]"
          )}
          aria-label="Toggle navigation"
        >
          <IconMenu2 size={22} />
        </button>

        <div>
          <h1 className="select-none text-lg font-extrabold tracking-tight text-ink sm:text-xl">{title}</h1>
          <p className="text-xs font-semibold text-muted">
            {user ? `${user.firstName} ${user.lastName}` : "Fleet operator"}
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-4">
        <NotificationBell />
      </div>
    </header>
  );
}
