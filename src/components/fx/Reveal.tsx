import type { ReactNode } from 'react';
import { motion, type Variants } from 'motion/react';

export const EASE = [0.22, 1, 0.36, 1] as const;

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
};

type Tag = 'div' | 'section' | 'ul' | 'ol' | 'li' | 'p' | 'span';

/** Fades, lifts and un-blurs its content the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: Tag;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
    >
      {children}
    </Comp>
  );
}

/**
 * Staggers the entrance of motion children that use `itemVariants` (Card does by default),
 * at any depth below this element.
 */
export function Stagger({
  children,
  className,
  stagger = 0.06,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: Tag;
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.12 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: Tag }) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={className} variants={itemVariants}>
      {children}
    </Comp>
  );
}

/** Reveals a heading word by word. Plain text stays in the DOM for screen readers and SEO. */
export function WordReveal({
  text,
  className,
  wordClassName,
  delay = 0,
  inView = false,
  highlight = [],
}: {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  inView?: boolean;
  /** Words (exact match, punctuation included) rendered with the animated gradient. */
  highlight?: string[];
}) {
  const words = text.split(' ');
  const trigger = inView
    ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, amount: 0.5 } }
    : { initial: 'hidden', animate: 'show' };
  return (
    <motion.span
      className={className}
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className={`inline-block ${highlight.includes(word) ? 'text-gradient' : ''} ${wordClassName ?? ''}`}
            variants={{
              hidden: { y: '100%', opacity: 0, filter: 'blur(6px)' },
              show: { y: '0%', opacity: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </motion.span>
  );
}
