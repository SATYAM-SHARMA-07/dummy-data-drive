import { Home, Map, BookOpen, Play, CalendarDays, MessageSquare, BarChart3, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/roadmap", icon: Map, label: "Roadmap" },
  { path: "/knowledge", icon: BookOpen, label: "Learn" },
  { path: "/messages", icon: MessageSquare, label: "DMs" },
  { path: "/analytics", icon: BarChart3, label: "Stats" },
  { path: "/reels", icon: Play, label: "Reels" },
  { path: "/events", icon: CalendarDays, label: "Events" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card shadow-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-1">
        {navItems.map(({ path, icon: Icon, label }) => {
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
      </div>
    </nav>
  );
};

export default BottomNav;
