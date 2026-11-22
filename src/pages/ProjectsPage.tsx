import { FolderGit2 } from 'lucide-react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { publishedProjects } from '../lib/selectors';
import { PageHeader } from '../components/layout/PageHeader';
import { Container, EmptyState } from '../components/ui/primitives';
import { ProjectCard } from '../components/cards';

export function ProjectsPage() {
  const data = useSnapshot();
  const projects = publishedProjects(data);
  const hasSamples = projects.some((p) => p.isSample);
  useSeo('Projects', 'QA and automation project case studies: business context, testing approach, challenges and outcomes.');

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Project showcase"
        description="Case studies covering the business context, testing approach, my responsibilities and what changed as a result."
      />
      <Container className="py-16">
        {hasSamples && (
          <p className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Projects marked <strong>Sample placeholder</strong> are templates, not completed work. Real case studies are being written up.
          </p>
        )}
        {projects.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <EmptyState icon={<FolderGit2 className="size-8" />} title="Projects coming soon" description="Case studies are being prepared." />
        )}
      </Container>
    </>
  );
}
