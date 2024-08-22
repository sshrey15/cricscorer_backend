import jwt from "jsonwebtoken";


export function authenticateToken(req,res,next){
    const token = req.cookies.scorerCookie;

    if(!token){
        return res.status(401).json({error: "Acces Denied"})

    }

    try{
        const decoded   = jwt.verify(token, process.env.JWT_SECRET);
        req.scorer = decoded;
        next();
    }catch(err){
        return res.status(403).json({error: "Invalid Token"});
    }
}


export function protected_route(req,res,next){
   res.status(200).json({message: "Protected Route"});
}