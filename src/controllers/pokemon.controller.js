import Pokedex from "pokedex-promise-v2";
import Pokemon from "../models/Pokemon.js";
import sequelize from "../config/db.js";

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
    const abilities = pokemon.abilities
      .map((ability) => ability.ability.name)
      .join(", ");
    const stats = pokemon.stats
      .map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
      .join(", ");
    const weight = pokemon.weight;
    const height = pokemon.height;
    const image = pokemon.sprites.front_default || "";
    return {
      name: pokemon.name,
      type: types,
      abilities: abilities,
      stats: stats,
      weight: weight,
      height: height,
      image: image,
    };
  } catch (error) {
    console.error(`Error fetching details for ${name}:`, error);
    return {
      name: name,
      type: "unknown",
      abilities: "unknown",
      stats: "unknown",
      weight: 0,
      height: 0,
      image: "",
    };
  }
}

export async function savePokemonData(pokemonData) {
  try {
    for (const pokemon of pokemonData) {
      const details = await getPokemonDetails(pokemon.name);
      await Pokemon.findOrCreate({
        where: { name: details.name },
        defaults: {
          type: details.type || "unknown",
          abilities: details.abilities || "unknown",
          stats: details.stats || "unknown",
          weight: details.weight || 0,
          height: details.height || 0,
          image: details.image || "",
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
    const response = await P.getPokemonsList({ nolimit: true });
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

export const getPokemonById = async (req, res) => {
  try {
    const { id } = req.params;
    const pokemon = await Pokemon.findByPk(id);
    if (pokemon) {
      res.json(pokemon);
    } else {
      res.status(404).json({ error: "Pokemon not found" });
    }
  } catch (error) {
    console.error("Failed to retrieve Pokemon:", error);
    res.status(500).json({ error: "Failed to retrieve Pokemon" });
  }
};

export const getRandomPokemon = async (req, res) => {
  try {
    const randomPokemon = await Pokemon.findOne({
      order: sequelize.random(),
    });
    res.json(randomPokemon);
  } catch (error) {
    console.error("Failed to retrieve random Pokémon:", error);
    res.status(500).json({ error: "Failed to retrieve random Pokémon" });
  }
};

export const getRandomPokemons = async (req, res) => {
  try {
    const randomPokemons = await Pokemon.findAll({
      order: sequelize.random(),
      limit: 24,
    });
    res.json(randomPokemons);
  } catch (error) {
    console.error("Failed to retrieve random Pokémon:", error);
    res.status(500).json({ error: "Failed to retrieve random Pokémon" });
  }
};
