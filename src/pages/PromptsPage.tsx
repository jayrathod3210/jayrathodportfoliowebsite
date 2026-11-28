import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX, Sparkles } from 'lucide-react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { allTags, filterPrompts, publishedPrompts } from '../lib/selectors';
import { cn } from '../lib/utils';
import { PageHeader } from '../components/layout/PageHeader';
import { Container, EmptyState } from '../components/ui/primitives';
import { SearchInput, SelectField } from '../components/ui/form';
import { Button } from '../components/ui/Button';
import { PromptCard } from '../components/cards';
import { Reveal, Stagger } from '../components/fx/Reveal';

export function PromptsPage() {
  const data = useSnapshot();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const categorySlug = params.get('category') ?? '';
  const tag = params.get('tag') ?? '';
  useSeo('QA Prompt Library', 'Reusable AI prompts for QA engineers: test case generation, API testing, Playwright, Cypress, bug analysis and more.');

  const prompts = useMemo(() => publishedPrompts(data), [data]);
  const category = data.promptCategories.find((c) => c.id === categorySlug);
  const results = filterPrompts(prompts, { query, categoryId: category?.id, tag });
  const tags = allTags(prompts);
  const counts = new Map<string, number>();
  prompts.forEach((p) => p.categoryId && counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1));
  const usedCategories = data.promptCategories.filter((c) => counts.get(c.id));
  const categoryName = (id: string | null) => data.promptCategories.find((c) => c.id === id)?.name;
  const filtering = Boolean(query || category || tag);

  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  }

  return (
    <>
      <PageHeader
        eyebrow="QA Prompt Library"
        title="AI prompts for everyday QA work"
        highlight={["AI", "prompts"]}
        description="Reusable, copy-ready prompts for test design, API testing, automation and bug analysis. Always review AI output: these prompts speed up thinking, they don't replace it."
      />
      <Container className="py-16">
        {prompts.length === 0 ? (
          <EmptyState icon={<Sparkles className="size-8" />} title="Prompts coming soon" description="The library is being prepared." />
        ) : (
          <>
            <Reveal className="mb-6 grid gap-4 md:grid-cols-[1fr_260px]">
              <SearchInput value={query} onChange={(v) => update('q', v)} placeholder="Search prompts…" label="Search prompts" />
              <SelectField
                label="Category"
                value={category?.id ?? ''}
                onChange={(e) => update('category', e.target.value)}
                wrapperClassName="[&>label]:sr-only"
                className="h-11"
              >
                <option value="">All categories ({prompts.length})</option>
                {usedCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({counts.get(c.id) ?? 0})
                  </option>
                ))}
              </SelectField>
            </Reveal>
            {tags.length > 0 && (
              <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
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
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted" aria-live="polite">
                Showing {results.length} of {prompts.length} prompts
              </p>
              {filtering && (
                <Button variant="ghost" size="sm" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                  Clear filters
                </Button>
              )}
            </div>
            {results.length ? (
              <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {results.map((p) => (
                  <PromptCard key={p.id} prompt={p} categoryName={categoryName(p.categoryId)} />
                ))}
              </Stagger>
            ) : (
              <EmptyState
                icon={<SearchX className="size-8" />}
                title="No prompts match your filters"
                description="Try a different search term or category."
              />
            )}
          </>
        )}
      </Container>
    </>
  );
}
