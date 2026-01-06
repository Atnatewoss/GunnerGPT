import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Navbar } from "@/components/layout/Navbar";
import { ZoomWrapper } from "../components/layout/ZoomWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-red-100 selection:text-red-900`}
      >
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <ZoomWrapper>
            {children}
          </ZoomWrapper>
        </div>
      </body>
    </html>
  );
}
