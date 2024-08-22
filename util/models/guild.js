const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");

class Guild extends Model {}

Guild.init(
  {
    guild_id: { type: DataTypes.STRING, primaryKey: true },
    guild_name: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "Guild",
    tableName: "guilds",
  }
);

module.exports = Guild;
