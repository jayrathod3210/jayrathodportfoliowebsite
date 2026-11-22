import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { QaUnpackedBrand } from '../types/content';
import { SocialIcon } from './ui/SocialIcon';

export function QaUnpackedWordmark({ name, className = '' }: { name: string; className?: string }) {
  const [first, ...rest] = name.split(' ');
  return (
    <span className={`font-mono font-bold tracking-tight ${className}`}>
      <span className="text-unpacked">{first}</span>
      {rest.length > 0 && <span className="text-white"> {rest.join(' ')}</span>}
    </span>
  );
}

export function QaUnpackedSocials({ brand }: { brand: QaUnpackedBrand }) {
  const live = brand.socials.filter((s) => s.url);
  const pending = brand.socials.filter((s) => !s.url);
  return (
    <div className="flex flex-wrap items-center gap-2">
      {live.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-unpacked/40 px-4 text-sm text-unpacked-soft hover:bg-unpacked/10"
        >
          <SocialIcon platform={s.platform} /> {s.label}
        </a>
      ))}
      {pending.map((s) => (
        <span
          key={s.id}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-dashed border-line-strong px-4 text-sm text-subtle"
        >
          <SocialIcon platform={s.platform} /> {s.label} · coming soon
        </span>
      ))}
    </div>
  );
}

/** Compact teaser used on the home page. Uses the QA UNPACKED amber accent to stay a distinct brand. */
export function QaUnpackedTeaser({ brand }: { brand: QaUnpackedBrand }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-unpacked/25 bg-gradient-to-br from-[#1a1508] via-navy-900 to-navy-900 p-6 sm:p-10">
      <div className="max-w-2xl">
        <p className="font-mono text-xs tracking-wider text-unpacked uppercase">A knowledge initiative by Jay Rathod</p>
        <h2 className="mt-3 text-3xl sm:text-4xl">
          <QaUnpackedWordmark name={brand.name} />
        </h2>
        <p className="mt-2 font-mono text-sm text-unpacked-soft">{brand.tagline}</p>
        <p className="mt-4 text-muted">{brand.description}</p>
        <Link
          to="/qa-unpacked"
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-unpacked px-4 text-sm font-semibold text-navy-950 hover:bg-unpacked-soft"
        >
          Discover {brand.name} <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
