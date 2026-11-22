import { useEffect } from 'react';

const SITE = 'Jay Rathod';
const DEFAULT_DESCRIPTION =
  'Jay Rathod — QA professional with 6 years of experience across manual, web, mobile, API and automation testing.';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSeo(title: string, description = DEFAULT_DESCRIPTION, options: { noindex?: boolean } = {}) {
  const { noindex = false } = options;
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : `${SITE} — QA Engineer | Automation | Quality Engineering`;
    document.title = fullTitle;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
  }, [title, description, noindex]);
}
