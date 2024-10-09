import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function patch_scorecard(req, res) {
  console.log("entered patch_scorecard");
  const { runs, wickets } = req.body;
  const cookie = req.cookies.inningsCookie;

  console.log("cookie_data", cookie);

  if (!cookie) {
    console.log("No cookie found");
    return res.status(400).json({ error: "No cookie found" });
  }

  let inningsId;
  try {
    const parsedCookie = typeof cookie === 'string' ? JSON.parse(cookie) : cookie;
    inningsId = parsedCookie.innings1Id;
  } catch (error) {
    console.error("Error parsing cookie:", error);
    return res.status(400).json({ error: "Invalid cookie format" });
  }

  console.log("innings_id: ", inningsId);

  if (!inningsId) {
    console.error("innings1Id not found in cookie");
    return res.status(400).json({ error: "innings1Id not found in cookie" });
  }

  try {
    const innings = await prisma.innings.findUnique({
      where: { id: inningsId },
      include: { totalRuns: true },
    });

    if (innings && innings.totalRuns.length > 0) {
      const scorecardId = innings.totalRuns[0].id;
      console.log("Scorecard ID: ", scorecardId);

      const existingScorecard = await prisma.scoreCard.findUnique({
        where: { id: scorecardId },
      });
      console.log("existingscorecard: ", existingScorecard);

      if (!existingScorecard) {
        return res.status(404).json({ error: "Scorecard not found" });
      }

      // Check if the number of wickets is already 10
      if (existingScorecard.wickets >= 10) {
        return res.status(400).json({ error: "Cannot update scorecard after 10 wickets" });
      }

      let updateData = {};
      if (runs !== undefined) updateData.runs = existingScorecard.runs + runs;
      if (wickets !== undefined) updateData.wickets = existingScorecard.wickets + wickets;

      // Calculate new overs
      const currentOvers = existingScorecard.overs;
      const wholePart = Math.floor(currentOvers);
      const fractionalPart = (currentOvers % 1).toFixed(1);

      let newOvers;
      if (fractionalPart === '0.5') {
        newOvers = wholePart + 1;
      } else {
        newOvers = parseFloat((currentOvers + 0.1).toFixed(1));
      }

      updateData.overs = newOvers;

      const updatedScorecard = await prisma.scoreCard.update({
        where: { id: scorecardId },
        data: updateData,
      });
      console.log("updatedScorecard: ", updatedScorecard);

      const scoreboard = {
        id: updatedScorecard.id,
        runs: updatedScorecard.runs,
        overs: updatedScorecard.overs,
        wickets: updatedScorecard.wickets,
      };

      res.cookie("scorecardCookie", JSON.stringify(scoreboard), {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ scoreboard });
    } else {
      console.log("Innings not found or no totalRuns available");
      return res.status(404).json({ error: "Innings not found or no totalRuns available" });
    }

  } catch (error) {
    console.error("Error updating scorecard:", error);
    return res.status(500).json({ error: "Failed to update scorecard" });
  }
}