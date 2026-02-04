import { supabase } from "./supabase";

export async function fetchComments(thoughtId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("thought_id", thoughtId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function postComment({
  thoughtId,
  parentId,
  text,
}: {
  thoughtId: string;
  parentId: string | null;
  text: string;
}) {
  const { error } = await supabase.from("comments").insert({
    thought_id: thoughtId,
    parent_id: parentId,   // null = top-level comment
    text,
  });

  if (error) throw error;
}
