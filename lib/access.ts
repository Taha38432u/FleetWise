export type UserRole = "SUPER_ADMIN" | "ADMIN" | "DISPATCHER" | "DRIVER" | "MECHANIC";

export interface MenuItem {
  name: string;
  path: string;
  icon: string;
  roles: UserRole[];
}

export const menuItems: MenuItem[] = [
  {
    name: "SaaS Owner",
    path: "/owner",
    icon: "staff",
    roles: ["SUPER_ADMIN"],
  },
  {
    name: "Command Center",
    path: "/dashboard",
    icon: "dashboard",
    roles: ["ADMIN", "DISPATCHER", "DRIVER", "MECHANIC"],
  },
  {
    name: "Live Tracking",
    path: "/live-tracking",
    icon: "map",
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    name: "Vehicles",
    path: "/vehicles",
    icon: "car",
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    name: "Drivers",
    path: "/drivers",
    icon: "users",
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    name: "Staff",
    path: "/staff",
    icon: "staff",
    roles: ["ADMIN"],
  },
  {
    name: "Mechanics",
    path: "/mechanics",
    icon: "mechanics",
    roles: ["ADMIN", "DISPATCHER", "MECHANIC"],
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    icon: "tool",
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    name: "Routes",
    path: "/routes",
    icon: "routes",
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    name: "Fuel",
    path: "/fuel",
    icon: "fuel",
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    name: "My Routes",
    path: "/my-routes",
    icon: "routes",
    roles: ["DRIVER"],
  },
  {
    name: "Fleet Costs",
    path: "/finance",
    icon: "finance",
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    name: "Reports",
    path: "/reports",
    icon: "reports",
    roles: ["ADMIN", "DISPATCHER"],
  },
  {
    name: "Subscription",
    path: "/billing",
    icon: "billing",
    roles: ["ADMIN"],
  },
  {
    name: "Settings",
    path: "/settings",
    icon: "settings",
    roles: ["ADMIN", "DISPATCHER", "DRIVER", "MECHANIC"],
  },
];

export const roleLandingRoute: Record<UserRole, string> = {
  SUPER_ADMIN: "/owner",
  ADMIN: "/dashboard",
  DISPATCHER: "/dashboard",
  DRIVER: "/dashboard",
  MECHANIC: "/mechanics",
};

export type PlanFeatureKey = "reportsExport" | "liveTracking";

export function getPlanFeatureForPath(pathname: string): PlanFeatureKey | null {
  const normalizedPath = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
  if (normalizedPath === "/reports" || normalizedPath.startsWith("/reports/")) {
    return "reportsExport";
  }
  if (normalizedPath === "/live-tracking" || normalizedPath.startsWith("/live-tracking/")) {
    return "liveTracking";
  }
  return null;
}

export function isPlanPathAllowed(
  pathname: string,
  features?: Partial<Record<PlanFeatureKey, boolean>>,
) {
  const feature = getPlanFeatureForPath(pathname);
  return !feature || features?.[feature] !== false;
}

export function getDefaultRouteForRole(role?: UserRole | null) {
  if (!role) {
    return "/login";
  }

  return roleLandingRoute[role] || "/dashboard";
}

export function canAccessPath(role: UserRole | null | undefined, pathname: string) {
  if (!role) {
    return false;
  }

  const normalizedPath = pathname === "/" ? pathname : pathname.replace(/\/+$/, "");
  if (role === "SUPER_ADMIN") {
    return true;
  }
  return menuItems.some((item) => {
    const itemPath = item.path === "/" ? item.path : item.path.replace(/\/+$/, "");
    return (
      item.roles.includes(role) &&
      (normalizedPath === itemPath || normalizedPath.startsWith(`${itemPath}/`))
    );
  });
}

export function getVisibleMenuItems(role: UserRole | null | undefined) {
  if (!role) {
    return [];
  }

  return menuItems.filter((item) => item.roles.includes(role));
}
