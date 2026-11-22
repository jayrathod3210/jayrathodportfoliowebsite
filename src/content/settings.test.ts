import { describe, expect, it } from 'vitest';
import { categoriesFrom, experienceFrom, profileFrom, projectFrom, qaUnpackedFrom, skillsFrom, whatsappLink, yearsSince } from './settings';

const qa = qaUnpackedFrom({});

describe('yearsSince (automatic years of experience)', () => {
  it('rounds to the nearest whole year', () => {
    expect(yearsSince('2021-04', new Date(2026, 10, 22))).toBe(6); // 5y 7m
    expect(yearsSince('2021-04', new Date(2027, 3, 1))).toBe(6); // 6y 0m
    expect(yearsSince('2021-04', new Date(2027, 9, 1))).toBe(7); // 6y 6m
    expect(yearsSince('2021-04', new Date(2028, 3, 1))).toBe(7);
  });
  it('returns 0 for a missing or malformed date', () => {
    expect(yearsSince('', new Date())).toBe(0);
    expect(yearsSince('April 2021', new Date())).toBe(0);
  });
});

describe('profileFrom', () => {
  const raw = { name: 'Jay', careerStart: '2021-04', heroSubtitle: 'QA professional with {years} years of experience.', goals: ['{years} years in'] };

  it('fills {years} from the career start date', () => {
    const p = profileFrom(raw, qa, new Date(2027, 9, 1));
    expect(p.yearsOfExperience).toBe(7);
    expect(p.heroSubtitle).toBe('QA professional with 7+ years of experience.');
    expect(p.goals).toEqual(['7+ years in']);
  });

  it('never doubles the plus sign when the text already has {years}+', () => {
    expect(profileFrom({ ...raw, heroSubtitle: '{years}+ years' }, qa, new Date(2026, 10, 22)).heroSubtitle).toBe('6+ years');
  });

  it('fills {years} in highlight numbers and drops incomplete ones', () => {
    const stats = [{ value: '{years}', label: 'Years' }, { value: '98%', label: 'Satisfaction' }, { value: '', label: 'x' }];
    const p = profileFrom({ ...raw, stats }, qa, new Date(2026, 10, 22));
    expect(p.stats.map((s) => s.value)).toEqual(['6+', '98%']);
  });

  it('lets a manual override win', () => {
    expect(profileFrom({ ...raw, yearsOverride: 10 }, qa).yearsOfExperience).toBe(10);
  });

  it('survives a completely empty file', () => {
    const p = profileFrom({}, qa);
    expect(p.name).toBe('Jay Rathod');
    expect(p.journey).toEqual([]);
    expect(p.socials).toEqual([]);
    expect(p.avatarUrl).toBeNull();
  });

  it('maps unknown social platforms to "other"', () => {
    expect(profileFrom({ socials: [{ platform: 'myspace', label: 'X', url: 'https://x.y' }] }, qa).socials[0].platform).toBe('other');
  });
});

describe('whatsappLink', () => {
  it('builds a wa.me link from any number format', () => {
    expect(whatsappLink('+91 7600682088')).toMatch(/^https:\/\/wa\.me\/917600682088\?text=/);
  });
  it('returns an empty string when no number is set', () => {
    expect(whatsappLink('')).toBe('');
  });
});

describe('skills, categories, experience, projects', () => {
  it('builds ordered skill categories and skips unnamed ones', () => {
    const { skillCategories, skills } = skillsFrom({ categories: [{ name: 'API Testing', skills: ['Postman', 'Swagger'] }, { name: '' }] });
    expect(skillCategories.map((c) => c.name)).toEqual(['API Testing']);
    expect(skills.map((s) => s.name)).toEqual(['Postman', 'Swagger']);
  });

  it('derives a category id from its name when the id is missing', () => {
    expect(categoriesFrom([{ name: 'AI in QA' }])).toEqual([{ id: 'ai-in-qa', name: 'AI in QA', description: '' }]);
  });

  it('treats an empty end month as the current job and skips incomplete entries', () => {
    expect(experienceFrom('/content/experience/a.yml', { role: 'QA', company: 'X', startDate: '2023-04', endDate: '' })?.endDate).toBeNull();
    expect(experienceFrom('/content/experience/b.yml', { role: 'QA' })).toBeNull();
  });

  it('uses the file name as the project slug and drops empty images', () => {
    const p = projectFrom('/content/projects/my-project.yml', { title: 'P', images: [{ image: '' }, { image: '/i.png', alt: 'A' }] });
    expect(p?.slug).toBe('my-project');
    expect(p?.images).toEqual([{ url: '/i.png', alt: 'A' }]);
  });
});
