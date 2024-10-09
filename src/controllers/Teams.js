
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export async function delete_all(req, res, next){
    try{
        await prisma.team.deleteMany();
        return res.status(200).json({message: "All teams deleted"});
    }catch(err){
        next(err);
        return res.status(500).json({error: err});
    }
}

export async function get_team(req,res,next){
    try{
        const {roomId} = req.body;
        const team = await prisma.team.findUnique({
            where:{
                roomId: roomId
            }
        })
        return res.status(200).json({team})

    }catch(err){
        next(err);
        return res.status(500).json({error: err});
    }
}


export async function addTeams(req, res, next) {
    try {
        // creating a team by addding name, roomId and roompassword
        const { name, roomId, roompassword } = req.body;
        const team = await prisma.team.create({
            data: {

                name: name,
                roomId: roomId,
                roompassword: roompassword

            }
        });
        console.log("data is insside")
        console.log(team)
        return res.status(200).json({ team });
    } catch (err) {
        next(err);
    }
}

export async function getTeams(req, res, next){
    try {
        const teams = await prisma.team.findMany({
            select: {
                id: true,
                name: true,
                roomId: true,
                roompassword: true
            }
            
        })
        return res.status(200).json({ teams });
    } catch (err) {
        next(err);
    }
}