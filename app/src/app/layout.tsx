import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { ThemeProvider } from "../components/theme/Theme";
import ServiceWorkerRegister from "../components/serviceworkerregister/ServiceWorkerRegister";

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
        <ThemeProvider>
          <Sidebar />
          <Header />
          {children}
          <ServiceWorkerRegister />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
