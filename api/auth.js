// Decap CMS OAuth provider — step 1: redirect to GitHub's authorize screen.
// Mirrors what Netlify's hosted OAuth provider (api.netlify.com) used to do for us.
export default function handler(req, res) {
  const clientId = process.env.OAUTH_CLIENT_ID;
  if (!clientId) {
    res.status(500).send("Missing OAUTH_CLIENT_ID environment variable");
    return;
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const redirectUri = `${protocol}://${host}/api/callback`;

  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("scope", "repo,user");

  res.writeHead(302, { Location: authorizeUrl.toString() });
  res.end();
}
