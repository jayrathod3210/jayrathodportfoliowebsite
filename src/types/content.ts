export type PublishStatus = 'draft' | 'published';

export type SocialPlatform =
  | 'linkedin'
  | 'instagram'
  | 'github'
  | 'youtube'
  | 'x'
  | 'medium'
  | 'website'
  | 'whatsapp'
  | 'other';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface JourneyStage {
  id: string;
  period: string;
  title: string;
  description: string;
}

export interface QaUnpackedBrand {
  name: string;
  tagline: string;
  description: string;
  focusAreas: string[];
  socials: SocialLink[];
}

export interface Stat {
  id: string;
  /** Display text, e.g. "50+", "1000+", "98%". A leading number animates. */
  value: string;
  label: string;
}

export interface Profile {
  name: string;
  positioning: string;
  heroTitle: string;
  heroSubtitle: string;
  shortIntro: string;
  about: string;
  philosophy: string;
  yearsOfExperience: number;
  journey: JourneyStage[];
  interests: string[];
  goals: string[];
  avatarUrl: string | null;
  /** YYYY-MM. Years of experience are calculated from this at page load. */
  careerStart: string;
  location: string;
  email: string;
  /** Shown publicly as a WhatsApp chat link. */
  whatsapp: string;
  resumeUrl: string;
  socials: SocialLink[];
  /** Headline numbers shown under the home page hero. */
  stats: Stat[];
  /** Platforms listed in the home page 'Platforms I test' card. */
  platforms: string[];
  /** Tools shown in the scrolling strip on the home page. */
  tools: string[];
  qaUnpacked: QaUnpackedBrand;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  location: string;
  summary: string;
  responsibilities: string[];
  contributions: string[];
  technologies: string[];
  order: number;
}

export interface SkillCategory {
  id: string;
  name: string;
  description: string;
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  categoryId: string;
  order: number;
}

export interface ProjectImage {
  url: string;
  alt: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  summary: string;
  businessContext: string;
  testingApproach: string;
  technologies: string[];
  responsibilities: string[];
  challenges: string[];
  outcomes: string[];
  images: ProjectImage[];
  githubUrl: string;
  liveUrl: string;
  isSample: boolean;
  featured: boolean;
  order: number;
}

/** Category id is its URL slug; it is what Decap stores in each Markdown file's front matter. */
export interface Category {
  id: string;
  name: string;
  description: string;
}

/** Loaded from content/blog/<slug>.md, which is written by Decap CMS. id === slug. */
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  coverAlt: string;
  categoryId: string | null;
  tags: string[];
  status: PublishStatus;
  featured: boolean;
  publishedAt: string | null;
}

/** Loaded from content/prompts/<slug>.md, which is written by Decap CMS. id === slug. */
export interface Prompt {
  id: string;
  slug: string;
  title: string;
  categoryId: string | null;
  description: string;
  content: string;
  usageNotes: string;
  tags: string[];
  status: PublishStatus;
  featured: boolean;
}

export interface SiteContent {
  profile: Profile;
  experiences: Experience[];
  skillCategories: SkillCategory[];
  skills: Skill[];
  projects: Project[];
  blogCategories: Category[];
  promptCategories: Category[];
  articles: Article[];
  prompts: Prompt[];
}
