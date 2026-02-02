// Simple content moderation - checks for obvious harmful content
// Returns true if content should be hidden

const HARMFUL_PATTERNS = [
  // Self-harm related
  /\b(kill\s*(my)?self|suicide|end\s*(my)?\s*life|want\s*to\s*die)\b/i,
  // Violence related
  /\b(murder|kill\s*(someone|them|him|her|people)|massacre|slaughter|assassinate)\b/i,
  /\b(bomb|shoot\s*up|mass\s*shooting|terrorist|terrorize)\b/i,
];

export function shouldHideContent(content: string): boolean {
  return HARMFUL_PATTERNS.some(pattern => pattern.test(content));
}
