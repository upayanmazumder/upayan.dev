import RootLayoutClient from "./RootLayoutClient";

import { SessionProvider } from "next-auth/react";

import React from "react";
export const metadata = {
  title: "Upayan",
  description: "Explore my page",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SessionProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
        </SessionProvider>
      </body>
    </html>
  );
}