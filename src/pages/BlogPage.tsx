import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { BookOpen, SearchX } from 'lucide-react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { allTags, draftArticles, featuredArticle, filterArticles, publishedArticles } from '../lib/selectors';
import { cn } from '../lib/utils';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, Container, EmptyState } from '../components/ui/primitives';
import { SearchInput } from '../components/ui/form';
import { Button } from '../components/ui/Button';
import { ArticleCard, ArticleCover, ArticleMeta, UpcomingArticle } from '../components/cards';

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 text-sm transition-colors',
        active ? 'border-accent bg-accent/15 text-white' : 'border-line-strong text-muted hover:border-accent/50 hover:text-white',
      )}
    >
      {children}
    </button>
  );
}

export function BlogPage() {
  const data = useSnapshot();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const categorySlug = params.get('category') ?? '';
  const tag = params.get('tag') ?? '';
  useSeo('Blog', 'Articles on software testing, automation, API testing, Playwright, Cypress, Selenium and AI in QA.');

  const published = useMemo(() => publishedArticles(data), [data]);
  const upcoming = useMemo(() => draftArticles(data), [data]);
  const category = data.blogCategories.find((c) => c.id === categorySlug);
  const usedCategoryIds = new Set(published.map((a) => a.categoryId));
  const categories = data.blogCategories.filter((c) => usedCategoryIds.has(c.id));
  const tags = allTags(published);
  const categoryName = (id: string | null) => data.blogCategories.find((c) => c.id === id)?.name;

  const filtering = Boolean(query || category || tag);
  const results = filterArticles(published, { query, categoryId: category?.id, tag });
  const featured = filtering ? null : featuredArticle(published);
  const grid = featured ? results.filter((a) => a.id !== featured.id) : results;

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  return (
    <>
      <PageHeader
        eyebrow="Blog"
        title="Notes on testing & quality"
        description="Practical writing on software testing, automation, API testing, AI in QA and growing a career in quality engineering."
      />
      <Container className="py-12">
        {published.length > 0 && (
          <div className="mb-10 space-y-4">
            <div className="max-w-xl">
              <SearchInput value={query} onChange={(v) => update('q', v)} placeholder="Search articles…" label="Search articles" />
            </div>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                <FilterChip active={!category} onClick={() => update('category', '')}>
                  All
                </FilterChip>
                {categories.map((c) => (
                  <FilterChip key={c.id} active={category?.id === c.id} onClick={() => update('category', category?.id === c.id ? '' : c.id)}>
                    {c.name}
                  </FilterChip>
                ))}
              </div>
            )}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
                <span className="text-xs text-subtle">Tags:</span>
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={tag === t}
                    onClick={() => update('tag', tag === t ? '' : t)}
                    className={cn(
                      'rounded-md px-2 py-0.5 font-mono text-xs',
                      tag === t ? 'bg-accent text-white' : 'bg-navy-800 text-muted hover:text-white',
                    )}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {featured && (
          <Card interactive className="group relative mb-10 grid overflow-hidden md:grid-cols-2">
            <ArticleCover article={featured} className="h-full md:aspect-auto" />
            <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
              <p className="font-mono text-xs tracking-wider text-accent-soft uppercase">Featured article</p>
              <h2 className="text-2xl leading-snug font-semibold group-hover:text-accent-soft">
                <Link to={`/blog/${featured.slug}`} className="after:absolute after:inset-0">
                  {featured.title}
                </Link>
              </h2>
              <p className="text-muted">{featured.excerpt}</p>
              <ArticleMeta article={featured} categoryName={categoryName(featured.categoryId)} />
            </div>
          </Card>
        )}

        {published.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="size-8" />}
            title="First articles are on the way"
            description="No articles have been published yet. Here's what's currently being written."
          />
        ) : grid.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((a) => (
              <ArticleCard key={a.id} article={a} categoryName={categoryName(a.categoryId)} />
            ))}
          </div>
        ) : filtering ? (
          <EmptyState
            icon={<SearchX className="size-8" />}
            title="No articles match your filters"
            action={
              <Button variant="secondary" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                Clear filters
              </Button>
            }
          />
        ) : null}

        {upcoming.length > 0 && !filtering && (
          <section className="mt-16" aria-labelledby="upcoming">
            <h2 id="upcoming" className="text-xl font-semibold">
              In the works
            </h2>
            <p className="mt-1 text-sm text-muted">Draft topics currently being written. Not yet published.</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((a) => (
                <UpcomingArticle key={a.id} article={a} categoryName={categoryName(a.categoryId)} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
