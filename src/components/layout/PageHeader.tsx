import type { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Container, Eyebrow } from '../ui/primitives';
import { EASE, WordReveal } from '../fx/Reveal';

export function PageHeader({
  eyebrow,
  title,
  description,
  highlight,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  /** Words in the title to render with the animated gradient. */
  highlight?: string[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,rgb(59_130_246/0.22),transparent_65%)]"
      />
      <Container className="relative">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: EASE }}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </motion.div>
        <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-tight sm:text-6xl">
          <WordReveal text={title} delay={0.1} highlight={highlight} />
        </h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.15 }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {description}
          </motion.p>
        )}
        {children}
      </Container>
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
