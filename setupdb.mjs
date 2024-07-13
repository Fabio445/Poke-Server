import sequelize from "./src/config/db.js";
import "./src/models/Pokemon.js";

const initDb = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Il database è stato resettato e sincronizzato con successo!");
  } catch (error) {
    console.error("Errore durante la sincronizzazione del database:", error);
  }
};

initDb();
