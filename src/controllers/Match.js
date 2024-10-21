import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createMatch(req, res,next) {
  console.log("created_match function called")
  console.log("Request body: ", req.body);
  
  const { team1RoomId, team1Password, team2RoomId, team2Password } = req.body;
  console.log("Request body: ", req.body);


  if (!team1RoomId || !team1Password || !team2RoomId || !team2Password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const team1 = await prisma.team.findUnique({
      where: {
        roomId: team1RoomId,
      },
    });
    console.log("team1_mkc", team1)
    if (!team1 || team1.roompassword !== team1Password) {
      console.log("Team1 not found with roomID: ", team1RoomId);  
      return res.status(400).json({ error: "Invalid team1 credentials" });
    }
    const team2 = await prisma.team.findUnique({
      where: {
        roomId: team2RoomId,
      },
    });
    if (!team2 || team2.roompassword !== team2Password) {
      return res.status(400).json({ error: "Invalid team2 credentials" });
    }

    const match = await prisma.match.create({
      data: {
        team1Id: team1.id,
        team2Id: team2.id,
      },
    });

    res.cookie("matchCookie", { 
      matchId: match.id,
      team1Id: match.team1Id,
      team2Id: match.team2Id,
     }, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      maxAge: 24 * 60 * 60 * 1000,
    });
    const cookie_data = req.cookies.matchCookie;

    return res.status(200).json({ message: "Match created successfully", match, cookie_data });
  } catch (err) {
    console.log("Error has occurred: ", err);
    return res.status(500).json({ error: "Something went wrong", err });
  }
}


export async function getAllMatches(req, res, next) {
  try {
    const matches = await prisma.match.findMany({
      select: {
        id: true,
        team1Id: true,
        team2Id: true,
        overs: true,
        createdAt: true,
        innings: {
          select: {
            id: true,
            inningsNumber: true,
            inningsType: true,
            totalRuns: true,
            createdAt: true
          }
        }
      }
    });
    return res.status(200).json({ matches });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong", err });
  }
}