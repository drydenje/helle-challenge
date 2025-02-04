import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("stats");
  const helle = await store.get("hellebuyck");
  // needed to use a temp var, might be able to parse without?
  const temp = JSON.parse(helle);
  const temp2 = {
    ...temp,
    logs: temp.gameLog.reverse(),
  };

  const totalShotsAgainst = temp2.logs.reverse().reduce((acc, curr, index) => {
    acc.push(curr.shotsAgainst + (acc[index - 1] || 0));
    return acc;
  }, []);

  // const totalGoalsAgainst = temp.gameLog
  //   .reverse()
  //   .reduce((acc, curr, index) => {
  //     acc.push(curr.goalsAgainst + (acc[index - 1] || 0));
  //     return acc;
  //   }, []);

  const logs = temp2.logs.map((game, index) => {
    // const sp = (totalGoalsAgainst[index] / totalShotsAgainst[index] - 1) * -1;
    return {
      ...game,
      totalShotsAgainst: 5,
      // totalShotsAgainst: totalShotsAgainst[index],
      // totalGoalsAgainst: totalGoalsAgainst[index],
      // totalSavePercentage: parseFloat(sp).toFixed(3),
    };
  });

  const res = Object.assign(
    // create a new blank object
    {},
    // add the player name and number first
    // (this is done for a nicer viewing order, not js related)
    {
      playerName: "Connor Hellebuyck",
      playerNumber: 8476945,
      ...temp2,
      gameLogs: logs,
    },
    // then add the blob data pulled from netlify
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
  // return new Response(JSON.stringify(temp));
};
