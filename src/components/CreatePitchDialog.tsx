import { useState } from "react";
import { Plus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CreatePitchDialogProps {
  onCreated: () => void;
}

const CreatePitchDialog = ({ onCreated }: CreatePitchDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      const { error } = await supabase.from("pitches").insert({
        user_id: user.id,
        title,
        description,
        tags,
      });
      if (error) throw error;

      toast({ title: "Pitch posted!", description: "Your pitch is now live." });
      setTitle("");
      setDescription("");
      setTags([]);
      setOpen(false);
      onCreated();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Pitch
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100vw-2rem)]">
        <DialogHeader>
          <DialogTitle>Post Your Pitch</DialogTitle>
          <DialogDescription>Share your startup idea with the community</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pitch-title">Title</Label>
            <Input
              id="pitch-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Your startup name & tagline"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pitch-desc">Description</Label>
            <Textarea
              id="pitch-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What problem are you solving? What's unique?"
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Tags (up to 5)</Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" variant="secondary" size="sm" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post Pitch
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePitchDialog;
