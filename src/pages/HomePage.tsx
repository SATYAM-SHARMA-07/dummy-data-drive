import { useState, useEffect } from "react";
import { Search, Heart, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import CreatePitchDialog from "@/components/CreatePitchDialog";
import CommentsSheet from "@/components/CommentsSheet";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface Pitch {
  id: string;
  title: string;
  description: string;
  tags: string[] | null;
  likes_count: number;
  comments_count: number;
  trending: boolean;
  created_at: string;
  user_id: string;
  profile?: { full_name: string; startup_name: string | null };
}

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const fetchPitches = async () => {
    const { data, error } = await supabase
      .from("pitches")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) { toast.error("Failed to load pitches"); return; }

    // Fetch profiles
    const userIds = [...new Set((data || []).map((p) => p.user_id))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, full_name, startup_name")
      .in("user_id", userIds);
    const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);

    setPitches((data || []).map((p) => ({ ...p, profile: profileMap.get(p.user_id) })));
  };

  const fetchLikes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("pitch_likes")
      .select("pitch_id")
      .eq("user_id", user.id);
    if (data) setLikedPosts(new Set(data.map((l) => l.pitch_id)));
  };

  useEffect(() => {
    fetchPitches();
    fetchLikes();

    // Realtime for pitches
    const channel = supabase
      .channel("pitches-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "pitches" }, () => {
        fetchPitches();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, () => {
        fetchPitches(); // refresh counts
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const toggleLike = async (pitchId: string) => {
    if (!user) return;
    const liked = likedPosts.has(pitchId);

    // Optimistic update
    setLikedPosts((prev) => {
      const next = new Set(prev);
      liked ? next.delete(pitchId) : next.add(pitchId);
      return next;
    });

    if (liked) {
      await supabase.from("pitch_likes").delete().eq("pitch_id", pitchId).eq("user_id", user.id);
      await supabase.rpc("decrement_likes", { pitch_id_param: pitchId });
    } else {
      await supabase.from("pitch_likes").insert({ pitch_id: pitchId, user_id: user.id });
      await supabase.rpc("increment_likes", { pitch_id_param: pitchId });
    }
  };

  const trending = pitches.filter((p) => p.trending);
  const filtered = pitches.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const getInitials = (name?: string) =>
    name ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) : "??";

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 px-4 pt-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">CoFound</h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <TrendingUp className="h-3 w-3" /> {trending.length} Trending
            </Badge>
            {user && <CreatePitchDialog onCreated={() => {}} />}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search pitches..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>

        {/* Trending */}
        {!search && trending.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">🔥 Trending</h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {trending.map((post, index) => (
                <motion.div key={post.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.3 }}>
                  <Card className="min-w-[200px] shrink-0 bg-primary/5 p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {getInitials(post.profile?.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium truncate">{post.profile?.full_name || "Founder"}</span>
                    </div>
                    <p className="text-sm font-semibold line-clamp-2">{post.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Heart className="h-3 w-3" /> {post.likes_count}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Feed */}
        <div className="space-y-3">
          {filtered.map((post, index) => {
            const liked = likedPosts.has(post.id);
            return (
              <motion.div key={post.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05, duration: 0.3 }}>
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {getInitials(post.profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{post.profile?.full_name || "Founder"}</p>
                      <p className="text-xs text-muted-foreground">
                        {post.profile?.startup_name || "Startup"} · {timeAgo(post.created_at)}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold mb-1">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{post.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(post.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-xs transition-colors hover:text-primary">
                      <Heart className={`h-4 w-4 transition-all ${liked ? "fill-primary text-primary scale-110" : ""}`} />
                      {post.likes_count + (liked && !likedPosts.has(post.id) ? 1 : 0)}
                    </button>
                    <CommentsSheet pitchId={post.id} commentsCount={post.comments_count} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No pitches found. Be the first to post!</p>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default HomePage;
