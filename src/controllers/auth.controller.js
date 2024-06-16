import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Funzione per registrare un nuovo utente
export const signUp = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Controlla se l'utente esiste già
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuovo utente
    const user = await User.create({ username, password: hashedPassword });

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.id });
  } catch (error) {
    console.error("Error during sign up:", error);
    res.status(500).json({ error: "An error occurred during sign up" });
  }
};

// Funzione per effettuare il login
export const signIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Trova l'utente per username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Confronta la password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    // Genera un token JWT
    const token = jwt.sign({ userId: user.id }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error during sign in:", error);
    res.status(500).json({ error: "An error occurred during sign in" });
  }
};
