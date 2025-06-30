import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";
import { ThemeProvider } from "../components/theme/Theme";
import ServiceWorkerRegister from "../components/serviceworkerregister/ServiceWorkerRegister";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Upayan",
  description: "Upayan | Portfolio",
  icons: {
    icon: "/upayan.svg",
    apple: "/upayan.svg",
    shortcut: "/upayan.svg",
  },
  openGraph: {
    title: "Upayan",
    description: "Upayan | Portfolio",
    url: "https://upayan.dev",
    siteName: "Upayan",
    images: [
      {
        url: "/icon.svg",
        width: 144,
        height: 144,
        alt: "Upayan Icon",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Upayan",
    description: "Upayan | Portfolio",
    images: ["/icon.svg"],
    creator: "@upayanmazumder",
  },
  manifest: "/manifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  appleWebApp: {
    capable: true,
    title: "Upayan",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  metadataBase: new URL("https://upayan.dev"),
  alternates: {
    canonical: "https://upayan.dev",
    types: {
      "application/rss+xml": "/feed.xml",
      "application/atom+xml": "/feed.atom",
    },
    languages: {
      "en-US": "/",
      "en-GB": "/gb",
      "fr-FR": "/fr",
      "es-ES": "/es",
      "de-DE": "/de",
    },
  },
  keywords: [
    "upayan",
    "Upayan Mazumder",
    "developer",
    "programmer",
    "software engineer",
    "web developer",
    "portfolio",
    "personal website",
    "upayan.dev",
  ],
  authors: [
    {
      name: "Upayan Mazumder",
      url: "https://upayan.dev",
    },
  ],
  creator: "Upayan Mazumder",
  applicationName: "Upayan",
  publisher: "Upayan Mazumder",
  category: "Portfolio",
};

export const viewport = {
  themeColor: "#C",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
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
          {children}
          <Analytics />
          <ServiceWorkerRegister />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
