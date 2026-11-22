export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function uid(prefix = 'id'): string {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}_${random}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

const WORDS_PER_MINUTE = 220;

export function wordCount(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#>*_`~\-[\]()!|]/g, ' ')
    .trim();
  if (!text) return 0;
  return text.split(/\s+/).length;
}

export function readingTimeMinutes(markdown: string): number {
  return Math.max(1, Math.round(wordCount(markdown) / WORDS_PER_MINUTE));
}

export function formatDate(iso: string | null): string {
  if (!iso) return '';
  // Date-only values (YYYY-MM-DD) are calendar days: parse as local so no timezone shifts them a day back.
  const dayOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  const date = dayOnly ? new Date(+dayOnly[1], +dayOnly[2] - 1, +dayOnly[3]) : new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatMonth(yyyyMm: string | null): string {
  if (!yyyyMm) return 'Present';
  const [year, month] = yyyyMm.split('-').map(Number);
  if (!year || !month) return yyyyMm;
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of markdown.split('\n')) {
    if (line.trim().startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      const text = match[2].replace(/[*_`]/g, '');
      items.push({ id: slugify(text), text, level: match[1].length as 2 | 3 });
    }
  }
  return items;
}

export function splitList(value: string): string[] {
  return value
    .split(/\n|,/)
    .map((v) => v.trim())
    .filter(Boolean);
}

export function splitLines(value: string): string[] {
  return value
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean);
}

export function isSafeUrl(value: string): boolean {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' || url.protocol === 'mailto:';
  } catch {
    return false;
  }
}

export function isSafeImageSrc(value: string | null): boolean {
  if (!value) return false;
  if (value.startsWith('data:image/')) return true;
  if (value.startsWith('/')) return true;
  return isSafeUrl(value);
}
