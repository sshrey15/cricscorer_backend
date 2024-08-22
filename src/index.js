// Importing required modules
import express from "express";
import cookieParser from "cookie-parser";
import matchesRouter from "./routes/matches.js";
import scorerAuthRouter from "./routes/scorerAuth.js";
import playerAuthRouter from "./routes/playerAuth.js";

// Constants
const port = 8000;

const app = express();


app.use(express.json());
app.use(cookieParser());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use("/api/v1", matchesRouter);
app.use("/api/v1/scorer_auth", scorerAuthRouter);
app.use("/api/v1/player_auth", playerAuthRouter);

app.get("/", (req, res) => {
  res.send("CRICSCORER");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
