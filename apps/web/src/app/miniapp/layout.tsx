import type { Metadata } from "next";

import { APP_DESCRIPTION, APP_NAME } from "./constant/mini-app";
// import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <html lang="en">
    //   <body>
    //     <Providers>{children}</Providers>
    //   </body>
    // </html>
    <Providers>{children}</Providers>
  );
}
