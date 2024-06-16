import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./config/db.js";
import pokemonRoutes from "./routes/pokemon.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/pokemon", pokemonRoutes);
app.use("/api/auth", authRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );

    sequelize.sync().then(() => {
      app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
      });
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});
