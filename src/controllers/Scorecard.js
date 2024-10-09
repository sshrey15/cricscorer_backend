import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function patch_scorecard(req, res) {
  const { runs, wickets } = req.body; // Extract wickets from the request body
  const cookie = req.cookies.inningsCookie;

  if (!cookie || !cookie.innings1Id) {
    return res.status(400).json({ error: "Innings not created" });
  }

  const inningsId = cookie.innings1Id;
  console.log("innings_id: ", inningsId);

  try {
    const currentBowlingStats = await prisma.currentBowlingStats.findMany({
      where: {
        inningsId: inningsId,
      },
    });

    const totalBallsBowled = currentBowlingStats.reduce((total, stats) => total + stats.ballsBowled, 0);
    console.log("totalballsbowled: ", totalBallsBowled);

    const innings = await prisma.innings.findUnique({
      where: {
        id: inningsId
      },
      include: {
        totalRuns: true // Include related ScoreCard records
      }
    });
    
    if (innings && innings.totalRuns.length > 0) {
      const scorecardId = innings.totalRuns[0].id; // Access the first element's id
      console.log("Scorecard ID: ", scorecardId);
    
      // Check if the scorecard record exists
      const existingScorecard = await prisma.scoreCard.findUnique({
        where: {
          id: scorecardId,
        },
      });
      console.log("existingscorecard: ", existingScorecard);
    
      if (!existingScorecard) {
        return res.status(404).json({ error: "Scorecard not found" });
      }
    
      let updateData = {};
      if (runs !== undefined) updateData.runs = existingScorecard.runs + runs;
      if (wickets !== undefined) updateData.wickets = existingScorecard.wickets + wickets; // Update wickets
    
      // Update current bowling stats and calculate overs
      for (const stats of currentBowlingStats) {
        const newBallsBowled = stats.ballsBowled + 1;
        const newOvers = Math.floor(newBallsBowled / 6) + (newBallsBowled % 6) * 0.1;
        
        await prisma.currentBowlingStats.update({
          where: {
            id: stats.id,
          },
          data: {
            ballsBowled: newBallsBowled,
            overs: newOvers,
          },
        });

        // Update overs in updateData
        updateData.overs = newOvers;
      }
    
      // Update the scorecard
      const updatedScorecard = await prisma.scoreCard.update({
        where: {
          id: scorecardId,
        },
        data: updateData,
      });
      console.log("updatedScorecard: ", updatedScorecard);
    
      // Define and update the scoreboard
      const scoreboard = {
        id: updatedScorecard.id,
        runs: updatedScorecard.runs,
        overs: updatedScorecard.overs,
        wickets: updatedScorecard.wickets, // Include wickets in the scoreboard
        // Add other necessary fields
      };
    
      // Set the updated scoreboard in the cookie
      res.cookie("scorecardCookie", JSON.stringify(scoreboard), {
        httpOnly: true, // Accessible only by the web server
        secure: true, // Send only over HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
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