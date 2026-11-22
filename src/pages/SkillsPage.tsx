import { Bot, Bug, Gauge, GitBranch, Plug, Users, Workflow, type LucideIcon } from 'lucide-react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { skillsByCategory } from '../lib/selectors';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, Container, EmptyState } from '../components/ui/primitives';
import { Stagger } from '../components/fx/Reveal';

// Categories are created in the CMS, so pick an icon from keywords in the category name.
const ICON_RULES: Array<[RegExp, LucideIcon]> = [
  [/\bapi\b/i, Plug],
  [/perform|load|stress|speed/i, Gauge],
  [/ci\/?cd|pipeline|devops/i, GitBranch],
  [/\bai\b|emerging|future/i, Bot],
  [/tool|collab/i, Users],
  [/automat/i, Workflow],
  [/test/i, Bug],
];
const iconFor = (name: string): LucideIcon => ICON_RULES.find(([re]) => re.test(name))?.[1] ?? Workflow;

export function SkillsPage() {
  const data = useSnapshot();
  const groups = skillsByCategory(data).filter((g) => g.skills.length > 0);
  useSeo('Skills', 'Software testing, automation (Playwright, Cypress, Selenium), API testing and AI-assisted QA skills.');

  return (
    <>
      <PageHeader
        eyebrow="Skills"
        title="Skills & tools"
        highlight={['tools']}
        description="Grouped by how I use them. No self-rated percentages, just the practices and tools I work with."
      />
      <Container className="py-20">
        {groups.length ? (
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {groups.map(({ category, skills }, i) => {
              const Icon = iconFor(category.name);
              return (
                <Card key={category.id} interactive className="group relative overflow-hidden p-7">
                  <div aria-hidden className="pointer-events-none absolute -top-16 -right-16 size-44 rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.14),transparent_65%)] transition-transform duration-700 group-hover:scale-150" />
                  <div className="relative flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-cyan/10 text-accent-soft ring-1 ring-white/10 transition-transform duration-500 group-hover:rotate-[-8deg]">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <h2 className="relative mt-5 text-xl font-semibold">{category.name}</h2>
                  {category.description && <p className="relative mt-2 text-sm text-muted">{category.description}</p>}
                  <ul className="relative mt-6 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <li key={s.id} className="rounded-full border border-white/10 bg-navy-950/60 px-3 py-1.5 text-sm text-slate-200 transition-colors hover:border-cyan/40">
                        {s.name}
                      </li>
                    ))}
                  </ul>
                </Card>
              );
            })}
          </Stagger>
        ) : (
          <EmptyState title="Skills coming soon" />
        )}
      </Container>
    </>
  );
}
