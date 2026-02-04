import { useEffect, useState } from "react";
import { fetchComments, postComment } from "./api";
import { buildThread } from "./utils";

export default function Comments({ thoughtId }: { thoughtId: string }) {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadComments() {
    setLoading(true);
    const data = await fetchComments(thoughtId);
    setThreads(buildThread(data));
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, [thoughtId]);

  return (
    <div className="mt-6 space-y-4">
      {loading && <p className="text-sm opacity-70">Loading replies...</p>}

      {!loading && threads.length === 0 && (
        <p className="text-sm opacity-70">No replies yet.</p>
      )}

      {threads.map((c) => (
        <Comment key={c.id} comment={c} thoughtId={thoughtId} refresh={loadComments} />
      ))}
    </div>
  );
}

function Comment({
  comment,
  thoughtId,
  refresh,
}: {
  comment: any;
  thoughtId: string;
  refresh: () => void;
}) {
  return (
    <div className="ml-4 border-l border-gray-700 pl-4">
      <p className="text-sm text-gray-200">{comment.text}</p>

      <ReplyBox
        thoughtId={thoughtId}
        parentId={comment.id}
        refresh={refresh}
      />

      {comment.replies.map((r: any) => (
        <Comment key={r.id} comment={r} thoughtId={thoughtId} refresh={refresh} />
      ))}
    </div>
  );
}

function ReplyBox({
  thoughtId,
  parentId,
  refresh,
}: {
  thoughtId: string;
  parentId: string | null;
  refresh: () => void;
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function sendReply() {
    if (!text.trim()) return;

    setSending(true);

    await postComment({
      thoughtId,
      parentId,
      text,
    });

    setText("");
    setSending(false);
    refresh();
  }

  return (
    <div className="mt-2 flex gap-2 items-center">
    <input
      className="bg-transparent border-b border-gray-600 text-sm outline-none text-white"
      placeholder="Reply..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />
    <button
      onClick={sendReply}
      disabled={sending}
      className="text-xs opacity-70 hover:opacity-100"
    >
      {sending ? "..." : "send"}
    </button>
  </div>
  );
}
