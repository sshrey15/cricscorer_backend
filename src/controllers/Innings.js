
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function post_innings(res,req){
    const {matchId,inningsNumber, inningsType, teamId} = req.body;
    const innings = await prisma.innings.create({
        data:{
            matchId: matchId,
            inningsNumber: inningsNumber,
            inningsType: inningsType,
            teamId: teamId
        }
    })
    return res.send(200).json({innings});
}

export async  function get_innings(req,res){
    const innings = await prisma.innings.findMany();
    return res.status(200).json({innings});
}

export async function get_innings_by_matchId(req,res){
    const {matchId} = req.params;
    const innings = await prisma.innings.findMany({
        where:{
            matchId: parseInt(matchId)
        }
    })
    return res.status(200).json({innings});
}

export async function get_innings_by_teamId(req,res){
    const {teamId} = req.params;
    const innings = await prisma.innings.findMany({
        where:{
            teamId: parseInt(teamId)
        }
    })
    return res.status(200).json({innings});
}

export async function get_innings_by_matchId_and_teamId(req,res){
    const {matchId,teamId} = req.params;
    const innings = await prisma.innings.findMany({
        where:{
            matchId: parseInt(matchId),
            teamId: parseInt(teamId)
        }
    })
    return res.status(200).json({innings});
}