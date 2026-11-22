import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, FlaskConical, ImageIcon } from 'lucide-react';
import type { Article, Project, Prompt } from '../types/content';
import { cn, formatDate, isSafeImageSrc, readingTimeMinutes } from '../lib/utils';
import { Badge, Card, Tag } from './ui/primitives';
import { CopyButton } from './CopyButton';

export function ArticleCover({ article, className }: { article: Article; className?: string }) {
  if (article.coverImage && isSafeImageSrc(article.coverImage)) {
    return (
      <img
        src={article.coverImage}
        alt={article.coverAlt}
        loading="lazy"
        className={cn('aspect-[16/9] w-full object-cover', className)}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={cn(
        'grid-backdrop flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-navy-800 to-navy-900',
        className,
      )}
    >
      <ImageIcon className="size-8 text-line-strong" />
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
      <div className="flex flex-1 flex-col gap-3 p-5">
        <ArticleMeta article={article} categoryName={categoryName} />
        <h3 className="text-lg leading-snug font-semibold group-hover:text-accent-soft">
          <Link to={`/blog/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{article.excerpt}</p>
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
    <Card className="flex flex-col gap-2 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="warning">In the works</Badge>
        {categoryName && <Badge>{categoryName}</Badge>}
      </div>
      <h3 className="text-base leading-snug font-semibold">{article.title}</h3>
      <p className="text-sm text-muted">{article.excerpt}</p>
    </Card>
  );
}

export function PromptCard({ prompt, categoryName }: { prompt: Prompt; categoryName?: string }) {
  return (
    <Card interactive className="flex flex-col p-5" data-testid="prompt-card">
      <div className="flex items-start justify-between gap-3">
        {categoryName ? <Badge tone="accent">{categoryName}</Badge> : <Badge>Uncategorized</Badge>}
      </div>
      <h3 className="mt-3 text-base leading-snug font-semibold">{prompt.title}</h3>
      <p className="mt-2 text-sm text-muted">{prompt.description}</p>
      <pre className="mt-4 line-clamp-4 overflow-hidden rounded-lg border border-line bg-navy-950 p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap text-slate-400">
        {prompt.content}
      </pre>
      {prompt.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {prompt.tags.map((t) => (
            <Tag key={t}>#{t}</Tag>
          ))}
        </div>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <CopyButton text={prompt.content} itemName={prompt.title} />
        <Link
          to={`/prompts/${prompt.slug}`}
          className="inline-flex h-8 items-center gap-1 rounded-lg px-3 text-sm text-slate-300 hover:bg-navy-800 hover:text-white"
          aria-label={`View details: ${prompt.title}`}
        >
          View Details <ArrowUpRight className="size-3.5" aria-hidden />
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

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card interactive className="group relative flex flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        {project.isSample && <SampleBadge />}
        {project.featured && !project.isSample && <Badge tone="accent">Featured</Badge>}
      </div>
      <h3 className="mt-3 text-lg leading-snug font-semibold group-hover:text-accent-soft">
        <Link to={`/projects/${project.slug}`} className="after:absolute after:inset-0">
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-muted">{project.summary}</p>
      {project.technologies.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {project.technologies.map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
        </div>
      )}
    </Card>
  );
}
