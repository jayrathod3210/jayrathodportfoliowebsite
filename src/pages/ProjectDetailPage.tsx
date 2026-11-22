import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { isSafeImageSrc, isSafeUrl } from '../lib/utils';
import { Card, Container, Tag } from '../components/ui/primitives';
import { LinkButton } from '../components/ui/Button';
import { SampleBadge } from '../components/cards';
import { SocialIcon } from '../components/ui/SocialIcon';
import { NotFoundPage } from './NotFoundPage';

function ListSection({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300 marker:text-accent">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </section>
  );
}

function TextSection({ title, text }: { title: string; text: string }) {
  if (!text) return null;
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 leading-relaxed whitespace-pre-line text-slate-300">{text}</p>
    </section>
  );
}

export function ProjectDetailPage() {
  const { slug } = useParams();
  const data = useSnapshot();
  const project = data.projects.find((p) => p.slug === slug);
  useSeo(project?.title ?? 'Project not found', project?.summary);

  if (!project) return <NotFoundPage />;

  return (
    <article>
      <header className="hero-backdrop border-b border-line">
        <Container className="py-12 sm:py-16">
          <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-muted hover:text-white">
            <ArrowLeft className="size-4" aria-hidden /> All projects
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">{project.isSample && <SampleBadge />}</div>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">{project.title}</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted">{project.summary}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {project.githubUrl && isSafeUrl(project.githubUrl) && (
              <LinkButton href={project.githubUrl} external variant="secondary">
                <SocialIcon platform="github" /> View on GitHub
              </LinkButton>
            )}
            {project.liveUrl && isSafeUrl(project.liveUrl) && (
              <LinkButton href={project.liveUrl} external>
                <ExternalLink className="size-4" aria-hidden /> Live project
              </LinkButton>
            )}
          </div>
        </Container>
      </header>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1fr_280px]">
        <div className="space-y-10">
          {project.isSample && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              This is a template placeholder showing how a case study will be structured. It does not describe completed work.
            </p>
          )}
          <TextSection title="Business context" text={project.businessContext} />
          <TextSection title="Testing approach" text={project.testingApproach} />
          <ListSection title="My responsibilities" items={project.responsibilities} />
          <ListSection title="Key challenges" items={project.challenges} />
          <ListSection title="Outcomes" items={project.outcomes} />
          {project.images.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold">Screenshots & diagrams</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {project.images
                  .filter((img) => isSafeImageSrc(img.url))
                  .map((img) => (
                    <figure key={img.url} className="overflow-hidden rounded-xl border border-line">
                      <img src={img.url} alt={img.alt} loading="lazy" className="w-full" />
                      {img.alt && <figcaption className="p-3 text-xs text-subtle">{img.alt}</figcaption>}
                    </figure>
                  ))}
              </div>
            </section>
          )}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <h2 className="text-sm font-semibold tracking-wider text-subtle uppercase">Technologies</h2>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.length ? project.technologies.map((t) => <Tag key={t}>{t}</Tag>) : <p className="text-sm text-subtle">Not specified</p>}
            </div>
          </Card>
        </aside>
      </Container>
    </article>
  );
}
