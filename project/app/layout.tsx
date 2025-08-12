import QueryClientProvider from "@/components/ui/query-client-provider";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Project Management Tool",
  description: "Team collaboration and project management platform",
  generator: "v0.dev"
};

type RootLayout = { children: React.ReactNode };

export default function RootLayout({ children }: RootLayout) {
  return (
    <html lang="en">
      <body
        className={cn("bg-neutral-100 dark:bg-neutral-900", inter.className)}>
        <ClerkProvider
          afterSignOutUrl="/sign-in"
          appearance={{ cssLayerName: "clerk" }}>
          <QueryClientProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </QueryClientProvider>
        </ClerkProvider>
        <Toaster position="bottom-left" />
      </body>
    </html>
  );
}
