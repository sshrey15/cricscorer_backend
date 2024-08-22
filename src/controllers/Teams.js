
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export async function addTeams(req, res, next) {
    try {
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