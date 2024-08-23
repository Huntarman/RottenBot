const { Sequelize } = require("sequelize");
require("dotenv").config();
// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: "localhost",
    port: 5433,
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;
