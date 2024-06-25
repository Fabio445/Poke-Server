import express from "express";
import { createPokemon } from "../controllers/pokemon.controller.js";
import { getPokemon } from "../controllers/pokemon.controller.js";
const router = express.Router();

router.get("/create", createPokemon);
router.get("/", getPokemon);
export default router;
