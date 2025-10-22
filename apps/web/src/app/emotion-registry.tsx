"use client";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { useState } from "react";

export default function EmotionRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cache] = useState(() => {
    const c = createCache({ key: "css", prepend: true });
    c.compat = true;
    return c;
  });

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys((cache as any).inserted).join(" ")}`}
      dangerouslySetInnerHTML={{
        __html: (cache as any).sheet.tags
          .map((t: any) => t.textContent)
          .join(""),
      }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}
