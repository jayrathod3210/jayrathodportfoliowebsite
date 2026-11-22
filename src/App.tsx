import { lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PublicLayout, ScrollToTop } from './components/layout/PublicLayout';
import { Spinner } from './components/ui/primitives';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

/*
 * Page code is split per route. React Router keeps the current screen visible until the next
 * page's code has loaded, so a click on a not-yet-loaded page feels frozen. To make every click
 * respond instantly, all page code is fetched in the background once the site has loaded, and a
 * link's page is fetched as soon as the visitor hovers, touches or focuses it.
 */
const load = {
  about: () => import('./pages/AboutPage'),
  experience: () => import('./pages/ExperiencePage'),
  skills: () => import('./pages/SkillsPage'),
  projects: () => import('./pages/ProjectsPage'),
  projectDetail: () => import('./pages/ProjectDetailPage'),
  blog: () => import('./pages/BlogPage'),
  article: () => import('./pages/ArticlePage'),
  prompts: () => import('./pages/PromptsPage'),
  promptDetail: () => import('./pages/PromptDetailPage'),
  qaUnpacked: () => import('./pages/QaUnpackedPage'),
  contact: () => import('./pages/ContactPage'),
};

/** Loaders to run for a link, keyed by the first segment of its path. */
const loadersForSection: Record<string, (() => Promise<unknown>)[]> = {
  about: [load.about],
  experience: [load.experience],
  skills: [load.skills],
  projects: [load.projects, load.projectDetail],
  blog: [load.blog, load.article],
  prompts: [load.prompts, load.promptDetail],
  'qa-unpacked': [load.qaUnpacked],
  contact: [load.contact],
};

const AboutPage = lazy(() => load.about().then((m) => ({ default: m.AboutPage })));
const ExperiencePage = lazy(() => load.experience().then((m) => ({ default: m.ExperiencePage })));
const SkillsPage = lazy(() => load.skills().then((m) => ({ default: m.SkillsPage })));
const ProjectsPage = lazy(() => load.projects().then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => load.projectDetail().then((m) => ({ default: m.ProjectDetailPage })));
const BlogPage = lazy(() => load.blog().then((m) => ({ default: m.BlogPage })));
const ArticlePage = lazy(() => load.article().then((m) => ({ default: m.ArticlePage })));
const PromptsPage = lazy(() => load.prompts().then((m) => ({ default: m.PromptsPage })));
const PromptDetailPage = lazy(() => load.promptDetail().then((m) => ({ default: m.PromptDetailPage })));
const QaUnpackedPage = lazy(() => load.qaUnpacked().then((m) => ({ default: m.QaUnpackedPage })));
const ContactPage = lazy(() => load.contact().then((m) => ({ default: m.ContactPage })));

/** A failed background fetch is harmless: the page simply loads normally when visited. */
const run = (loaders: (() => Promise<unknown>)[]) => loaders.forEach((l) => l().catch(() => {}));

function PreloadPages() {
  useEffect(() => {
    const onIntent = (e: Event) => {
      const link = (e.target as Element | null)?.closest?.('a[href^="/"]');
      const section = link?.getAttribute('href')?.split(/[/?#]/)[1];
      if (section && loadersForSection[section]) run(loadersForSection[section]);
    };
    const events = ['pointerover', 'touchstart', 'focusin'] as const;
    events.forEach((t) => document.addEventListener(t, onIntent, { passive: true }));

    // Fetch everything once the first page has rendered and the browser is idle.
    const all = () => run(Object.values(load));
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(all, { timeout: 2000 })
      : window.setTimeout(all, 1200);
    return () => {
      events.forEach((t) => document.removeEventListener(t, onIntent));
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
    };
  }, []);
  return null;
}

/** Decap CMS is a separate static page (public/admin/index.html); hand off to it if the SPA receives /admin. */
function DecapRedirect() {
  useEffect(() => {
    window.location.replace('/admin/index.html');
  }, []);
  return <Spinner className="min-h-screen" label="Opening content editor…" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PreloadPages />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="experience" element={<ExperiencePage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<ProjectDetailPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<ArticlePage />} />
          <Route path="prompts" element={<PromptsPage />} />
          <Route path="prompts/:slug" element={<PromptDetailPage />} />
          <Route path="qa-unpacked" element={<QaUnpackedPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route path="admin/*" element={<DecapRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
