import { Briefcase } from 'lucide-react';
import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { sortedExperiences } from '../lib/selectors';
import { PageHeader } from '../components/layout/PageHeader';
import { Container, EmptyState } from '../components/ui/primitives';
import { ExperienceTimeline } from '../components/ExperienceTimeline';
import { LinkButton } from '../components/ui/Button';

export function ExperiencePage() {
  const data = useSnapshot();
  const items = sortedExperiences(data);
  useSeo('Experience', `${data.profile.yearsOfExperience} years of software testing experience across manual, automation and API testing.`);

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title={`${data.profile.yearsOfExperience} years in software testing`}
        description="Manual testing foundations, automation with Cypress and Playwright, and growing ownership of QA strategy and delivery."
      />
      <Container className="py-16">
        <div className="max-w-3xl">
          {items.length ? (
            <ExperienceTimeline items={items} />
          ) : (
            <EmptyState icon={<Briefcase className="size-8" />} title="Experience details coming soon" />
          )}
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          <LinkButton to="/skills" variant="secondary">
            Explore skills
          </LinkButton>
          <LinkButton to="/contact">Get in touch</LinkButton>
        </div>
      </Container>
    </>
  );
}
