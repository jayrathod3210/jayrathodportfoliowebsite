import { Mail, MapPin, Phone } from 'lucide-react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, Container } from '../components/ui/primitives';
import { ContactForm } from '../components/ContactForm';
import { SocialIcon } from '../components/ui/SocialIcon';

export function ContactPage() {
  const { profile } = useSnapshot();
  const socials = profile.socials.filter((s) => s.url);
  useSeo('Contact', `Get in touch with ${profile.name} about QA roles, automation and software quality.`);

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's connect"
        description="Recruiters, hiring managers, QA professionals and developers: I'd love to hear from you."
      />
      <Container className="grid gap-10 py-16 lg:grid-cols-[1fr_340px]">
        <Card className="p-6 sm:p-8">
          <h2 className="mb-6 text-xl font-semibold">Send a message</h2>
          {profile.email ? (
            <ContactForm to={profile.email} />
          ) : (
            <p className="text-muted">A contact email has not been configured yet.</p>
          )}
        </Card>

        <aside className="space-y-4">
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
          {profile.phone && (
            <a href={`tel:${profile.phone.replace(/\s+/g, '')}`} className="block">
              <Card interactive className="flex items-center gap-4 p-5">
                <Phone className="size-5 text-accent-soft" aria-hidden />
                <div>
                  <p className="text-xs text-subtle">Phone</p>
                  <p className="text-sm text-white">{profile.phone}</p>
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
        </aside>
      </Container>
    </>
  );
}
