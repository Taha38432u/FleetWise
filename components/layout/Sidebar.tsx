"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconLayoutDashboard,
  IconMap2,
  IconCar,
  IconUsers,
  IconTool,
  IconReportAnalytics,
  IconCreditCard,
  IconSettings,
  IconTruck,
  IconLogout,
} from "@tabler/icons-react";
import clsx from "clsx";
import { logout as apiLogout } from "@/api/auth/authApi";

const menu = [
  { name: "Command Center", path: "/dashboard", icon: IconLayoutDashboard },
  { name: "Live Tracking", path: "/live-tracking", icon: IconMap2 },
  { name: "Vehicles", path: "/vehicles", icon: IconCar },
  { name: "Drivers", path: "/drivers", icon: IconUsers },
  { name: "Mechanics", path: "/mechanics", icon: IconUsers },
  { name: "Maintenance", path: "/maintenance", icon: IconTool },
  { name: "Reports", path: "/reports", icon: IconReportAnalytics },
  { name: "Subscription", path: "/billing", icon: IconCreditCard },
  { name: "Settings", path: "/settings", icon: IconSettings },
];

export default function Sidebar({ sidebarWidth }: { sidebarWidth: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={clsx(
        // base layout (like your reference)
        "flex flex-col h-full overflow-y-auto overflow-x-hidden py-3 transition-all duration-300 shadow-lg",
        "bg-primary text-white",
        sidebarWidth ? "w-[250px]" : "w-[70px] items-center"
      )}
    >
      {/* Logo Section */}
      <div
        className={clsx(
          "py-4 flex",
          sidebarWidth ? "justify-center" : "items-center justify-center"
        )}
      >
        <div
          className={clsx(
            "rounded-lg flex items-center justify-center shadow-lg bg-linear-to-br from-blue-600 to-cyan-500 hover:scale-105 transition-transform duration-300"
          )}
          style={{
            width: sidebarWidth ? "64px" : "44px",
            height: sidebarWidth ? "64px" : "44px",
          }}
          title="FleetWise"
        >
          <IconTruck
            size={sidebarWidth ? 36 : 28}
            stroke={1.6}
            className="text-white"
          />
        </div>
      </div>

      {/* Menu Items */}
      <ul className="space-y-2 px-2 flex-1 w-full">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                className={clsx(
                  "flex items-center rounded-[14px] transition-all duration-300",
                  isActive
                    ? "bg-linear-to-r from-primary-dark to-primary text-white shadow-lg"
                    : "hover:bg-primary-light/50 text-gray-200",
                  sidebarWidth
                    ? "gap-4 px-4 py-2 justify-start"
                    : "px-0 py-3 justify-center"
                )}
              >
                <Icon
                  size={sidebarWidth ? 22 : 24}
                  stroke={1.5}
                  className={clsx(isActive ? "text-white" : "text-gray-300")}
                />
                {sidebarWidth && (
                  <span
                    className={clsx(
                      "font-semibold text-[15px]",
                      isActive ? "text-white" : "text-gray-300"
                    )}
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

        {/* Logout at bottom */}
        <div className="px-4 pt-3 border-t border-white/20">
          <button
            onClick={async () => {
              try {
                await apiLogout();
              } catch (e) {}
              localStorage.removeItem("accessToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("user");
              router.push("/login");
            }}
            className={clsx(
              "flex items-center gap-3 w-full rounded-[12px] px-4 py-2 hover:bg-primary-light/40 transition",
              sidebarWidth ? "justify-start" : "justify-center"
            )}
          >
            <IconLogout size={18} className="text-gray-200" />
            {sidebarWidth && <span className="font-semibold text-[15px] text-gray-200">Logout</span>}
          </button>
        </div>
    </aside>
  );
}
