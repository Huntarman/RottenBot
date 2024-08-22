const User = require("./user");
const Guild = require("./guild");
const GuildUserProfile = require("./guildUserProfile");

User.hasMany(GuildUserProfile, {
  foreignKey: "user_id",
  sourceKey: "user_id",
  as: "guild_profiles",
});

GuildUserProfile.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "user_id",
  as: "user",
});

Guild.hasMany(GuildUserProfile, {
  foreignKey: "guild_id",
  sourceKey: "guild_id",
  as: "user_profiles",
});

GuildUserProfile.belongsTo(Guild, {
  foreignKey: "guild_id",
  targetKey: "guild_id",
  as: "guilds",
});

module.exports = {
  User,
  Guild,
  GuildUserProfile,
};
