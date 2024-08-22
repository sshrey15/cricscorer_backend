import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function post_current_bowling_stats(req,res){
    const {inningsId, bowlerId,overNumber=0, runs = 0, wickets = 0, overs = 0.0, ballsBowled=0} = req.body;
    const current_bowling_stats = await prisma.currentBowlingStats.create({
        data:{
            inningsId: inningsId,
            bowlerId: bowlerId,
            overNumber: overNumber,
            runs: runs,
            wickets: wickets,
            overs: overs,
            ballsBowled: ballsBowled
        }
    })
    return res.status(200).json({current_bowling_stats});
}

export async function get_current_bowling_stats(req,res){
    const current_bowling_stats = await prisma.currentBowlingStats.findMany();
    return res.status(200).json({current_bowling_stats});
}

export async function get_current_bowling_stats_by_inningsId(req,res){
    const {inningsId} = req.params;
    const current_bowling_stats = await prisma.currentBowlingStats.findMany({
        where:{
            inningsId: parseInt(inningsId)
        }
    })
    return res.status(200).json({current_bowling_stats});s
}

export async function update_current_bowling_stats(req,res){
    const { bowlerId, runs, wickets, overs, ballsBowled,overNumber,wide,noBall } = req.body;

    let updateData = {};
    if (runs !== undefined) updateData.runs = runs;
    if (wickets !== undefined) updateData.wickets = wickets;
    if (overs !== undefined) updateData.overs = overs;
    if (wide !== undefined) updateData.wide = wide;
    if (noBall !== undefined) updateData.noBall = noBall;
    if (ballsBowled !== undefined && !wide && !noBall) {
        updateData.ballsBowled = (ballsBowled % 6) + 1;
        if (updateData.ballsBowled === 6) {
            updateData.overs = Math.floor(overs) +1; //current overs
            updateData.ballsBowled = 0;
            updateData.overNumber = (overNumber || 0) + 1;
        }else{
            updateData.overs = Math.floor(overs) + (ballsBowled % 6) / 10; // increment the decimal part
        
        }
    }
    if (overNumber !== undefined) updateData.overNumber = overNumber;

    const current_bowling_stats = await prisma.currentBowlingStats.update({
        where: {
            id: bowlerId
        },
        data: updateData
    });
    return res.status(200).json({current_bowling_stats});
    
}

