"use client";

import { APP_NAME } from "@/app/miniapp/constant/mini-app";
import styled from "@emotion/styled";
import { useMiniApp } from "@neynar/react";
import { useCallback, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "../Button";
import {
  HomeContent,
  HomeLayout,
  StatusMessage,
  StyledTextArea,
} from "../components";
import { CreateCoinButton } from "../components/coin/create/button";
import { Label } from "../label";

const LLM_AGENT_URL = process.env.NEXT_PUBLIC_LLM_AGENT_URL;

type ConversationEntry = {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

/**
 * ChatTab component displays the main landing content for the mini app.
 *
 * This is the default tab that users see when they first open the mini app.
 * It provides a simple welcome message and placeholder content that can be
 * customized for specific use cases.
 *
 * @example
 * ```tsx
 * <ChatTab />
 * ```
 */
export function ChatTab() {
  const { context } = useMiniApp();
  const { address } = useAccount();
  const appDisplayName = APP_NAME?.trim() || "Lumina Mini App";

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
      {
        role: "user",
        content: trimmedPrompt,
        timestamp: new Date().toISOString(),
      },
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
        {
          role: "assistant",
          content: reply,
          timestamp: new Date().toISOString(),
        },
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
        {/* <HomeTitle>Put your content here!</HomeTitle> */}
        {/* <HomeSubtitle>Powered by Neynar 🪐</HomeSubtitle> */}

        <ChatContainer>
          <ChatHeaderRow>
            <Label htmlFor="llm-agent-input">LLM Agent Playground</Label>
            <ChatHint>
              Chat with the {appDisplayName} agent in real time.
            </ChatHint>
          </ChatHeaderRow>

          {conversation.length === 0 ? (
            <EmptyState>
              Start the conversation with a question about your mini app.
            </EmptyState>
          ) : (
            <ChatList aria-live="polite" aria-label="Conversation">
              {conversation.map((entry, index) => {
                const isUser = entry.role === "user";
                const displayName = isUser
                  ? context?.user?.displayName ||
                    context?.user?.username ||
                    "You"
                  : `${appDisplayName} Agent`;
                const timestamp = new Date(entry.timestamp).toLocaleTimeString(
                  [],
                  { hour: "2-digit", minute: "2-digit" }
                );
                const userInitial = (
                  context?.user?.displayName ||
                  context?.user?.username ||
                  "You"
                )
                  .charAt(0)
                  .toUpperCase();
                const key = `${entry.role}-${entry.timestamp}-${index}`;

                const renderAvatar = () => {
                  if (!isUser) {
                    return (
                      <ChatAvatar
                        src="/miniapp/icon.png"
                        alt={`${appDisplayName} logo`}
                      />
                    );
                  }

                  if (context?.user?.pfpUrl) {
                    return (
                      <ChatAvatar src={context.user.pfpUrl} alt="Your avatar" />
                    );
                  }

                  return (
                    <ChatAvatarFallback $isUser={isUser}>
                      {userInitial}
                    </ChatAvatarFallback>
                  );
                };

                const data = new Object() as Record<string, string>;
                conversation.forEach((conversation) => {
                  if (conversation.role === "user") {
                    Object.assign(data, {
                      question: conversation.content,
                      timestamp: conversation.timestamp,
                    });
                  } else if (conversation.role === "assistant") {
                    Object.assign(data, {
                      agentAnswer: conversation.content,
                      timestamp: conversation.timestamp,
                    });
                  }
                });

                return (
                  <ChatMessage key={key} $isUser={isUser}>
                    {!isUser && renderAvatar()}
                    <ChatBubble $isUser={isUser}>
                      <ChatBubbleHeader $isUser={isUser}>
                        <ChatName>{displayName}</ChatName>
                        <ChatTimestamp>{timestamp}</ChatTimestamp>
                      </ChatBubbleHeader>
                      <ChatBubbleBody>{entry.content}</ChatBubbleBody>
                      {!isUser && (
                        <CreateCoinButton
                          name={`${context?.user?.username ?? address} Lumina research`}
                          symbol={`LUM${context?.user?.username?.slice(0, 5).toLocaleUpperCase() ?? address?.slice(2, 7).toLocaleUpperCase()}`}
                          description={`Lumina Q&A Token by ${context?.user?.username ?? address}`}
                          properties={data}
                        />
                      )}
                    </ChatBubble>
                    {isUser && renderAvatar()}
                  </ChatMessage>
                );
              })}
            </ChatList>
          )}

          <ChatInputArea>
            <StyledTextArea
              id="llm-agent-input"
              placeholder="Ask the agent anything…"
              value={promptInput}
              onChange={(event) => setPromptInput(event.target.value)}
              disabled={isGenerating || !LLM_AGENT_URL}
            />
            <ChatActions>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !promptInput.trim() || !LLM_AGENT_URL}
                isLoading={isGenerating}
              >
                {isGenerating ? "Generating..." : "Send to Agent"}
              </Button>
            </ChatActions>
          </ChatInputArea>

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
        </ChatContainer>
      </HomeContent>
    </HomeLayout>
  );
}

const ChatContainer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChatHeaderRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const ChatHint = styled.span`
  font-size: 0.75rem;
  line-height: 1.125rem;
  color: rgba(107, 114, 128, 0.8);

  .dark & {
    color: rgba(156, 163, 175, 0.75);
  }
`;

const EmptyState = styled.div`
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px dashed rgba(229, 231, 235, 0.9);
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgba(107, 114, 128, 0.9);

  .dark & {
    border-color: rgba(75, 85, 99, 0.75);
    color: rgba(156, 163, 175, 0.8);
  }
`;

const ChatList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChatMessage = styled.li<{ $isUser: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  justify-content: ${({ $isUser }) => ($isUser ? "flex-end" : "flex-start")};
`;

const ChatAvatar = styled.img`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
`;

const ChatAvatarFallback = styled.div<{ $isUser: boolean }>`
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  display: grid;
  place-items: center;
  font-weight: 600;
  font-size: 1rem;
  background-color: ${({ $isUser }) =>
    $isUser ? "var(--primary, #6366f1)" : "rgba(243, 244, 246, 0.95)"};
  color: ${({ $isUser }) => ($isUser ? "#ffffff" : "#111827")};
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);

  .dark & {
    background-color: ${({ $isUser }) =>
      $isUser
        ? "color-mix(in srgb, #6366f1 85%, #1f2937 15%)"
        : "rgba(31, 41, 55, 0.92)"};
    color: rgba(229, 231, 235, 0.94);
  }
`;

const ChatBubble = styled.div<{ $isUser: boolean }>`
  width: min(100%, 19.5rem);
  border-radius: 0.75rem;
  background-color: ${({ $isUser }) =>
    $isUser ? "var(--primary, #6366f1)" : "rgba(243, 244, 246, 0.95)"};
  color: ${({ $isUser }) => ($isUser ? "#ffffff" : "inherit")};
  border: 1px solid
    ${({ $isUser }) =>
      $isUser
        ? "color-mix(in srgb, #6366f1 72%, #312e81 28%)"
        : "rgba(229, 231, 235, 0.9)"};
  box-shadow: 0 2px 10px rgba(15, 23, 42, 0.12);
  overflow: hidden;

  .dark & {
    background-color: ${({ $isUser }) =>
      $isUser
        ? "color-mix(in srgb, #6366f1 80%, #312e81 20%)"
        : "rgba(31, 41, 55, 0.92)"};
    border-color: ${({ $isUser }) =>
      $isUser ? "rgba(99, 102, 241, 0.65)" : "rgba(55, 65, 81, 0.85)"};
  }
`;

const ChatBubbleHeader = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  padding: 0.75rem 1rem 0.5rem;
  border-bottom: 1px solid
    ${({ $isUser }) =>
      $isUser
        ? "color-mix(in srgb, #4338ca 55%, transparent)"
        : "rgba(209, 213, 219, 0.75)"};

  .dark & {
    border-color: ${({ $isUser }) =>
      $isUser ? "rgba(129, 140, 248, 0.4)" : "rgba(55, 65, 81, 0.75)"};
  }
`;

const ChatBubbleBody = styled.div`
  padding: 0.75rem 1rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const ChatName = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ChatTimestamp = styled.time`
  font-size: 0.75rem;
  color: rgba(107, 114, 128, 0.8);

  .dark & {
    color: rgba(156, 163, 175, 0.75);
  }
`;

const ChatInputArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const ChatActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;
