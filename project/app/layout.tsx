import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";

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
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
