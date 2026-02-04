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
    <div className="mt-4 space-y-4 transition-all duration-300 ease-in-out">
      {/* Top-level reply box */}
      <ReplyBox parentId={null} thoughtId={thoughtId} refresh={loadComments} />

      {loading && (
        <p className="text-xs text-muted-foreground/60 animate-pulse">
          Loading replies...
        </p>
      )}

      {!loading && threads.length === 0 && (
        <p className="text-xs text-muted-foreground/60">
          No replies yet — be the first.
        </p>
      )}

      <div className="space-y-3">
        {threads.map((c) => (
          <Comment
            key={c.id}
            comment={c}
            thoughtId={thoughtId}
            refresh={loadComments}
            depth={0}
          />
        ))}
      </div>
    </div>
  );
}

function Comment({
  comment,
  thoughtId,
  refresh,
  depth,
}: {
  comment: any;
  thoughtId: string;
  refresh: () => void;
  depth: number;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`relative pl-4 transition-all duration-300 ease-out ${
        depth === 0 ? "" : "ml-3"
      }`}
      style={{
        borderLeft: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {/* COMMENT BODY */}
      <div className="py-1 animate-fade-in">
        <p className="text-sm text-foreground/85">{comment.text}</p>

        {/* ACTIONS (like X/Reddit) */}
        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground/60">
          <button
            onClick={() => setOpen(!open)}
            className="hover:text-muted-foreground"
          >
            {open ? "Hide thread" : "Show thread"}
          </button>

          <ReplyToggle
            thoughtId={thoughtId}
            parentId={comment.id}
            refresh={refresh}
          />
        </div>
      </div>

      {/* REPLIES */}
      {open && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2 transition-all duration-300 ease-in-out">
          {comment.replies.map((r: any) => (
            <Comment
              key={r.id}
              comment={r}
              thoughtId={thoughtId}
              refresh={refresh}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- REPLY TOGGLE (Reddit/X style) ---------- */

function ReplyToggle({
  thoughtId,
  parentId,
  refresh,
}: {
  thoughtId: string;
  parentId: string;
  refresh: () => void;
}) {
  const [showBox, setShowBox] = useState(false);

  return (
    <div>
      <button
        onClick={() => setShowBox(!showBox)}
        className="hover:text-muted-foreground"
      >
        {showBox ? "Cancel" : "Reply"}
      </button>

      {showBox && (
        <div className="mt-2 animate-slide-in">
          <ReplyBox
            thoughtId={thoughtId}
            parentId={parentId}
            refresh={refresh}
          />
        </div>
      )}
    </div>
  );
}

/* ---------- REPLY INPUT BOX ---------- */

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
    <div className="flex gap-2 items-center">
      <input
        className="bg-transparent border-b border-border/40 text-sm outline-none text-foreground w-full placeholder:text-muted-foreground/40"
        placeholder={
          parentId ? "Write a reply..." : "Add a comment to this thought..."
        }
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={sendReply}
        disabled={sending}
        className="text-xs text-muted-foreground/70 hover:text-muted-foreground"
      >
        {sending ? "..." : "send"}
      </button>
    </div>
  );
}
