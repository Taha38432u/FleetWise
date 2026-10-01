"use client";

import "@mantine/core/styles.css";
import "./globals.css";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Outfit } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/components/auth/AuthProvider";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps} data-mantine-color-scheme="light">
      <body className={`${outfit.className} font-main antialiased`}>
        <MantineProvider
          theme={{
            fontFamily: "var(--font-outfit)",
            primaryColor: "green",
            defaultRadius: "md",
            colors: {
              green: [
                "#f6fbf7",
                "#e7f6ed",
                "#cfead8",
                "#a9d8b8",
                "#7fc092",
                "#4d9f68",
                "#2f8554",
                "#157347",
                "#0f5f3a",
                "#0b3d27",
              ],
            },
            components: {
              Button: {
                defaultProps: {
                  color: "green",
                },
              },
              ThemeIcon: {
                defaultProps: {
                  color: "green",
                  variant: "light",
                },
              },
              Badge: {
                defaultProps: {
                  color: "green",
                },
              },
            },
          }}
        >
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              {children}

              <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
              />
            </AuthProvider>
          </QueryClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
