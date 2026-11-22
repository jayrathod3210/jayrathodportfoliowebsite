import type { Article, Prompt, SiteContent } from '../types/content';
import { blogCategories, experiences, profile, projects, promptCategories, skillCategories, skills } from '../data/site';
import { articleFromFile, promptFromFile } from './markdown';

// Markdown files are bundled at build time. Decap CMS commits a new file, the host rebuilds, the site updates.
const blogFiles = import.meta.glob<string>('/content/blog/*.md', { query: '?raw', import: 'default', eager: true });
const promptFiles = import.meta.glob<string>('/content/prompts/*.md', { query: '?raw', import: 'default', eager: true });

function load<T>(files: Record<string, string>, toItem: (path: string, raw: string) => T | null): T[] {
  return Object.entries(files).flatMap(([path, raw]) => {
    const item = toItem(path, raw);
    if (!item && import.meta.env.DEV) console.warn(`[content] Skipped ${path}: missing a title or content.`);
    return item ? [item] : [];
  });
}

export const content: SiteContent = {
  profile,
  experiences,
  skillCategories,
  skills,
  projects,
  blogCategories,
  promptCategories,
  articles: load<Article>(blogFiles, (p, raw) => articleFromFile(p, raw, blogCategories)),
  prompts: load<Prompt>(promptFiles, (p, raw) => promptFromFile(p, raw, promptCategories)),
};

export function useSnapshot(): SiteContent {
  return content;
}
