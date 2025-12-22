"use client";

import "@mantine/core/styles.css";
import "./globals.css";
import { MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Inter } from "next/font/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Load Inter font
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps} data-mantine-color-scheme="light">
      <body className={`${inter.className} font-main antialiased`}>
        <MantineProvider
          theme={{
            fontFamily: "var(--font-inter)",
            primaryColor: "blue",
          }}
        >
          {/* React Query Provider */}
          <QueryClientProvider client={queryClient}>
            {children}

            {/* Toast Container */}
            <ToastContainer
              position="top-right"
              autoClose={1500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
            />
          </QueryClientProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
