import { Mail, MapPin } from 'lucide-react';
import { useSnapshot } from '../content';
import { whatsappLink } from '../content/settings';
import { useSeo } from '../hooks/useSeo';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, Container } from '../components/ui/primitives';
import { ContactForm } from '../components/ContactForm';
import { SocialIcon } from '../components/ui/SocialIcon';
import { Reveal, Stagger } from '../components/fx/Reveal';

export function ContactPage() {
  const { profile } = useSnapshot();
  const socials = profile.socials.filter((s) => s.url);
  const whatsapp = whatsappLink(profile.whatsapp);
  useSeo('Contact', `Get in touch with ${profile.name} about QA roles, automation and software quality.`);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's connect"
        highlight={["connect"]}
        description="Recruiters, hiring managers, QA professionals and developers: I'd love to hear from you."
      />
      <Container className="grid gap-10 py-20 lg:grid-cols-[1fr_360px]">
        <Reveal>
        <Card className="relative overflow-hidden p-6 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.14),transparent_65%)]" />
          <h2 className="relative mb-8 text-2xl font-semibold">Send a message</h2>
          {profile.email ? (
            <ContactForm to={profile.email} />
          ) : (
            <p className="text-muted">A contact email has not been configured yet.</p>
          )}
        </Card>
        </Reveal>

        <Stagger as="div" className="space-y-4" delay={0.2}>
          {whatsapp && (
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="block">
              <Card interactive className="flex items-center gap-4 border-emerald-500/25 bg-gradient-to-br from-emerald-500/[0.12] to-transparent p-5">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_0_24px_-4px_rgb(37_211_102/0.7)]">
                  <SocialIcon platform="whatsapp" className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">Chat on WhatsApp</p>
                  <p className="text-sm text-emerald-200/80">{profile.whatsapp}</p>
                </div>
              </Card>
            </a>
          )}
          {profile.email && (
            <a href={`mailto:${profile.email}`} className="block">
              <Card interactive className="flex items-center gap-4 p-5">
                <Mail className="size-5 text-accent-soft" aria-hidden />
                <div className="min-w-0">
                  <p className="text-xs text-subtle">Email</p>
                  <p className="truncate text-sm text-white">{profile.email}</p>
                </div>
              </Card>
            </a>
          )}
          {socials.map((s) => (
            <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card interactive className="flex items-center gap-4 p-5">
                <SocialIcon platform={s.platform} className="size-5 text-accent-soft" />
                <div>
                  <p className="text-xs text-subtle">{s.label}</p>
                  <p className="text-sm text-white">Connect with me</p>
                </div>
              </Card>
            </a>
          ))}
          {profile.location && (
            <Card className="flex items-center gap-4 p-5">
              <MapPin className="size-5 text-accent-soft" aria-hidden />
              <div>
                <p className="text-xs text-subtle">Location</p>
                <p className="text-sm text-white">{profile.location}</p>
              </div>
            </Card>
          )}
        </Stagger>
      </Container>
    </>
  );
}
