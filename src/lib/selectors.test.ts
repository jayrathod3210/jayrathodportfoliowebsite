import { describe, expect, it } from 'vitest';
import { content } from '../content';
import type { Article } from '../types/content';
import { filterArticles, filterPrompts, publishedArticles, publishedPrompts, relatedArticles } from './selectors';

const published = (a: Article, date: string | null): Article => ({ ...a, status: 'published', publishedAt: date });

describe('articles', () => {
  it('never lists drafts as published', () => {
    const data = { ...content, articles: content.articles.map((a) => ({ ...a, status: 'draft' as const })) };
    expect(publishedArticles(data)).toEqual([]);
  });

  it('sorts newest first and puts undated articles last', () => {
    const [a, b, c] = content.articles;
    const data = { ...content, articles: [published(a, null), published(b, '2026-01-01'), published(c, '2026-02-01')] };
    expect(publishedArticles(data).map((x) => x.id)).toEqual([c.id, b.id, a.id]);
  });

  it('filters by query terms, category and tag', () => {
    const all = content.articles;
    expect(filterArticles(all, { query: 'status codes' }).map((a) => a.slug)).toEqual(['api-testing-is-more-than-checking-status-codes']);
    expect(filterArticles(all, { categoryId: 'manual-testing' })).toHaveLength(1);
    expect(filterArticles(all, { tag: 'postman' })).toHaveLength(1);
  });

  it('ranks related articles by shared category and tags', () => {
    const base = { ...content.articles[0], id: 'x', categoryId: 'api-testing', tags: ['postman'] };
    expect(relatedArticles(base, content.articles)[0].slug).toBe('api-testing-is-more-than-checking-status-codes');
  });
});

describe('prompts', () => {
  it('only shows published prompts', () => {
    const data = { ...content, prompts: [...content.prompts, { ...content.prompts[0], id: 'hidden', status: 'draft' as const }] };
    expect(publishedPrompts(data)).toHaveLength(content.prompts.length);
  });

  it('searches inside the prompt text', () => {
    expect(filterPrompts(content.prompts, { query: 'getByRole' }).map((p) => p.slug)).toEqual(['create-playwright-typescript-automation-tests']);
  });

  it('filters by category', () => {
    expect(filterPrompts(content.prompts, { categoryId: 'api-testing' })).toHaveLength(2);
  });
});
