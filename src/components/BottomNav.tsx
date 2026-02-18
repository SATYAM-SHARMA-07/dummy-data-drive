import { Home, Map, BookOpen, Play, CalendarDays, MessageSquare, BarChart3, User, MoreHorizontal } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const mainNavItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/roadmap", icon: Map, label: "Roadmap" },
  { path: "/knowledge", icon: BookOpen, label: "Learn" },
  { path: "/reels", icon: Play, label: "Reels" },
  { path: "/events", icon: CalendarDays, label: "Events" },
  { path: "/profile", icon: User, label: "Profile" },
];

const moreItems = [
  { path: "/messages", icon: MessageSquare, label: "Direct Messages" },
  { path: "/analytics", icon: BarChart3, label: "Analytics" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isMoreActive = moreItems.some(item => location.pathname === item.path);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-1">
        {mainNavItems.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "fill-primary/20")} />
              <span className={cn("font-medium", active && "font-semibold")}>{label}</span>
            </button>
          );
        })}

        <Sheet>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 text-xs transition-colors",
                isMoreActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <MoreHorizontal className={cn("h-5 w-5", isMoreActive && "fill-primary/20")} />
              <span className={cn("font-medium", isMoreActive && "font-semibold")}>More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl pb-8">
            <div className="mt-4 grid grid-cols-2 gap-3">
              {moreItems.map(({ path, icon: Icon, label }) => {
                const active = location.pathname === path;
                return (
                  <SheetTrigger asChild key={path}>
                    <button
                      onClick={() => navigate(path)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-4 text-left transition-colors",
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-muted/30 text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-6 w-6 shrink-0" />
                      <span className="font-medium">{label}</span>
                    </button>
                  </SheetTrigger>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default BottomNav;
