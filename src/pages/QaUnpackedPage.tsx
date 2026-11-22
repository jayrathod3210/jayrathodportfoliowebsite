import { motion } from 'motion/react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { Card, Container } from '../components/ui/primitives';
import { QaUnpackedSocials, QaUnpackedWordmark } from '../components/QaUnpacked';
import { LinkButton } from '../components/ui/Button';
import { EASE, Reveal, Stagger } from '../components/fx/Reveal';

export function QaUnpackedPage() {
  const { profile } = useSnapshot();
  const brand = profile.qaUnpacked;
  useSeo(brand.name, `${brand.name}: ${brand.tagline} ${brand.description}`);

  return (
    <>
      <section className="relative overflow-hidden border-b border-unpacked/15 pt-32 pb-20 sm:pt-44 sm:pb-28">
        <div aria-hidden className="pointer-events-none absolute -top-40 right-[-10%] size-[700px] rounded-full bg-[radial-gradient(circle,rgb(245_165_36/0.18),transparent_62%)]" />
        <div aria-hidden className="pointer-events-none absolute bottom-[-30%] left-[-10%] size-[500px] rounded-full bg-[radial-gradient(circle,rgb(245_165_36/0.08),transparent_62%)]" />
        <Container className="relative">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="font-mono text-xs tracking-[0.18em] text-unpacked uppercase"
          >
            A knowledge initiative by {profile.name}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
            className="mt-5 text-6xl leading-none sm:text-8xl lg:text-9xl"
          >
            <QaUnpackedWordmark name={brand.name} />
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}>
            <p className="mt-6 font-mono text-xl text-unpacked-soft">{brand.tagline}</p>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{brand.description}</p>
            <div className="mt-10">
              <QaUnpackedSocials brand={brand} />
            </div>
          </motion.div>
        </Container>
      </section>

      <Container className="py-24">
        <Reveal>
          <h2 className="text-3xl font-semibold sm:text-4xl">What {brand.name} covers</h2>
        </Reveal>
        <Stagger as="ul" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brand.focusAreas.map((area, i) => (
            <li key={area}>
              <Card interactive className="h-full border-unpacked/10 p-6 [--tw-gradient-from:rgb(245_165_36/0.06)]">
                <p className="font-mono text-sm text-unpacked">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-3 text-lg font-medium text-white">{area}</p>
              </Card>
            </li>
          ))}
        </Stagger>

        <Reveal className="mt-20">
          <div className="border-spin flex flex-col gap-6 rounded-[2rem] bg-white/[0.02] p-8 [--spin-color:#f5a524] sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <p className="max-w-xl text-lg text-slate-300">
              Want to start with something practical? The QA Prompt Library and blog share the same ideas in reusable form.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton to="/prompts">QA Prompt Library</LinkButton>
              <LinkButton to="/blog" variant="secondary">
                Blog
              </LinkButton>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
