import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const store = getStore("stats");
  // const playerID = "hellebuyck";
  const { playerID } = context.params;

  // maybe add these in later?
  // const playerName = "Connor Hellebuyck";
  // const playerNumber = "8476945";

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
        // playerName,
        // playerNumber,
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
        gameLogs: [
          ...result.gameLogs.map((game, index) => {
            const sp = (tGoalsAgainst[index] / tShotsAgainst[index] - 1) * -1;
            return {
              gameNumber: index + 1,
              date: game.gameDate,
              opponent: game.opponentCommonName.default,
              homeRoadFlag: game.homeRoadFlag,
              goals: game.goals,
              assists: game.assists,
              shotsAgainst: game.shotsAgainst,
              goalsAgainst: game.goalsAgainst,
              savePctg: game.savePctg,

              opponent: game.opponentCommonName.default,
              decision: game.decision,

              // season totals
              totalShotsAgainst: tShotsAgainst[index],
              totalGoalsAgainst: tGoalsAgainst[index],
              totalSavePercentage: parseFloat(sp).toFixed(3),
            };
          }),
        ],
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

// Here are the possible routes that can be used,
// might add more player info/seasons down the line
export const config = {
  path: "/functions/player/:playerID",
  // path: "/player/:playerID/:playerName"
};
