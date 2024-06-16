import express from "express";
import { createPokemon } from "../controllers/pokemon.controller.js";

const router = express.Router();

router.get("/create", createPokemon);

export default router;
