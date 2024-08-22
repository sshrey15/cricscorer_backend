import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

//PLAYER SUGNUP ************************************************************************************************
export async function signup_players(req, res, next) {
  try {
    const { name, email, password, battingHand, bowlingStyle, role } = req.body;
    console.log("req.body: ", req.body);
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    }
    console.log("email is valid");
    if (!validator.isLength(password, { min: 8 })) {
      return res
        .status(400)
        .json({ error: "Password must be atleast 8 characters" });
    }
    console.log("password is atleast 8 characters");
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    console.log("password is required");
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("passwordHash: ", passwordHash);
    console.log("before_existing_player");
    const existing_player = await prisma.player.findUnique({
      where: {
        email,
      },
    });
    console.log("existing_player: ", existing_player);
    if (existing_player) {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.log("before_create");

    try {
      const player = await prisma.player.create({
        data: {
          name,
          email,
          password: passwordHash,
          battingHand,
          bowlingStyle,
          role,
        },
      });
      console.log("player: ", player);

      return res.status(200).json({ player });
    } catch (error) {
      console.error("Error creating player: ", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

//PLAYER LOGIN ************************************************************************************************
export async function login_players(req, res) {
  try {
    const { email, password } = req.body;
    console.log("data inside player_login: ", email, password);
    if (!email) {
      return res.status(400).json({ error: "email id requierd" });
    }
    const existing_player = await prisma.player.findUnique({
      where: { email },
    });
    console.log("existing_player: ", existing_player);
    if (!existing_player) {
      return res.status(400).json({ error: "Player not found" });
    }
    const passwordisValid = await bcrypt.compare(
      password,
      existing_player.password
    );
    if (!passwordisValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    console.log("before_token");
    try {
      if (!process.env.JWT_SECRET) {
        throw new error("JWT_SECRET not found");
      }
      const token = jwt.sign(
        {
          id: existing_player.id,
          email: existing_player.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      console.log("player_token: ", token);
      res.cookie("playerCookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 86400000,
      });
      const response = res.status(200).json({ token });
      console.log("response: ", response);
    } catch (err) {
      return res.status(500).json({ error: "something went  wrong" });
    }
  } catch (err) {
    return res.status(500).json({ error: "something went wrong" });
  }
}

//SCORER SIGNUP ************************************************************************************************
export async function createScorer(req, res) {
  try {
    const { firstname, lastname, email, password } = req.body;
    console.log("inside createScorer");
    console.log("req.body: ", req.body);
    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Invalid email" });
    } else {
      console.log("email is valid");
    }
    if (!validator.isLength(password, { min: 8 })) {
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters" });
    } else {
      console.log("password is atleast 8 characters");
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    } else {
      console.log("password is required");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const existingScorer = await prisma.scorer.findUnique({
      where: {
        email,
      },
    });
    console.log("existingScorer: ", existingScorer);

    if (existingScorer) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const scorer = await prisma.scorer.create({
      data: {
        firstname,
        lastname,
        email,
        password: passwordHash,
      },
    });
    console.log("scorer: ", scorer);
    return res.status(200).json({ scorer });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}

//SCORER LOGIN ************************************************************************************************
export async function loginScorer(req, res) {
  try {
    const { email, password } = req.body;
    console.log("data inside scorer_login: ", email, password);
    if (!email) {
      return res.status(400).json({ error: "email id requierd" });
    }

    const existingScorer = await prisma.scorer.findUnique({
      where: { email },
    });

    console.log("existingScorer: ", existingScorer);

    if (!existingScorer) {
      return res.status(400).json({ error: "Scorer not found" });
    }

    const passwordisValid = await bcrypt.compare(
      password,
      existingScorer.password
    );

    if (!passwordisValid) {
      return res.status(400).json({ error: "Invalid password" });
    }
    console.log("before_token");
    try {
      if (!process.env.JWT_SECRET) {
        throw new error("JWT_SECRET not found");
      }
      const token = jwt.sign(
        {
          id: existingScorer.id,
          email: existingScorer.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      console.log("scorer_token: ", token);

      res.cookie("scorerCookie", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 86400000,
        path: "/",
      });
      const response = res.status(200).json({ token });
      console.log("response: ", response);
    } catch (err) {
      return res.status(500).json({ error: "something went  wrong" });
    }

    // console.log("scorer_token: ", token)

    return response;
  } catch (err) {
    return res.status(500).json({ error: "something went wrong" });
  }
}

//SCORER LOGOUT ************************************************************************************************
export async function logoutScorer(req, res) {
  try {
    const response = res.status(200).json({ message: "Logged out", token: "" });
    response.cookies.set({
      name: "scorerCookie",
      value: "",
      options: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0,
        path: "/",
      },
    });
    return response;
  } catch (err) {
    return res.status(500).json({ error: "something went wrong" });
  }
}
