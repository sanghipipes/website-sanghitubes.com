import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Truncate text for card display. Prefer ending at a complete sentence within the limit;
// otherwise cut at a word boundary and append an ellipsis, stripping any trailing punctuation
// or dangling conjunction/preposition so the result never ends like "…and…".
export function truncate(text: string, maxLength = 115): string {
  if (!text || text.length <= maxLength) return text;
  const window = text.slice(0, maxLength);
  // Prefer a complete sentence (avoid over-short cuts with the ≥40 floor).
  const sentenceEnd = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("! "),
    window.lastIndexOf("? "),
  );
  if (sentenceEnd >= 40) return text.slice(0, sentenceEnd + 1);
  // Fallback: word-boundary cut with a clean ending.
  let cut = window;
  const lastSpace = cut.lastIndexOf(" ");
  if (lastSpace > 0) cut = cut.slice(0, lastSpace);
  cut = cut
    .replace(/[\s,;:.–—-]+$/u, "")
    .replace(/\s+(?:and|or|with|for|to|of|in|the|a|an)$/i, "")
    .replace(/[\s,;:.–—-]+$/u, "");
  return `${cut}…`;
}
