import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "AI Web Studio",
  description: "Кабинет организации AI Web Studio",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" suppressHydrationWarning className={manrope.variable}>
      <body className="min-h-svh antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
