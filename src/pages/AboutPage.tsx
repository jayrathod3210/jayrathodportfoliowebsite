import { Quote, Target } from 'lucide-react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { PageHeader } from '../components/layout/PageHeader';
import { Avatar, Card, Container } from '../components/ui/primitives';
import { LinkButton } from '../components/ui/Button';
import { Markdown } from '../components/Markdown';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { Reveal, Stagger } from '../components/fx/Reveal';

export function AboutPage() {
  const { profile } = useSnapshot();
  useSeo('About', profile.shortIntro);

  return (
    <>
      <PageHeader
        eyebrow="About"
        title="From test execution to quality engineering"
        highlight={['quality', 'engineering']}
        description={profile.shortIntro}
      />

      <Container className="grid gap-14 py-20 lg:grid-cols-[1fr_320px]">
        <div className="space-y-24">
          <Reveal as="section">
            <h2 id="story" className="text-3xl font-semibold">
              My story
            </h2>
            <Markdown content={profile.about} className="prose-article prose-lg mt-6" />
          </Reveal>

          <Reveal as="section">
            <h2 className="sr-only">Testing philosophy</h2>
            <figure className="border-spin relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-accent/15 via-navy-900 to-navy-950 p-8 sm:p-12">
              <div aria-hidden className="absolute -top-20 -left-20 size-72 rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.18),transparent_65%)]" />
              <Quote className="relative size-10 text-cyan" aria-hidden />
              <blockquote className="relative mt-6 text-2xl leading-snug font-medium text-white sm:text-3xl">“{profile.philosophy}”</blockquote>
              <figcaption className="relative mt-6 font-mono text-xs tracking-[0.16em] text-subtle uppercase">My testing philosophy</figcaption>
            </figure>
          </Reveal>

          <section>
            <Reveal>
              <h2 className="mb-8 text-3xl font-semibold">Career journey</h2>
            </Reveal>
            <JourneyTimeline stages={profile.journey} />
          </section>

          <section>
            <Reveal>
              <h2 className="text-3xl font-semibold">Professional goals</h2>
            </Reveal>
            <Stagger as="ul" className="mt-8 grid gap-4 sm:grid-cols-2">
              {profile.goals.map((goal, i) => (
                <li key={goal}>
                  <Card interactive className="flex h-full flex-col gap-4 p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-soft">
                        <Target className="size-5" aria-hidden />
                      </span>
                      <span className="font-mono text-xs text-subtle">{String(i + 1).padStart(2, '0')}</span>
                    </div>
                    <p className="leading-relaxed text-slate-200">{goal}</p>
                  </Card>
                </li>
              ))}
            </Stagger>
          </section>
        </div>

        <Stagger as="div" className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          <Card className="flex flex-col items-center p-7 text-center">
            <Avatar src={profile.avatarUrl} name={profile.name} className="size-28 text-3xl" />
            <p className="mt-5 text-lg font-semibold text-white">{profile.name}</p>
            <p className="text-sm text-accent-soft">{profile.positioning}</p>
            <p className="mt-1 text-xs text-subtle">{profile.location}</p>
            <div className="mt-6 flex w-full flex-col gap-2">
              <LinkButton to="/contact">Let's Connect</LinkButton>
              {profile.resumeUrl && (
                <LinkButton href={profile.resumeUrl} variant="secondary" external>
                  View résumé
                </LinkButton>
              )}
            </div>
          </Card>
          <Card className="p-7">
            <h2 className="font-mono text-[11px] tracking-[0.16em] text-subtle uppercase">Areas of interest</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <li key={interest} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-200">
                  {interest}
                </li>
              ))}
            </ul>
          </Card>
        </Stagger>
      </Container>
    </>
  );
}
