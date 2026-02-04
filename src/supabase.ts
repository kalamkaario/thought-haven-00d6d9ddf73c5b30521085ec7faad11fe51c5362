import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = "sb_publishable_uLeD_k6tf9GcrYYN0fVahQ_OlZxTzZj";

export const supabase = createClient(supabaseUrl, supabaseKey);
