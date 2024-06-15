import express from "express";
import cors from "cors";
import { Sequelize, DataTypes } from "sequelize";
import Pokedex from "pokedex-promise-v2";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

const sequelize = new Sequelize("PokeKollect", "root", "root", {
  dialect: "mysql",
  host: "localhost",
  port: 3307, // Assicurati che il tuo MySQL sia in ascolto sulla porta 3307
});

// Definizione del modello Pokemon
const Pokemon = sequelize.define("Pokemon", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Imposta il nome del Pokémon come unico
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
});

// Opzioni per l'API Pokedex
const options = {
  protocol: "https",
  hostName: "pokeapi.co",
  versionPath: "/api/v2/",
  cacheLimit: 100 * 1000, // 100s
  timeout: 5 * 1000, // 5s
};
const P = new Pokedex(options);

// Funzione per ottenere i dettagli del Pokémon (tipo e immagine)
async function getPokemonDetails(name) {
  try {
    const pokemon = await P.getPokemonByName(name);
    const types = pokemon.types.map((type) => type.type.name).join(", ");
    const image = pokemon.sprites.front_default;
    return { type: types, image };
  } catch (error) {
    console.error(`Error fetching details for ${name}:`, error);
    return { type: "unknown", image: "" }; // Ritorna valori di default in caso di errore
  }
}

// Funzione per salvare i dati dei Pokémon nel database
async function savePokemonData(pokemonData) {
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

// Route per ottenere i dati dei Pokémon dall'API Pokedex e salvarli nel database
app.get("/api/CreatePokemon", async (req, res) => {
  try {
    const response = await P.getPokemonsList({ nolimit: true });
    const pokemonData = response.results;

    await savePokemonData(pokemonData);

    // Recupera tutti i Pokémon salvati nel database
    const pokemons = await Pokemon.findAll();
    res.json(pokemons);
  } catch (error) {
    console.error("Error fetching Pokemon data:", error);
    res.status(500).json({
      error: "An error occurred while fetching Pokemon data",
      details: error.message,
    });
  }
});

// Verifica la connessione al database prima di avviare il server
sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );

    // Sincronizza il modello con il database e avvia il server Express
    Pokemon.sync().then(() => {
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Gestione delle eccezioni globali
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Puoi aggiungere log o altre operazioni di gestione degli errori qui
});
