"use client";
import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/navbar";
import { ItineraryCard } from "@/components/itinerary-card";
import { Send, Loader2, Plane, MessageSquare } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  itinerary?: any;
};

const SUGGESTIONS = [
  "Book me a long weekend in Lisbon in April, business class if my miles cover it",
  "Plan a 10-day Japan trip in October, maximize my Marriott points for hotels",
  "Find me a quick getaway to Mexico City this month, budget-friendly but not cheap",
  "Romantic weekend in Paris, Amex Platinum perks, boutique hotel preferred",
];

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          conversationId,
        }),
      });
      const data = await res.json();
      if (data.conversationId) setConversationId(data.conversationId);
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        itinerary: data.itinerary,
      };
      setMessages([...newMessages, assistantMsg]);
    } catch {
      setMessages([...newMessages, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I ran into an issue. Please try again.",
      }]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e1a] flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col pt-16 max-w-3xl mx-auto w-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center animate-fade-in">
              <div className="w-16 h-16 bg-[#d4a843]/10 rounded-2xl flex items-center justify-center mb-6">
                <Plane className="w-8 h-8 text-[#d4a843]" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#f5f0e8] mb-2">Where to next?</h2>
              <p className="text-[#b8b0a0] mb-8 max-w-sm">
                Describe your dream trip in plain English. I'll optimize every booking for your points and perks.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    className="text-left p-3 rounded-xl bg-[#141927] border border-[#2a3048] hover:border-[#d4a843]/50 text-sm text-[#b8b0a0] hover:text-[#f5f0e8] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center shrink-0 mt-1">
                  <Plane className="w-4 h-4 text-[#0a0e1a]" />
                </div>
              )}
              <div className={`max-w-[80%] space-y-3 ${msg.role === "user" ? "items-end flex flex-col" : ""}`}>
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#2a3048] text-[#f5f0e8] rounded-tr-sm"
                    : "bg-[#141927] border border-[#2a3048] text-[#f5f0e8] rounded-tl-sm"
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.itinerary && (
                  <ItineraryCard itinerary={msg.itinerary} conversationId={conversationId} />
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-full bg-[#d4a843] flex items-center justify-center shrink-0">
                <Plane className="w-4 h-4 text-[#0a0e1a]" />
              </div>
              <div className="bg-[#141927] border border-[#2a3048] rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center h-5">
                  <div className="w-1.5 h-1.5 bg-[#d4a843] rounded-full animate-bounce" style={{animationDelay: "0ms"}} />
                  <div className="w-1.5 h-1.5 bg-[#d4a843] rounded-full animate-bounce" style={{animationDelay: "150ms"}} />
                  <div className="w-1.5 h-1.5 bg-[#d4a843] rounded-full animate-bounce" style={{animationDelay: "300ms"}} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#2a3048]">
          <div className="flex gap-3 items-end glass rounded-2xl p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your trip... (e.g. 'Weekend in Rome, late April, boutique hotel')"
              rows={1}
              className="flex-1 bg-transparent text-[#f5f0e8] placeholder-[#b8b0a0]/50 text-sm resize-none focus:outline-none min-h-[24px] max-h-32"
              style={{ height: "auto" }}
              onInput={e => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="w-9 h-9 bg-[#d4a843] rounded-xl flex items-center justify-center hover:bg-[#e8c06a] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 text-[#0a0e1a] animate-spin" /> : <Send className="w-4 h-4 text-[#0a0e1a]" />}
            </button>
          </div>
          <p className="text-xs text-[#b8b0a0]/50 text-center mt-2">
            AI-suggested itineraries. Always verify prices before booking.
          </p>
        </div>
      </div>
    </div>
  );
}
