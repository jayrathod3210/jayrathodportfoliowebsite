import { useSnapshot } from '../content';
import { useSeo } from '../hooks/useSeo';
import { Card, Container } from '../components/ui/primitives';
import { QaUnpackedSocials, QaUnpackedWordmark } from '../components/QaUnpacked';
import { LinkButton } from '../components/ui/Button';

export function QaUnpackedPage() {
  const { profile } = useSnapshot();
  const brand = profile.qaUnpacked;
  useSeo(brand.name, `${brand.name}: ${brand.tagline} ${brand.description}`);

  return (
    <>
      <section className="border-b border-unpacked/20 bg-[radial-gradient(50rem_24rem_at_80%_-10%,rgb(245_165_36/0.14),transparent_60%)]">
        <Container className="py-16 sm:py-24">
          <p className="font-mono text-xs tracking-wider text-unpacked uppercase">A knowledge initiative by {profile.name}</p>
          <h1 className="mt-4 text-5xl sm:text-7xl">
            <QaUnpackedWordmark name={brand.name} />
          </h1>
          <p className="mt-4 font-mono text-lg text-unpacked-soft">{brand.tagline}</p>
          <p className="mt-6 max-w-2xl text-lg text-muted">{brand.description}</p>
          <div className="mt-8">
            <QaUnpackedSocials brand={brand} />
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-2xl font-semibold">What {brand.name} covers</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {brand.focusAreas.map((area, i) => (
            <li key={area}>
              <Card className="h-full border-unpacked/15 p-5">
                <p className="font-mono text-xs text-unpacked">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-2 font-medium text-white">{area}</p>
              </Card>
            </li>
          ))}
        </ul>

        <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-line p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="max-w-xl text-muted">
            Want to start with something practical? The QA Prompt Library and blog share the same ideas in reusable form.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton to="/prompts" variant="secondary">
              QA Prompt Library
            </LinkButton>
            <LinkButton to="/blog" variant="secondary">
              Blog
            </LinkButton>
          </div>
        </div>
      </Container>
    </>
  );
}
