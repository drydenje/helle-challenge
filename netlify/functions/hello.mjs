import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("stats");
  const helle = await store.get("hellebuyck");
  // needed to use a temp var, might be able to parse without?
  const temp = JSON.parse(helle);
  const res = Object.assign(
    // create a new blank object
    {},
    // add the player name and number first
    // (this is done for a nicer viewing order, not js related)
    {
      playerName: "Connor Hellebuyck",
      playerNumber: 8476945,
    },
    // then add the blob data pulled from netlify
    temp,
    // then remove the fields you don't want
    {
      gameTypeId: undefined,
      playerStatsSeasons: undefined,
    }
  );

  // check if data is stored in a blob
  if (res === null)
    return new Response("No data received", {
      status: 500,
      statusText: "Failed to retrive blob",
    });

  // Everything's ok, return the data
  return new Response(JSON.stringify(res));
};
