"use client";

import { useMiniApp } from "@neynar/react";
import {
  ContextCard,
  ContextHeading,
  ContextPre,
  ContextWrapper,
} from "../components/Tabs";

/**
 * ContextTab component displays the current mini app context in JSON format.
 * 
 * This component provides a developer-friendly view of the Farcaster mini app context,
 * including user information, client details, and other contextual data. It's useful
 * for debugging and understanding what data is available to the mini app.
 * 
 * The context includes:
 * - User information (FID, username, display name, profile picture)
 * - Client information (safe area insets, platform details)
 * - Mini app configuration and state
 * 
 * @example
 * ```tsx
 * <ContextTab />
 * ```
 */
export function ContextTab() {
  const { context } = useMiniApp();
  
  return (
    <ContextWrapper>
      <ContextHeading>Context</ContextHeading>
      <ContextCard>
        <ContextPre>{JSON.stringify(context, null, 2)}</ContextPre>
      </ContextCard>
    </ContextWrapper>
  );
}
