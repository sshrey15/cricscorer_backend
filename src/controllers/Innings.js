
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// controllers/Innings.js
export async function createInnings(req, res, next) {
  console.log("createInnings function called");
  console.log("Request body: ", req.body);

 
  try {
    const { inningsNumber, inningsType, teamid_tosswon } = req.body;
    const cookie = req.cookies.matchCookie;
    console.log("cookie_data: ", cookie);
  
    if (!inningsNumber || !inningsType) {
      return res.status(400).json({ error: "All fields are required" });
    }

    
  


    // Your logic to create innings
    return res.status(201).json({ message: "Innings created successfully" });
  } catch (error) {
    console.error("Error creating innings: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}