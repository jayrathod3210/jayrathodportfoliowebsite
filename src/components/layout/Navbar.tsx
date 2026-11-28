import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useLenis } from '../fx/SmoothScroll';
import { EASE } from '../fx/Reveal';

export const NAV_ITEMS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/skills', label: 'Skills' },
  { to: '/projects', label: 'Projects' },
  { to: '/prompts', label: 'QA Prompt Library' },
  { to: '/contact', label: 'Contact' },
];

function isActive(pathname: string, to: string, end?: boolean) {
  return end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
}

export function Navbar({ name }: { name: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { pathname } = useLocation();
  const lenis = useLenis();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 16));

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, lenis]);

  const desktopItems = NAV_ITEMS.filter((i) => i.to !== '/contact');
  const activeTo = desktopItems.find((i) => isActive(pathname, i.to, i.end))?.to;
  const pillTo = hovered ?? activeTo;

  return (
    <>
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500',
        scrolled || open ? 'border-b border-white/[0.06] bg-navy-950/70 backdrop-blur-xl' : 'border-b border-transparent',
      )}
    >
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px] lg:px-8">
        <Link to="/" className="group flex items-center gap-2.5 font-semibold text-white" aria-label={`${name}, home`}>
          <span className="bg-brand-gradient flex size-8 items-center justify-center rounded-lg text-[13px] font-bold shadow-[0_0_20px_-4px_rgb(34_211_238/0.6)] transition-transform duration-300 group-hover:rotate-[-6deg]">
            JR
          </span>
          <span className="text-[13px] tracking-[0.22em] uppercase">{name}</span>
        </Link>

        <ul
          className="relative hidden items-center rounded-full border border-white/[0.07] bg-white/[0.03] p-1 lg:flex"
          onMouseLeave={() => setHovered(null)}
        >
          {desktopItems.map((item) => {
            const active = isActive(pathname, item.to, item.end);
            return (
              <li key={item.to} className="relative">
                {pillTo === item.to && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-white/[0.08]"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <NavLink
                  to={item.to}
                  end={item.end}
                  onMouseEnter={() => setHovered(item.to)}
                  className={cn(
                    'relative z-10 block rounded-full px-3.5 py-1.5 text-[13px] transition-colors',
                    active ? 'text-white' : 'text-muted hover:text-white',
                  )}
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>

        <Link
          to="/contact"
          className="bg-brand-gradient btn-shine hidden h-9 items-center gap-1.5 rounded-full px-4 text-[13px] font-medium text-white shadow-[0_8px_30px_-10px_rgb(34_211_238/0.6)] lg:inline-flex"
        >
          Contact <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>

        <button
          type="button"
          className="relative inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <motion.span
            aria-hidden
            className="absolute h-[1.5px] w-4 rounded bg-white"
            animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
          <motion.span
            aria-hidden
            className="absolute h-[1.5px] w-4 rounded bg-white"
            animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
            transition={{ duration: 0.3, ease: EASE }}
          />
        </button>
      </nav>
    </header>

      {/* Rendered outside <header>: the header's backdrop-filter would otherwise become the containing block
          for this fixed overlay and collapse it to the header's height. */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            data-lenis-prevent
            className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-navy-950/95 backdrop-blur-xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.ul
              className="flex flex-col px-6 pt-6 pb-10"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.to}
                  variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } } }}
                  className="border-b border-white/[0.06]"
                >
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive: a }) =>
                      cn('flex items-baseline gap-4 py-4 text-2xl font-semibold tracking-tight', a ? 'text-white' : 'text-slate-400')
                    }
                  >
                    <span className="font-mono text-xs text-accent-soft">0{i + 1}</span>
                    {item.label}
                  </NavLink>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
