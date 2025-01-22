import stats from "../../src/stats/price";

export default async (req, context) => {
  return new Response(JSON.stringify(stats));
};
