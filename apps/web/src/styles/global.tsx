"use client";

import { css, Global } from "@emotion/react";

const globalStyles = css`
  /* ===== CSS Variables (Light) ===== */
  :root {
    --background: #f4f4ff;
    --foreground: #16161d;
    --primary: #8807ff;
    --primary-foreground: #f4f4ff;
    --card: #ffffff;
    --card-foreground: #16161d;
    --popover: #ffffff;
    --popover-foreground: #16161d;
    --secondary: #e2cffc;
    --secondary-foreground: #2e005c;
    --muted: #e5e5e6;
    --muted-foreground: #61616b;
    --accent: #a14cf6;
    --accent-foreground: #ffffff;
    --destructive: #e2003c;
    --destructive-foreground: #ffffff;
    --border: #cacace;
    --input: #cacace;
    --ring: #8807ff;
    --chart-1: #630abd;
    --chart-2: #47038b;
    --chart-3: #ba75ff;
    --chart-4: #d1a3ff;
    --chart-5: #a14cf6;
    --radius: 0.625rem;
    --sidebar: #f2f2f2;
    --sidebar-foreground: #16161d;
    --sidebar-primary: #8807ff;
    --sidebar-primary-foreground: #f4f4ff;
    --sidebar-accent: #cacab6;
    --sidebar-accent-foreground: #16161d;
    --sidebar-border: #cacace;
    --sidebar-ring: #8807ff;
  }
  /* ===== Dark mode (.dark on html/body) ===== */
  .dark {
    --background: #16161d;
    --foreground: #f4f4ff;
    --card: #22222b;
    --card-foreground: #f4f4ff;
    --popover: #22222b;
    --popover-foreground: #f4f4ff;
    --primary: #8807ff;
    --primary-foreground: #f4f4ff;
    --secondary: #42242d;
    --secondary-foreground: #f4f4ff;
    --muted: #24242d;
    --muted-foreground: #878792;
    --accent: #47038b;
    --accent-foreground: #f4f4ff;
    --destructive: #2e005c;
    --destructive-foreground: #f4f4ff;
    --border: #61616b;
    --input: #61616b;
    --ring: #8807ff;
    --chart-1: #8807ff;
    --chart-2: #a14cf6;
    --chart-3: #47038b;
    --chart-4: #630abd;
    --chart-5: #ba75ff;
    --sidebar: #22222b;
    --sidebar-foreground: #f4f4ff;
    --sidebar-primary: #8807ff;
    --sidebar-primary-foreground: #f4f4ff;
    --sidebar-accent: #2e005c;
    --sidebar-accent-foreground: #f4f4ff;
    --sidebar-border: #61616b;
    --sidebar-ring: #8807ff;
  }
  /* ===== Base (tailwind @layer base 대체) ===== */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  html,
  body {
    height: 100%;
  }
  body {
    margin: 0;
    background: var(--background);
    color: var(--foreground);
    font-family:
      "Geist",
      system-ui,
      -apple-system,
      Segoe UI,
      Roboto,
      "Helvetica Neue",
      Arial,
      "Noto Sans",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol";
  }

  @supports (-webkit-touch-callout: none) {
    input,
    textarea,
    select {
      font-size: 16px !important;
    }
  }

  @supports (-webkit-touch-callout: none) {
    input,
    textarea,
    select,
    button {
      border-radius: 0 !important;
      box-shadow: none !important;
    }
  }
  input:focus,
  textarea:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.4); /* 예시 */
  }

  /* border & outline defaults (border-border, outline-ring/50 대체) */
  * {
    border-color: var(--border);
    outline-color: color-mix(in oklch, var(--ring) 50%, transparent);
    outline-offset: 0.1rem;
  }
  :where(button, a, input, textarea, select):focus-visible {
    outline-style: solid;
    outline-width: 2px;
  }

  .layout {
    min-height: 100dvh; /* 또는 100svh (iOS Safari 대응) */
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    background-color: white;
    min-height: 90vh;
    // padding-top: calc(var(--header-height));
  }
`;

export const GlobalStyles = () => {
  return <Global styles={globalStyles} />;
};
