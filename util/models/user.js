const { Sequelize, DataTypes, Model } = require("sequelize");
const sequelize = require("../sequelize");

class User extends Model {}

User.init(
  {
    user_id: { type: DataTypes.STRING, primaryKey: true },
    user_name: { type: DataTypes.STRING },
    join_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    jackpots: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    sequelize,
    timestamps: false,
    modelName: "User",
    tableName: "users",
  }
);

// User.hasMany(GuildUserProfile, {
//   foreignKey: "user_id",
//   sourceKey: "user_id",
//   as: "user_interactions",
// });
// GuildUserProfile.belongsTo(User, {
//   foreignKey: "user_id",
//   targetKey: "user_id",
//   as: "user",
// });
module.exports = User;
