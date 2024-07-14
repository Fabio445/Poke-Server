import express from "express";
import { createPokemon } from "../controllers/pokemon.controller.js";
import { getPokemon } from "../controllers/pokemon.controller.js";
import { getRandomPokemon } from "../controllers/pokemon.controller.js";
import { getRandomPokemons } from "../controllers/pokemon.controller.js";
const router = express.Router();

router.get("/create", createPokemon);
router.get("/", getPokemon);
router.get("/random", getRandomPokemon);
router.get("/randoms", getRandomPokemons);
export default router;
