import { useEffect, useMemo, useState } from "react";
import { Eye, Heart, MessageCircle, Plus, Share2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { reelCards, ReelCard } from "@/data/dummy";
import { motion, AnimatePresence } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AnimatedPage from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const LOCAL_REELS_KEY = "cofound_custom_reels";

const parseYoutubeId = (value: string) => {
  const input = value.trim();
  const directId = /^[a-zA-Z0-9_-]{11}$/;
  if (directId.test(input)) return input;

  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    if (url.searchParams.get("v")) return url.searchParams.get("v");
    const match = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
    if (match?.[1]) return match[1];
  } catch {
    return null;
  }

  return null;
};

const ReelsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [activeReel, setActiveReel] = useState<string | null>(null);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());
  const [customReels, setCustomReels] = useState<ReelCard[]>([]);

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [youtubeInput, setYoutubeInput] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_REELS_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as ReelCard[];
      if (Array.isArray(parsed)) setCustomReels(parsed);
    } catch {
      setCustomReels([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_REELS_KEY, JSON.stringify(customReels));
  }, [customReels]);

  const reels = useMemo(() => [...customReels, ...reelCards], [customReels]);

  const toggleLike = (id: string) => {
    setLikedReels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const submitReel = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({ title: "Sign in required", description: "Please login to post a reel.", variant: "destructive" });
      return;
    }

    const youtubeId = parseYoutubeId(youtubeInput);
    if (!youtubeId) {
      toast({ title: "Invalid link", description: "Please add a valid YouTube URL or video ID.", variant: "destructive" });
      return;
    }

    const creatorName = user.user_metadata?.full_name || user.email?.split("@")[0] || "Founder";
    const creatorInitials = creatorName
      .split(" ")
      .map((part: string) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const newReel: ReelCard = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      creator: creatorName,
      creatorInitials: creatorInitials || "CF",
      views: "0",
      thumbnail: "🎬",
      youtubeId,
    };

    setCustomReels((prev) => [newReel, ...prev]);
    setTitle("");
    setYoutubeInput("");
    setOpen(false);
    toast({ title: "Reel posted", description: "Your reel is now visible in the feed." });
  };

  return (
    <AnimatedPage>
      <div className="px-4 pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-primary">Startup Reels</h1>
            <p className="text-sm text-muted-foreground">Watch, learn, and post your own founder reels</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Post Reel
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post a Reel</DialogTitle>
                <DialogDescription>Add a YouTube short/video and it will appear at the top of feed.</DialogDescription>
              </DialogHeader>
              <form onSubmit={submitReel} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reel-title">Title</Label>
                  <Input id="reel-title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="How we got our first 100 users" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="youtube-link">YouTube URL or ID</Label>
                  <Input
                    id="youtube-link"
                    value={youtubeInput}
                    onChange={(e) => setYoutubeInput(e.target.value)}
                    required
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <Button type="submit" className="w-full">Publish Reel</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="space-y-4 px-4 pb-4">
        <AnimatePresence>
          {reels.map((reel, index) => {
            const isActive = activeReel === reel.id;
            const liked = likedReels.has(reel.id);

            return (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06, duration: 0.25 }}
                className="relative overflow-hidden rounded-2xl border bg-card shadow-sm"
              >
                <AspectRatio ratio={9 / 16} className="max-h-[420px]">
                  {isActive ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${reel.youtubeId}?autoplay=1&rel=0`}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={reel.title}
                    />
                  ) : (
                    <button onClick={() => setActiveReel(reel.id)} className="relative h-full w-full">
                      <img
                        src={`https://img.youtube.com/vi/${reel.youtubeId}/maxresdefault.jpg`}
                        alt={reel.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
                          <svg className="ml-0.5 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="line-clamp-2 text-sm font-semibold text-white">{reel.title}</p>
                      </div>
                    </button>
                  )}
                </AspectRatio>

                <div className="absolute bottom-20 right-3 flex flex-col items-center gap-4">
                  <button onClick={(e) => { e.stopPropagation(); toggleLike(reel.id); }} className="flex flex-col items-center">
                    <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : "text-white"} drop-shadow-md`} />
                    <span className="mt-0.5 text-[10px] font-medium text-white drop-shadow-md">{reel.views}</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <MessageCircle className="h-6 w-6 text-white drop-shadow-md" />
                    <span className="mt-0.5 text-[10px] font-medium text-white drop-shadow-md">42</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <Share2 className="h-6 w-6 text-white drop-shadow-md" />
                  </button>
                </div>

                <div className="flex items-center gap-3 border-t p-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-xs text-primary-foreground">{reel.creatorInitials}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{reel.creator}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{reel.title}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Eye className="h-3 w-3" />
                    {reel.views} views
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AnimatedPage>
  );
};

export default ReelsPage;
