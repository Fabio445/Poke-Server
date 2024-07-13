import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Pokemon = sequelize.define("Pokemon", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  abilities: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  stats: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  height: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  weight: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default Pokemon;
