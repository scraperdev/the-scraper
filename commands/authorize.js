const { SlashCommandBuilder } = require("@discordjs/builders");

const conn = require("../db.js");
const owner = require("../config.json").owner;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("authorize")
    .setDescription("Authorizes a guild to use the bot.")
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("The ID of the guild to authorize.")
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
      `INSERT INTO guilds (guild_id, authorized) VALUES (?, 1) ON DUPLICATE KEY UPDATE authorized = 1`,
      [id],
      (err, result) => {
        if (err) {
          console.log(err);
          interaction.reply({
            content: "Error.",
          });
        } else {
          interaction.reply({
            content: "Guild authorized.",
          });
        }
      }
    );
  },
};
