import { Link } from 'react-router-dom';
import { ArrowUp, Mail } from 'lucide-react';
import type { Profile } from '../../types/content';
import { Container } from '../ui/primitives';
import { SocialIcon } from '../ui/SocialIcon';
import { useLenis } from '../fx/SmoothScroll';
import { NAV_ITEMS } from './Navbar';
import { whatsappLink } from '../../content/settings';

const iconLink =
  'flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-muted transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:text-white';

export function Footer({ profile }: { profile: Profile }) {
  const lenis = useLenis();
  const socials = profile.socials.filter((s) => s.url);
  const whatsapp = whatsappLink(profile.whatsapp);
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/[0.06]">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
      <Container className="grid gap-12 pt-16 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold tracking-[0.2em] text-white uppercase">{profile.name}</p>
          <p className="mt-2 text-sm text-accent-soft">{profile.positioning}</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-subtle">“{profile.philosophy}”</p>
          <div className="mt-6 flex items-center gap-2">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className={iconLink} aria-label="Email">
                <Mail className="size-4" />
              </a>
            )}
            {whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={`${iconLink} hover:border-[#25D366]/60 hover:text-[#25D366]`} aria-label="Chat on WhatsApp">
                <SocialIcon platform="whatsapp" />
              </a>
            )}
            {socials.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className={iconLink} aria-label={s.label}>
                <SocialIcon platform={s.platform} />
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Footer">
          <p className="font-mono text-[11px] tracking-[0.16em] text-subtle uppercase">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {NAV_ITEMS.slice(1, 6).map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="text-muted transition-colors hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-[11px] tracking-[0.16em] text-subtle uppercase">Resources</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/prompts" className="text-muted transition-colors hover:text-white">
                QA Prompt Library
              </Link>
            </li>
            <li>
              <Link to="/qa-unpacked" className="text-muted transition-colors hover:text-unpacked-soft">
                {profile.qaUnpacked.name}
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-muted transition-colors hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <Container>
        <p
          aria-hidden
          className="pointer-events-none bg-gradient-to-b from-white/[0.09] to-transparent bg-clip-text text-center text-[17vw] leading-[0.8] font-bold tracking-tighter text-transparent select-none lg:text-[180px]"
        >
          {profile.name.toUpperCase()}
        </p>
      </Container>

      <div className="border-t border-white/[0.06]">
        <Container className="flex flex-col items-start gap-3 py-6 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: 'smooth' }))}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 transition-colors hover:border-white/20 hover:text-white"
          >
            <ArrowUp className="size-3.5" aria-hidden /> Back to top
          </button>
        </Container>
      </div>
    </footer>
  );
}
