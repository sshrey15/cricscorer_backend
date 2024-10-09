import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// controllers/Innings.js
export async function createInnings(req, res, next) {
  console.log("createInnings function called");
  console.log("Request body: ", req.body);

  try {
    const {  inningsType, teamid_tosswon } = req.body;
    const cookie = req.cookies.matchCookie;
    console.log("cookie_data: ", cookie);


    if(!matchCookie || !matchCookieId){
      return res.status(400).json({error: "Match not created"});
    }

    let inningsNumber;

    if(inningsType === "Batting || batting  || Bat || BAT"){
      inningsNumber = 1;
    }else if(inningsType === "Bowling || bowling || Bowl || BOWL"){
      inningsNumber = 2;
    }else{
      return res.status(400).json({error: "Invalid innings type"});
    }

    const innings = await prisma.innings.create({
      data:{
        inningsNumber: inningsNumber,
        inningsType: inningsType,
        matchId: cookie.matchId,  
        teamId: teamid_tosswon
      }
    })

    const scoreCard = await prisma.scoreCard.create({
      data:{
        inningsId: innings.id,
        runs: 0,
        wickets: 0,
        overs: 0,
      }
    })


    const inningsCookie = {
      innings1Id: innings.id,
      scoreCard1Id: scoreCard.id
    }


    res.cookie("inningsCookie", JSON.stringify(inningsCookie),{
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000
    })

    return res.status(201).json({
      message: "Innings created successfully",
      innings: innings,
      scoreCard: scoreCard
    })

  } catch (error) {
    console.error("Error creating innings: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
