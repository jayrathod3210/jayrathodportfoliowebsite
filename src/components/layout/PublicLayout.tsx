import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useSnapshot } from '../../content';
import { Spinner } from '../ui/primitives';
import { AuroraBackground, ScrollProgress } from '../fx/effects';
import { useLenis } from '../fx/SmoothScroll';
import { EASE } from '../fx/Reveal';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    const target = hash ? document.getElementById(decodeURIComponent(hash.slice(1))) : null;
    if (target) {
      if (lenis) lenis.scrollTo(target, { offset: -96 });
      else target.scrollIntoView();
      return;
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash, lenis]);
  return null;
}

export function PublicLayout() {
  const { profile } = useSnapshot();
  const { pathname } = useLocation();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <AuroraBackground />
      <ScrollProgress />
      <Navbar name={profile.name} />
      <main id="main" className="flex-1">
        <Suspense fallback={<Spinner className="min-h-[70vh]" label="Loading page…" />}>
          <motion.div
            key={pathname}
            // Kept short so a click feels instant: the new page is readable almost immediately.
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <Outlet />
          </motion.div>
        </Suspense>
      </main>
      <Footer profile={profile} />
    </div>
  );
}
