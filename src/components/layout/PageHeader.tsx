import type { ReactNode } from 'react';
import { Container } from '../ui/primitives';

export function PageHeader({ eyebrow, title, description, children }: { eyebrow: string; title: string; description?: ReactNode; children?: ReactNode }) {
  return (
    <section className="hero-backdrop border-b border-line">
      <Container className="py-14 sm:py-20">
        <p className="font-mono text-xs font-medium tracking-wider text-accent-soft uppercase">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-base text-muted sm:text-lg">{description}</p>}
        {children}
      </Container>
    </section>
  );
}
