import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gzcgzchajyckooihwfja.supabase.co";

// 👇 PASTE YOUR ANON PUBLIC KEY HERE (from the bottom screenshot)
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxamVpcW14c2xobXZlbWFucW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MjcxODksImV4cCI6MjA4NTUwMzE4OX0.n45_z5_K1IjntKsoY9JsvSssPqfKxndFtTNpFX9I4l4";

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});
