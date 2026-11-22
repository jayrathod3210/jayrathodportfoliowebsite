import { Suspense, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSnapshot } from '../../content';
import { Spinner } from '../ui/primitives';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
      return;
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

export function PublicLayout() {
  const { profile } = useSnapshot();
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Navbar name={profile.name} />
      <main id="main" className="flex-1">
        <Suspense fallback={<Spinner label="Loading page…" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer profile={profile} />
    </div>
  );
}
