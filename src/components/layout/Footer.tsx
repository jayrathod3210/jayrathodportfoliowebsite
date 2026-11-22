import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import type { Profile } from '../../types/content';
import { Container } from '../ui/primitives';
import { SocialIcon } from '../ui/SocialIcon';
import { NAV_ITEMS } from './Navbar';

export function Footer({ profile }: { profile: Profile }) {
  const socials = profile.socials.filter((s) => s.url);
  return (
    <footer className="mt-24 border-t border-line bg-navy-950">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold tracking-[0.18em] text-white uppercase">{profile.name}</p>
          <p className="mt-2 text-sm text-muted">{profile.positioning}</p>
          <p className="mt-4 max-w-sm text-sm text-subtle">{profile.philosophy}</p>
          <div className="mt-5 flex items-center gap-2">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex size-9 items-center justify-center rounded-lg border border-line text-muted hover:border-accent/50 hover:text-white"
                aria-label="Email"
              >
                <Mail className="size-4" />
              </a>
            )}
            {socials.map((s) => (
              <a
                key={s.id}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-lg border border-line text-muted hover:border-accent/50 hover:text-white"
                aria-label={s.label}
              >
                <SocialIcon platform={s.platform} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-semibold tracking-wider text-subtle uppercase">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            {NAV_ITEMS.slice(1, 6).map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-muted hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold tracking-wider text-subtle uppercase">Resources</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/prompts" className="text-muted hover:text-white">
                QA Prompt Library
              </Link>
            </li>
            <li>
              <Link to="/qa-unpacked" className="text-muted hover:text-unpacked-soft">
                {profile.qaUnpacked.name}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-muted hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-line">
        <Container className="flex flex-col gap-2 py-6 text-xs text-subtle sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <p>Built with React, TypeScript & Tailwind CSS.</p>
        </Container>
      </div>
    </footer>
  );
}
