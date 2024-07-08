const { Events } = require("discord.js");

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    if (newState.channelId === null) {
      console.log(
        newState.member.user.tag + ` has left ${oldState.channel.name}`
      );
    } else if (oldState.channelId === null) {
      console.log(
        newState.member.user.tag + ` has joined ${newState.channel.name}`
      );
    }
  },
};
