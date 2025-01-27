import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const url = `https://api-web.nhle.com/v1/player/8476945/game-log/20242025/2`;
  const resp = await fetch(url);
  const json = await resp.json();

  const store = getStore("stats");
  await store.setJSON("hellebuyck", await json);

  return new Response(json);
};
