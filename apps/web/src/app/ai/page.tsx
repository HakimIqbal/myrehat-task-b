"use client";

import { useChat } from "@ai-sdk/react";
import { Bubble, BubbleContent } from "@myrehat-task-b/ui/components/bubble";
import { Button } from "@myrehat-task-b/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@myrehat-task-b/ui/components/input-group";
import {
  Message,
  MessageContent as MessageBody,
  MessageHeader,
} from "@myrehat-task-b/ui/components/message";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@myrehat-task-b/ui/components/message-scroller";
import { Tooltip, TooltipContent, TooltipTrigger } from "@myrehat-task-b/ui/components/tooltip";
import { DefaultChatTransport } from "ai";
import {
  ArrowUpIcon,
  Bot,
  Compass,
  Home,
  Loader2,
  RotateCwIcon,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Streamdown } from "streamdown";

import { ENV } from "../../env";

const SUGGESTIONS = [
  {
    icon: Home,
    title: "Cameron Highlands Stay",
    prompt: "Recommend the best homestay options in Cameron Highlands for a family retreat.",
  },
  {
    icon: Compass,
    title: "BuyHomestay Process",
    prompt: "How does buying an established Airbnb Profile or homestay business work on MyRehat?",
  },
  {
    icon: Zap,
    title: "Direct Host Pricing",
    prompt: "What are the benefits of booking directly with hosts compared to conventional platforms?",
  },
];

export default function AIPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: `${ENV.NEXT_PUBLIC_SERVER_URL}/ai`,
    }),
  });
  const isSending = status === "submitted" || status === "streaming";

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;
    sendMessage({ text });
    setInput("");
  };

  const handlePromptKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    if (isSending) return;
    sendMessage({ text: prompt });
  };

  const resetConversation = () => {
    setInput("");
    setMessages([]);
  };

  return (
    <MessageScrollerProvider>
      <div className="flex h-[calc(100vh-4rem)] min-h-[500px] w-full flex-col bg-background">
        {/* Concierge Status Header */}
        <header className="shrink-0 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex size-9 items-center justify-center rounded-full border border-border/50 bg-muted/40 text-foreground">
                <Bot className="size-4" />
                <span className="absolute bottom-0 right-0 size-2 rounded-full border-2 border-background bg-emerald-500" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-semibold text-foreground">MyRehat AI Concierge</h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.2 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Direct host inquiries & homestay recommendations
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label="Reset conversation"
                      onClick={resetConversation}
                      disabled={isSending}
                      className="rounded-full size-8"
                    />
                  }
                >
                  <RotateCwIcon className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>Reset conversation</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </header>

        {/* Chat History & Messages Body */}
        <main className="min-h-0 flex-1 overflow-y-auto">
          {messages.length === 0 && !isSending ? (
            <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center px-4 py-8 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border border-border/50 bg-muted/30 text-foreground shadow-2xs">
                <Bot className="size-5 text-muted-foreground" />
              </div>
              <h2 className="text-lg font-bold text-foreground">
                How can MyRehat help today?
              </h2>
              <p className="mt-1 max-w-md text-xs text-muted-foreground leading-relaxed">
                Ask about direct booking with hosts, Cameron Highlands & Penang stays, or exploring BuyHomestay listings and business acquisitions.
              </p>

              {/* Suggestion Chips */}
              <div className="mt-6 grid w-full max-w-xl grid-cols-1 gap-2.5 sm:grid-cols-3">
                {SUGGESTIONS.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(item.prompt)}
                      className="flex flex-col items-start gap-1.5 rounded-xl border border-border/70 bg-card p-3 text-left transition-all hover:border-primary/40 hover:bg-muted/40 hover:shadow-xs cursor-pointer group"
                    >
                      <div className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                        <Icon className="size-3.5" />
                      </div>
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.title}
                      </span>
                      <span className="line-clamp-2 text-[11px] text-muted-foreground">
                        {item.prompt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent
                  aria-busy={isSending}
                  className="mx-auto w-full max-w-3xl px-4 py-6 space-y-4"
                >
                  {messages.map((message) => {
                    const isUser = message.role === "user";

                    return (
                      <MessageScrollerItem key={message.id} scrollAnchor={isUser}>
                        <Message align={isUser ? "end" : "start"}>
                          <MessageBody>
                            <MessageHeader className="text-[11px] text-muted-foreground">
                              {isUser ? "You" : "MyRehat Concierge"}
                            </MessageHeader>
                            <Bubble
                              align={isUser ? "end" : "start"}
                              variant={isUser ? "default" : "secondary"}
                              className={`rounded-2xl text-xs leading-relaxed ${
                                isUser
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted/80 text-foreground border border-border/50"
                              }`}
                            >
                              <BubbleContent className="p-3.5">
                                {message.parts?.map((part, index) => {
                                  if (part.type === "text") {
                                    return (
                                      <Streamdown
                                        key={index}
                                        isAnimating={
                                          status === "streaming" && message.role === "assistant"
                                        }
                                      >
                                        {part.text}
                                      </Streamdown>
                                    );
                                  }
                                  return null;
                                })}
                              </BubbleContent>
                            </Bubble>
                          </MessageBody>
                        </Message>
                      </MessageScrollerItem>
                    );
                  })}
                  {status === "submitted" && (
                    <MessageScrollerItem>
                      <Message align="start">
                        <MessageBody>
                          <Bubble
                            variant="secondary"
                            className="rounded-2xl bg-muted/80 border border-border/50"
                          >
                            <BubbleContent className="flex items-center gap-2 p-3 text-xs text-muted-foreground">
                              <Loader2 className="size-3.5 animate-spin text-primary" />
                              <span>Concierge is drafting a response...</span>
                            </BubbleContent>
                          </Bubble>
                        </MessageBody>
                      </Message>
                    </MessageScrollerItem>
                  )}
                  <MessageScrollerItem scrollAnchor />
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          )}
        </main>

        {/* Input Bar */}
        <footer className="shrink-0 border-t border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
            <form onSubmit={handleSubmit} className="w-full">
              <InputGroup className="rounded-2xl border-border/70 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
                <InputGroupTextarea
                  name="prompt"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handlePromptKeyDown}
                  placeholder="Ask MyRehat Concierge about direct homestays, rates, or listings..."
                  className="max-h-32 min-h-12 text-xs py-2.5 px-3 resize-none"
                  rows={1}
                  autoComplete="off"
                  autoFocus
                  disabled={isSending}
                />
                <InputGroupAddon align="block-end" className="pb-1.5 pr-1.5">
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    disabled={isSending || !input.trim()}
                    className="ml-auto size-7 rounded-full shadow-xs"
                  >
                    {isSending ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <ArrowUpIcon className="size-3.5" />
                    )}
                    <span className="sr-only">Send message</span>
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
            </form>
            <p className="text-center text-[10px] text-muted-foreground">
              Powered by OpenRouter AI &bull; Direct booking inquiries handled via WAHA webhook
            </p>
          </div>
        </footer>
      </div>
    </MessageScrollerProvider>
  );
}
