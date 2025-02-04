import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("stats");
  const playerID = "hellebuyck";
  const playerName = "Connor Hellebuyck";
  const playerNumber = "8476945";

  const calcTotalShotsAgainst = (logs) => {
    return logs.reduce((acc, curr, index) => {
      acc.push(curr.shotsAgainst + (acc[index - 1] || 0));
      return acc;
    }, []);
  };

  const calcTotalGoalsAgainst = (logs) => {
    return logs.reduce((acc, curr, index) => {
      acc.push(curr.goalsAgainst + (acc[index - 1] || 0));
      return acc;
    }, []);
  };

  const player = await store
    .get(playerID)
    .then((result) => JSON.parse(result))
    .then((result) => {
      return {
        playerID,
        playerName,
        playerNumber,
        ...result,
        gameLogs: result.gameLog.reverse(),
        // data we don't need
        gameTypeId: undefined,
        playerStatsSeasons: undefined,
        gameLog: undefined,
      };
    })
    .then((result) => {
      const tShotsAgainst = calcTotalShotsAgainst(result.gameLogs);
      const tGoalsAgainst = calcTotalGoalsAgainst(result.gameLogs);

      return {
        ...result,
        gameLogs: {
          ...result.gameLogs.map((game, index) => {
            const sp = (tGoalsAgainst[index] / tShotsAgainst[index] - 1) * -1;
            return {
              game,
              totalShotsAgainst: tShotsAgainst[index],
              totalGoalsAgainst: tGoalsAgainst[index],
              totalSavePercentage: parseFloat(sp).toFixed(3),
            };
          }),
        },
      };
    });

  // check if data is stored in a blob
  if (player === null)
    return new Response("No data received", {
      status: 500,
      statusText: "Failed to retrive blob",
    });

  // Everything's ok, return the data
  return new Response(JSON.stringify(player));
};
