"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconLayoutDashboard,
  IconCreditCard,
  IconCategory,
  IconUser,
  IconWallet,
  IconPigMoney,
  IconTarget,
  IconRefresh,
} from "@tabler/icons-react";
import clsx from "clsx";

const menu = [
  { name: "Dashboard", path: "/dashboard", icon: IconLayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: IconCreditCard },
  { name: "Categories", path: "/categories", icon: IconCategory },
  { name: "Accounts", path: "/accounts", icon: IconUser },
  { name: "Budgets", path: "/budgets", icon: IconPigMoney },
  { name: "Goals", path: "/goals", icon: IconTarget },
  { name: "Recurring", path: "/recurring", icon: IconRefresh },
];

export default function Sidebar({ sidebarWidth }: { sidebarWidth: boolean }) {
  const pathname = usePathname();

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
            "rounded-full flex items-center justify-center shadow-inner bg-primary-light hover:scale-105 transition-transform duration-300"
          )}
          style={{
            width: sidebarWidth ? "64px" : "44px",
            height: sidebarWidth ? "64px" : "44px",
          }}
          title="Expense Flow"
        >
          <IconWallet
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
                    ? "bg-gradient-to-r from-primary-dark to-primary text-white shadow-lg"
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
    </aside>
  );
}
