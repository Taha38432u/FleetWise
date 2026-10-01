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
  IconRoute,
  IconBriefcase2,
  IconUserCog,
  IconLock,
  IconGasStation,
} from "@tabler/icons-react";
import clsx from "clsx";
import { getVisibleMenuItems } from "@/lib/access";
import { useAuthState } from "@/components/auth/AuthProvider";
import { useSubscription } from "@/hooks/useBilling";

const iconMap = {
  dashboard: IconLayoutDashboard,
  map: IconMap2,
  car: IconCar,
  users: IconUsers,
  staff: IconUserCog,
  mechanics: IconBriefcase2,
  tool: IconTool,
  reports: IconReportAnalytics,
  finance: IconBriefcase2,
  fuel: IconGasStation,
  billing: IconCreditCard,
  settings: IconSettings,
  routes: IconRoute,
};

export default function Sidebar({ sidebarWidth }: { sidebarWidth: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, clearSession } = useAuthState();
  const shouldCheckPlan = role === "ADMIN" || role === "DISPATCHER";
  const subscriptionQuery = useSubscription(shouldCheckPlan);
  const limits = subscriptionQuery.data?.data?.limits;
  const menu = getVisibleMenuItems(role).map((item) => ({
    ...item,
    locked:
      (item.path === "/reports" && limits?.features?.reportsExport === false) ||
      (item.path === "/live-tracking" && limits?.features?.liveTracking === false),
  }));

  return (
    <aside
      className={clsx(
        "flex h-full flex-col overflow-y-auto overflow-x-hidden py-4 transition-all",
        "bg-white text-slate-900",
        sidebarWidth ? "w-[250px]" : "w-[70px] items-center"
      )}
    >
      <div
        className={clsx(
          "flex px-3 pb-5",
          sidebarWidth ? "justify-center" : "items-center justify-center"
        )}
      >
        <div className={clsx("flex items-center", sidebarWidth ? "gap-3" : "justify-center")}>
          <div
            className="flex items-center justify-center rounded-xl border border-green-200 bg-green-50 text-primary"
            style={{
              width: sidebarWidth ? "44px" : "40px",
              height: sidebarWidth ? "44px" : "40px",
            }}
            title="FleetWise"
          >
            <IconTruck
              size={sidebarWidth ? 26 : 24}
              stroke={1.8}
              className="text-primary"
            />
          </div>
          {sidebarWidth && (
            <div>
              <p className="text-base font-extrabold tracking-tight text-ink">FleetWise</p>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">
                Operations
              </p>
            </div>
          )}
        </div>
      </div>

      <ul className="w-full flex-1 space-y-1.5 px-2">
        {menu.map((item) => {
          const isActive = pathname === item.path;
          const Icon =
            iconMap[item.icon as keyof typeof iconMap] || IconLayoutDashboard;
          return (
            <li key={item.path}>
              <Link
                href={item.path}
                prefetch
                aria-disabled={item.locked}
                tabIndex={item.locked ? -1 : 0}
                onClick={(event) => {
                  if (!item.locked) return;
                  event.preventDefault();
                }}
                onMouseEnter={() => {
                  if (!item.locked) router.prefetch(item.path);
                }}
                onFocus={() => {
                  if (!item.locked) router.prefetch(item.path);
                }}
                className={clsx(
                  "flex min-h-11 items-center rounded-xl border text-sm transition-colors duration-200",
                  item.locked
                    ? "cursor-not-allowed border-transparent text-slate-400 opacity-60"
                    : isActive
                    ? "border-green-200 bg-green-50 text-primary"
                    : "border-transparent text-slate-600 hover:border-green-100 hover:bg-green-50 hover:text-primary",
                  sidebarWidth
                    ? "gap-3 px-3 py-2.5 justify-start"
                    : "px-0 py-3 justify-center"
                )}
              >
                <Icon
                  size={sidebarWidth ? 22 : 24}
                  stroke={1.7}
                  className={clsx(
                    item.locked ? "text-slate-400" : isActive ? "text-primary" : "text-slate-500",
                  )}
                />
                {sidebarWidth && (
                  <span className="flex min-w-0 flex-1 items-center justify-between gap-2">
                    <span
                      className={clsx(
                        "truncate font-semibold",
                        isActive ? "text-primary" : "text-slate-700"
                      )}
                    >
                      {item.name}
                    </span>
                    {item.locked && <IconLock size={14} className="shrink-0 text-amber-600" />}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

        <div className="border-t border-line px-3 pt-3">
          <button
            onClick={() => {
              router.replace("/login");
              void clearSession();
            }}
            className={clsx(
              "flex min-h-11 w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-green-100 hover:bg-green-50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60",
              sidebarWidth ? "justify-start" : "justify-center"
            )}
          >
            <IconLogout size={18} />
            {sidebarWidth && <span className="font-semibold text-[15px]">Logout</span>}
          </button>
        </div>
    </aside>
  );
}
