import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { itemVariants, Reveal } from '../fx/Reveal';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

function trackPointer(e: MouseEvent<HTMLDivElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
}

/**
 * Surface used across the site. Inside a <Stagger> it animates in automatically.
 * `interactive` adds the cursor-following spotlight, glowing border and lift on hover.
 */
export function Card({
  className,
  interactive,
  onMouseMove,
  ...props
}: HTMLMotionProps<'div'> & { interactive?: boolean }) {
  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={(e) => {
        if (interactive) trackPointer(e);
        onMouseMove?.(e);
      }}
      className={cn(
        'rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.045] to-white/[0.01]',
        interactive && 'spotlight transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-white/[0.12]',
        className,
      )}
      {...props}
    />
  );
}

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'unpacked';

const badgeTones: Record<BadgeTone, string> = {
  neutral: 'border-white/10 bg-white/5 text-slate-300',
  accent: 'border-accent/30 bg-accent/10 text-accent-soft',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  danger: 'border-red-500/30 bg-red-500/10 text-red-300',
  unpacked: 'border-unpacked/30 bg-unpacked/10 text-unpacked-soft',
};

export function Badge({ tone = 'neutral', className, children }: { tone?: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        badgeTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Tag({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex rounded-md border border-white/[0.06] bg-white/[0.03] px-2 py-0.5 font-mono text-xs text-muted', className)}>
      {children}
    </span>
  );
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-mono text-[11px] font-medium tracking-[0.14em] text-accent-soft uppercase',
        className,
      )}
    >
      <span className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping-slow rounded-full bg-cyan opacity-70" />
        <span className="relative inline-flex size-1.5 rounded-full bg-cyan" />
      </span>
      {children}
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as: Heading = 'h2',
  className,
  align = 'left',
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
  align?: 'left' | 'center';
}) {
  return (
    <Reveal
      className={cn(
        'mb-10 flex flex-col gap-5 sm:mb-14',
        align === 'center' ? 'items-center text-center' : 'sm:flex-row sm:items-end sm:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'flex flex-col items-center')}>
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <Heading className={cn('font-semibold tracking-tight', Heading === 'h1' ? 'text-4xl sm:text-5xl' : 'text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]')}>
          {title}
        </Heading>
        {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </Reveal>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        'flex flex-col items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.015] px-6 py-14 text-center',
        className,
      )}
    >
      {icon && <div className="mb-4 text-subtle">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </Reveal>
  );
}

export function Spinner({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div role="status" className={cn('flex items-center justify-center gap-3 py-24 text-muted', className)}>
      <Loader2 className="size-5 animate-spin" aria-hidden />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function Avatar({ src, name, className }: { src: string | null; name: string; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div className={cn('relative shrink-0 rounded-full bg-gradient-to-br from-accent via-cyan to-violet p-[2px]', className)}>
      {src ? (
        <img src={src} alt={`Portrait of ${name}`} className="size-full rounded-full object-cover" loading="lazy" />
      ) : (
        <div
          role="img"
          aria-label={`${name} (profile photo placeholder)`}
          className="flex size-full items-center justify-center rounded-full bg-navy-900 font-semibold tracking-tight text-white"
        >
          {initials}
        </div>
      )}
    </div>
  );
}
