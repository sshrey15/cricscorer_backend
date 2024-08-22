
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function post_scorecard(req, res) {
  const { inningsId, runs = 0, wickets = 0, overs = 0.0 } = req.body;

  const scoreboard = await prisma.scoreCard.create({
    data: {
      inningsId: inningsId,
      runs: runs,
      wickets: wickets,
      overs: overs,
    },
  });
  return res.statsus(200).json({ scoreboard });
}

export async function get_scorecard(req, res) {
  const scoreboard = await prisma.scoreCard.findMany();
  return res.status(200).json({ scoreboard });
}

export async function get_scorecard_by_inningsId(req, res) {
  const { inningsId } = req.params;
  const scoreboard = await prisma.scoreCard.findMany({
    where: {
      inningsId: parseInt(inningsId),
    },
  });
  return res.status(200).json({ scoreboard });
}

export async function update_scorecard(req, res) {
  const {  runs, wickets, inningsId } = req.body;

  const currentBowlingStats = await prisma.currentBowlingStats.findMany({
    where: {
      inningsId: inningsId,
    },
  });

  const totalBallsBowled = currentBowlingStats.reduce((total, stats)=> total + stats.ballsBowled,0)

  let updateData = {};
  if (runs !== undefined) updateData.runs = runs;
  if (wickets !== undefined) updateData.wickets = wickets;
  if(overs !== undefined)   updateData.overs = Math.floor(totalBallsBowled / 6) + (totalBallsBowled % 6) / 10;


  const scoreboard = await prisma.scoreCard.update({
    where: {
      id: inningsId
    },
    data: updateData,
  });

  return res.status(200).json({ scoreboard });
}