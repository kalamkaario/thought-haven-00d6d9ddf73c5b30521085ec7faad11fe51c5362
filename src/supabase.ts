import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gzcgzchajyckooihwfja.supabase.co";
const supabaseKey = "sb_publishable_uLeD_k6tf9GcrYYN0fVahQ_OlZxTzZj"; // your key

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
  },
});
