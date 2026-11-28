import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, ArrowUpRight, Gamepad2, Globe, Layers, Mail, Monitor, Plug, Quote, Smartphone, Sparkles, type LucideIcon } from 'lucide-react';
import { useSnapshot } from '../content';
import { whatsappLink } from '../content/settings';
import { useSeo } from '../hooks/useSeo';
import { publishedProjects, publishedPrompts, skillsByCategory } from '../lib/selectors';
import { LinkButton } from '../components/ui/Button';
import { Avatar, Card, Container, EmptyState, SectionHeading } from '../components/ui/primitives';
import { ProjectCard, PromptCard } from '../components/cards';
import { QaUnpackedTeaser } from '../components/QaUnpacked';
import { SkillsTabs } from '../components/SkillsTabs';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { Magnetic, Marquee, StatValue, TestRunner } from '../components/fx/effects';
import { EASE, Reveal, Stagger, StaggerItem, WordReveal } from '../components/fx/Reveal';
import { SocialIcon } from '../components/ui/SocialIcon';
import { HeroBackground } from '../components/fx/HeroBackground';

function SectionLink({ to, children }: { to: string; children: string }) {
  return (
    <Link to={to} className="group inline-flex items-center gap-1.5 text-sm font-medium text-accent-soft transition-colors hover:text-white">
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
    </Link>
  );
}

function Hero() {
  const { profile } = useSnapshot();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const termY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0]);
  const titleWords = profile.heroTitle.split(' ');
  const socials = profile.socials.filter((s) => s.url);
  const whatsapp = whatsappLink(profile.whatsapp);

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 pb-16 sm:pt-36 lg:min-h-[100svh] lg:pt-40">
      <HeroBackground />
      <Container className="relative grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
        <motion.div style={{ y: textY, opacity: fade }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pr-3 pl-1 text-xs text-slate-300"
          >
            <span className="bg-brand-gradient rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-white uppercase">
              QA
            </span>
            {profile.positioning}
          </motion.p>

          <h1 className="mt-7 font-semibold tracking-tight">
            <span className="block text-2xl text-slate-400 sm:text-3xl">
              <WordReveal text={`Hi, I'm ${profile.name}.`} delay={0.1} />
            </span>
            <span className="mt-3 block text-[clamp(2.6rem,7.2vw,5.4rem)] leading-[1.02]">
              <WordReveal text={profile.heroTitle} delay={0.2} highlight={titleWords.slice(-2)} />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {profile.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.5 }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic className="flex w-full sm:inline-flex sm:w-auto">
              <LinkButton to="/projects" size="lg" className="w-full sm:w-auto">
                Explore My Work <ArrowRight className="size-4" aria-hidden />
              </LinkButton>
            </Magnetic>
            <Magnetic className="flex w-full sm:inline-flex sm:w-auto">
              <LinkButton to="/contact" size="lg" variant="secondary" className="w-full sm:w-auto">
                Let's Connect
              </LinkButton>
            </Magnetic>
            {(socials.length > 0 || whatsapp) && (
              <div className="flex items-center gap-2 sm:ml-2">
                {whatsapp && (
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="flex size-11 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-[#25D366]/60 hover:text-[#25D366]"
                  >
                    <SocialIcon platform="whatsapp" />
                  </a>
                )}
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex size-11 items-center justify-center rounded-full border border-white/10 text-muted transition-colors hover:border-white/25 hover:text-white"
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: termY }}
          initial={{ opacity: 0, scale: 0.94, rotateX: 8 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
          className="relative mx-auto w-full max-w-md [perspective:1200px] lg:max-w-none"
        >
          <div aria-hidden className="absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle_at_50%_40%,rgb(34_211_238/0.22),transparent_65%)] blur-2xl" />
          <TestRunner className="relative" />

          <div className="absolute -top-5 -right-2 hidden animate-float rounded-full border border-white/10 bg-navy-900/90 px-3 py-1.5 font-mono text-xs text-emerald-300 shadow-xl backdrop-blur sm:block">
            ● all checks passed
          </div>
        </motion.div>
      </Container>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-subtle lg:flex"
      >
        SCROLL
        <span className="relative h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent to-cyan"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  );
}

const PLATFORM_ICONS: Array<[RegExp, LucideIcon]> = [
  [/mobile|android|ios|app\b/i, Smartphone],
  [/api|service/i, Plug],
  [/desktop|windows|mac/i, Monitor],
  [/game/i, Gamepad2],
  [/web|browser|site/i, Globe],
];
const platformIcon = (name: string): LucideIcon => PLATFORM_ICONS.find(([re]) => re.test(name))?.[1] ?? Layers;

/** Headline numbers (editable in the CMS) that count up when they scroll into view. */
function StatsBand() {
  const { profile } = useSnapshot();
  if (!profile.stats.length) return null;
  return (
    <section aria-label="Highlights" className="relative pb-16 sm:pb-24">
      <Container>
        <Stagger
          as="ul"
          className={`grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.07] ${
            profile.stats.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
          }`}
        >
          {profile.stats.map((stat) => (
            <StaggerItem as="li" key={stat.id} className="group relative overflow-hidden bg-navy-950/90 px-5 py-8 sm:px-8 sm:py-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.16),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <p className="relative text-4xl font-bold tracking-tighter sm:text-5xl lg:text-6xl">
                <StatValue value={stat.value} className="text-gradient" />
              </p>
              <p className="relative mt-3 text-sm text-muted sm:text-base">{stat.label}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </section>
  );
}

function AtAGlance() {
  const { profile } = useSnapshot();
  return (
    <section className="py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="At a glance" title="Quality is a mindset, not a phase." />
        <Stagger className="grid auto-rows-[minmax(0,auto)] gap-4 md:grid-cols-6">
          <Card interactive className="flex flex-col justify-between gap-8 p-7 sm:p-8 md:col-span-4 md:row-span-2">
            <div className="flex items-center gap-4">
              <Avatar src={profile.avatarUrl} name={profile.name} className="size-16 text-lg" />
              <div>
                <p className="text-lg font-semibold text-white">{profile.name}</p>
                <p className="text-sm text-muted">{profile.location}</p>
              </div>
            </div>
            <p className="text-xl leading-relaxed text-slate-200 sm:text-2xl sm:leading-relaxed">{profile.shortIntro}</p>
            <SectionLink to="/about">Read my story</SectionLink>
          </Card>

          <Card interactive className="relative overflow-hidden p-7 md:col-span-2 md:row-span-2">
            <div aria-hidden className="absolute -top-10 -right-10 size-40 rounded-full bg-[radial-gradient(circle,rgb(59_130_246/0.3),transparent_65%)]" />
            <p className="relative font-mono text-xs tracking-wider text-subtle uppercase">Platforms I test</p>
            <ul className="relative mt-6 space-y-4">
              {profile.platforms.map((platform) => {
                const Icon = platformIcon(platform);
                return (
                  <li key={platform} className="flex items-center gap-3 text-[15px] text-slate-200">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-cyan/10 text-accent-soft ring-1 ring-white/10">
                      <Icon className="size-4" aria-hidden />
                    </span>
                    {platform}
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card interactive className="relative overflow-hidden p-7 sm:p-8 md:col-span-3">
            <Quote className="size-7 text-cyan/70" aria-hidden />
            <p className="mt-4 text-lg leading-relaxed text-white">{profile.philosophy}</p>
            <p className="mt-4 font-mono text-xs tracking-wider text-subtle uppercase">Testing philosophy</p>
          </Card>

          <Card interactive className="p-7 sm:p-8 md:col-span-3">
            <p className="flex items-center gap-2 font-mono text-xs tracking-wider text-subtle uppercase">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping-slow rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
              </span>
              Currently exploring
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <li key={interest} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-slate-200">
                  {interest}
                </li>
              ))}
            </ul>
          </Card>
        </Stagger>
      </Container>
    </section>
  );
}

export function HomePage() {
  const data = useSnapshot();
  const { profile } = data;
  useSeo('', profile.heroSubtitle);

  const promptCategory = (id: string | null) => data.promptCategories.find((c) => c.id === id)?.name;
  const projects = publishedProjects(data).filter((p) => p.featured).slice(0, 3);
  const prompts = publishedPrompts(data)
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);
  const skillGroups = skillsByCategory(data).filter((g) => g.skills.length > 0);

  return (
    <>
      <Hero />

      <StatsBand />

      <div className="border-y border-white/[0.06] bg-white/[0.015] py-6">
        <p className="sr-only">Tools I work with: {profile.tools.join(', ')}</p>
        <Marquee
          items={profile.tools.map((tool) => (
            <span className="flex items-center gap-3 px-3 font-mono text-sm text-slate-400">
              <span className="text-cyan/60">✦</span>
              {tool}
            </span>
          ))}
        />
      </div>

      <AtAGlance />

      {/* Career journey */}
      <section className="py-24 sm:py-32">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              eyebrow="Career journey"
              title={
                <>
                  From manual testing to <span className="text-gradient">quality engineering</span>
                </>
              }
              description="Every stage added a new layer: product understanding first, then automation, now strategy and AI-assisted workflows."
              className="mb-6 sm:mb-8"
            />
            <Reveal delay={0.1}>
              <SectionLink to="/experience">View full experience</SectionLink>
            </Reveal>
          </div>
          <JourneyTimeline stages={profile.journey} />
        </Container>
      </section>

      {/* Skills */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading
            eyebrow="Skills"
            title="Testing depth, automation breadth"
            description="Strong manual testing fundamentals combined with modern automation and API validation."
            action={<SectionLink to="/skills">See all skills</SectionLink>}
          />
          <Reveal>
            <SkillsTabs groups={skillGroups} />
          </Reveal>
        </Container>
      </section>

      {/* Featured projects */}
      <section className="py-24 sm:py-32">
        <Container>
          <SectionHeading eyebrow="Projects" title="Featured work" action={<SectionLink to="/projects">All projects</SectionLink>} />
          {projects.length ? (
            <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} />
              ))}
            </Stagger>
          ) : (
            <EmptyState title="Projects coming soon" description="Case studies are being prepared." />
          )}
        </Container>
      </section>

      {/* Prompt library */}
      <section className="relative py-24 sm:py-32">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-[500px] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgb(34_211_238/0.07),transparent_65%)]" />
        <Container className="relative">
          <SectionHeading
            eyebrow="QA Prompt Library"
            title={
              <>
                Reusable <span className="text-gradient">AI prompts</span> for everyday QA
              </>
            }
            description="Copy-ready prompts for test design, API testing, automation and bug analysis."
            action={<SectionLink to="/prompts">Browse the library</SectionLink>}
          />
          {prompts.length ? (
            <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {prompts.map((p) => (
                <PromptCard key={p.id} prompt={p} categoryName={promptCategory(p.categoryId)} />
              ))}
            </Stagger>
          ) : (
            <EmptyState icon={<Sparkles className="size-8" />} title="Prompts coming soon" />
          )}
        </Container>
      </section>

      {/* QA UNPACKED */}
      <section className="py-16 sm:py-24">
        <Container>
          <Reveal>
            <QaUnpackedTeaser brand={profile.qaUnpacked} />
          </Reveal>
        </Container>
      </section>

      {/* Closing CTA */}
      <section className="py-24 sm:py-32">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] px-6 py-20 text-center sm:px-12 sm:py-28">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgb(37_99_235/0.35),transparent_60%)]" />
            <div aria-hidden className="grid-backdrop absolute inset-0 opacity-60" />
            <div className="relative">
              <h2 className="mx-auto max-w-3xl text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
                <WordReveal text="Let's build quality together." inView highlight={['quality']} />
              </h2>
              <Reveal delay={0.2}>
                <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
                  Open to conversations about QA roles, automation, and software quality.
                </p>
              </Reveal>
              <Reveal delay={0.35} className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                <Magnetic className="flex w-full sm:inline-flex sm:w-auto">
                  <LinkButton to="/contact" size="lg" className="w-full sm:w-auto">
                    Get in touch <ArrowUpRight className="size-4" aria-hidden />
                  </LinkButton>
                </Magnetic>
                {profile.email && (
                  <Magnetic className="flex w-full sm:inline-flex sm:w-auto">
                    <LinkButton href={`mailto:${profile.email}`} size="lg" variant="secondary" className="w-full sm:w-auto">
                      <Mail className="size-4" aria-hidden /> Email me
                    </LinkButton>
                  </Magnetic>
                )}
              </Reveal>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
