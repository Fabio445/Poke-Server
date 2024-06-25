import Pokedex from "pokedex-promise-v2";
import Pokemon from "../models/Pokemon.js";

const P = new Pokedex({
  protocol: "https",
  hostName: "pokeapi.co",
  versionPath: "/api/v2/",
  cacheLimit: 100 * 1000,
  timeout: 5 * 1000,
});

async function getPokemonDetails(name) {
  try {
    const pokemon = await P.getPokemonByName(name);
    const types = pokemon.types.map((type) => type.type.name).join(", ");
    const image = pokemon.sprites.front_default;
    return { type: types, image };
  } catch (error) {
    console.error(`Error fetching details for ${name}:`, error);
    return { type: "unknown", image: "" };
  }
}

export async function savePokemonData(pokemonData) {
  try {
    for (const pokemon of pokemonData) {
      const { type, image } = await getPokemonDetails(pokemon.name);
      await Pokemon.findOrCreate({
        where: { name: pokemon.name },
        defaults: {
          type: type || "unknown",
          description: "",
          image: image || "",
        },
      });
    }
    console.log("Pokemon data saved successfully");
  } catch (error) {
    console.error("Error saving Pokemon data:", error);
  }
}

export async function createPokemon(req, res) {
  try {
    const response = await P.getPokemonsList({ limit: 100 });
    const pokemonData = response.results;
    await savePokemonData(pokemonData);
    res.status(201).json({ message: "Pokémon data saved successfully" });
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
    res.status(500).json({
      error: "An error occurred while fetching Pokemon data",
      details: error.message,
    });
  }
}

export const getPokemon = async (req, res) => {
  try {
    const pokemon = await Pokemon.findAll();
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve pokemon" });
  }
};
