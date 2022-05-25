const { SlashCommandBuilder } = require("@discordjs/builders");

const con = require("../db.js");

const { comboLookup } = require("../logs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("combos")
    .setDescription("Get's combos from the database.")
    .addStringOption((option) =>
      option
        .setName("domain")
        .setDescription("The domain to search for.")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("combolist")
        .setDescription(
          "When enabled it will generate the combos in username:password format."
        )
        .setRequired(false)
    ),

  async execute(interaction) {
    const username = interaction.user.username;
    const discriminator = interaction.user.discriminator;
    const user = username + "#" + discriminator;

    const domain = interaction.options.getString("domain");
    const combolist = interaction.options.getBoolean("combolist");

    comboLookup(user, domain);
    console.log("Finding combos for: " + domain + " for: " + user);
    // find the any domain that contains the domain
    con.query(
      `SELECT * FROM combos WHERE domain LIKE '%${domain}%' AND guildId = ?`,
      [interaction.guild.id],
      (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
          // make username:password
          let combos = "";
          if (combolist) {
            combos = result.map(
              (combo) => combo.username + ":" + combo.password
            );
          } else {
            combos = result.map(
              (combo) =>
                "URL: " +
                combo.domain +
                "\nUsername: " +
                combo.username +
                "\nPassword: " +
                combo.password +
                "\n"
            );
          }

          combos = combos.join("\n");
          interaction.reply({
            files: [
              {
                attachment: Buffer.from(combos),
                name: "combos.txt",
              },
            ],
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: ":x: No combos found.",
            ephemeral: true,
          });
        }
      }
    );
  },
};
