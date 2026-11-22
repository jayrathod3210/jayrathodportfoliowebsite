import { useId, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Skill, SkillCategory } from '../types/content';
import { cn } from '../lib/utils';
import { EASE } from './fx/Reveal';

export function SkillsTabs({ groups }: { groups: Array<{ category: SkillCategory; skills: Skill[] }> }) {
  const [active, setActive] = useState(groups[0]?.category.id ?? '');
  const baseId = useId();
  const current = groups.find((g) => g.category.id === active) ?? groups[0];
  if (!current) return null;

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const i = groups.findIndex((g) => g.category.id === active);
    const next = groups[(i + (e.key === 'ArrowRight' ? 1 : groups.length - 1)) % groups.length];
    setActive(next.category.id);
    document.getElementById(`${baseId}-tab-${next.category.id}`)?.focus();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
      <div role="tablist" aria-label="Skill categories" aria-orientation="vertical" onKeyDown={onKeyDown} className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
        {groups.map(({ category, skills }) => {
          const selected = category.id === current.category.id;
          return (
            <button
              key={category.id}
              id={`${baseId}-tab-${category.id}`}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={`${baseId}-panel`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(category.id)}
              className={cn(
                'relative flex shrink-0 items-center justify-between gap-4 rounded-xl px-4 py-3 text-left text-sm transition-colors',
                selected ? 'text-white' : 'text-muted hover:text-white',
              )}
            >
              {selected && (
                <motion.span
                  layoutId={`${baseId}-tab-bg`}
                  className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.06]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative font-medium whitespace-nowrap">{category.name}</span>
              <span className="relative hidden font-mono text-xs text-subtle lg:inline">{String(skills.length).padStart(2, '0')}</span>
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${current.category.id}`}
        className="relative min-h-[220px] overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-white/[0.01] p-6 sm:p-8"
      >
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.18),transparent_65%)]" />
        <AnimatePresence mode="wait">
          <motion.div
            key={current.category.id}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
            className="relative"
          >
            <motion.h3 variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="text-xl font-semibold">
              {current.category.name}
            </motion.h3>
            {current.category.description && (
              <motion.p variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="mt-1 text-sm text-muted">
                {current.category.description}
              </motion.p>
            )}
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {current.skills.map((s) => (
                <motion.li
                  key={s.id}
                  variants={{
                    hidden: { opacity: 0, y: 12, scale: 0.96 },
                    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: EASE } },
                  }}
                  className="rounded-full border border-white/10 bg-navy-900/80 px-4 py-2 text-sm text-slate-200 transition-colors hover:border-cyan/40 hover:text-white"
                >
                  {s.name}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
