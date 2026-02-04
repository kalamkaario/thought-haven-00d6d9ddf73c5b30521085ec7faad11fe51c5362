import { Thought } from '@/hooks/useThoughts';
import { formatDistanceToNow } from 'date-fns';
import { useState } from "react";
import Comments from "../Comments";

interface ThoughtFeedProps {
  thoughts: Thought[];
  loading: boolean;
}

export function ThoughtFeed({ thoughts, loading }: ThoughtFeedProps) {
  if (loading) {
    return (
      <div className="w-full mt-20">
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" />
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
            <span className="w-2 h-2 rounded-full bg-primary/20 animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
          <span className="text-muted-foreground font-mono text-sm">
            Peering into the void...
          </span>
        </div>
      </div>
    );
  }

  if (thoughts.length === 0) {
    return (
      <div className="w-full mt-20">
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card border border-border/50 mb-6">
            <svg className="w-6 h-6 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-muted-foreground font-mono text-sm">
            The void is empty
          </p>
          <p className="text-muted-foreground/40 font-mono text-xs mt-2">
            Be the first to release something
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mt-20">
      <div className="section-divider pt-12 mb-10">
        <div className="flex items-center justify-center gap-4">
          <h2 className="text-muted-foreground font-mono text-xs uppercase tracking-[0.2em]">
            From the void
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-card border border-border/50 text-muted-foreground/60 font-mono text-[10px]">
            {thoughts.length}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {thoughts.map((thought, index) => (
          <ThoughtCard key={thought.id} thought={thought} index={index} />
        ))}
      </div>
    </div>
  );
}

/* ---------- SEPARATE COMPONENT FOR EACH THOUGHT ---------- */

function ThoughtCard({ thought, index }: { thought: Thought; index: number }) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <article
      className="thought-card animate-slide-up"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap break-words text-[15px]">
        {thought.content}
      </p>

      {/* VIEW REPLIES BUTTON */}
      <button
        onClick={() => setShowReplies(!showReplies)}
        className="mt-3 text-xs text-muted-foreground/70 hover:text-muted-foreground"
      >
        {showReplies ? "Hide replies" : "View replies"}
      </button>

      {/* COMMENTS SECTION (SHOW ONLY WHEN CLICKED) */}
      {showReplies && (
        <div className="mt-3">
          <Comments thoughtId={thought.id} />
        </div>
      )}

      <div className="mt-5 flex items-center gap-3">
        <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
        <time className="text-muted-foreground/50 font-mono text-xs tracking-wide">
          {formatDistanceToNow(new Date(thought.created_at), { addSuffix: true })}
        </time>
      </div>
    </article>
  );
}
