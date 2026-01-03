"use client";
import "dayjs/locale/en"; // Import dayjs locale
import "@mantine/dates/styles.css"; // Import Mantine dates styles
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => setMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [matches, query]);

  return matches;
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(true);
  const isMobile = useMediaQuery("(max-width: 575px)");

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    } else {
      setTimeout(() => {
        setIsAuthChecked(true);
      });
    }
  }, [router]);

  // Collapse sidebar automatically on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarWidth(false);
    }
  }, [isMobile]);

  if (!isAuthChecked) return null;

  return (
    <div className="flex w-full h-screen overflow-hidden">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out shadow-lg ${
          sidebarWidth ? "w-[250px]" : "w-[70px]"
        } h-full`}
      >
        <Sidebar sidebarWidth={sidebarWidth} />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full overflow-hidden bg-gray-50">
        <Header toggleSidebar={() => setSidebarWidth((prev) => !prev)} />

        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}
