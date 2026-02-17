import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";

interface Profile {
  user_id: string;
  full_name: string;
  startup_name: string | null;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

const MessagesPage = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch all profiles except current user
  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("user_id, full_name, startup_name")
      .neq("user_id", user.id)
      .then(({ data }) => {
        if (data) setProfiles(data);
      });
  }, [user]);

  // Fetch conversation when a user is selected
  const fetchMessages = async () => {
    if (!user || !selectedUser) return;
    const { data } = await supabase
      .from("direct_messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.user_id}),and(sender_id.eq.${selectedUser.user_id},receiver_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  };

  useEffect(() => {
    fetchMessages();

    if (!user || !selectedUser) return;
    const channel = supabase
      .channel(`dm-${selectedUser.user_id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "direct_messages" }, (payload) => {
        const msg = payload.new as Message;
        if (
          (msg.sender_id === user.id && msg.receiver_id === selectedUser.user_id) ||
          (msg.sender_id === selectedUser.user_id && msg.receiver_id === user.id)
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, selectedUser]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!user || !selectedUser || !newMessage.trim()) return;
    await supabase.from("direct_messages").insert({
      sender_id: user.id,
      receiver_id: selectedUser.user_id,
      content: newMessage.trim(),
    });
    setNewMessage("");
  };

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Conversation view
  if (selectedUser) {
    return (
      <AnimatedPage>
        <div className="flex flex-col h-[calc(100vh-5rem)]">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b bg-card">
            <Button variant="ghost" size="icon" onClick={() => setSelectedUser(null)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {getInitials(selectedUser.full_name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{selectedUser.full_name}</p>
              <p className="text-xs text-muted-foreground">{selectedUser.startup_name || "Founder"}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {messages.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">
                Start the conversation! 👋
              </p>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender_id === user?.id;
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                      isMe
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-0.5 ${isMe ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-4 py-3 border-t bg-card">
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1"
            />
            <Button size="icon" onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  // Contacts list
  return (
    <AnimatedPage>
      <div className="space-y-4 px-4 pt-4">
        <h1 className="text-2xl font-bold text-primary">Messages</h1>
        {profiles.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No other founders to message yet.</p>
        )}
        <div className="space-y-2">
          {profiles.map((profile, i) => (
            <motion.div
              key={profile.user_id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => setSelectedUser(profile)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{profile.full_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{profile.startup_name || "Founder"}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default MessagesPage;
