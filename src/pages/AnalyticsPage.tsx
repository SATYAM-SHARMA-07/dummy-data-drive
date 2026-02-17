import { useState, useEffect } from "react";
import { BarChart3, Heart, MessageSquare, FileText, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AnimatedPage from "@/components/AnimatedPage";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(217, 91%, 50%)", "hsl(25, 95%, 55%)", "hsl(160, 60%, 45%)", "hsl(280, 60%, 55%)"];

const AnalyticsPage = () => {
  const { user } = useAuth();
  const [totalPitches, setTotalPitches] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [pitchData, setPitchData] = useState<{ name: string; likes: number; comments: number }[]>([]);
  const [tagData, setTagData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchAnalytics = async () => {
      // Fetch user's pitches
      const { data: pitches } = await supabase
        .from("pitches")
        .select("title, likes_count, comments_count, tags")
        .eq("user_id", user.id);

      if (pitches) {
        setTotalPitches(pitches.length);
        setTotalLikes(pitches.reduce((sum, p) => sum + p.likes_count, 0));
        setTotalComments(pitches.reduce((sum, p) => sum + p.comments_count, 0));
        setPitchData(
          pitches.map((p) => ({
            name: p.title.length > 12 ? p.title.slice(0, 12) + "…" : p.title,
            likes: p.likes_count,
            comments: p.comments_count,
          }))
        );

        // Tag distribution
        const tagCount: Record<string, number> = {};
        pitches.forEach((p) => (p.tags || []).forEach((t) => (tagCount[t] = (tagCount[t] || 0) + 1)));
        setTagData(Object.entries(tagCount).map(([name, value]) => ({ name, value })));
      }
    };

    fetchAnalytics();
  }, [user]);

  const stats = [
    { label: "Pitches", value: totalPitches, icon: FileText, color: "text-primary" },
    { label: "Total Likes", value: totalLikes, icon: Heart, color: "text-destructive" },
    { label: "Comments", value: totalComments, icon: MessageSquare, color: "text-accent-foreground" },
  ];

  return (
    <AnimatedPage>
      <div className="space-y-4 px-4 pt-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-primary">Analytics</h1>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="flex flex-col items-center p-4">
                <Icon className={`h-5 w-5 mb-1 ${color}`} />
                <span className="text-lg font-bold">{value}</span>
                <span className="text-xs text-muted-foreground">{label}</span>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Engagement bar chart */}
        {pitchData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Engagement by Pitch
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pitchData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip />
                  <Bar dataKey="likes" fill="hsl(217, 91%, 50%)" radius={[4, 4, 0, 0]} name="Likes" />
                  <Bar dataKey="comments" fill="hsl(25, 95%, 55%)" radius={[4, 4, 0, 0]} name="Comments" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        )}

        {/* Tag distribution pie chart */}
        {tagData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-4">
              <h3 className="text-sm font-semibold mb-3">Tag Distribution</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="50%" height={160}>
                  <PieChart>
                    <Pie data={tagData} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={30}>
                      {tagData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5">
                  {tagData.map((tag, i) => (
                    <div key={tag.name} className="flex items-center gap-2 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-muted-foreground">{tag.name} ({tag.value})</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {totalPitches === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">
            Post some pitches to see your analytics! 📊
          </p>
        )}
      </div>
    </AnimatedPage>
  );
};

export default AnalyticsPage;
