const { SlashCommandBuilder } = require("@discordjs/builders");

// this command is a joke but i am going to leave it here

module.exports = {
  data: new SlashCommandBuilder()
    .setName("agree")
    .setDescription("Agree to a message"),
  async execute(interaction) {
    const user =
      interaction.user.username + "#" + interaction.user.discriminator;
    console.log("Agreeing to message for: " + user);
    await interaction.channel.send("^^");
    await interaction.reply({
      content: ":thumbsup:",
      ephemeral: true,
    });
  },
};
