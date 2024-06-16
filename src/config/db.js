import { Sequelize } from "sequelize";

const sequelize = new Sequelize("PokeKollect", "root", "root", {
  dialect: "mysql",
  host: "localhost",
  port: 3307,
});

export default sequelize;
