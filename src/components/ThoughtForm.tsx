import { useState, useEffect } from 'react';
import { canPost } from '@/lib/anonymousId';

interface ThoughtFormProps {
  onSubmit: (content: string) => Promise<{ success: boolean; error?: string }>;
  isPosting: boolean;
}

export function ThoughtForm({ onSubmit, isPosting }: ThoughtFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  const charCount = content.length;
  const isOverLimit = charCount > 1000;
  const charPercentage = Math.min((charCount / 1000) * 100, 100);

  // Check rate limit on mount and update countdown
  useEffect(() => {
    const check = () => {
      const { allowed, waitSeconds } = canPost();
      if (!allowed) {
        setCountdown(waitSeconds);
      } else {
        setCountdown(0);
      }
    };

    check();
    const interval = setInterval(check, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const result = await onSubmit(content);
    
    if (result.success) {
      setContent('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(result.error || 'Something went wrong');
    }
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative transition-all duration-300 ${isFocused ? 'scale-[1.01]' : ''}`}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Dump everything in your head…"
          className="thought-input min-h-[180px]"
          disabled={isPosting}
        />
        
        {/* Character counter with progress ring */}
        <div className="absolute bottom-5 right-5 flex items-center gap-3">
          <div className="relative w-10 h-10">
            <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
              />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                stroke={isOverLimit ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                strokeWidth="2"
                strokeDasharray={`${charPercentage} 100`}
                strokeLinecap="round"
                className="transition-all duration-300"
              />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center font-mono text-[10px] ${
              isOverLimit ? 'text-destructive' : 'text-muted-foreground'
            }`}>
              {1000 - charCount}
            </span>
          </div>
        </div>
      </div>

      {/* Status messages */}
      <div className="h-8 mt-4">
        {error && (
          <p className="text-destructive text-sm font-mono animate-fade-in flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
            {error}
          </p>
        )}

        {success && (
          <p className="text-primary text-sm font-mono animate-fade-in flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Gone forever. You'll never see it again.
          </p>
        )}
      </div>

      {/* Submit area */}
      <div className="mt-6 flex items-center justify-between">
        <button
          type="submit"
          disabled={isPosting || isOverLimit || countdown > 0 || !content.trim()}
          className="dump-button group"
        >
          {isPosting ? (
            <span className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
              Releasing...
            </span>
          ) : countdown > 0 ? (
            <span className="flex items-center gap-3">
              <span className="font-mono tabular-nums">{formatCountdown(countdown)}</span>
              <span className="text-primary-foreground/60">cooldown</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Dump
              <svg 
                className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          )}
        </button>

        {countdown > 0 && !isPosting && (
          <div className="flex items-center gap-2">
            <div className="w-24 h-1 bg-border/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary/40 rounded-full transition-all duration-1000"
                style={{ width: `${((60 - countdown) / 60) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
