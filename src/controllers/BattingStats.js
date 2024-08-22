import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();



export async function post_batting_stats(req, res) {
  const { inningsId, strikerId, runs = 0, balls = 0 } = req.body;
  const currentBattingStats = await prisma.currentBattingStats.create({
    data: {
      inningsId: inningsId,
      strikerId: strikerId,
      runs: runs,
      balls: balls,
    },
  });
  return res.status(200).json({ currentBattingStats });
}

export async function get_batting_stats(req, res) {
  const currentBattingStats = await prisma.currentBattingStats.findMany();
  return res.status(200).json({ currentBattingStats });
}

export async function get_batting_stats_by_inningsId(req, res) {
  const { inningsId } = req.params;
  const currentBattingStats = await prisma.currentBattingStats.findMany({
    where: {
      inningsId: parseInt(inningsId),
    },
  });
  return res.status(200).json({ currentBattingStats });
}

export async function update_current_batting_Stats(req, res) {
  const {
    strickerId,
    nonStrickerId,
    runs,
    balls,
    inningsId,
    isWide,
    dismissalId,
    dismissalType,
    newBatsmanId,
  } = req.body;

  // Fetch the current batting stats for the striker
  const currentBattingStats = await prisma.currentBattingStats.findUnique({
    where: {
      strickerId: strickerId,
    },
  });

  // Update the runs and balls for the striker
  let updateData = {};
  if (runs !== undefined && !isWide)
    updateData.runs = currentBattingStats.runs + runs;
  if (balls !== undefined) updateData.balls = currentBattingStats.balls + 1;
  if (dismissalId !== undefined) {
    updateData.dismissalId = dismissalId;
    // Update the Dismissals model
    await prisma.dismisals.create({
      data: {
        id: dismissalId,
        inningsId: inningsId,
        batsmanId: strickerId,
        dismissalType: dismissalType,
      },
    });
    updateData.strikerId = newBatsmanId;
  }

  // Update the current batting stats for the striker
  const updatedBattingStats = await prisma.currentBattingStats.update({
    where: {
      strickerId: strickerId,
    },
    data: updateData,
  });

  if (
    (runs % 2 !== 0 && runs !== 4 && runs !== 6) ||
    (balls % 6 === 0 && runs % 2 == 0 )
  ) {
    // Switch the striker and non-striker
    await prisma.currentBattingStats.update({
      where: {
        strickerId: strickerId,
      },
      data: {
        strickerId: nonStrickerId,
        nonStrickerId: strickerId,
      },
    });
  }

  return res.status(200).json({ updatedBattingStats });
}
