import { useState } from "react";
import { Search, Heart, MessageCircle, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { pitchPosts, founders } from "@/data/dummy";
import { useAuth } from "@/contexts/AuthContext";
import CreatePitchDialog from "@/components/CreatePitchDialog";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import CommentsSheet from "@/components/CommentsSheet";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const trending = pitchPosts.filter((p) => p.trending);
  const filtered = pitchPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  const getFounder = (id: string) => founders.find((f) => f.id === id)!;

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
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
          <Input
            placeholder="Search pitches..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Trending */}
        {!search && (
          <div>
            <h2 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              🔥 Trending
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {trending.map((post, index) => {
                const founder = getFounder(post.founderId);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                  >
                    <Card className="min-w-[200px] shrink-0 bg-primary/5 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                            {founder.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium truncate">{founder.name}</span>
                      </div>
                      <p className="text-sm font-semibold line-clamp-2">{post.title}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <Heart className="h-3 w-3" /> {post.likes}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Feed */}
        <div className="space-y-3">
          {filtered.map((post, index) => {
            const founder = getFounder(post.founderId);
            const liked = likedPosts.has(post.id);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {founder.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{founder.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {founder.startup} · {post.createdAt}
                      </p>
                    </div>
                  </div>
                  <h3 className="text-sm font-bold mb-1">{post.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{post.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1 text-xs transition-colors hover:text-primary"
                    >
                      <Heart className={`h-4 w-4 transition-all ${liked ? "fill-primary text-primary scale-110" : ""}`} />
                      {post.likes + (liked ? 1 : 0)}
                    </button>
                    <CommentsSheet pitchId={post.id} commentsCount={post.comments} />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default HomePage;
