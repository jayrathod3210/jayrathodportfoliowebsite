import { parse } from 'yaml';
import type { Category, Experience, Profile, Project, QaUnpackedBrand, Skill, SkillCategory, SocialLink, SocialPlatform } from '../types/content';
import { slugify } from '../lib/utils';
import { bool, list, str } from './markdown';

// Parsers for the YAML files Decap CMS writes under content/. Every field has a safe default,
// so a field left empty in the CMS never breaks the site.

type Raw = Record<string, unknown>;

export function parseYaml(raw: string | undefined): Raw {
  if (!raw) return {};
  try {
    const data = parse(raw);
    return data && typeof data === 'object' ? (data as Raw) : {};
  } catch {
    return {};
  }
}

const objects = (v: unknown): Raw[] => (Array.isArray(v) ? v.filter((x): x is Raw => !!x && typeof x === 'object') : []);
const num = (v: unknown, fallback: number): number => {
  const n = typeof v === 'number' ? v : Number(str(v));
  return Number.isFinite(n) ? n : fallback;
};
const MONTH = /^\d{4}-(0[1-9]|1[0-2])$/;
const month = (v: unknown): string => {
  const s = str(v);
  return MONTH.test(s) ? s : '';
};

const PLATFORMS: SocialPlatform[] = ['linkedin', 'instagram', 'github', 'youtube', 'x', 'medium', 'website', 'whatsapp', 'other'];

function socials(v: unknown, prefix: string): SocialLink[] {
  return objects(v).map((s, i) => {
    const platform = str(s.platform) as SocialPlatform;
    return {
      id: `${prefix}_${i}`,
      platform: PLATFORMS.includes(platform) ? platform : 'other',
      label: str(s.label) || platform || 'Link',
      url: str(s.url),
    };
  });
}

/**
 * Whole years since `careerStart` (YYYY-MM), rounded to the nearest year.
 * Evaluated in the visitor's browser, so it moves on by itself without a redeploy.
 */
export function yearsSince(careerStart: string, now = new Date()): number {
  if (!MONTH.test(careerStart)) return 0;
  const [y, m] = careerStart.split('-').map(Number);
  const months = (now.getFullYear() - y) * 12 + (now.getMonth() + 1 - m);
  return Math.max(0, Math.round(months / 12));
}

export function profileFrom(raw: Raw, qaUnpacked: QaUnpackedBrand, now = new Date()): Profile {
  const careerStart = month(raw.careerStart);
  const override = num(raw.yearsOverride, NaN);
  const years = Number.isFinite(override) && override > 0 ? override : yearsSince(careerStart, now);
  // Experience is always presented as "N+" (e.g. "6+ years").
  const fill = (text: string) => text.replace(/\{years\}\+?/g, `${years}+`);

  return {
    name: str(raw.name) || 'Jay Rathod',
    positioning: fill(str(raw.positioning)),
    heroTitle: fill(str(raw.heroTitle)),
    heroSubtitle: fill(str(raw.heroSubtitle)),
    shortIntro: fill(str(raw.shortIntro)),
    about: fill(str(raw.about)),
    philosophy: fill(str(raw.philosophy)),
    yearsOfExperience: years,
    careerStart,
    journey: objects(raw.journey).map((j, i) => ({
      id: `stage_${i}`,
      period: str(j.period),
      title: fill(str(j.title)),
      description: fill(str(j.description)),
    })),
    interests: list(raw.interests),
    goals: list(raw.goals).map(fill),
    avatarUrl: str(raw.avatar) || null,
    location: str(raw.location),
    email: str(raw.email),
    whatsapp: str(raw.whatsapp),
    resumeUrl: str(raw.resume),
    socials: socials(raw.socials, 'social'),
    stats: objects(raw.stats)
      .map((s, i) => ({ id: `stat_${i}`, value: fill(str(s.value)), label: fill(str(s.label)) }))
      .filter((s) => s.value && s.label),
    platforms: list(raw.platforms),
    tools: list(raw.tools),
    qaUnpacked,
  };
}

export function qaUnpackedFrom(raw: Raw): QaUnpackedBrand {
  return {
    name: str(raw.name) || 'QA UNPACKED',
    tagline: str(raw.tagline),
    description: str(raw.description),
    focusAreas: list(raw.focusAreas),
    socials: socials(raw.socials, 'qa'),
  };
}

export function skillsFrom(raw: Raw): { skillCategories: SkillCategory[]; skills: Skill[] } {
  const skillCategories: SkillCategory[] = [];
  const skills: Skill[] = [];
  objects(raw.categories).forEach((c, i) => {
    const name = str(c.name);
    if (!name) return;
    const id = `sc_${slugify(name) || i}`;
    skillCategories.push({ id, name, description: str(c.description), order: i + 1 });
    list(c.skills).forEach((skill, j) => skills.push({ id: `${id}_${j}`, name: skill, categoryId: id, order: j + 1 }));
  });
  return { skillCategories, skills };
}

export function categoriesFrom(v: unknown): Category[] {
  return objects(v)
    .map((c) => ({ id: str(c.id) || slugify(str(c.name)), name: str(c.name), description: str(c.description) }))
    .filter((c) => c.id && c.name);
}

export function experienceFrom(path: string, raw: Raw): Experience | null {
  const role = str(raw.role);
  const company = str(raw.company);
  if (!role || !company) return null;
  return {
    id: path.split('/').pop()!.replace(/\.ya?ml$/, ''),
    role,
    company,
    startDate: month(raw.startDate),
    endDate: month(raw.endDate) || null,
    location: str(raw.location),
    summary: str(raw.summary),
    responsibilities: list(raw.responsibilities),
    contributions: list(raw.contributions),
    technologies: list(raw.technologies),
    order: num(raw.order, 99),
  };
}

export function projectFrom(path: string, raw: Raw): Project | null {
  const title = str(raw.title);
  if (!title) return null;
  const slug = path.split('/').pop()!.replace(/\.ya?ml$/, '');
  return {
    id: slug,
    slug,
    title,
    summary: str(raw.summary),
    businessContext: str(raw.businessContext),
    testingApproach: str(raw.testingApproach),
    technologies: list(raw.technologies),
    responsibilities: list(raw.responsibilities),
    challenges: list(raw.challenges),
    outcomes: list(raw.outcomes),
    images: objects(raw.images)
      .map((img) => ({ url: str(img.image), alt: str(img.alt) }))
      .filter((img) => img.url),
    githubUrl: str(raw.githubUrl),
    liveUrl: str(raw.liveUrl),
    isSample: bool(raw.isSample),
    featured: bool(raw.featured),
    order: num(raw.order, 99),
  };
}

/** Builds a wa.me chat link from a number in any format, e.g. "+91 7600682088". */
export function whatsappLink(number: string, message = 'Hi Jay, I found your portfolio and would like to connect.'): string {
  const digits = number.replace(/\D/g, '');
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : '';
}
