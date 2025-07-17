import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Devices from "../components/ui/Devices/Devices";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Background from "../components/ui/Background/Background";

// Load fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata: Metadata = {
  title: "Upayan",
  description: "",
};

// Layout Component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        style={{
          margin: "0",
          padding: "0",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#0a0a0a",
        }}
      >
        <Background />
        <Devices>{children}</Devices>
        <SpeedInsights />
      </body>
    </html>
  );
}
