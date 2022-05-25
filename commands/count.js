const { SlashCommandBuilder } = require("@discordjs/builders");

const con = require("../db.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("count")
    .setDescription("Get the count of stuff you have"),
  async execute(interaction) {
    const user =
      interaction.user.username + "#" + interaction.user.discriminator;
    console.log("Counting for: " + user);
    // shit code :skull:
    await interaction.reply({
      content:
        "Tokens: " +
        "`" +
        numberWithCommas(await getTokenCount(interaction.channel.guild.id)) +
        "`" +
        "\n" +
        "Combos: " +
        "`" +
        numberWithCommas(await getComboCount(interaction.channel.guild.id)) +
        "`",
    });
  },
};

function getComboCount(guild_id) {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT COUNT(*) AS count FROM combos WHERE guildId = ?",
      [guild_id],
      (err, result) => {
        if (err) throw err;
        resolve(result[0].count);
      }
    );
  });
}

function getTokenCount(guild_id) {
  return new Promise((resolve, reject) => {
    con.query(
      "SELECT COUNT(*) AS count FROM tokens WHERE guildId = ?",
      [guild_id],
      (err, result) => {
        if (err) throw err;
        resolve(result[0].count);
      }
    );
  });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
