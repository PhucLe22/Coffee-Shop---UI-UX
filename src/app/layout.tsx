import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Plus_Jakarta_Sans,
  Inter,
  Pacifico,
} from "next/font/google";
import "./globals.css";
import ResponsiveLayout from "@/app/layouts/main-layout";
import QueryProvider from "@/app/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Amber Roast",
  description: "Hệ thống quản lý và đặt hàng Amber Roast",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${plusJakartaSans.variable} ${inter.variable} ${pacifico.variable} antialiased`}>
        <QueryProvider>
          <ResponsiveLayout>{children}</ResponsiveLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
