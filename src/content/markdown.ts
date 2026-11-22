import { parse } from 'yaml';
import type { Article, Category, PublishStatus, Prompt } from '../types/content';

export interface ParsedFile {
  data: Record<string, unknown>;
  body: string;
}

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

export function parseFrontMatter(raw: string): ParsedFile {
  const match = FRONT_MATTER.exec(raw.replace(/^﻿/, ''));
  if (!match) return { data: {}, body: raw.trim() };
  const data = parse(match[1]);
  return { data: data && typeof data === 'object' ? (data as Record<string, unknown>) : {}, body: match[2].trim() };
}

export function slugFromPath(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '');
}

export const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '');
export const bool = (v: unknown): boolean => v === true || v === 'true';
export const list = (v: unknown): string[] => (Array.isArray(v) ? v.map(str).filter(Boolean) : []);
const status = (v: unknown): PublishStatus => (str(v) === 'published' ? 'published' : 'draft');

function date(v: unknown): string | null {
  if (v instanceof Date) return Number.isNaN(v.getTime()) ? null : v.toISOString();
  const s = str(v);
  if (!s || Number.isNaN(new Date(s).getTime())) return null;
  return s;
}

function category(v: unknown, categories: Category[]): string | null {
  const id = str(v);
  return categories.some((c) => c.id === id) ? id : null;
}

/** Returns null (and the file is skipped) when a required field is missing. */
export function articleFromFile(path: string, raw: string, categories: Category[]): Article | null {
  const { data, body } = parseFrontMatter(raw);
  const slug = slugFromPath(path);
  const title = str(data.title);
  if (!title) return null;
  const s = status(data.status);
  return {
    id: slug,
    slug,
    title,
    excerpt: str(data.excerpt),
    content: body,
    coverImage: str(data.coverImage) || null,
    coverAlt: str(data.coverAlt),
    categoryId: category(data.category, categories),
    tags: list(data.tags),
    status: s,
    featured: bool(data.featured),
    publishedAt: s === 'published' ? date(data.publishedAt) : null,
  };
}

export function promptFromFile(path: string, raw: string, categories: Category[]): Prompt | null {
  const { data, body } = parseFrontMatter(raw);
  const slug = slugFromPath(path);
  const title = str(data.title);
  if (!title || !body) return null;
  return {
    id: slug,
    slug,
    title,
    categoryId: category(data.category, categories),
    description: str(data.description),
    content: body,
    usageNotes: str(data.usageNotes),
    tags: list(data.tags),
    status: status(data.status),
    featured: bool(data.featured),
  };
}
