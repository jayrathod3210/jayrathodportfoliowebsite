import { lazy, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PublicLayout, ScrollToTop } from './components/layout/PublicLayout';
import { Spinner } from './components/ui/primitives';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';

const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage').then((m) => ({ default: m.ExperiencePage })));
const SkillsPage = lazy(() => import('./pages/SkillsPage').then((m) => ({ default: m.SkillsPage })));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage').then((m) => ({ default: m.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })));
const BlogPage = lazy(() => import('./pages/BlogPage').then((m) => ({ default: m.BlogPage })));
const ArticlePage = lazy(() => import('./pages/ArticlePage').then((m) => ({ default: m.ArticlePage })));
const PromptsPage = lazy(() => import('./pages/PromptsPage').then((m) => ({ default: m.PromptsPage })));
const PromptDetailPage = lazy(() => import('./pages/PromptDetailPage').then((m) => ({ default: m.PromptDetailPage })));
const QaUnpackedPage = lazy(() => import('./pages/QaUnpackedPage').then((m) => ({ default: m.QaUnpackedPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));

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
