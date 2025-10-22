import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
// import { Analytics } from "@vercel/analytics/next"
import { GlobalStyles } from "@/styles/global";
import EmotionRegistry from "./emotion-registry";
// import GlobalLayout from "@/web/layout/global";
// import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sample Web Application",
  description: "Sample Web Application",
  // generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable}`}>
        <EmotionRegistry>
          <GlobalStyles />
          <div>{children}</div>
        </EmotionRegistry>
      </body>
    </html>
  );
}
