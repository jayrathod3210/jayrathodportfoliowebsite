import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import type { JourneyStage } from '../types/content';
import { Card } from './ui/primitives';
import { Reveal } from './fx/Reveal';

/** Vertical timeline whose line fills with the brand gradient as you scroll through it. */
export function JourneyTimeline({ stages }: { stages: JourneyStage[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <div className="relative">
      <div aria-hidden className="absolute top-3 bottom-3 left-[15px] w-px bg-white/10" />
      <motion.div
        aria-hidden
        style={{ scaleY }}
        className="absolute top-3 bottom-3 left-[15px] w-px origin-top bg-gradient-to-b from-accent via-cyan to-violet shadow-[0_0_12px_rgb(34_211_238/0.8)]"
      />
      <ol ref={ref} className="space-y-6">
        {stages.map((stage, i) => (
          <li key={stage.id} className="relative pl-12">
            <motion.span
              aria-hidden
              className="absolute top-6 left-[9px] size-[13px] rounded-full border-2"
              initial={{ backgroundColor: '#050a16', borderColor: 'rgba(255,255,255,0.2)', boxShadow: '0 0 0 0 rgba(34,211,238,0)' }}
              whileInView={{ backgroundColor: '#22d3ee', borderColor: '#22d3ee', boxShadow: '0 0 18px 2px rgba(34,211,238,0.6)' }}
              viewport={{ margin: '0px 0px -45% 0px' }}
              transition={{ duration: 0.4 }}
            />
            <Reveal>
              <Card interactive className="p-6 sm:p-7">
                <p className="font-mono text-xs tracking-wider text-accent-soft uppercase">
                  {String(i + 1).padStart(2, '0')} · {stage.period}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{stage.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{stage.description}</p>
              </Card>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
