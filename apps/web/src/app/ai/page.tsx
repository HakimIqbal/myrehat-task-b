"use client";

import { useChat } from "@ai-sdk/react";
import { Button } from "@myrehat-task-b/ui/components/button";
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
  Loader2,
  RotateCwIcon,
} from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { Streamdown } from "streamdown";

const QUICK_CHIPS = [
  {
    label: "Cameron Highlands stays",
    prompt: "Recommend the best homestay options in Cameron Highlands with scenic valley views.",
  },
  {
    label: "Buying an Airbnb business",
    prompt: "How does acquiring an operating Airbnb Profile work on MyRehat?",
  },
  {
    label: "Direct host pricing",
    prompt: "What are the pricing benefits of booking directly with hosts?",
  },
];

export default function AIPage() {
  const [input, setInput] = useState("");
  // Same-Origin Relative API Path "/ai" to leverage Next.js proxy rewrites
  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/ai",
    }),
  });
  const isSending = status === "submitted" || status === "streaming";
  const hasStarted = messages.length > 0 || isSending;

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
    setInput("");
    sendMessage({ text: prompt });
  };

  const resetConversation = () => {
    setInput("");
    setMessages([]);
  };

  return (
    <MessageScrollerProvider>
      <div className="flex h-[calc(100vh-4rem)] min-h-[500px] w-full flex-col bg-background">
        {/* Concierge Persona Status Header */}
        <header className="shrink-0 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative flex size-10 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-foreground shadow-2xs">
                <Bot className="size-5" />
                <span className="absolute bottom-0 right-0 flex size-2.5 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full border-2 border-background bg-emerald-500" />
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm font-semibold tracking-tight text-foreground">
                    MyRehat Concierge
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Verified Host &amp; Homestay Assistant
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
                      className="rounded-full size-8 border border-border/70 hover:bg-muted/60 transition-colors"
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

        {/* Studio Body: Central Studio (messages empty) vs MessageScroller (chat active) */}
        {!hasStarted ? (
          <main className="min-h-0 flex-1 overflow-y-auto flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
              {/* Bot Avatar Icon */}
              <div className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-muted/30 text-foreground shadow-2xs mb-4">
                <Bot className="size-5" />
              </div>

              {/* Central Title */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground text-center">
                Where are you traveling in Malaysia?
              </h2>

              {/* Subtitle */}
              <p className="mt-2 text-sm text-muted-foreground text-center max-w-md mx-auto">
                Ask about verified stays, direct host rates, or BuyHomestay acquisitions.
              </p>

              {/* Central Input Box */}
              <div className="w-full max-w-2xl mx-auto mt-6">
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="relative rounded-2xl border border-border/70 bg-background shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring transition-all">
                    <textarea
                      name="prompt"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handlePromptKeyDown}
                      placeholder="Ask MyRehat Concierge about stays, rates, or property acquisitions..."
                      className="w-full min-h-12 max-h-32 py-3 pl-4 pr-12 text-sm placeholder:text-muted-foreground/60 resize-none outline-none bg-transparent"
                      rows={1}
                      autoComplete="off"
                      autoFocus
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      disabled={isSending || !input.trim()}
                      aria-label="Send message"
                      className="absolute right-2 bottom-2 size-8 rounded-full bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white shadow-xs hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                    >
                      {isSending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowUpIcon className="size-4" />
                      )}
                    </button>
                  </div>
                </form>

                {/* 3 Quick Chips */}
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {QUICK_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(chip.prompt)}
                      disabled={isSending}
                      className="rounded-full border border-border/60 bg-background px-4 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>
        ) : (
          <>
            {/* Active Chat Conversation History */}
            <main className="min-h-0 flex-1 overflow-y-auto">
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent
                    aria-busy={isSending}
                    className="mx-auto w-full max-w-3xl px-4 py-6 space-y-5"
                  >
                    {messages.map((message) => {
                      const isUser = message.role === "user";

                      return (
                        <MessageScrollerItem key={message.id} scrollAnchor={isUser}>
                          <div className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                            <span className="text-[11px] font-medium text-muted-foreground mb-1">
                              {isUser ? "You" : "MyRehat Concierge"}
                            </span>
                            <div
                              className={
                                isUser
                                  ? "rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white shadow-xs max-w-[85%] self-end bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466]"
                                  : "rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-foreground bg-muted/70 dark:bg-zinc-900 border border-border/50 shadow-2xs max-w-[85%] self-start"
                              }
                            >
                              {message.parts?.map((part, index) => {
                                if (part.type === "text") {
                                  return isUser ? (
                                    <span key={index}>{part.text}</span>
                                  ) : (
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
                            </div>
                          </div>
                        </MessageScrollerItem>
                      );
                    })}

                    {/* Typing Animation in Assistant Bubble */}
                    {status === "submitted" && (
                      <MessageScrollerItem>
                        <div className="flex flex-col items-start">
                          <span className="text-[11px] font-medium text-muted-foreground mb-1">
                            MyRehat Concierge
                          </span>
                          <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-foreground bg-muted/70 dark:bg-zinc-900 border border-border/50 shadow-2xs max-w-[85%] self-start">
                            <div className="flex items-center gap-1.5 py-1">
                              <span className="size-2 rounded-full bg-[#E61E4D] animate-bounce [animation-delay:-0.3s]" />
                              <span className="size-2 rounded-full bg-[#E31C5F] animate-bounce [animation-delay:-0.15s]" />
                              <span className="size-2 rounded-full bg-[#D70466] animate-bounce" />
                            </div>
                          </div>
                        </div>
                      </MessageScrollerItem>
                    )}
                    <MessageScrollerItem scrollAnchor />
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </main>

            {/* Input Bar Fixed in Footer During Active Chat */}
            <footer className="shrink-0 border-t border-border/60 bg-background/80 px-4 py-3 backdrop-blur-md">
              <div className="mx-auto w-full max-w-3xl">
                <form onSubmit={handleSubmit} className="w-full">
                  <div className="relative rounded-2xl border border-border/70 bg-background shadow-sm focus-within:border-ring focus-within:ring-1 focus-within:ring-ring transition-all">
                    <textarea
                      name="prompt"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handlePromptKeyDown}
                      placeholder="Ask MyRehat Concierge about stays, rates, or property acquisitions..."
                      className="w-full min-h-12 max-h-32 py-3 pl-4 pr-12 text-sm placeholder:text-muted-foreground/60 resize-none outline-none bg-transparent"
                      rows={1}
                      autoComplete="off"
                      autoFocus
                      disabled={isSending}
                    />
                    <button
                      type="submit"
                      disabled={isSending || !input.trim()}
                      aria-label="Send message"
                      className="absolute right-2 bottom-2 size-8 rounded-full bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white shadow-xs hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
                    >
                      {isSending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ArrowUpIcon className="size-4" />
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </footer>
          </>
        )}
      </div>
    </MessageScrollerProvider>
  );
}
