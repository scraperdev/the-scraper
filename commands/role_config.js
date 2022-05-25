const { SlashCommandBuilder } = require("@discordjs/builders");

const conn = require("../db.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role_config")
    .setDescription("Configure your guild's roles.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role to configure.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The type of role to assign the role to.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const type = interaction.options.getString("type");

    console.log(role.id);

    const valid_types = ["billing", "boosts", "hqguild", "nitro"];

    if (!valid_types.includes(type)) {
      interaction.reply({
        content: "Invalid type. Valid types are: " + valid_types.join(", "),
      });
      return;
    }

    // prob an sqli here but idc
    conn.query(
      `UPDATE guilds SET ${type}_role = ? WHERE guild_id = ?`,
      [role.id, interaction.guild.id],
      (err, result) => {
        if (err) {
          console.log(err);
          interaction.reply({
            content: "Error.",
          });
        } else {
          console.log(result);
          interaction.reply({
            content: "Role configured.",
          });
        }
      }
    );
  },
};
