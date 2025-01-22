import { getStore } from "@netlify/blobs";
import stats from "../../src/stats/hellebuyck";

// use setJSON to set the blob

export default async (req, context) => {
  const url = `https://api-web.nhle.com/v1/player/8476945/game-log/20242025/2`;
  const resp = await fetch(url);

  const store = getStore("stats");
  await store.setJSON("hellebuyck", await resp.json());

  return new Response(JSON.stringify(resp.json()));
};
