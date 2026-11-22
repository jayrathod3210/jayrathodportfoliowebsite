# Going live and setting up the content editor (Decap CMS)

This takes about 20 minutes, once. Everything here is free: GitHub, Netlify's free plan, and Decap CMS.

When you're done, you'll write blog posts and prompts at **`https://your-site/admin/`**, logged in with GitHub. Each time you save, Decap commits a Markdown file to your repository and Netlify rebuilds the site. Changes are live in about a minute.

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

## Step 2: Deploy on Netlify

1. Sign in at <https://app.netlify.com> with your GitHub account.
2. Choose **Add new site → Import an existing project → GitHub**, and pick your repository.
3. Netlify reads `netlify.toml` automatically (build command `npm run build`, publish folder `dist`). Click **Deploy**.
4. Note your site URL, e.g. `https://jay-rathod.netlify.app`. You can rename it under **Site configuration → Change site name**, or add your own domain later.

## Step 3: Let the editor log in with GitHub

Decap needs a GitHub "OAuth app" so it can save files to your repository on your behalf.

1. On GitHub, go to **Settings → Developer settings → OAuth Apps → New OAuth App**:
   - **Application name:** `Portfolio CMS`
   - **Homepage URL:** your Netlify URL from step 2
   - **Authorization callback URL:** `https://api.netlify.com/auth/done`
2. Click **Register application**, then **Generate a new client secret**. Keep this page open.
3. In Netlify, open your site → **Site configuration → Access & security → OAuth → Install provider**.
   Choose **GitHub** and paste the **Client ID** and **Client secret**.

> The client secret is stored only in Netlify. It never goes into your code or repository.

## Step 4: Point the editor at your repository

Edit `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: YOUR_USERNAME/portfolio   # ← your repository
  branch: main

site_url: https://jay-rathod.netlify.app   # ← your site URL
```

Commit and push. Netlify redeploys automatically.

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

### Changing anything else
Your profile, experience, skills, projects and QA UNPACKED links are in **`src/data/site.ts`**. Edit that file, then commit and push.

### Adding a category
Categories are listed in two places, which must match:
1. `src/data/site.ts` (`blogCategories` or `promptCategories`)
2. `public/admin/config.yml` (the `category` field's `options`)

`npm test` fails if they drift apart.

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
| Login popup closes and nothing happens | Check the OAuth app callback URL is exactly `https://api.netlify.com/auth/done`, and that the GitHub provider is installed in Netlify. |
| "Not Found" / no permission after login | The `repo:` value in `config.yml` is wrong, or your GitHub account lacks write access to it. |
| Article saved but not on the site | Its Status is still **Draft**, or the Netlify build failed (check **Deploys** in Netlify). |
