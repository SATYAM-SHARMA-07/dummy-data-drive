import { useState, useEffect } from "react";
import { MessageCircle, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface FounderProfile {
  user_id: string;
  full_name: string;
  startup_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  pitch_count: number;
  total_likes: number;
}

const FounderDiscovery = () => {
  const [founders, setFounders] = useState<FounderProfile[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFounders = async () => {
      // Get profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, startup_name, bio, avatar_url");

      if (!profiles) return;

      // Get pitch stats per user
      const { data: pitches } = await supabase
        .from("pitches")
        .select("user_id, likes_count");

      const statsMap = new Map<string, { count: number; likes: number }>();
      (pitches || []).forEach((p) => {
        const existing = statsMap.get(p.user_id) || { count: 0, likes: 0 };
        statsMap.set(p.user_id, {
          count: existing.count + 1,
          likes: existing.likes + p.likes_count,
        });
      });

      const enriched: FounderProfile[] = profiles
        .filter((p) => p.user_id !== user?.id)
        .map((p) => ({
          ...p,
          pitch_count: statsMap.get(p.user_id)?.count || 0,
          total_likes: statsMap.get(p.user_id)?.likes || 0,
        }))
        .sort((a, b) => b.total_likes - a.total_likes)
        .slice(0, 10);

      setFounders(enriched);
    };

    fetchFounders();
  }, [user]);

  const getInitials = (name: string) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  if (founders.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Discover Founders
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {founders.map((founder, index) => (
          <motion.div
            key={founder.user_id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.07, duration: 0.3 }}
          >
            <Card className="min-w-[160px] max-w-[160px] shrink-0 p-3 flex flex-col items-center text-center gap-2">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                  {getInitials(founder.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 w-full">
                <p className="text-sm font-semibold truncate">{founder.full_name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {founder.startup_name || "Founder"}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{founder.pitch_count} pitches</span>
                <span>·</span>
                <span>{founder.total_likes} ❤️</span>
              </div>
              {user && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full gap-1 text-xs"
                  onClick={() => navigate("/messages")}
                >
                  <MessageCircle className="h-3 w-3" />
                  Message
                </Button>
              )}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FounderDiscovery;
