import { describe, expect, it } from 'vitest';
import { articleFromFile, parseFrontMatter, promptFromFile } from './markdown';

const cats = [{ id: 'api-testing', name: 'API Testing', description: '' }];

describe('parseFrontMatter', () => {
  it('splits YAML front matter from the body', () => {
    expect(parseFrontMatter('---\ntitle: Hi\ntags:\n  - a\n---\nBody text\n')).toEqual({ data: { title: 'Hi', tags: ['a'] }, body: 'Body text' });
  });
  it('handles Windows line endings and a BOM', () => {
    expect(parseFrontMatter('﻿---\r\ntitle: Hi\r\n---\r\nBody').data.title).toBe('Hi');
  });
  it('treats a file without front matter as body only', () => {
    expect(parseFrontMatter('Just text')).toEqual({ data: {}, body: 'Just text' });
  });
});

describe('articleFromFile', () => {
  const file = (fm: string, body = '## Heading\nText') => `---\ntitle: My post\n${fm}\n---\n${body}`;

  it('derives slug from the file name and reads Decap fields', () => {
    const a = articleFromFile('/content/blog/my-post.md', file('status: published\npublishedAt: 2026-11-20\ncategory: api-testing\nfeatured: true\ntags: [api]'), cats)!;
    expect(a).toMatchObject({ slug: 'my-post', id: 'my-post', status: 'published', publishedAt: '2026-11-20', categoryId: 'api-testing', featured: true, tags: ['api'] });
  });

  it('never exposes a date on drafts', () => {
    expect(articleFromFile('/x/d.md', file('status: draft\npublishedAt: 2026-11-20'), cats)!.publishedAt).toBeNull();
  });

  it('defaults unknown status to draft and unknown category to null', () => {
    const a = articleFromFile('/x/d.md', file('status: maybe\ncategory: nope'), cats)!;
    expect(a.status).toBe('draft');
    expect(a.categoryId).toBeNull();
  });

  it('treats empty strings from Decap as missing', () => {
    const a = articleFromFile('/x/d.md', file('status: published\npublishedAt: ""\ncoverImage: ""'), cats)!;
    expect(a.publishedAt).toBeNull();
    expect(a.coverImage).toBeNull();
  });

  it('skips files without a title', () => {
    expect(articleFromFile('/x/d.md', '---\nstatus: published\n---\nBody', cats)).toBeNull();
  });
});

describe('promptFromFile', () => {
  it('uses the body verbatim as the prompt text', () => {
    const p = promptFromFile('/content/prompts/p.md', '---\ntitle: P\nstatus: published\n---\nLine 1\n\n{{placeholder}}\n', cats)!;
    expect(p.content).toBe('Line 1\n\n{{placeholder}}');
  });
  it('skips prompts with no text', () => {
    expect(promptFromFile('/x/p.md', '---\ntitle: P\n---\n', cats)).toBeNull();
  });
});
