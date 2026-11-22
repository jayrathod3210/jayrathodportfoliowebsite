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
    <div className="border-spin relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1c1608] via-navy-900 to-navy-950 p-8 [--spin-color:#f5a524] sm:p-12">
      <div aria-hidden className="pointer-events-none absolute -top-32 -right-24 size-[420px] rounded-full bg-[radial-gradient(circle,rgb(245_165_36/0.22),transparent_65%)]" />
      <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        <div>
          <p className="font-mono text-xs tracking-[0.16em] text-unpacked uppercase">A knowledge initiative by Jay Rathod</p>
          <h2 className="mt-4 text-4xl sm:text-6xl">
            <QaUnpackedWordmark name={brand.name} />
          </h2>
          <p className="mt-3 font-mono text-base text-unpacked-soft">{brand.tagline}</p>
          <p className="mt-5 max-w-xl leading-relaxed text-muted">{brand.description}</p>
          <Link
            to="/qa-unpacked"
            className="btn-shine mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-unpacked px-6 text-sm font-semibold text-navy-950 shadow-[0_10px_40px_-10px_rgb(245_165_36/0.6)] transition-colors hover:bg-unpacked-soft"
          >
            Discover {brand.name} <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <ul className="flex flex-wrap gap-2 lg:justify-end">
          {brand.focusAreas.map((area) => (
            <li key={area} className="rounded-full border border-unpacked/20 bg-unpacked/[0.06] px-3.5 py-1.5 text-sm text-unpacked-soft/90">
              {area}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
