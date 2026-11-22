import type { Experience } from '../types/content';
import { formatMonth } from '../lib/utils';
import { Badge, Tag } from './ui/primitives';

export function ExperienceTimeline({ items, compact = false }: { items: Experience[]; compact?: boolean }) {
  return (
    <ol className="relative space-y-8 border-l border-line pl-6 sm:pl-8">
      {items.map((exp) => (
        <li key={exp.id} className="relative">
          <span
            aria-hidden
            className={`absolute top-1.5 -left-[31px] size-3 rounded-full border-2 sm:-left-[39px] ${
              exp.endDate === null ? 'border-accent bg-accent' : 'border-line-strong bg-navy-950'
            }`}
          />
          <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-lg font-semibold">
              {exp.role}
              <span className="font-normal text-muted"> · {exp.company}</span>
            </h3>
            <p className="font-mono text-xs text-subtle">
              {formatMonth(exp.startDate)} — {formatMonth(exp.endDate)}
            </p>
          </div>
          {exp.endDate === null && (
            <Badge tone="accent" className="mt-2">
              Current role
            </Badge>
          )}
          {exp.summary && <p className="mt-3 text-sm text-slate-300">{exp.summary}</p>}

          {!compact && exp.responsibilities.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold tracking-wider text-subtle uppercase">Responsibilities</h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-accent">
                {exp.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          {!compact && exp.contributions.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold tracking-wider text-subtle uppercase">Key contributions</h4>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted marker:text-accent">
                {exp.contributions.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          {exp.technologies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {exp.technologies.map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
