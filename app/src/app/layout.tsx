import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/sidebar/sidebar";
import Footer from "../components/footer/footer";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Bg from "../components/background/background";
import { ThemeManager, MoodSelector } from "../components/theme/theme";

export const metadata: Metadata = {
  title: "Upayan",
  description: "Welcome to my portfolio website!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta property="og:title" content="Upayan" />
        <meta
          property="og:description"
          content="Welcome to my portfolio website!"
        />
        <meta property="og:image" content="/icons/icon-512x512.webp" />
        <meta property="og:url" content="https://upayan.dev" />
        <meta property="og:type" content="website" />
      </head>
      <body>
        <Bg>
          <ThemeManager>
            <MoodSelector />
            <Sidebar />
            {children}
            <Footer />
            <SpeedInsights />
          </ThemeManager>
        </Bg>
      </body>
    </html>
  );
}
