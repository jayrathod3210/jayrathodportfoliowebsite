import { Bot, Bug, GitBranch, Plug, Users, Workflow, type LucideIcon } from 'lucide-react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { skillsByCategory } from '../lib/selectors';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, Container, EmptyState } from '../components/ui/primitives';

const ICONS: Record<string, LucideIcon> = {
  sc_testing: Bug,
  sc_automation: Workflow,
  sc_api: Plug,
  sc_cicd: GitBranch,
  sc_tools: Users,
  sc_emerging: Bot,
};

export function SkillsPage() {
  const data = useSnapshot();
  const groups = skillsByCategory(data).filter((g) => g.skills.length > 0);
  useSeo('Skills', 'Software testing, automation (Playwright, Cypress, Selenium), API testing and AI-assisted QA skills.');

  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title="Skills & tools"
        description="Grouped by how I use them. No self-rated percentages, just the practices and tools I work with."
      />
      <Container className="py-16">
        {groups.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {groups.map(({ category, skills }) => {
              const Icon = ICONS[category.id] ?? Workflow;
              return (
                <Card key={category.id} className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent-soft">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h2 className="text-lg font-semibold">{category.name}</h2>
                  </div>
                  {category.description && <p className="mt-3 text-sm text-muted">{category.description}</p>}
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <li key={s.id} className="rounded-lg border border-line-strong bg-navy-850 px-3 py-1.5 text-sm text-slate-200">
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState title="Skills coming soon" />
        )}
      </Container>
    </>
  );
}
