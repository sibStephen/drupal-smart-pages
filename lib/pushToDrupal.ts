import { getAccessToken } from "./getAccessToken";

export async function pushToDrupal(nodeId: string, title: string, body: string) {
  const accessToken = await getAccessToken();
  const apiUrl = `${process.env.DRUPAL_API_URL}/${nodeId}`;

  const response = await fetch(apiUrl, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      data: {
        type: "node--article",
        id: nodeId,
        attributes: {
          title,
          body: {
            value: body,
            format: "plain_text",
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error("Failed to push content to Drupal: " + error);
  }

  return await response.json();
}
