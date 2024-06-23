import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const signUp = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ error: "An error occurred during sign up" });
  }
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Both username and password are required" });
  }

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({
      error: "An error occurred during sign in",
      details: error.message,
    });
  }
};
