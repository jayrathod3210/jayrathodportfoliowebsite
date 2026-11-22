# Jay Rathod: QA Engineer | Automation | Quality Engineering

Personal portfolio, blog and QA Prompt Library.
React 19 + TypeScript + Vite + Tailwind CSS v4, with blog posts and prompts managed in [Decap CMS](https://decapcms.org).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests
npm run build      # production build → dist/
npm run preview    # serve the production build
```

Requires Node 20.19+ or 22.12+.

## Where content lives

| What | Where | How to change |
|---|---|---|
| Blog articles | `content/blog/*.md` | Decap CMS at `/admin/` |
| QA prompts | `content/prompts/*.md` | Decap CMS at `/admin/` |
| Uploaded images | `public/images/uploads/` | Decap CMS |
| Profile, experience, skills, projects, QA UNPACKED, categories | `src/data/site.ts` | Edit the file |
| Profile photo | `public/images/…`, then set `avatarUrl` in `src/data/site.ts` | Edit the file |

There is no database or server. Markdown files are bundled at build time, so the site is fully static and hosting is free.

**Setup for going live and logging in to the CMS: [docs/CMS_SETUP.md](docs/CMS_SETUP.md).**

## Content rules built into the site

- Articles with `status: draft` never appear in production. Their title and excerpt show under "In the works".
- An article's date is shown only when it's published and has a `publishedAt` value.
- Projects marked `isSample: true` show a "Sample placeholder" badge and a notice. Set it to `false` once a project describes real work.
- Empty social-link URLs are hidden. On QA UNPACKED they show as "coming soon".
- The phone number is empty by default because anything there is public.

## Project structure

```
content/                 Markdown written by Decap CMS (blog/, prompts/)
public/admin/            Decap CMS (index.html + config.yml)
src/
  data/site.ts           Static site data
  content/               Loads and parses the Markdown at build time
  components/            UI primitives (ui/), layout, cards, Markdown renderer
  pages/                 One file per route
  lib/                   Pure helpers: selectors, validation, utils (unit tested)
netlify.toml             Build settings + SPA routing for Netlify
legacy-static/           First static draft, kept for reference only
```

## Routes

`/` · `/about` · `/experience` · `/skills` · `/projects` · `/projects/:slug` · `/blog` · `/blog/:slug` · `/prompts` · `/prompts/:slug` · `/qa-unpacked` · `/contact` · `/admin/` (CMS)

## Notes

- **Contact form:** there is no mail server. A valid submission opens the visitor's email app with the message pre-filled.
- **SEO:** each page sets its own title and description. It's a client-rendered single-page app; if search ranking becomes important, add pre-rendering later.
- **Decap version** is pinned in `public/admin/index.html` (`decap-cms@3.17.3`). Update it deliberately.
