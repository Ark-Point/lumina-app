"use client";

import { silkscreen } from "@/app/fonts/silkscreen";
import ChatIcon from "@/app/miniapp/asset/button/chat-send.svg";
import { APP_NAME } from "@/app/miniapp/constant/mini-app";
import styled from "@emotion/styled";
import { useMiniApp } from "@neynar/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "../Button";
import {
  ChatContent,
  ChatLayout,
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
  const chatContentRef = useRef<HTMLDivElement | null>(null);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const isUserScrollingRef = useRef(false);

  const conversationId = useMemo(() => {
    if (context?.user?.fid) {
      return `miniapp-${context.user.fid}`;
    }
    return fallbackConversationId;
  }, [context?.user?.fid, fallbackConversationId]);

  useEffect(() => {
    if (isUserScrollingRef.current) {
      return;
    }
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [conversation]);

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
    isUserScrollingRef.current = false;

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

  const handleChatScroll = useCallback(() => {
    const element = chatContentRef.current;
    if (!element) return;
    const { scrollTop, scrollHeight, clientHeight } = element;
    // const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
    const threshold = 60;
    isUserScrollingRef.current = distanceFromBottom > threshold;
  }, []);
  const renderLogo = () => {
    return (
      <img
        src="/miniapp/opengraph-image.png"
        // alt={`${appDisplayName} logo`}
        style={{ width: "12rem", height: "6rem", alignSelf: "center" }}
      />
    );
  };

  return (
    <ChatLayout>
      <ChatContent ref={chatContentRef} onScroll={handleChatScroll}>
        {/* <HomeTitle>Put your content here!</HomeTitle> */}
        {/* <HomeSubtitle>Powered by Neynar 🪐</HomeSubtitle> */}

        <ChatContainer>
          <ChatWelcomeBox>
            <ChatWelcomeWrapper>
              <ChatWelcomeTitleWrapper>
                <Label
                  className={silkscreen.className}
                  style={{
                    color: "var(--Primitive-Purple-6, #8807FF)",
                    textAlign: "center",
                    fontSize: "0.875rem",
                    fontStyle: "normal",
                    fontWeight: 400,
                    lineHeight: "normal",
                  }}
                >
                  Welcome!
                </Label>
              </ChatWelcomeTitleWrapper>
              {renderLogo()}
              <Label
                className={silkscreen.className}
                style={{
                  color: `var(--Primitive-Gray-9, #16161D)`,
                  textAlign: `center`,
                  // fontFamily: "Pretendard",
                  fontSize: `1.125rem`,
                  fontStyle: `normal`,
                  fontWeight: 600,
                  lineHeight: `normal`,
                  paddingBottom: "0.5rem",
                }}
              >
                Lumina Agent
              </Label>
              <Label
                className={silkscreen.className}
                style={{
                  color: `var(--Primitive-Gray-6, #747480)`,
                  textAlign: `center`,
                  // fontFamily: `Pretendard`,
                  fontSize: `0.75rem`,
                  fontStyle: `normal`,
                  fontWeight: 400,
                  lineHeight: `normal`,
                }}
              >
                Chat with the {appDisplayName} agent in real time.
              </Label>
            </ChatWelcomeWrapper>
          </ChatWelcomeBox>

          {conversation.length === 0 ? (
            <EmptyState>Start the conversation with Lumina agent</EmptyState>
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
                  ["en-US"],
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
                        style={{ width: "3.375rem", height: "3.375rem" }}
                      />
                    );
                  }
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
                    <ChatBubbleAndTimeWrapper $isUser={isUser}>
                      {isUser && <ChatTimestamp>{timestamp}</ChatTimestamp>}
                      <ChatBubble $isUser={isUser}>
                        <ChatBubbleBody>{entry.content}</ChatBubbleBody>
                      </ChatBubble>
                      {!isUser && (
                        <ChatTimeAndCreateCoinWrapper>
                          <CreateCoinButton
                            name={`${context?.user?.username ?? address} Lumina research`}
                            symbol={`${context?.user?.username?.slice(0, 5).toLocaleUpperCase() ?? address?.slice(2, 7).toLocaleUpperCase()}$LUM`}
                            description={`Lumina Q&A Token by ${context?.user?.username ?? address}`}
                            properties={data}
                          />

                          <ChatTimestamp>{timestamp}</ChatTimestamp>
                        </ChatTimeAndCreateCoinWrapper>
                      )}
                    </ChatBubbleAndTimeWrapper>
                    {/* {isUser && renderAvatar()} */}
                  </ChatMessage>
                );
              })}
              {agentError && (
                <StatusMessage style={{ color: "var(--destructive, #ef4444)" }}>
                  {agentError}
                </StatusMessage>
              )}
            </ChatList>
          )}
          <div ref={endOfMessagesRef} />
        </ChatContainer>
      </ChatContent>
      <ChatInputWrapper>
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
              <span aria-hidden="true">
                <Image src={ChatIcon} alt="" width={24} height={24} />
              </span>
            </Button>
          </ChatActions>
        </ChatInputArea>
      </ChatInputWrapper>
    </ChatLayout>
  );
}

const ChatContainer = styled.div`
  padding: 0.875rem;

  /* height: 100%; */
  // gap: 1rem;
  overflow: scroll;
  /* min-height: calc(100% - 74px - 5.5rem); */
  justify-content: flex-end;
  /* background-color: blue; */

  -ms-overflow-style: none; /* IE/Edge */
  scrollbar-width: none; /* Firefox */
  .no-scrollbar::-webkit-scrollbar {
    display: none; /* Chrome/Safari */
  }
`;

const ChatWelcomeBox = styled.div`
  /* margin: 0 2.5rem; */
  padding: 3.5rem 2.25rem;
  display: flex;
  flex-direction: column;
  /* gap: 0.25rem; */
  border-radius: 8px;
  border: 1px solid var(--Primitive-Purple-5, #a14cf6);
  background: var(--Primitive-Purple-1, #f4f0ff);
`;

const ChatWelcomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChatWelcomeTitleWrapper = styled.div`
  margin-bottom: 1rem;
`;

const EmptyState = styled.div`
  padding: 7rem 4rem 1.5rem 4rem;
  color: var(--Primitive-Gray-8, #22222b);
  text-align: center;
  font-family: Pretendard;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ChatList = styled.ul`
  list-style: none;
  padding-inline-start: 0; /* 논리 속성으로 좌우 대응 */

  margin: 0;
  /* padding: 1.5rem 1rem; */
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChatMessage = styled.li<{ $isUser: boolean }>`
  display: flex;
  flex-direction: ${({ $isUser }) => ($isUser ? "row" : "column")};
  /* align-items: flex-end; */
  align-self: stretch;
  /* gap: 0.75rem; */
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
  /* background-color: ${({ $isUser }) =>
    $isUser ? "var(--primary, #6366f1)" : "rgba(243, 244, 246, 0.95)"}; */
  color: ${({ $isUser }) => ($isUser ? "#ffffff" : "#111827")};
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
`;

const ChatBubble = styled.div<{ $isUser: boolean }>`
  /* width: min(100%, 19.5rem);
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
  } */
  display: flex;
  padding: 1rem 1.125rem;

  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  border: ${({ $isUser }) =>
    $isUser
      ? "1px solid var(--Primitive-Purple-4, #ba75ff)"
      : "1px solid var(--Primitive-Gray-4, #BABAC0)"};
  background: ${({ $isUser }) =>
    $isUser
      ? "var(--Primitive-Purple-1, #f4f0ff)"
      : "var(--Primitive-White, #FFF)"};
`;

const ChatBubbleAndTimeWrapper = styled.div<{ $isUser: boolean }>`
  padding: ${({ $isUser }) => ($isUser ? "1rem 0" : "0.5rem 0 0 0")};
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  flex-direction: row;
  gap: 1rem;
`;

const ChatTimeAndCreateCoinWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const ChatBubbleBody = styled.div`
  color: var(--Primitive-Gray-9, #16161d);
  font-family: Pretendard;

  font-style: normal;
  font-weight: 400;

  /* padding: 0.75rem 1rem 1rem; */
  font-size: 0.875rem;
  line-height: 1.5;
  white-space: pre-wrap;
  /* background-color: red; */
`;

const ChatName = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 0.875rem;
`;

const ChatTimestamp = styled.time`
  /* font-size: 0.75rem;
  color: rgba(107, 114, 128, 0.8);

  .dark & {
    color: rgba(156, 163, 175, 0.75);
  } */
  color: var(--Primitive-Gray-7, #42424d);
  text-align: center;
  font-family: Pretendard;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: normal;
`;
const ChatInputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;
const ChatInputArea = styled.div`
  display: flex;
  flex-direction: row;
`;

const ChatActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;
