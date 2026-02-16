import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profile?: { full_name: string };
}

interface CommentsSheetProps {
  pitchId: string;
  commentsCount: number;
}

const CommentsSheet = ({ pitchId, commentsCount }: CommentsSheetProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchComments = async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, content, created_at, user_id")
      .eq("pitch_id", pitchId)
      .order("created_at", { ascending: true });

    if (data) {
      // Fetch profiles for all user_ids
      const userIds = [...new Set(data.map((c) => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);
      setComments(data.map((c) => ({ ...c, profile: profileMap.get(c.user_id) })));
    }
  };

  useEffect(() => {
    if (open) fetchComments();
  }, [open]);

  const addComment = async () => {
    if (!newComment.trim() || !user) return;
    setLoading(true);
    const { error } = await supabase.from("comments").insert({
      pitch_id: pitchId,
      user_id: user.id,
      content: newComment.trim(),
    });
    if (error) {
      toast.error("Failed to add comment");
    } else {
      await supabase.rpc("increment_comments", { pitch_id_param: pitchId });
      setNewComment("");
      fetchComments();
    }
    setLoading(false);
  };

  const deleteComment = async (id: string) => {
    await supabase.from("comments").delete().eq("id", id);
    fetchComments();
  };

  const getInitials = (name?: string) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "?";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary">
          <MessageCircle className="h-4 w-4" /> {commentsCount}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>Comments</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col h-full pt-4">
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            {comments.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-8">No comments yet. Be the first!</p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="flex gap-2">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(c.profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">{c.profile?.full_name || "User"}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{c.content}</p>
                </div>
                {user?.id === c.user_id && (
                  <button onClick={() => deleteComment(c.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); addComment(); }}
            className="flex gap-2 border-t pt-3 pb-2"
          >
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="text-sm"
            />
            <Button size="icon" type="submit" disabled={loading || !newComment.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CommentsSheet;
