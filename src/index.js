
import express from "express";
import cookieParser from "cookie-parser";
import matchesRouter from "./routes/matches.js";
import scorerAuthRouter from "./routes/scorerAuth.js";
import playerAuthRouter from "./routes/playerAuth.js";
import inningsRouter from "./routes/innings.js";
import scoreboardRouter from "./routes/scoreboard.js";



const port = 8000;

const app = express();


app.use(express.json());
app.use(cookieParser());


app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});


app.use("/api/v1", matchesRouter);
app.use("/api/v1/innings", inningsRouter); 
app.use("/api/v1/scorer_auth", scorerAuthRouter); // scorer_authentication
app.use("/api/v1/player_auth", playerAuthRouter);

app.use("/api/v1", scoreboardRouter);




app.get("/", (req, res) => {
  res.send("CRICSCORER");
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});