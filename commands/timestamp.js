const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timestamp")
    .setDescription("Converts a discord ID to a timestamp.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID to convert.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user =
      interaction.user.username + "#" + interaction.user.discriminator;
    const number = interaction.options.getString("id");
    console.log("Converting ID " + number + " for: " + user);

    let id = parseInt(number);

    let binary = id.toString(2);
    binary = binary.padStart(64, "0");

    let excerpt = binary.substring(0, 42);

    let decimal = parseInt(excerpt, 2);

    let unix = parseInt(decimal) + 1420070400000;

    const date = new Date(unix);
    const timestamp = date.toLocaleString();

    await interaction.reply({
      content: "ID: `" + id + "` Created at: " + timestamp,
      ephemeral: true,
    });
  },
};
