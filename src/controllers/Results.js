import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();


export async function create_result(req, res, next) {
    try {
      const { winnerId } = req.body;
      const { matchCookie } = req.cookies;
  
      if (!matchCookie || !matchCookie.matchId) {
        return res.status(400).json({ error: "Match ID not found in cookies" });
      }
  
      const matchId = matchCookie.matchId;
  
      // Your logic to create a result using matchId and winnerId
      const result = await prisma.result.create({
        data: {
          matchId: matchId,
          winnerId: winnerId,
        },
      });
  
      return res.status(200).json({ message: "Result created successfully", result });
    } catch (err) {
      next(err);
      return res.status(500).json({ error: err });
    }
  }