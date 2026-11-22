import { ArrowLeft, Info } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { publishedPrompts } from '../lib/selectors';
import { Badge, Card, Container, Tag } from '../components/ui/primitives';
import { CopyButton } from '../components/CopyButton';
import { PromptCard } from '../components/cards';
import { NotFoundPage } from './NotFoundPage';

export function PromptDetailPage() {
  const { slug } = useParams();
  const data = useSnapshot();
  const prompts = publishedPrompts(data);
  const prompt = prompts.find((p) => p.slug === slug);
  useSeo(prompt ? `${prompt.title} · QA Prompt` : 'Prompt not found', prompt?.description);

  if (!prompt) return <NotFoundPage />;

  const category = data.promptCategories.find((c) => c.id === prompt.categoryId);
  const related = prompts.filter((p) => p.id !== prompt.id && p.categoryId === prompt.categoryId).slice(0, 3);
  const placeholders = [...new Set(prompt.content.match(/\{\{[^}]+\}\}/g) ?? [])];

  return (
    <>
      <Container className="max-w-4xl py-12">
        <Link to="/prompts" className="inline-flex items-center gap-1 text-sm text-muted hover:text-white">
          <ArrowLeft className="size-4" aria-hidden /> QA Prompt Library
        </Link>
        <div className="mt-6 flex flex-wrap gap-2">
          {category && (
            <Link to={`/prompts?category=${category.id}`}>
              <Badge tone="accent">{category.name}</Badge>
            </Link>
          )}
        </div>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{prompt.title}</h1>
        <p className="mt-3 text-lg text-muted">{prompt.description}</p>

        <Card className="mt-8 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-line bg-navy-850 px-4 py-3">
            <p className="font-mono text-xs text-subtle">prompt.txt</p>
            <CopyButton text={prompt.content} itemName={prompt.title} />
          </div>
          <pre
            data-testid="prompt-content"
            className="max-h-[60vh] overflow-auto p-5 font-mono text-sm leading-relaxed whitespace-pre-wrap text-slate-200"
          >
            {prompt.content}
          </pre>
        </Card>

        {(prompt.usageNotes || placeholders.length > 0) && (
          <Card className="mt-6 flex gap-4 p-5">
            <Info className="mt-0.5 size-5 shrink-0 text-accent-soft" aria-hidden />
            <div className="space-y-3 text-sm text-slate-300">
              {prompt.usageNotes && <p>{prompt.usageNotes}</p>}
              {placeholders.length > 0 && (
                <div>
                  <p className="text-subtle">Replace these placeholders before using the prompt:</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {placeholders.map((p) => (
                      <li key={p}>
                        <Tag>{p}</Tag>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card>
        )}

        {prompt.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {prompt.tags.map((t) => (
              <Link key={t} to={`/prompts?tag=${encodeURIComponent(t)}`}>
                <Tag className="hover:text-white">#{t}</Tag>
              </Link>
            ))}
          </div>
        )}
      </Container>

      {related.length > 0 && (
        <section className="border-t border-line py-14" aria-labelledby="related-prompts">
          <Container>
            <h2 id="related-prompts" className="mb-6 text-xl font-semibold">
              More {category?.name} prompts
            </h2>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PromptCard key={p.id} prompt={p} categoryName={category?.name} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
