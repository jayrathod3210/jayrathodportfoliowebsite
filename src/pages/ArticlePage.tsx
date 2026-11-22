import { ArrowLeft, Link2 } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSnapshot } from '../content';
import { useToast } from '../context/ToastContext';
import { useSeo } from '../hooks/useSeo';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { publishedArticles, relatedArticles } from '../lib/selectors';
import { extractToc, isSafeImageSrc } from '../lib/utils';
import { Avatar, Container, Tag } from '../components/ui/primitives';
import { ArticleCard, ArticleMeta } from '../components/cards';
import { Markdown } from '../components/Markdown';
import { SocialIcon } from '../components/ui/SocialIcon';
import { NotFoundPage } from './NotFoundPage';

function ShareLinks({ title }: { title: string }) {
  const { copy } = useCopyToClipboard();
  const { notify } = useToast();
  const url = window.location.href.split('?')[0];
  const enc = encodeURIComponent;
  const btn =
    'inline-flex size-9 items-center justify-center rounded-lg border border-line text-muted hover:border-accent/50 hover:text-white';

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs text-subtle">Share</span>
      <a
        className={btn}
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
      >
        <SocialIcon platform="linkedin" />
      </a>
      <a
        className={btn}
        href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X"
      >
        <SocialIcon platform="x" />
      </a>
      <button
        type="button"
        className={btn}
        aria-label="Copy link"
        onClick={async () => {
          const ok = await copy(url);
          notify(ok ? 'Link copied.' : 'Could not copy the link.', ok ? 'success' : 'error');
        }}
      >
        <Link2 className="size-4" />
      </button>
    </div>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const data = useSnapshot();
  const article = data.articles.find((a) => a.slug === slug);
  // Drafts are only viewable on the local dev server, never in a production build.
  const visible = article && (article.status === 'published' || import.meta.env.DEV);
  useSeo(visible ? article.title : 'Article not found', visible ? article.excerpt : undefined, {
    noindex: !visible || article.status !== 'published',
  });

  if (!article || !visible) return <NotFoundPage />;

  const { profile } = data;
  const toc = extractToc(article.content);
  const categoryName = data.blogCategories.find((c) => c.id === article.categoryId)?.name;
  const related = relatedArticles(article, publishedArticles(data));

  return (
    <article>
      {article.status === 'draft' && (
        <div role="note" className="border-b border-amber-500/30 bg-amber-500/10 py-2 text-center text-sm text-amber-200">
          Draft preview: visible on the local dev server only. Set the status to Published in the CMS to make it live.
        </div>
      )}
      <header className="border-b border-line">
        <Container className="max-w-4xl pt-32 pb-14 sm:pt-40 sm:pb-16">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted hover:text-white">
            <ArrowLeft className="size-4" aria-hidden /> All articles
          </Link>
          <div className="mt-6">
            <ArticleMeta article={article} categoryName={categoryName} />
          </div>
          <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg text-muted">{article.excerpt}</p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Avatar src={profile.avatarUrl} name={profile.name} className="size-11 text-sm" />
              <div>
                <p className="text-sm font-medium text-white">{profile.name}</p>
                <p className="text-xs text-subtle">{profile.positioning}</p>
              </div>
            </div>
            <ShareLinks title={article.title} />
          </div>
        </Container>
      </header>

      {article.coverImage && isSafeImageSrc(article.coverImage) && (
        <Container className="max-w-5xl pt-10">
          <img src={article.coverImage} alt={article.coverAlt} className="aspect-[2/1] w-full rounded-2xl border border-line object-cover" />
        </Container>
      )}

      <Container className={`grid gap-12 py-12 ${toc.length >= 3 ? 'max-w-6xl lg:grid-cols-[1fr_240px]' : 'max-w-3xl'}`}>
        <div className="min-w-0">
          <Markdown content={article.content} />
          {article.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-line pt-6">
              {article.tags.map((t) => (
                <Link key={t} to={`/blog?tag=${encodeURIComponent(t)}`}>
                  <Tag className="hover:text-white">#{t}</Tag>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-8 flex items-center gap-4 rounded-xl border border-line bg-navy-900 p-5">
            <Avatar src={profile.avatarUrl} name={profile.name} className="size-14 text-base" />
            <div>
              <p className="text-sm text-subtle">Written by</p>
              <p className="font-semibold text-white">{profile.name}</p>
              <p className="text-sm text-muted">{profile.positioning}</p>
            </div>
          </div>
        </div>
        {toc.length >= 3 && (
          <nav aria-label="Table of contents" className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
            <p className="text-xs font-semibold tracking-wider text-subtle uppercase">On this page</p>
            <ul className="mt-3 space-y-2 border-l border-line text-sm">
              {toc.map((item) => (
                <li key={item.id} className={item.level === 3 ? 'pl-6' : 'pl-3'}>
                  <a href={`#${item.id}`} className="text-muted hover:text-white">
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>

      {related.length > 0 && (
        <section className="border-t border-line py-14" aria-labelledby="related">
          <Container>
            <h2 id="related" className="mb-6 text-xl font-semibold">
              Related articles
            </h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} categoryName={data.blogCategories.find((c) => c.id === a.categoryId)?.name} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </article>
  );
}
