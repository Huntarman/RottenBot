const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");
const User = require("./user");
const Guild = require("./guild");

class GuildUserProfile extends Model {}

GuildUserProfile.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    guild_id: {
      type: DataTypes.STRING,
      references: {
        model: Guild,
        key: "guild_id",
      },
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      references: {
        model: User,
        key: "user_id",
      },
      allowNull: false,
    },
    tokens: { type: DataTypes.INTEGER, defaultValue: 1000, allowNull: false },
    daily_bonus: { type: DataTypes.DATE, allowNull: true },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "GuildUserProfile",
    tableName: "guild_user_profiles",
  }
);

// GuildUserProfile.belongsTo(Guild, {
//   foreignKey: "guild_id",
//   targetKey: "guild_id",
//   as: "guild",
// });

// Guild.hasMany(GuildUserProfile, {
//   foreignKey: "guild_id",
//   sourceKey: "guild_id",
//   as: "guild_interactions",
// });

module.exports = GuildUserProfile;
