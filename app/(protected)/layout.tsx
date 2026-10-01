"use client";
import "dayjs/locale/en";
import "@mantine/dates/styles.css";
import { Loader } from "@mantine/core";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { canAccessPath, getDefaultRouteForRole, isPlanPathAllowed } from "@/lib/access";
import { useAuthState } from "@/components/auth/AuthProvider";
import { useSubscription } from "@/hooks/useBilling";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarWidth, setSidebarWidth] = useState(true);
  const isMobile = useMediaQuery("(max-width: 575px)");
  const { user, role, isAuthenticated, isBootstrapped } = useAuthState();
  const shouldCheckPlan = role === "ADMIN" || role === "DISPATCHER";
  const subscriptionQuery = useSubscription(shouldCheckPlan);
  const planFeatures = subscriptionQuery.data?.data?.limits?.features;

  useEffect(() => {
    if (!isBootstrapped) {
      return;
    }

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!canAccessPath(role, pathname) || !isPlanPathAllowed(pathname, planFeatures)) {
      router.replace(getDefaultRouteForRole(role));
    }
  }, [isAuthenticated, isBootstrapped, pathname, planFeatures, role, router]);

  useEffect(() => {
    if (isMobile) {
      const t = setTimeout(() => setSidebarWidth(false), 0);
      return () => clearTimeout(t);
    }
  }, [isMobile]);

  if (!isBootstrapped || !isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="ui-card-compact flex items-center gap-3 px-6 py-4">
          <Loader size="sm" />
          <span className="text-sm font-medium text-slate-700">
            Loading your FleetWise workspace...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-surface">
      <div
        className={`h-full border-r border-line bg-white transition-[width] duration-200 ${
          sidebarWidth ? "w-[250px]" : "w-[70px]"
        }`}
      >
        <Sidebar sidebarWidth={sidebarWidth} />
      </div>

      <div className="flex flex-col flex-1 h-full overflow-hidden bg-surface">
        <Header toggleSidebar={() => setSidebarWidth((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="ui-shell">{children}</div>
        </main>
      </div>
    </div>
  );
}
