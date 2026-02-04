import { supabase } from "./supabase";

export async function fetchComments(thoughtId: string) {
  console.log("Fetching comments for:", thoughtId);

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("thought_id", thoughtId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fetch error:", error);
    return [];
  }

  console.log("Fetched comments:", data);
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
  console.log("Sending comment:", { thoughtId, parentId, text });

  const { data, error } = await supabase
    .from("comments")
    .insert({
      thought_id: thoughtId,
      parent_id: parentId,
      text,
    })
    .select(); // important — we get the inserted row back

  if (error) {
    console.error("Insert error:", error);
    throw error;
  }

  console.log("Inserted comment:", data);
}
