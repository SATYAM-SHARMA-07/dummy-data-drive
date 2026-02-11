import { Settings, FileText, Map, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/data/dummy";

const stats = [
  { label: "Pitches", value: 3, icon: FileText },
  { label: "Roadmap", value: "17%", icon: Map },
  { label: "Articles", value: 5, icon: BookOpen },
];

const ProfilePage = () => (
  <div className="space-y-4 px-4 pt-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-primary">Profile</h1>
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
    </div>

    {/* User Info */}
    <Card className="flex flex-col items-center p-6 text-center">
      <Avatar className="h-20 w-20 mb-3">
        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
          {currentUser.initials}
        </AvatarFallback>
      </Avatar>
      <h2 className="text-lg font-bold">{currentUser.name}</h2>
      <p className="text-sm text-primary font-medium">{currentUser.startup}</p>
      <p className="text-xs text-muted-foreground mt-1 max-w-xs">{currentUser.bio}</p>
    </Card>

    {/* Stats */}
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ label, value, icon: Icon }) => (
        <Card key={label} className="flex flex-col items-center p-4">
          <Icon className="h-5 w-5 text-primary mb-1" />
          <span className="text-lg font-bold">{value}</span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </Card>
      ))}
    </div>

    {/* Settings Placeholder */}
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
  </div>
);

export default ProfilePage;
