const { SlashCommandBuilder } = require("@discordjs/builders");

const conn = require("../db.js");

const owner = require("../config.json").owner;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unauthorize")
    .setDescription("Removes a guilds permission to use the bot.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the guild to unauthorize.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const id = interaction.options.getString("id");
    if (!interaction.user.id === owner) {
      interaction.reply({
        content: ":x: You are not authorized to use this command.",
      });
      return;
    }
    conn.query(
      `UPDATE guilds SET authorized = 0 WHERE guild_id = ?`,
      [id],
      (err, result) => {
        if (err) {
          console.log(err);
          interaction.reply({
            content: "Error.",
          });
        } else {
          interaction.reply({
            content: "Guild unauthorized.",
          });
        }
      }
    );
  },
};
