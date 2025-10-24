import localFont from "next/font/local";

export const silkscreen = localFont({
  src: [
    {
      path: "./silkscreen/Silkscreen-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./silkscreen/Silkscreen-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-silkscreen",
  display: "swap",
  preload: true,
});
