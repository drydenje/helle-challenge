import stats from "../../src/stats/price";

export default async (req, context) => {
  const temp = stats;
  const res = Object.assign(
    // create a new blank object
    {},
    // add the player name and number first
    // (this is done for a nicer viewing order, not js related)
    {
      playerName: "Carey Price",
      playerNumber: 8471679,
    },
    // then add the blob data pulled from netlify
    temp,
    // then remove the fields you don't want
    {
      gameTypeId: undefined,
      playerStatsSeasons: undefined,
    }
  );
  return new Response(JSON.stringify(res));
  // return new Response(res);
};
