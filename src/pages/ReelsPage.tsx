import { useState } from "react";
import { Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { reelCards } from "@/data/dummy";
import { motion, AnimatePresence } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import AnimatedPage from "@/components/AnimatedPage";

const ReelsPage = () => {
  const [activeReel, setActiveReel] = useState<string | null>(null);
  const [likedReels, setLikedReels] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedReels((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <AnimatedPage>
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-2xl font-bold text-primary">Startup Reels</h1>
        <p className="text-sm text-muted-foreground">Watch & learn from founders</p>
      </div>

      <div className="space-y-4 px-4 pb-4">
        <AnimatePresence>
          {reelCards.map((reel, index) => {
            const isActive = activeReel === reel.id;
            const liked = likedReels.has(reel.id);

            return (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.3 }}
                className="relative overflow-hidden rounded-2xl bg-card border shadow-sm"
              >
                {/* Video embed */}
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
                    <button
                      onClick={() => setActiveReel(reel.id)}
                      className="relative h-full w-full"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${reel.youtubeId}/maxresdefault.jpg`}
                        alt={reel.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
                          <svg className="h-6 w-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      {/* Bottom gradient */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-sm font-semibold text-white line-clamp-2">{reel.title}</p>
                      </div>
                    </button>
                  )}
                </AspectRatio>

                {/* Actions sidebar (Instagram-style) */}
                <div className="absolute right-3 bottom-20 flex flex-col items-center gap-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(reel.id); }}
                    className="flex flex-col items-center"
                  >
                    <Heart className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : "text-white"} drop-shadow-md`} />
                    <span className="text-[10px] text-white font-medium mt-0.5 drop-shadow-md">
                      {parseInt(reel.views.replace("K", "000")) > 999 ? reel.views : reel.views}
                    </span>
                  </button>
                  <button className="flex flex-col items-center">
                    <MessageCircle className="h-6 w-6 text-white drop-shadow-md" />
                    <span className="text-[10px] text-white font-medium mt-0.5 drop-shadow-md">42</span>
                  </button>
                  <button className="flex flex-col items-center">
                    <Share2 className="h-6 w-6 text-white drop-shadow-md" />
                  </button>
                </div>

                {/* Creator info */}
                <div className="flex items-center gap-3 p-3 border-t">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {reel.creatorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{reel.creator}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {reel.views} views
                    </p>
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
