import stats from "../../src/stats/price";

// export default async (req, context) => {
//   const temp = stats;

//   const totalShotsAgainst = temp.gameLog.reduce((acc, curr, index) => {
//     acc.push(curr.shotsAgainst + (acc[index - 1] || 0));
//     return acc;
//   }, []);

//   const totalGoalsAgainst = temp.gameLog.reduce((acc, curr, index) => {
//     acc.push(curr.goalsAgainst + (acc[index - 1] || 0));
//     return acc;
//   }, []);

//   const logs = temp.gameLog.reverse().map((game, index) => {
//     const sp = (totalGoalsAgainst[index] / totalShotsAgainst[index] - 1) * -1;
//     return {
//       ...game,
//       totalShotsAgainst: totalShotsAgainst[index],
//       totalGoalsAgainst: totalGoalsAgainst[index],
//       totalSavePercentage: parseFloat(sp).toFixed(3),
//     };
//   });

//   const res = Object.assign(
//     // create a new blank object
//     {},
//     // add the player name and number first
//     // (this is done for a nicer viewing order, not js related)
//     {
//       playerName: "Carey Price",
//       playerNumber: 8471679,
//       gameLog: logs,
//     },
//     // then add the blob data pulled from netlify
//     // temp,
//     {
//       totalGoalsAgainst: totalGoalsAgainst,
//       totalShotsAgainst: totalShotsAgainst,
//     },
//     // then remove the fields you don't want
//     {
//       gameTypeId: undefined,
//       playerStatsSeasons: undefined,
//     }
//   );
//   return new Response(JSON.stringify(res));
//   // return new Response(res);
// };

export default async (req, context) => {
  // const stats = await import("../../src/stats/price");
  const playerID = "price";

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

  //   "playerID": "hellebuyck",
  // "seasonId": 20242025,
  // "gameLogs": {
  // "0": {
  // "gameNumber": 1,
  // "date": "2024-10-09",
  // "opponent": "Oilers",
  // "homeRoadFlag": "R",
  // "goals": 0,
  // "assists": 0,
  // "shotsAgainst": 30,
  // "goalsAgainst": 0,
  // "savePctg": 1,
  // "decision": "W",
  // "totalShotsAgainst": 30,
  // "totalGoalsAgainst": 0,
  // "totalSavePercentage": "1.000"
  // },

  // const tShotsAgainst = calcTotalShotsAgainst(result.gameLogs);
  // const tGoalsAgainst = calcTotalGoalsAgainst(result.gameLogs);

  const logs = stats.gameLog.reverse();
  const tShotsAgainst = calcTotalShotsAgainst(logs);
  const tGoalsAgainst = calcTotalGoalsAgainst(logs);
  let player = Object.assign(
    {},
    {
      playerID: "price",
      seasonId: stats.seasonId,
      gameLogs: [
        ...logs.map((game, index) => {
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
      // data we don't need
      gameTypeId: undefined,
      playerStatsSeasons: undefined,
      gameLog: undefined,
    }
    //   return {
    //     ...result,
    //     gameLogs: {
    //       ...result.gameLogs.map((game, index) => {
    //         const sp = (tGoalsAgainst[index] / tShotsAgainst[index] - 1) * -1;
    //         return {
    //           game,
    //           totalShotsAgainst: tShotsAgainst[index],
    //           totalGoalsAgainst: tGoalsAgainst[index],
    //           totalSavePercentage: parseFloat(sp).toFixed(3),
    //         };
    //       }),
    //     },
    //   };
    // });
  );
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
  path: "/functions/price",
  // path: "/player/:playerID/:playerName"
};
