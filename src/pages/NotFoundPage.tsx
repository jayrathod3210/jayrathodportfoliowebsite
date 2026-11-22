import { useSeo } from '../hooks/useSeo';
import { Container } from '../components/ui/primitives';
import { LinkButton } from '../components/ui/Button';

export function NotFoundPage() {
  useSeo('Page not found', 'The page you were looking for does not exist.', { noindex: true });
  return (
    <Container className="flex flex-col items-center py-28 text-center">
      <p className="font-mono text-sm text-accent-soft">404 · Test failed</p>
      <h1 className="mt-4 text-3xl font-bold sm:text-4xl">Expected a page. Found nothing.</h1>
      <p className="mt-4 max-w-md text-muted">The page you're looking for doesn't exist or may have moved.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton to="/">Back to home</LinkButton>
        <LinkButton to="/blog" variant="secondary">
          Read the blog
        </LinkButton>
      </div>
    </Container>
  );
}
