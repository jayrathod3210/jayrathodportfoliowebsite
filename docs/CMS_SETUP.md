# Going live and setting up the content editor (Decap CMS)

This takes about 20 minutes, once. Everything here is free: GitHub, Vercel's free plan, and Decap CMS.

When you're done, you'll write blog posts and prompts at **`https://your-site/admin/`**, logged in with GitHub. Each time you save, Decap commits a Markdown file to your repository and Vercel rebuilds the site. Changes are live in about a minute.

---

## Step 1: Put the project on GitHub

1. Create a new repository on GitHub, e.g. `portfolio`. It can be public or private.
2. In this project folder, run:

   ```bash
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
   git push -u origin main
   ```

## Step 2: Deploy on Vercel

1. Sign in at <https://vercel.com> with your GitHub account.
2. Choose **Add New → Project**, and pick your repository.
3. Vercel reads `vercel.json` automatically (build command `npm run build`, output folder `dist`). Framework preset should auto-detect as Vite. Click **Deploy**.
4. Note your site URL, e.g. `https://jayrathodqa.vercel.app`. You can add your own domain later under **Project → Settings → Domains**.

## Step 3: Let the editor log in with GitHub

Decap needs a GitHub "OAuth app" so it can save files to your repository on your behalf. Instead of a hosted provider, this project ships its own tiny OAuth provider as two Vercel serverless functions: [`api/auth.js`](../api/auth.js) and [`api/callback.js`](../api/callback.js).

1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - **Application name:** `Portfolio CMS`
   - **Homepage URL:** your Vercel URL from step 2
   - **Authorization callback URL:** `https://your-site.vercel.app/api/callback`
2. Click **Register application**, then **Generate a new client secret**. Keep this page open.
3. In Vercel, open your project → **Settings → Environment Variables**, and add:
   - `OAUTH_CLIENT_ID` = the Client ID from the GitHub OAuth App
   - `OAUTH_CLIENT_SECRET` = the Client secret you just generated
4. Redeploy (**Deployments → ⋯ → Redeploy**) so the functions pick up the new variables.

> The client secret is stored only in Vercel's environment variables. It never goes into your code or repository.

## Step 4: Point the editor at your repository

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: YOUR_USERNAME/portfolio   # ← your repository
  branch: main
  base_url: https://your-site.vercel.app   # ← your site URL
  auth_endpoint: api/auth

site_url: https://your-site.vercel.app   # ← your site URL
```

Commit and push. Vercel redeploys automatically.

## Step 5: Log in

Open `https://your-site/admin/` and click **Login with GitHub**.

Only GitHub accounts with **write access to the repository** can log in and edit. Everyone else is refused.

---

## Writing content

### Publishing a blog article
1. **Blog articles → New Article.**
2. Fill in the title, excerpt, category, tags and the article itself. A cover image is optional; uploads are saved to `public/images/uploads/`.
3. To make it visible, set **Status → Published** and the **Publish date** to today.
4. Click **Publish → Publish now** at the top.

> ⚠️ Decap's **Publish** button only *saves* the file. The **Status** field decides whether visitors can see it.
> To save work in progress, keep Status on **Draft** and click Publish. Drafts never appear on the live site.
> Draft topics are listed publicly under "In the works" with their title and excerpt only.

### Adding or editing a prompt
**QA prompts → New Prompt.** Whatever you type in **Prompt text** is exactly what the **Copy Prompt** button copies. Use `{{placeholders}}` for parts the reader should replace; the prompt page lists them automatically.

### Everything else is in the CMS too

You never need to edit code to change the site's content.

| In the CMS | What it controls |
|---|---|
| **Site content → Profile, home page & story** | Name, hero headline and description, short intro, your story (About page), testing philosophy, career journey timeline, interests, goals, profile photo, location, email, WhatsApp number, résumé PDF, social links (LinkedIn, GitHub…), the **highlight numbers** under the hero (50+, 1000+, 98%…), the **Platforms I test** card and the scrolling **tools strip** |
| **Site content → QA UNPACKED** | Brand name, tagline, description, focus areas, its own social links |
| **Site content → Skills** | Skill categories and the skills in each (drag to reorder) |
| **Site content → Blog & prompt categories** | The category lists offered when writing articles and prompts |
| **Experience** | Each job: title, company, dates, responsibilities, contributions, technologies, display order |
| **Projects** | Each case study, the "Sample placeholder" flag, featured on home page, screenshots |
| **Blog articles** / **QA prompts** | As described above |

### Years of experience update themselves
In **Profile → Career start month** your start date is stored (currently `2021-04`). The site calculates your years of experience from it **every time a visitor opens the page**, so the number goes up on its own: no edit, no push, no redeploy. It rounds to the nearest year (5 years 7 months shows as 6; it becomes 7 in October 2027).

In any text field on the Profile page, and in the highlight numbers, write `{years}` where the number should appear, e.g. *"QA professional with {years} years of experience"*. It is always shown with a plus, e.g. **6+**. To force a specific number instead, fill **Years of experience (manual override)**; leave it empty to go back to automatic.

### Adding a category
**Site content → Blog & prompt categories → Add.** Give it a name and a short lowercase ID (e.g. `api-testing`). It then appears in the Category dropdown when writing articles or prompts. Don't change an ID after posts use it.

---

## Editing locally (optional, no GitHub login needed)

Run these in two terminals:

```bash
npx decap-server   # lets the CMS write straight to your local files
npm run dev
```

Open <http://localhost:5173/admin/index.html>. Changes are written directly into `content/`; commit and push them yourself. On the local dev server, draft articles can also be previewed at `/blog/<slug>`.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Failed to load config.yml" | Check the YAML indentation in `public/admin/config.yml`. |
| Login popup closes and nothing happens | Check the OAuth app callback URL is exactly `https://your-site.vercel.app/api/callback`, and that `OAUTH_CLIENT_ID`/`OAUTH_CLIENT_SECRET` are set in Vercel's environment variables (then redeploy). |
| "Not Found" / no permission after login | The `repo:` value in `config.yml` is wrong, or your GitHub account lacks write access to it. |
| Article saved but not on the site | Its Status is still **Draft**, or the Vercel build failed (check **Deployments** in Vercel). |
| LinkedIn link asks visitors to log in | That's a LinkedIn setting, not the website: on LinkedIn go to **Me → View profile → Edit public profile & URL** and set **Your profile's public visibility** to **On**, with the sections you want visible switched on. |
