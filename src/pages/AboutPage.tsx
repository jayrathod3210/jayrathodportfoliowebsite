import { Quote, Target } from 'lucide-react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { PageHeader } from '../components/layout/PageHeader';
import { Avatar, Card, Container } from '../components/ui/primitives';
import { LinkButton } from '../components/ui/Button';
import { Markdown } from '../components/Markdown';

export function AboutPage() {
  const { profile } = useSnapshot();
  useSeo('About', profile.shortIntro);

  return (
    <>
      <PageHeader eyebrow="About" title="From test execution to quality engineering" description={profile.shortIntro} />

      <Container className="grid gap-12 py-16 lg:grid-cols-[1fr_320px]">
        <div className="space-y-14">
          <section aria-labelledby="story">
            <h2 id="story" className="text-2xl font-semibold">
              My story
            </h2>
            <Markdown content={profile.about} className="prose-article mt-5" />
          </section>

          <section aria-labelledby="philosophy">
            <h2 id="philosophy" className="sr-only">
              Testing philosophy
            </h2>
            <figure className="relative rounded-2xl border border-accent/25 bg-gradient-to-br from-accent/10 to-transparent p-8 sm:p-10">
              <Quote className="size-8 text-accent" aria-hidden />
              <blockquote className="mt-4 text-xl leading-relaxed font-medium text-white sm:text-2xl">
                “{profile.philosophy}”
              </blockquote>
              <figcaption className="mt-4 text-sm text-muted">My testing philosophy</figcaption>
            </figure>
          </section>

          <section aria-labelledby="journey">
            <h2 id="journey" className="text-2xl font-semibold">
              Career journey
            </h2>
            <ol className="mt-6 space-y-4">
              {profile.journey.map((stage, i) => (
                <li key={stage.id}>
                  <Card className="flex gap-5 p-6">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-navy-800 font-mono text-sm text-accent-soft">
                      0{i + 1}
                    </span>
                    <div>
                      <p className="font-mono text-xs text-subtle">{stage.period}</p>
                      <h3 className="mt-1 text-lg font-semibold">{stage.title}</h3>
                      <p className="mt-1 text-sm text-muted">{stage.description}</p>
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="goals">
            <h2 id="goals" className="text-2xl font-semibold">
              Professional goals
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {profile.goals.map((goal) => (
                <li key={goal}>
                  <Card className="flex h-full gap-3 p-5">
                    <Target className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                    <p className="text-sm text-slate-300">{goal}</p>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card className="flex flex-col items-center p-6 text-center">
            <Avatar src={profile.avatarUrl} name={profile.name} className="size-28 text-3xl" />
            <p className="mt-4 text-lg font-semibold text-white">{profile.name}</p>
            <p className="text-sm text-muted">{profile.positioning}</p>
            <p className="mt-1 text-xs text-subtle">{profile.location}</p>
            <div className="mt-5 flex w-full flex-col gap-2">
              <LinkButton to="/contact">Let's Connect</LinkButton>
              {profile.resumeUrl && (
                <LinkButton href={profile.resumeUrl} variant="secondary" external>
                  View résumé
                </LinkButton>
              )}
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-sm font-semibold tracking-wider text-subtle uppercase">Areas of interest</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              {profile.interests.map((interest) => (
                <li key={interest} className="flex gap-2">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                  {interest}
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </Container>
    </>
  );
}
