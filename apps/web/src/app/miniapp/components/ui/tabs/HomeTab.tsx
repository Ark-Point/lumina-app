"use client";

import { useMiniApp } from "@neynar/react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "../Button";
import { Label } from "../label";
import {
  ContextCard,
  HomeContent,
  HomeLayout,
  HomeSubtitle,
  HomeTitle,
  SectionStack,
  StatusMessage,
  StyledTextArea,
} from "../components";

const LLM_AGENT_URL = process.env.NEXT_PUBLIC_LLM_AGENT_URL;

type ConversationEntry = {
  role: "user" | "assistant";
  content: string;
};

/**
 * HomeTab component displays the main landing content for the mini app.
 * 
 * This is the default tab that users see when they first open the mini app.
 * It provides a simple welcome message and placeholder content that can be
 * customized for specific use cases.
 * 
 * @example
 * ```tsx
 * <HomeTab />
 * ```
 */
export function HomeTab() {
  const { context } = useMiniApp();

  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [fallbackConversationId] = useState(() =>
    typeof crypto !== "undefined"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );

  const conversationId = useMemo(() => {
    if (context?.user?.fid) {
      return `miniapp-${context.user.fid}`;
    }
    return fallbackConversationId;
  }, [context?.user?.fid, fallbackConversationId]);

  const handleGenerate = useCallback(async () => {
    if (!LLM_AGENT_URL) {
      setAgentError("LLM agent URL is not configured.");
      return;
    }

    const trimmedPrompt = promptInput.trim();
    if (!trimmedPrompt) {
      return;
    }

    setIsGenerating(true);
    setAgentError(null);

    setConversation((prev) => [
      ...prev,
      { role: "user", content: trimmedPrompt },
    ]);
    setPromptInput("");

    try {
      const response = await fetch(`${LLM_AGENT_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: trimmedPrompt }],
          conversationId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        throw new Error(errorText || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const reply: string =
        data?.message ?? data?.content ?? "No response received.";

      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: reply },
      ]);
    } catch (error) {
      console.error("Failed to call LLM agent", error);
      const message =
        error instanceof Error ? error.message : "Unknown error occurred.";
      setAgentError(`Failed to generate response: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [conversationId, promptInput]);

  return (
    <HomeLayout>
      <HomeContent>
        <HomeTitle>Put your content here!</HomeTitle>
        <HomeSubtitle>Powered by Neynar 🪐</HomeSubtitle>

        <div style={{ marginTop: "1.5rem", textAlign: "left" }}>
          <SectionStack>
            <Label htmlFor="llm-agent-input">LLM Agent Playground</Label>
            <StyledTextArea
              id="llm-agent-input"
              placeholder="Ask the agent anything…"
              value={promptInput}
              onChange={(event) => setPromptInput(event.target.value)}
              disabled={isGenerating || !LLM_AGENT_URL}
            />
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !promptInput.trim() || !LLM_AGENT_URL}
              isLoading={isGenerating}
            >
              {isGenerating ? "Generating..." : "Send to Agent"}
            </Button>
            {!LLM_AGENT_URL && (
              <StatusMessage style={{ color: "var(--destructive, #ef4444)" }}>
                Configure NEXT_PUBLIC_LLM_AGENT_URL to enable the agent.
              </StatusMessage>
            )}
            {agentError && (
              <StatusMessage style={{ color: "var(--destructive, #ef4444)" }}>
                {agentError}
              </StatusMessage>
            )}
          </SectionStack>

          {conversation.length > 0 && (
            <ContextCard style={{ marginTop: "1rem" }}>
              <SectionStack>
                {conversation.map((entry, index) => (
                  <div key={`${entry.role}-${index}`}>
                    <p
                      style={{
                        fontWeight: 600,
                        marginBottom: "0.25rem",
                        color:
                          entry.role === "user"
                            ? "var(--primary, #6366f1)"
                            : "inherit",
                      }}
                    >
                      {entry.role === "user" ? "You" : "Agent"}
                    </p>
                    <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                      {entry.content}
                    </p>
                  </div>
                ))}
              </SectionStack>
            </ContextCard>
          )}
        </div>
      </HomeContent>
    </HomeLayout>
  );
}
