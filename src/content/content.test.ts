import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse } from 'yaml';
import { describe, expect, it } from 'vitest';
import { content } from '.';

interface DecapField {
  name: string;
  widget?: string;
  file?: string;
  collection?: string;
  value_field?: string;
  options?: Array<{ value: string } | string>;
}
interface DecapCollection {
  name: string;
  folder?: string;
  files?: Array<{ name: string; file: string; fields: DecapField[] }>;
  fields?: DecapField[];
}

const root = resolve(__dirname, '../..');
const config = parse(readFileSync(resolve(root, 'public/admin/config.yml'), 'utf8')) as { collections: DecapCollection[] };
const collection = (name: string) => config.collections.find((c) => c.name === name)!;
const field = (name: string, f: string) => collection(name).fields!.find((x) => x.name === f)!;
const unique = (values: string[]) => new Set(values).size === values.length;

describe('content files', () => {
  it('loads the profile from the CMS with an automatic years count', () => {
    expect(content.profile.name).toBe('Jay Rathod');
    expect(content.profile.careerStart).toBe('2021-04');
    expect(content.profile.yearsOfExperience).toBeGreaterThanOrEqual(6);
    expect(content.profile.heroSubtitle).not.toContain('{years}');
    expect(content.profile.whatsapp).toBe('+91 7600682088');
  });

  it('shows the requested highlight numbers, with years as N+', () => {
    expect(content.profile.stats.map((s) => s.label)).toEqual(['Projects tested', 'Test cases executed', 'Years of experience', 'Client satisfaction']);
    expect(content.profile.stats.map((s) => s.value)).toEqual(['50+', '1000+', `${content.profile.yearsOfExperience}+`, '98%']);
    expect(content.profile.heroSubtitle).toMatch(/\d+\+ years/);
  });

  it('lists performance, desktop and game testing skills', () => {
    const names = content.skills.map((s) => s.name);
    const expected = ['JMeter', 'Locust', 'Load Testing', 'Stress Testing', 'Page Speed Verification', 'Performance Reporting', 'Desktop Application Testing', 'Game Testing'];
    for (const skill of expected) expect(names).toContain(skill);
    expect(content.profile.platforms).toEqual(expect.arrayContaining(['Desktop software', 'Games']));
  });

  it('uses the public LinkedIn URL', () => {
    expect(content.profile.socials.find((s) => s.platform === 'linkedin')?.url).toBe('https://in.linkedin.com/in/jay-rathod-456198146');
  });

  it('loads experience, skills, projects, articles and prompts', () => {
    expect(content.experiences).toHaveLength(4);
    expect(content.skillCategories.length).toBeGreaterThan(0);
    expect(content.skills.length).toBeGreaterThan(20);
    expect(content.projects).toHaveLength(5);
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

  it('has unique ids', () => {
    expect(unique(content.skills.map((s) => s.id))).toBe(true);
    expect(unique(content.blogCategories.map((c) => c.id))).toBe(true);
    expect(unique(content.promptCategories.map((c) => c.id))).toBe(true);
  });

  it('flags a project as a sample exactly when its title says so', () => {
    content.projects.forEach((p) => expect(p.isSample, p.title).toBe(p.title.startsWith('Sample')));
  });
});

describe('Decap CMS config', () => {
  it('manages every content area', () => {
    expect(config.collections.map((c) => c.name)).toEqual(['settings', 'experience', 'projects', 'blog', 'prompts']);
  });

  it('points every single-page entry at a file that exists', () => {
    for (const f of collection('settings').files!) expect(existsSync(resolve(root, f.file)), f.file).toBe(true);
  });

  it('points every folder collection at the folders the site reads', () => {
    expect(collection('experience').folder).toBe('content/experience');
    expect(collection('projects').folder).toBe('content/projects');
    expect(collection('blog').folder).toBe('content/blog');
    expect(collection('prompts').folder).toBe('content/prompts');
  });

  it('takes blog and prompt categories from the CMS-managed categories file', () => {
    for (const [name, list] of [['blog', 'blog'], ['prompts', 'prompts']] as const) {
      const f = field(name, 'category');
      expect(f).toMatchObject({ widget: 'relation', collection: 'settings', file: 'categories', value_field: `${list}.*.id` });
    }
  });

  it('uses the status values the site understands', () => {
    for (const name of ['blog', 'prompts']) {
      const values = field(name, 'status').options!.map((o) => (typeof o === 'string' ? o : o.value)).sort();
      expect(values).toEqual(['draft', 'published']);
    }
  });
});
