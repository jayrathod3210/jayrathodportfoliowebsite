import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, FlaskConical, PenLine } from 'lucide-react';
import type { Article, Project, Prompt } from '../types/content';
import { cn, formatDate, isSafeImageSrc, readingTimeMinutes } from '../lib/utils';
import { Badge, Card, Tag } from './ui/primitives';
import { CopyButton } from './CopyButton';

export function ArticleCover({ article, className }: { article: Article; className?: string }) {
  if (article.coverImage && isSafeImageSrc(article.coverImage)) {
    return (
      <div className={cn('overflow-hidden', className)}>
        <img
          src={article.coverImage}
          alt={article.coverAlt}
          loading="lazy"
          className="aspect-[16/9] size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </div>
    );
  }
  return (
    <div
      aria-hidden
      className={cn('relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden bg-navy-900', className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(59_130_246/0.35),transparent_55%),radial-gradient(circle_at_80%_90%,rgb(34_211_238/0.2),transparent_50%)] transition-transform duration-700 group-hover:scale-110" />
      <div className="grid-backdrop absolute inset-0" />
      <span className="relative font-mono text-xs tracking-[0.3em] text-white/40 uppercase">Article</span>
    </div>
  );
}

export function ArticleMeta({ article, categoryName }: { article: Article; categoryName?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-subtle">
      {categoryName && <Badge tone="accent">{categoryName}</Badge>}
      {article.publishedAt && <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>}
      <span className="inline-flex items-center gap-1">
        <Clock className="size-3.5" aria-hidden />
        {readingTimeMinutes(article.content)} min read
      </span>
    </div>
  );
}

export function ArticleCard({ article, categoryName }: { article: Article; categoryName?: string }) {
  return (
    <Card interactive className="group relative flex flex-col overflow-hidden">
      <ArticleCover article={article} />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <ArticleMeta article={article} categoryName={categoryName} />
        <h3 className="text-lg leading-snug font-semibold transition-colors group-hover:text-accent-soft">
          <Link to={`/blog/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-muted">{article.excerpt}</p>
        {article.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {article.tags.slice(0, 3).map((t) => (
              <Tag key={t}>#{t}</Tag>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

export function UpcomingArticle({ article, categoryName }: { article: Article; categoryName?: string }) {
  return (
    <Card interactive className="flex flex-col gap-3 p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="warning">
          <PenLine className="size-3" aria-hidden /> In the works
        </Badge>
        {categoryName && <Badge>{categoryName}</Badge>}
      </div>
      <h3 className="mt-1 text-lg leading-snug font-semibold">{article.title}</h3>
      <p className="text-sm leading-relaxed text-muted">{article.excerpt}</p>
    </Card>
  );
}

export function PromptCard({ prompt, categoryName }: { prompt: Prompt; categoryName?: string }) {
  return (
    <Card interactive className="flex flex-col p-6" data-testid="prompt-card">
      <div className="flex items-start justify-between gap-3">
        {categoryName ? <Badge tone="accent">{categoryName}</Badge> : <Badge>Uncategorized</Badge>}
      </div>
      <h3 className="mt-4 text-lg leading-snug font-semibold">{prompt.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{prompt.description}</p>
      <div className="relative mt-5 overflow-hidden rounded-xl border border-white/[0.06] bg-navy-950/70">
        <div className="flex items-center gap-1.5 border-b border-white/[0.05] px-3 py-2">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
        </div>
        <pre className="line-clamp-4 overflow-hidden p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-400">
          {prompt.content}
        </pre>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-navy-950 to-transparent" />
      </div>
      {prompt.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {prompt.tags.map((t) => (
            <Tag key={t}>#{t}</Tag>
          ))}
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
        <CopyButton text={prompt.content} itemName={prompt.title} />
        <Link
          to={`/prompts/${prompt.slug}`}
          className="group/link inline-flex h-8 items-center gap-1 rounded-full px-3 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          aria-label={`View details: ${prompt.title}`}
        >
          View Details <ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" aria-hidden />
        </Link>
      </div>
    </Card>
  );
}

export function SampleBadge() {
  return (
    <Badge tone="warning">
      <FlaskConical className="size-3" aria-hidden /> Sample placeholder
    </Badge>
  );
}

export function ProjectCard({ project, index }: { project: Project; index?: number }) {
  return (
    <Card interactive className="group relative flex flex-col overflow-hidden p-7">
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-48 rounded-full bg-[radial-gradient(circle,rgb(59_130_246/0.18),transparent_65%)] transition-transform duration-700 group-hover:scale-150" />
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {project.isSample && <SampleBadge />}
          {project.featured && !project.isSample && <Badge tone="accent">Featured</Badge>}
        </div>
        {index !== undefined && <span className="font-mono text-xs text-subtle">{String(index + 1).padStart(2, '0')}</span>}
      </div>
      {/* Not `relative`: the link's ::after must stretch over the whole card, and z-10 keeps it above the positioned rows below. */}
      <h3 className="mt-5 text-xl leading-snug font-semibold transition-colors group-hover:text-accent-soft">
        <Link to={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:z-10">
          {project.title}
        </Link>
      </h3>
      <p className="relative mt-3 text-sm leading-relaxed text-muted">{project.summary}</p>
      <div className="relative mt-auto flex items-end justify-between gap-4 pt-6">
        <div className="flex flex-wrap gap-1.5">
          {project.technologies.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:border-cyan/50 group-hover:text-white">
          <ArrowUpRight className="size-4" aria-hidden />
        </span>
      </div>
    </Card>
  );
}
