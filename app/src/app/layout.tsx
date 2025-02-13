import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/sidebar/sidebar";
import Nav from "../components/nav/nav";
import Footer from "../components/footer/footer";

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
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body>
        <Sidebar />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
