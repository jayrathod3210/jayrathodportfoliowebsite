import { describe, expect, it } from 'vitest';
import { extractToc, formatMonth, isSafeImageSrc, isSafeUrl, readingTimeMinutes, slugify, wordCount } from './utils';

describe('slugify', () => {
  it.each([
    ['API Testing Is More Than Checking Status Codes', 'api-testing-is-more-than-checking-status-codes'],
    ['Manual Testing Is Not Dead – It Is Evolving', 'manual-testing-is-not-dead-it-is-evolving'],
    ['  --Hello   World--  ', 'hello-world'],
    ['Café & Crème', 'cafe-creme'],
    ['', ''],
  ])('%s -> %s', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });
});

describe('reading time', () => {
  it('never returns less than one minute', () => {
    expect(readingTimeMinutes('')).toBe(1);
  });
  it('ignores fenced code when counting words', () => {
    expect(wordCount('one two\n```\nconst a = 1;\n```\nthree')).toBe(3);
  });
  it('scales with length', () => {
    expect(readingTimeMinutes(Array(1100).fill('word').join(' '))).toBe(5);
  });
});

describe('extractToc', () => {
  it('collects h2 and h3 headings and skips code fences', () => {
    const md = '# Title\n## First part\ntext\n```\n## not a heading\n```\n### Sub *point*\n## Second';
    expect(extractToc(md)).toEqual([
      { id: 'first-part', text: 'First part', level: 2 },
      { id: 'sub-point', text: 'Sub point', level: 3 },
      { id: 'second', text: 'Second', level: 2 },
    ]);
  });
});

describe('URL safety', () => {
  it('accepts http(s) and mailto, rejects script URLs', () => {
    expect(isSafeUrl('https://example.com')).toBe(true);
    expect(isSafeUrl('mailto:a@b.co')).toBe(true);
    expect(isSafeUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeUrl('not a url')).toBe(false);
    expect(isSafeUrl('')).toBe(true);
  });
  it('allows data:image and relative paths for images only', () => {
    expect(isSafeImageSrc('data:image/webp;base64,AAA')).toBe(true);
    expect(isSafeImageSrc('/images/a.png')).toBe(true);
    expect(isSafeImageSrc('data:text/html,<script>')).toBe(false);
    expect(isSafeImageSrc(null)).toBe(false);
  });
});

describe('formatMonth', () => {
  it('formats YYYY-MM and treats null as Present', () => {
    expect(formatMonth('2023-04')).toBe('Apr 2023');
    expect(formatMonth(null)).toBe('Present');
  });
});
