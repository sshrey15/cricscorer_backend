// Importing required modules
import express from "express";
import cookieParser from "cookie-parser";
import matchesRouter from "./routes/matches.js";
import scorerAuthRouter from "./routes/scorerAuth.js";
import playerAuthRouter from "./routes/playerAuth.js";
import inningsRouter from "./routes/innings.js"

// Constants
const port = 8000;

const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});

// Route handlers
app.use("/api/v1", matchesRouter);
app.use("/api/v1/innings", inningsRouter); 
app.use("/api/v1/scorer_auth", scorerAuthRouter); // scorer_authentication
app.use("/api/v1/player_auth", playerAuthRouter);

// Root route for testing
app.get("/", (req, res) => {
  res.send("CRICSCORER");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});