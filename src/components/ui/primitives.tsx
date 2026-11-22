import type { HTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export function Container({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)} {...props} />;
}

export function Card({
  className,
  interactive,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-line bg-navy-900/80',
        interactive && 'transition-colors duration-200 hover:border-line-strong hover:bg-navy-850',
        className,
      )}
      {...props}
    />
  );
}

type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'unpacked';

const badgeTones: Record<BadgeTone, string> = {
  neutral: 'border-line-strong bg-navy-800 text-slate-300',
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
    <span className={cn('inline-flex rounded-md bg-navy-800 px-2 py-0.5 font-mono text-xs text-muted', className)}>
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  as: Heading = 'h2',
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
}) {
  return (
    <div className={cn('mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="mb-2 font-mono text-xs font-medium tracking-wider text-accent-soft uppercase">{eyebrow}</p>
        )}
        <Heading className={cn('font-semibold tracking-tight', Heading === 'h1' ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl')}>
          {title}
        </Heading>
        {description && <p className="mt-3 text-base text-muted">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
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
    <div
      className={cn(
        'flex flex-col items-center rounded-xl border border-dashed border-line-strong px-6 py-12 text-center',
        className,
      )}
    >
      {icon && <div className="mb-4 text-subtle">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-md text-sm text-muted">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
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
  if (src) {
    return <img src={src} alt={`Portrait of ${name}`} className={cn('rounded-full object-cover', className)} loading="lazy" />;
  }
  return (
    <div
      role="img"
      aria-label={`${name} (profile photo placeholder)`}
      className={cn(
        'flex items-center justify-center rounded-full border border-line-strong bg-gradient-to-br from-navy-700 to-navy-850 font-semibold text-white',
        className,
      )}
    >
      {initials}
    </div>
  );
}
