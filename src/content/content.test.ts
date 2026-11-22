import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import { content } from '.';

interface DecapField {
  name: string;
  options?: Array<{ value: string }>;
}
interface DecapCollection {
  name: string;
  folder: string;
  fields: DecapField[];
}

const config = parse(readFileSync(resolve(__dirname, '../../public/admin/config.yml'), 'utf8')) as { collections: DecapCollection[] };
const collection = (name: string) => config.collections.find((c) => c.name === name)!;
const options = (name: string, field: string) => collection(name).fields.find((f) => f.name === field)!.options!.map((o) => o.value);
const unique = (values: string[]) => new Set(values).size === values.length;

describe('content files', () => {
  it('loads every Markdown file in content/', () => {
    expect(content.articles).toHaveLength(5);
    expect(content.prompts).toHaveLength(7);
  });

  it('gives every article and prompt a category that exists', () => {
    content.articles.forEach((a) => expect(a.categoryId, a.slug).not.toBeNull());
    content.prompts.forEach((p) => expect(p.categoryId, p.slug).not.toBeNull());
  });

  it('does not claim any starter article is published or dated', () => {
    content.articles.forEach((a) => {
      expect(a.status).toBe('draft');
      expect(a.publishedAt).toBeNull();
    });
  });

  it('has unique ids across static data', () => {
    expect(unique(content.skills.map((s) => s.id))).toBe(true);
    expect(unique(content.projects.map((p) => p.slug))).toBe(true);
    expect(unique(content.experiences.map((e) => e.id))).toBe(true);
  });

  it('flags placeholder projects as samples', () => {
    content.projects.forEach((p) => expect(p.isSample && p.title.startsWith('Sample')).toBe(true));
  });
});

describe('Decap CMS config', () => {
  it('points collections at the folders the site reads', () => {
    expect(collection('blog').folder).toBe('content/blog');
    expect(collection('prompts').folder).toBe('content/prompts');
  });

  it('offers exactly the blog categories the site knows', () => {
    expect(options('blog', 'category')).toEqual(content.blogCategories.map((c) => c.id));
  });

  it('offers exactly the prompt categories the site knows', () => {
    expect(options('prompts', 'category')).toEqual(content.promptCategories.map((c) => c.id));
  });

  it('uses the status values the site understands', () => {
    expect(options('blog', 'status').sort()).toEqual(['draft', 'published']);
    expect(options('prompts', 'status').sort()).toEqual(['draft', 'published']);
  });
});
