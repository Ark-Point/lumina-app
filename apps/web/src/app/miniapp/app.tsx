"use client";

import { APP_NAME } from "@/app/miniapp/constant/mini-app";
import dynamic from "next/dynamic";

// note: dynamic import is required for components that use the Frame SDK
const AppComponent = dynamic(() => import("@/app/miniapp/components/App"), {
  ssr: false,
});

export default function App(
  { title }: { title?: string } = { title: APP_NAME }
) {
  return <AppComponent title={title} />;
}
