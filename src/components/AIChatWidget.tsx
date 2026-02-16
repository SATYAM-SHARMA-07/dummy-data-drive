import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

async function streamChat({
  messages,
  onDelta,
  onDone,
}: {
  messages: Msg[];
  onDelta: (t: string) => void;
  onDone: () => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages }),
  });

  if (resp.status === 429) { toast.error("Rate limit hit. Try again shortly."); onDone(); return; }
  if (resp.status === 402) { toast.error("AI credits exhausted."); onDone(); return; }
  if (!resp.ok || !resp.body) throw new Error("Stream failed");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let idx: number;
    while ((idx = buf.indexOf("\n")) !== -1) {
      let line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") { onDone(); return; }
      try {
        const c = JSON.parse(json).choices?.[0]?.delta?.content;
        if (c) onDelta(c);
      } catch { buf = line + "\n" + buf; break; }
    }
  }
  onDone();
}

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content: text };
    setMessages((p) => [...p, userMsg]);
    setLoading(true);

    let soFar = "";
    const upsert = (chunk: string) => {
      soFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: soFar } : m));
        return [...prev, { role: "assistant", content: soFar }];
      });
    };

    try {
      await streamChat({ messages: [...messages, userMsg], onDelta: upsert, onDone: () => setLoading(false) });
    } catch {
      toast.error("Failed to get AI response");
      setLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-4 z-50 flex w-[340px] flex-col rounded-xl border bg-card shadow-xl overflow-hidden"
            style={{ height: 420 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3">
              <div className="flex items-center gap-2 text-primary-foreground">
                <Bot className="h-5 w-5" />
                <span className="text-sm font-semibold">CoFound AI</span>
              </div>
              <button onClick={() => setOpen(false)}>
                <X className="h-4 w-4 text-primary-foreground/80 hover:text-primary-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-xs text-muted-foreground pt-8">
                  Ask me anything about startups, fundraising, or pitching! 🚀
                </p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-3.5 w-3.5 text-primary" />
                    </div>
                  )}
                  <div
                    className={`rounded-lg px-3 py-2 text-sm max-w-[75%] whitespace-pre-wrap ${
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {m.content}
                  </div>
                  {m.role === "user" && (
                    <div className="h-6 w-6 shrink-0 rounded-full bg-secondary flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              {loading && messages[messages.length - 1]?.role !== "assistant" && (
                <div className="flex gap-2">
                  <div className="h-6 w-6 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-primary animate-pulse" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2 text-sm text-muted-foreground">Thinking…</div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex gap-2 border-t p-3"
            >
              <Input
                placeholder="Ask CoFound AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="text-sm"
              />
              <Button size="icon" type="submit" disabled={loading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((p) => !p)}
        className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
        style={{ display: open ? "none" : "flex" }}
      >
        <MessageCircle className="h-5 w-5" />
      </motion.button>
    </>
  );
};

export default AIChatWidget;
