import stats from "../../src/stats/price";

export default async (req, context) => {
  const temp = stats;

  const totalShotsAgainst = temp.gameLog.reduce((acc, curr, index) => {
    acc.push(curr.shotsAgainst + (acc[index - 1] || 0));
    return acc;
  }, []);

  const totalGoalsAgainst = temp.gameLog.reduce((acc, curr, index) => {
    acc.push(curr.goalsAgainst + (acc[index - 1] || 0));
    return acc;
  }, []);

  const logs = temp.gameLog.map((game, index) => {
    const sp = (totalGoalsAgainst[index] / totalShotsAgainst[index] - 1) * -1;
    return {
      ...game,
      totalShotsAgainst: totalShotsAgainst[index],
      totalGoalsAgainst: totalGoalsAgainst[index],
      totalSavePercentage: parseFloat(sp).toFixed(3),
    };
  });

  const res = Object.assign(
    // create a new blank object
    {},
    // add the player name and number first
    // (this is done for a nicer viewing order, not js related)
    {
      playerName: "Carey Price",
      playerNumber: 8471679,
      gameLog: logs,
    },
    // then add the blob data pulled from netlify
    // temp,
    {
      totalGoalsAgainst: totalGoalsAgainst,
      totalShotsAgainst: totalShotsAgainst,
    },
    // then remove the fields you don't want
    {
      gameTypeId: undefined,
      playerStatsSeasons: undefined,
    }
  );
  return new Response(JSON.stringify(res));
  // return new Response(res);
};
