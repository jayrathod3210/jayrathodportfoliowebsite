import { useEffect, useRef, useState, type ReactNode } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring } from 'motion/react';

/** Thin gradient bar at the very top showing how far down the page you are. */
export function ScrollProgress() {
  // Tracks Lenis's already-smoothed scroll value directly: an extra spring on top of
  // that would double-smooth the motion, making the bar (and the page) feel laggy,
  // especially on a direction reversal.
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="bg-brand-gradient fixed inset-x-0 top-0 z-[70] h-[2px] origin-left"
    />
  );
}

/** Slow-moving aurora glow, grid and grain behind every page. Transform-only animation, so it stays cheap. */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-[25vh] -left-[15vw] size-[70vw] max-w-[1000px] animate-aurora-1 rounded-full bg-[radial-gradient(circle,rgb(37_99_235/0.28),transparent_62%)]" />
      <div className="absolute top-[15vh] -right-[20vw] size-[60vw] max-w-[900px] animate-aurora-2 rounded-full bg-[radial-gradient(circle,rgb(6_182_212/0.16),transparent_62%)]" />
      <div className="absolute -bottom-[30vh] left-[20vw] size-[60vw] max-w-[900px] animate-aurora-3 rounded-full bg-[radial-gradient(circle,rgb(124_58_237/0.14),transparent_62%)]" />
      <div className="grid-backdrop absolute inset-0" />
      <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
    </div>
  );
}

/** Pulls its child gently toward the cursor (pointer devices only). */
export function Magnetic({ children, strength = 0.25, className = 'inline-flex' }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-US');

/** Counts up from 0 the first time it is visible. */
export function CountUp({ to, suffix = '', duration = 1.8, className }: { to: number; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const final = `${formatNumber(to)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    if (reduce) {
      el.textContent = final;
      return;
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${formatNumber(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, to, suffix, duration, final]);

  return (
    <span className={className}>
      <span className="sr-only">{final}</span>
      <span ref={ref} aria-hidden>
        {`0${suffix}`}
      </span>
    </span>
  );
}

/** Animates a stat like "1000+" or "98%" by counting up its leading number; other text is shown as-is. */
export function StatValue({ value, className }: { value: string; className?: string }) {
  const match = /^([\d,]+(?:\.\d+)?)(.*)$/.exec(value.trim());
  if (!match) return <span className={className}>{value}</span>;
  return <CountUp to={Number(match[1].replace(/,/g, ''))} suffix={match[2]} className={className} />;
}

/** Infinite horizontal ticker. Pauses on hover. */
export function Marquee({ items, className = '' }: { items: ReactNode[]; className?: string }) {
  return (
    <div className={`group mask-fade-x overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="mr-3 shrink-0" aria-hidden={i >= items.length || undefined}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

type Line = { kind: 'cmd' | 'info' | 'pass' | 'summary'; text: string; meta?: string };

const TEST_LINES: Line[] = [
  { kind: 'cmd', text: 'npx playwright test philosophy.spec.ts' },
  { kind: 'info', text: 'Running 4 tests using 1 worker' },
  { kind: 'pass', text: 'understands the product', meta: '412ms' },
  { kind: 'pass', text: 'identifies risks', meta: '388ms' },
  { kind: 'pass', text: 'challenges assumptions', meta: '296ms' },
  { kind: 'pass', text: 'ensures software quality', meta: '503ms' },
  { kind: 'summary', text: '4 passed', meta: '1.6s' },
];

/** Decorative terminal that "runs" Jay's testing philosophy as a Playwright suite. */
export function TestRunner({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const command = TEST_LINES[0].text;
  const [typed, setTyped] = useState(0);
  const [shown, setShown] = useState(1);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setTyped(command.length);
      setShown(TEST_LINES.length);
      return;
    }
    const timers: number[] = [];
    for (let i = 1; i <= command.length; i++) timers.push(window.setTimeout(() => setTyped(i), 300 + i * 32));
    const start = 300 + command.length * 32 + 350;
    TEST_LINES.slice(1).forEach((_, i) => timers.push(window.setTimeout(() => setShown(i + 2), start + i * 420)));
    return () => timers.forEach(clearTimeout);
  }, [inView, reduce, command.length]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Terminal running a test suite named philosophy.spec.ts: understands the product, identifies risks, challenges assumptions, ensures software quality. 4 passed."
      className={`overflow-hidden rounded-2xl border border-white/10 bg-navy-950/80 shadow-2xl shadow-accent/10 backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-subtle">~/quality — zsh</span>
      </div>
      <div aria-hidden className="min-h-[260px] space-y-2 p-5 font-mono text-[13px] leading-relaxed">
        <p className="text-slate-200">
          <span className="text-cyan">❯ </span>
          {command.slice(0, typed)}
          {shown === 1 && <span className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 animate-blink bg-cyan" />}
        </p>
        {TEST_LINES.slice(1, shown).map((line) => (
          <motion.p
            key={line.text}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35 }}
            className={
              line.kind === 'info'
                ? 'pb-1 text-subtle'
                : line.kind === 'summary'
                  ? 'border-t border-white/5 pt-3 font-semibold text-emerald-400'
                  : 'flex justify-between gap-4 text-slate-300'
            }
          >
            {line.kind === 'pass' ? (
              <>
                <span>
                  <span className="text-emerald-400">✓ </span>
                  {line.text}
                </span>
                <span className="text-subtle">{line.meta}</span>
              </>
            ) : line.kind === 'summary' ? (
              <>
                {line.text} <span className="font-normal text-subtle">({line.meta})</span>
              </>
            ) : (
              line.text
            )}
          </motion.p>
        ))}
        {shown === TEST_LINES.length && (
          <p className="pt-1 text-slate-200">
            <span className="text-cyan">❯ </span>
            <span className="inline-block h-4 w-2 translate-y-0.5 animate-blink bg-cyan" />
          </p>
        )}
      </div>
    </div>
  );
}
