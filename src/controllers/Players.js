import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

export async function join_team(req, res, next) {
  const { roomId, roompassword } = req.body;
  const token = req.cookies.playerCookie;

  let playerId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace 'your_secret_key' with your actual secret key
    console.log("decoded: ", decoded);
    playerId = decoded.id;
    console.log("playerId: ", playerId);
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }

  try {
    const team = await prisma.team.findUnique({
      where: {
        roomId,
      },
    });

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }

    if (team.roompassword !== roompassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const player = await prisma.player.findUnique({
      where: {
        id: playerId,
      },
    });
    console.log("player: ", player);

    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }

    const updatedPlayer = await prisma.player.update({
      where: {
        id: playerId,
      },
      data: {
        teamId: team.id,
      },
    });

    return res.status(200).json({
      message: "Player successfully joined the team",
      player: updatedPlayer,
    });
  } catch (err) {
    console.log("Error has occurred: ", err);
    return res.status(500).json({ error: "Something went wrong", err });
  }
}
