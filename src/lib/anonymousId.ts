// Generate or retrieve a persistent anonymous ID for this browser
const STORAGE_KEY = 'thought_dump_anon_id';
const LAST_POST_KEY = 'thought_dump_last_post';

// ⏱️ 20 seconds rate limit
const RATE_LIMIT_MS = 20 * 1000; // 20 seconds

export function getAnonymousId(): string {
  if (typeof window === 'undefined') return '';
  
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

export function getLastPostTime(): number {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(LAST_POST_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

export function setLastPostTime(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LAST_POST_KEY, Date.now().toString());
}

export function canPost(): { allowed: boolean; waitSeconds: number } {
  const lastPost = getLastPostTime();
  const now = Date.now();
  const elapsed = now - lastPost;
  
  if (elapsed >= RATE_LIMIT_MS) {
    return { allowed: true, waitSeconds: 0 };
  }
  
  const remaining = RATE_LIMIT_MS - elapsed;
  return { allowed: false, waitSeconds: Math.ceil(remaining / 1000) };
}
