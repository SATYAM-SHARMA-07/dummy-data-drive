import { Play, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { reelCards } from "@/data/dummy";

const ReelsPage = () => (
  <div className="space-y-4 px-4 pt-4">
    <h1 className="text-2xl font-bold text-primary">Startup Reels</h1>
    <p className="text-sm text-muted-foreground">Quick insights from founders</p>
    <div className="space-y-3">
      {reelCards.map((reel) => (
        <Card key={reel.id} className="flex items-center gap-4 p-4">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-4xl">
            {reel.thumbnail}
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-primary/20">
              <Play className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold line-clamp-2">{reel.title}</h3>
            <div className="mt-1 flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                  {reel.creatorInitials}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{reel.creator}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Eye className="h-3 w-3" /> {reel.views} views
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

export default ReelsPage;
