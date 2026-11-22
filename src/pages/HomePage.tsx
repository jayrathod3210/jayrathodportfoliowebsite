import { ArrowRight, BookOpen, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { draftArticles, publishedArticles, publishedProjects, publishedPrompts } from '../lib/selectors';
import { LinkButton } from '../components/ui/Button';
import { Avatar, Card, Container, EmptyState, SectionHeading, Tag } from '../components/ui/primitives';
import { ArticleCard, ProjectCard, PromptCard, UpcomingArticle } from '../components/cards';
import { QaUnpackedTeaser } from '../components/QaUnpacked';

const KEY_SKILL_CATEGORIES = ['sc_automation', 'sc_api', 'sc_testing'];

function SectionLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-sm font-medium text-accent-soft hover:text-white">
      {children} <ArrowRight className="size-4" aria-hidden />
    </Link>
  );
}

export function HomePage() {
  const data = useSnapshot();
  const { profile } = data;
  useSeo('', profile.heroSubtitle);

  const categoryName = (id: string | null) => data.blogCategories.find((c) => c.id === id)?.name;
  const promptCategory = (id: string | null) => data.promptCategories.find((c) => c.id === id)?.name;

  const projects = publishedProjects(data).filter((p) => p.featured).slice(0, 3);
  const articles = publishedArticles(data).slice(0, 3);
  const upcoming = draftArticles(data).slice(0, 3);
  const prompts = publishedPrompts(data)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);
  const keySkills = data.skills
    .filter((s) => KEY_SKILL_CATEGORIES.includes(s.categoryId))
    .sort((a, b) => KEY_SKILL_CATEGORIES.indexOf(a.categoryId) - KEY_SKILL_CATEGORIES.indexOf(b.categoryId) || a.order - b.order)
    .slice(0, 14);

  return (
    <>
      {/* Hero */}
      <section className="hero-backdrop relative overflow-hidden border-b border-line">
        <div className="grid-backdrop absolute inset-0" aria-hidden />
        <Container className="relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_auto] lg:py-28">
          <div className="max-w-2xl animate-fade-up">
            <Avatar src={profile.avatarUrl} name={profile.name} className="mb-6 size-20 text-2xl lg:hidden" />
            <p className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-navy-900/80 px-3 py-1 font-mono text-xs text-accent-soft">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden /> {profile.positioning}
            </p>
            <h1 className="mt-6 text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block text-slate-300">Hi, I'm {profile.name}.</span>
              <span className="mt-1 block">{profile.heroTitle}</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{profile.heroSubtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <LinkButton to="/projects" size="lg">
                Explore My Work <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
              <LinkButton to="/contact" size="lg" variant="secondary">
                Let's Connect
              </LinkButton>
            </div>
          </div>
          <div className="hidden justify-self-center lg:block">
            <div className="relative">
              <div className="absolute -inset-3 rounded-full border border-accent/20" aria-hidden />
              <Avatar src={profile.avatarUrl} name={profile.name} className="size-64 text-6xl" />
            </div>
          </div>
        </Container>
        <Container className="relative pb-12">
          <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
            <div className="bg-navy-900 p-5">
              <dt className="text-xs tracking-wider text-subtle uppercase">Experience</dt>
              <dd className="mt-1 text-lg font-semibold text-white">{profile.yearsOfExperience} years in software testing</dd>
            </div>
            <div className="bg-navy-900 p-5">
              <dt className="text-xs tracking-wider text-subtle uppercase">Platforms</dt>
              <dd className="mt-1 text-lg font-semibold text-white">Web · Mobile · API</dd>
            </div>
            <div className="bg-navy-900 p-5">
              <dt className="text-xs tracking-wider text-subtle uppercase">Automation</dt>
              <dd className="mt-1 text-lg font-semibold text-white">Playwright · Cypress · Selenium</dd>
            </div>
          </dl>
        </Container>
      </section>

      {/* Experience summary */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Career journey"
            title="From manual testing to quality engineering"
            description={profile.shortIntro}
            action={<SectionLink to="/experience">View full experience</SectionLink>}
          />
          <ol className="grid gap-4 md:grid-cols-3">
            {profile.journey.map((stage, i) => (
              <li key={stage.id}>
                <Card className="h-full p-6">
                  <p className="font-mono text-xs text-accent-soft">
                    0{i + 1} · {stage.period}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold">{stage.title}</h3>
                  <p className="mt-2 text-sm text-muted">{stage.description}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Key skills */}
      <section className="border-y border-line bg-navy-900/40 py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Key skills"
              title="Testing depth, automation breadth"
              description="Strong manual testing fundamentals combined with modern automation and API validation."
              className="mb-6 sm:mb-6"
            />
            <SectionLink to="/skills">See all skills</SectionLink>
          </div>
          <ul className="flex flex-wrap gap-2" aria-label="Key skills">
            {keySkills.map((s) => (
              <li key={s.id}>
                <span className="inline-flex rounded-lg border border-line-strong bg-navy-900 px-3 py-2 text-sm text-slate-200">
                  {s.name}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Featured projects */}
      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Projects"
            title="Featured work"
            action={<SectionLink to="/projects">All projects</SectionLink>}
          />
          {projects.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          ) : (
            <EmptyState title="Projects coming soon" description="Case studies are being prepared." />
          )}
        </Container>
      </section>

      {/* Articles */}
      <section className="py-20 pt-0">
        <Container>
          <SectionHeading
            eyebrow="Blog"
            title={articles.length ? 'Latest articles' : 'Articles in the works'}
            description={articles.length ? undefined : 'Practical writing on testing, automation and AI in QA, coming soon.'}
            action={<SectionLink to="/blog">Visit the blog</SectionLink>}
          />
          {articles.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} categoryName={categoryName(a.categoryId)} />
              ))}
            </div>
          ) : upcoming.length ? (
            <div className="grid gap-4 md:grid-cols-3">
              {upcoming.map((a) => (
                <UpcomingArticle key={a.id} article={a} categoryName={categoryName(a.categoryId)} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<BookOpen className="size-8" />} title="No articles yet" />
          )}
        </Container>
      </section>

      {/* Prompt library preview */}
      <section className="border-y border-line bg-navy-900/40 py-20">
        <Container>
          <SectionHeading
            eyebrow="QA Prompt Library"
            title="Reusable AI prompts for everyday QA"
            description="Copy-ready prompts for test design, API testing, automation and bug analysis."
            action={<SectionLink to="/prompts">Browse the library</SectionLink>}
          />
          {prompts.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {prompts.map((p) => (
                <PromptCard key={p.id} prompt={p} categoryName={promptCategory(p.categoryId)} />
              ))}
            </div>
          ) : (
            <EmptyState icon={<Sparkles className="size-8" />} title="Prompts coming soon" />
          )}
        </Container>
      </section>

      {/* QA UNPACKED */}
      <section className="py-20">
        <Container>
          <QaUnpackedTeaser brand={profile.qaUnpacked} />
        </Container>
      </section>

      {/* Contact */}
      <section className="pb-4">
        <Container>
          <Card className="flex flex-col items-start gap-6 p-8 sm:p-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold sm:text-3xl">Let's build quality together.</h2>
              <p className="mt-2 max-w-xl text-muted">
                Open to conversations about QA roles, automation, and software quality.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.interests.slice(0, 3).map((i) => (
                  <Tag key={i}>{i}</Tag>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <LinkButton to="/contact" size="lg">
                Get in touch
              </LinkButton>
              {profile.email && (
                <LinkButton href={`mailto:${profile.email}`} size="lg" variant="secondary">
                  <Mail className="size-4" aria-hidden /> Email me
                </LinkButton>
              )}
            </div>
          </Card>
        </Container>
      </section>
    </>
  );
}
