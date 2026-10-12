import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MISE Campus | Student Food Discovery & Ordering",
  description:
    "AI-powered campus food discovery and ordering for university students in Nigeria. Verified cafeteria menus, real student budgets, and zero-queue pickup.",
  keywords: [
    "University of Ibadan food",
    "campus food discovery",
    "student budget meals",
    "cafeteria ordering",
    "Nigerian campus food",
    "UI food vendors",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} font-sans antialiased`}>
      <body className="min-h-screen flex flex-col bg-[#F6F3EC] text-[#24251F]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
