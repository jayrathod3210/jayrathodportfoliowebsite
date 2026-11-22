import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import type { Experience } from '../types/content';
import { formatMonth } from '../lib/utils';
import { Badge, Card, Tag } from './ui/primitives';
import { Reveal } from './fx/Reveal';

export function ExperienceTimeline({ items }: { items: Experience[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div className="relative">
      <div aria-hidden className="absolute top-2 bottom-2 left-[11px] w-px bg-white/10 sm:left-[15px]" />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute top-2 bottom-2 left-[11px] w-px origin-top bg-gradient-to-b from-accent via-cyan to-violet shadow-[0_0_12px_rgb(34_211_238/0.8)] sm:left-[15px]"
      />
      <ol ref={ref} className="space-y-8">
        {items.map((exp) => (
          <li key={exp.id} className="relative pl-9 sm:pl-12">
            <motion.span
              aria-hidden
              className="absolute top-7 left-[5px] size-[13px] rounded-full border-2 sm:left-[9px]"
              initial={{ backgroundColor: '#050a16', borderColor: 'rgba(255,255,255,0.2)', boxShadow: '0 0 0 0 rgba(34,211,238,0)' }}
              whileInView={{ backgroundColor: '#22d3ee', borderColor: '#22d3ee', boxShadow: '0 0 18px 2px rgba(34,211,238,0.6)' }}
              viewport={{ margin: '0px 0px -40% 0px' }}
              transition={{ duration: 0.4 }}
            />
            <Reveal>
              <Card interactive className="p-6 sm:p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{exp.role}</h3>
                    <p className="mt-1 text-accent-soft">{exp.company}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <p className="font-mono text-xs text-subtle">
                      {formatMonth(exp.startDate)} — {formatMonth(exp.endDate)}
                    </p>
                    {exp.endDate === null && <Badge tone="success">Current role</Badge>}
                  </div>
                </div>
                {exp.summary && <p className="mt-4 text-slate-300">{exp.summary}</p>}

                {exp.responsibilities.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-mono text-[11px] tracking-[0.16em] text-subtle uppercase">Responsibilities</h4>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
                      {exp.responsibilities.map((r) => (
                        <li key={r} className="flex gap-3">
                          <span aria-hidden className="mt-2 size-1 shrink-0 rounded-full bg-accent-soft" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exp.contributions.length > 0 && (
                  <div className="mt-6 rounded-xl border border-cyan/15 bg-cyan/[0.04] p-4">
                    <h4 className="font-mono text-[11px] tracking-[0.16em] text-cyan uppercase">Key contributions</h4>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300">
                      {exp.contributions.map((c) => (
                        <li key={c} className="flex gap-3">
                          <span aria-hidden className="text-cyan">✓</span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {exp.technologies.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {exp.technologies.map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                )}
              </Card>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
