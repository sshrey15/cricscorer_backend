import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function post_scorecard(req,res){
    const {team1Id, team2Id} = req.body
    const match =  await prisma.match.create({
        data:{
            team1Id: team1Id,
            team2Id: team2Id
        }
    })
    return res.status(200).json({match});
}

export async function get_matches(req,res){
    const matches = await prisma.match.findMany();
    return res.status(200).json({matches});
}

export async function get_match_by_id(req,res){
    const {matchId} = req.params;
    const match = await prisma.match.findUnique({
        where:{
            id: parseInt(matchId)
        }
    })
    return res.status(200).json({match});
}