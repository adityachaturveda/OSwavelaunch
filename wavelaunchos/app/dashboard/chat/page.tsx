"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Paperclip, Search, Send } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type Message = {
  id: string;
  author: "client" | "team";
  body: string;
  timestamp: string;
};

type Conversation = {
  id: string;
  client: string;
  contact: string;
  status: "Online" | "Awaiting Reply" | "Scheduled";
  lastMessage: string;
  messages: Message[];
};

const CONVERSATIONS: Conversation[] = [
  {
    id: "acme",
    client: "Acme Studios",
    contact: "Eddie Lake",
    status: "Online",
    lastMessage: "Looking forward to previewing the new concept deck.",
    messages: [
      {
        id: "1",
        author: "client",
        body: "Can we walk through the updated rollout plan tomorrow?",
        timestamp: "09:21"
      },
      {
        id: "2",
        author: "team",
        body: "Absolutely. I’ll send an agenda shortly and reserve time on your calendar.",
        timestamp: "09:23"
      },
      {
        id: "3",
        author: "client",
        body: "Perfect. Looking forward to previewing the new concept deck.",
        timestamp: "09:25"
      }
    ]
  },
  {
    id: "blue",
    client: "Blue Harbor AI",
    contact: "Alicia Barr",
    status: "Awaiting Reply",
    lastMessage: "Shared the product metrics export for reference.",
    messages: [
      {
        id: "1",
        author: "team",
        body: "Shared the product metrics export for reference.",
        timestamp: "Yesterday"
      }
    ]
  },
  {
    id: "lumen",
    client: "Lumen Ventures",
    contact: "Noah Chen",
    status: "Scheduled",
    lastMessage: "Standing sync scheduled for Friday.",
    messages: [
      {
        id: "1",
        author: "team",
        body: "Standing sync scheduled for Friday.",
        timestamp: "Monday"
      }
    ]
  }
];

const STATUS_VARIANTS: Record<Conversation["status"], string> = {
  Online: "border-emerald-500/60 bg-emerald-500/25 text-black/70 dark:text-emerald-50",
  "Awaiting Reply": "border-amber-500/60 bg-amber-500/25 text-black/70 dark:text-amber-50",
  Scheduled: "border-sky-500/60 bg-sky-500/25 text-black/70 dark:text-sky-50"
};

export default function ChatPage() {
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string>(CONVERSATIONS[0]?.id ?? "");

  const visibleConversations = useMemo(() => {
    if (!search.trim()) return CONVERSATIONS;
    const query = search.toLowerCase();
    return CONVERSATIONS.filter((conversation) =>
      [conversation.client, conversation.contact].some((field) => field.toLowerCase().includes(query))
    );
  }, [search]);

  const activeConversation = visibleConversations.find((conversation) => conversation.id === activeId) ??
    CONVERSATIONS.find((conversation) => conversation.id === activeId) ??
    CONVERSATIONS[0];

  return (
    <div className="flex-1 space-y-6 bg-background p-8 pt-6 text-foreground">
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Chat</h1>
        <p className="text-sm text-muted-foreground">
          Coordinate project updates, respond to client questions, and share assets in real time.
        </p>
      </header>

      <Card className="grid gap-0 border-border/60 bg-card/80 shadow-none lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-border/60 lg:border-b-0 lg:border-r">
          <div className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search conversations"
                className="bg-muted/40 pl-9"
              />
            </div>
          </div>

          <Separator className="bg-border/60" />

          <ScrollArea className="h-[480px]">
            <ul className="divide-y divide-border/40">
              {visibleConversations.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(conversation.id)}
                    className={`flex w-full flex-col gap-2 px-4 py-4 text-left transition-colors hover:bg-muted/10 ${
                      conversation.id === activeId ? "bg-muted/10" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-border/60">
                          <AvatarFallback className="font-semibold uppercase">
                            {conversation.client.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-semibold text-foreground">{conversation.client}</div>
                          <div className="text-xs text-muted-foreground">{conversation.contact}</div>
                        </div>
                      </div>
                      <Badge variant="outline" className={`rounded-full px-2 text-[11px] ${STATUS_VARIANTS[conversation.status]}`}>
                        {conversation.status}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{conversation.lastMessage}</p>
                  </button>
                </li>
              ))}
            </ul>
            {visibleConversations.length === 0 && (
              <div className="px-4 py-12 text-center text-sm text-muted-foreground">
                No conversations found.
              </div>
            )}
          </ScrollArea>
        </aside>

        <section className="flex flex-col">
          {activeConversation ? (
            <>
              <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-border/60">
                    <AvatarFallback className="font-semibold uppercase">
                      {activeConversation.client.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{activeConversation.client}</div>
                    <div className="text-xs text-muted-foreground">{activeConversation.contact}</div>
                  </div>
                </div>
                <Badge variant="outline" className={`rounded-full px-3 text-[11px] ${STATUS_VARIANTS[activeConversation.status]}`}>
                  {activeConversation.status}
                </Badge>
              </header>

              <ScrollArea className="flex-1 px-6 py-6">
                <div className="space-y-4">
                  {activeConversation.messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      body={message.body}
                      timestamp={message.timestamp}
                      align={message.author === "team" ? "right" : "left"}
                    />
                  ))}
                </div>
                <TypingIndicator />
              </ScrollArea>

              <footer className="border-t border-border/60 bg-background/80 px-6 py-4">
                <form className="flex flex-col gap-3">
                  <Textarea
                    rows={2}
                    placeholder="Write a reply and share updates, links, or files"
                    className="resize-none bg-muted/30"
                  />
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
                      <Paperclip className="h-4 w-4" />
                      Attachments
                    </Button>
                    <Button type="submit" className="gap-2 shadow-none">
                      <Send className="h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center">
              <MessageCircle className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Select a conversation</p>
                <p className="text-xs text-muted-foreground">
                  Choose a client thread from the left panel to review messages and respond.
                </p>
              </div>
            </div>
          )}
        </section>
      </Card>
    </div>
  );
}

function MessageBubble({ body, timestamp, align }: { body: string; timestamp: string; align: "left" | "right" }) {
  const isRight = align === "right";
  return (
    <div className={`flex ${isRight ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-xl border border-border/40 px-4 py-3 text-sm leading-relaxed shadow-sm transition-colors ${
          isRight ? "rounded-br-sm bg-primary/10 text-primary-foreground/80" : "rounded-bl-sm bg-muted/20 text-muted-foreground"
        }`}
      >
        <p className="text-foreground/90">{body}</p>
        <span className="mt-2 block text-xs text-muted-foreground/70">{timestamp}</span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((index) => (
          <span
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60"
            style={{ animationDelay: `${index * 120}ms` }}
          />
        ))}
      </div>
      Alicia is typing
    </div>
  );
}
