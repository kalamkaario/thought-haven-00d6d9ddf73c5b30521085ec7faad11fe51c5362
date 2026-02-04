import { useEffect, useState } from "react";
import { fetchComments, postComment } from "./api";
import { buildThread } from "./utils";

export default function Comments({ thoughtId }: { thoughtId: string }) {
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBox, setShowBox] = useState(false);

  async function loadComments() {
    const data = await fetchComments(thoughtId);
    setThreads(buildThread(data));
    setLoading(false);
  }

  useEffect(() => {
    loadComments();
  }, [thoughtId]);

  return (
    <div className="relative mt-4 space-y-4">
      {/* ABSTRACT FUTURISTIC REPLY TRIGGER (NO EMOJI) */}
      <button
        onClick={() => setShowBox(!showBox)}
        className="absolute -top-3 right-4 flex items-center gap-2 opacity-40 hover:opacity-80 transition-all group"
      >
        {/* glowing dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 
                         group-hover:shadow-[0_0_8px_hsl(var(--primary))]" />

        {/* subtle line */}
        <span className="w-6 h-px bg-gradient-to-r from-primary/60 to-transparent" />
      </button>

      {/* TOP REPLY BOX (toggles on abstract trigger) */}
      {showBox && (
        <div className="mt-2 animate-fade-in">
          <ReplyBox
            parentId={null}
            thoughtId={thoughtId}
            refresh={loadComments}
          />
        </div>
      )}

      {!loading && threads.length === 0 && (
        <p className="text-xs text-muted-foreground/60 opacity-70">
          No replies yet.
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
  const [showReply, setShowReply] = useState(false);

  return (
    <div
      className={`relative pl-4 transition-all duration-300 ${
        depth === 0 ? "" : "ml-3"
      }`}
      style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="py-1 animate-fade-in">
        <p className="text-sm text-foreground/85 font-mono tracking-tight">
          {comment.text}
        </p>

        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground/60">
          <button
            onClick={() => setOpen(!open)}
            className="hover:text-muted-foreground transition-colors"
          >
            {open ? "Hide thread" : "Show thread"}
          </button>

          <button
            onClick={() => setShowReply(!showReply)}
            className="hover:text-muted-foreground transition-colors"
          >
            {showReply ? "Cancel" : "Reply"}
          </button>
        </div>
      </div>

      {showReply && (
        <div className="mt-2 animate-slide-in">
          <ReplyBox
            thoughtId={thoughtId}
            parentId={comment.id}
            refresh={refresh}
          />
        </div>
      )}

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

/* ---------- REPLY INPUT WITH ARROW (NO CIRCLE BUTTON) ---------- */

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
    <div className="relative p-2 rounded-lg border border-border/30 bg-card/40 backdrop-blur-sm">
      {/* FUTURISTIC GLOW LINE */}
      <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

      <div className="flex items-center gap-2">
        <input
          className="bg-transparent border-b border-border/40 text-sm outline-none text-foreground w-full 
                     placeholder:text-muted-foreground/40 cursor-animate"
          placeholder={
            parentId
              ? "Write a reply..."
              : "Add a comment to this thought..."
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendReply();
          }}
        />

        {/* MINIMAL ARROW SEND */}
        <button
          onClick={sendReply}
          disabled={sending}
          className="text-primary/70 hover:text-primary transition-colors text-lg leading-none"
        >
          {sending ? "…" : "→"}
        </button>
      </div>
    </div>
  );
}
