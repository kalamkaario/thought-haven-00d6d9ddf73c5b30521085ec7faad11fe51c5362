-- Create the thoughts table for anonymous thought dumping
CREATE TABLE public.thoughts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author_hash TEXT NOT NULL,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (but allow anonymous access for this public app)
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert thoughts
CREATE POLICY "Anyone can insert thoughts"
ON public.thoughts
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read non-hidden thoughts (filtering by author_hash happens in app)
CREATE POLICY "Anyone can read non-hidden thoughts"
ON public.thoughts
FOR SELECT
USING (is_hidden = false);

-- Create index for faster queries on author_hash and created_at
CREATE INDEX idx_thoughts_author_hash ON public.thoughts(author_hash);
CREATE INDEX idx_thoughts_created_at ON public.thoughts(created_at DESC);

-- Enable realtime for live feed updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.thoughts;