import type { Article, Experience, Project, Prompt, SiteContent } from '../types/content';
import { articleFromFile, promptFromFile } from './markdown';
import { categoriesFrom, experienceFrom, parseYaml, profileFrom, projectFrom, qaUnpackedFrom, skillsFrom } from './settings';

// Everything under /content is written by Decap CMS and bundled at build time.
// Saving in the CMS commits a file, Netlify rebuilds, and the site updates.
const raw = (files: Record<string, string>) => files;
const settingsFiles = raw(import.meta.glob<string>('/content/settings/*.yml', { query: '?raw', import: 'default', eager: true }));
const experienceFiles = raw(import.meta.glob<string>('/content/experience/*.yml', { query: '?raw', import: 'default', eager: true }));
const projectFiles = raw(import.meta.glob<string>('/content/projects/*.yml', { query: '?raw', import: 'default', eager: true }));
const blogFiles = raw(import.meta.glob<string>('/content/blog/*.md', { query: '?raw', import: 'default', eager: true }));
const promptFiles = raw(import.meta.glob<string>('/content/prompts/*.md', { query: '?raw', import: 'default', eager: true }));

const setting = (name: string) => parseYaml(settingsFiles[`/content/settings/${name}.yml`]);

function load<T>(files: Record<string, string>, toItem: (path: string, raw: string) => T | null): T[] {
  return Object.entries(files).flatMap(([path, text]) => {
    const item = toItem(path, text);
    if (!item && import.meta.env.DEV) console.warn(`[content] Skipped ${path}: a required field is empty.`);
    return item ? [item] : [];
  });
}

const categories = setting('categories');
const blogCategories = categoriesFrom(categories.blog);
const promptCategories = categoriesFrom(categories.prompts);
const { skillCategories, skills } = skillsFrom(setting('skills'));

export const content: SiteContent = {
  profile: profileFrom(setting('profile'), qaUnpackedFrom(setting('qa-unpacked'))),
  experiences: load<Experience>(experienceFiles, (p, text) => experienceFrom(p, parseYaml(text))),
  skillCategories,
  skills,
  projects: load<Project>(projectFiles, (p, text) => projectFrom(p, parseYaml(text))),
  blogCategories,
  promptCategories,
  articles: load<Article>(blogFiles, (p, text) => articleFromFile(p, text, blogCategories)),
  prompts: load<Prompt>(promptFiles, (p, text) => promptFromFile(p, text, promptCategories)),
};

export function useSnapshot(): SiteContent {
  return content;
}
