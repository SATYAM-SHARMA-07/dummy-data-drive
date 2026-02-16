-- Enable realtime for pitches and comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.pitches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.comments;
