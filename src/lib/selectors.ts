import type { Article, Project, Prompt, SiteContent, Skill, SkillCategory } from '../types/content';

// Newest first; published articles without a date sort last, then alphabetically for a stable order.
const byNewest = (a: Article, b: Article) =>
  (b.publishedAt ?? '').localeCompare(a.publishedAt ?? '') || a.title.localeCompare(b.title);

export function publishedArticles(data: SiteContent): Article[] {
  return data.articles.filter((a) => a.status === 'published').sort(byNewest);
}

export function draftArticles(data: SiteContent): Article[] {
  return data.articles.filter((a) => a.status === 'draft').sort((a, b) => a.title.localeCompare(b.title));
}

export function featuredArticle(articles: Article[]): Article | null {
  return articles.find((a) => a.featured) ?? articles[0] ?? null;
}

export function relatedArticles(article: Article, all: Article[], limit = 3): Article[] {
  return all
    .filter((a) => a.id !== article.id)
    .map((a) => ({
      a,
      score:
        (a.categoryId && a.categoryId === article.categoryId ? 2 : 0) +
        a.tags.filter((t) => article.tags.includes(t)).length,
    }))
    .sort((x, y) => y.score - x.score || byNewest(x.a, y.a))
    .slice(0, limit)
    .map((x) => x.a);
}

function matches(query: string, ...fields: string[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return q.split(/\s+/).every((term) => fields.some((f) => f.toLowerCase().includes(term)));
}

export function filterArticles(
  articles: Article[],
  { query = '', categoryId = '', tag = '' }: { query?: string; categoryId?: string; tag?: string },
): Article[] {
  return articles.filter(
    (a) =>
      (!categoryId || a.categoryId === categoryId) &&
      (!tag || a.tags.includes(tag)) &&
      matches(query, a.title, a.excerpt, a.tags.join(' '), a.content),
  );
}

export function publishedPrompts(data: SiteContent): Prompt[] {
  return data.prompts.filter((p) => p.status === 'published').sort((a, b) => a.title.localeCompare(b.title));
}

export function filterPrompts(
  prompts: Prompt[],
  { query = '', categoryId = '', tag = '' }: { query?: string; categoryId?: string; tag?: string },
): Prompt[] {
  return prompts.filter(
    (p) =>
      (!categoryId || p.categoryId === categoryId) &&
      (!tag || p.tags.includes(tag)) &&
      matches(query, p.title, p.description, p.tags.join(' '), p.content),
  );
}

export function publishedProjects(data: SiteContent): Project[] {
  return [...data.projects].sort((a, b) => a.order - b.order);
}

export function skillsByCategory(data: SiteContent): Array<{ category: SkillCategory; skills: Skill[] }> {
  return [...data.skillCategories]
    .sort((a, b) => a.order - b.order)
    .map((category) => ({
      category,
      skills: data.skills.filter((s) => s.categoryId === category.id).sort((a, b) => a.order - b.order),
    }));
}

export function sortedExperiences(data: SiteContent) {
  return [...data.experiences].sort((a, b) => a.order - b.order || b.startDate.localeCompare(a.startDate));
}

export function allTags(items: Array<{ tags: string[] }>): string[] {
  return [...new Set(items.flatMap((i) => i.tags))].sort((a, b) => a.localeCompare(b));
}
