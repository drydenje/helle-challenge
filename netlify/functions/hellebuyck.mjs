import { getStore } from "@netlify/blobs";
// import type { Context } from "@netlify/functions"
// import stats from "../../src/stats/price";

// use setJSON to set the blob

export default async (req, context) => {
  const store = getStore("stats");
  const helle = await store.get("test");
  return new Response(helle);
  // return new Response(JSON.stringify(stats));
};
