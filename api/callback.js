// Decap CMS OAuth provider — step 2: exchange the GitHub code for a token
// and hand it back to the /admin popup via postMessage, using the same
// message protocol Decap CMS expects from Netlify's hosted provider.
export default async function handler(req, res) {
  const { code, error, error_description } = req.query;
  const clientId = process.env.OAUTH_CLIENT_ID;
  const clientSecret = process.env.OAUTH_CLIENT_SECRET;

  if (error) {
    res.status(200).send(renderMessage("error", { message: error_description || error }));
    return;
  }

  if (!clientId || !clientSecret) {
    res.status(500).send("Missing OAUTH_CLIENT_ID / OAUTH_CLIENT_SECRET environment variables");
    return;
  }

  if (!code) {
    res.status(400).send("Missing code parameter");
    return;
  }

  try {
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      res.status(200).send(renderMessage("error", { message: tokenData.error_description || tokenData.error }));
      return;
    }

    res.status(200).send(
      renderMessage("success", { token: tokenData.access_token, provider: "github" })
    );
  } catch (err) {
    res.status(200).send(renderMessage("error", { message: String(err) }));
  }
}

function renderMessage(status, payload) {
  const content = JSON.stringify(payload);
  return `<!doctype html>
<html><body>
<script>
(function() {
  function receiveMessage(message) {
    window.opener.postMessage(
      'authorization:github:${status}:${content}',
      message.origin
    );
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>
</body></html>`;
}
