export async function getAccessToken() {
  const clientId = process.env.DRUPAL_CLIENT_ID!;
  const clientSecret = process.env.DRUPAL_CLIENT_SECRET!;
  const tokenUrl = process.env.DRUPAL_TOKEN_URL!;

  const formData = new URLSearchParams();
  formData.append("grant_type", "client_credentials");
  formData.append("client_id", clientId);
  formData.append("client_secret", clientSecret);
  formData.append("scope", "create update delete");

  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch access token from Drupal");
  }

  const data = await res.json();
  return data.access_token;
}
