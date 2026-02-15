import { Settings, FileText, Map, BookOpen, LogOut } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";

const stats = [
  { label: "Pitches", value: 3, icon: FileText },
  { label: "Roadmap", value: "17%", icon: Map },
  { label: "Articles", value: 5, icon: BookOpen },
];

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.user_metadata?.full_name || user?.email || "User";
  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <AnimatedPage>
      <div className="space-y-4 px-4 pt-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Profile</h1>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="flex flex-col items-center p-6 text-center">
            <Avatar className="h-20 w-20 mb-3">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-lg font-bold">{displayName}</h2>
            <p className="text-xs text-muted-foreground mt-1">{user?.email}</p>
          </Card>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="flex flex-col items-center p-4">
                <Icon className="h-5 w-5 text-primary mb-1" />
                <span className="text-lg font-bold">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-4">
          <h3 className="text-sm font-semibold mb-3">Settings</h3>
          {["Edit Profile", "Notifications", "Privacy", "Help & Support"].map((item) => (
            <button
              key={item}
              className="flex w-full items-center justify-between border-b py-3 text-sm last:border-0"
            >
              {item}
              <span className="text-muted-foreground">→</span>
            </button>
          ))}
        </Card>

        <Button variant="outline" className="w-full gap-2 text-destructive" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>
      </div>
    </AnimatedPage>
  );
};

export default ProfilePage;
