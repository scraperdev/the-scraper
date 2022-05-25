const { MessageEmbed, WebhookClient } = require("discord.js");

const config = require("./config.json");

const webhook = new WebhookClient({
  url: config.webhookURL,
});

function tokenListGenerated(user, limit) {
  console.log(user);
  const embed = new MessageEmbed()
    .setTitle("Token List Generated")
    .setColor("#0099ff")
    .setDescription(
      `\`${user}\` has generated a token list with a limit of \`${limit}\``
    )
    .setTimestamp();
  webhook.send({
    embeds: [embed],
  });
}

function comboLookup(user, domain) {
  const embed = new MessageEmbed()
    .setTitle("Combo Lookup")
    .setColor("#0099ff")
    .setDescription(`\`${user}\` has looked up the combo for \`${domain}\``)
    .setTimestamp();
  webhook.send({
    embeds: [embed],
  });
}

function webhookCreated(user, webhookURL, id) {
  const embed = new MessageEmbed()
    .setTitle("Webhook Created")
    .setColor("#0099ff")
    .setDescription(
      `\`${user}\` has created a webhook with the URL \`${webhookURL}\` and resulted in the ID of \`${id}\``
    )
    .setTimestamp();
  webhook.send({
    embeds: [embed],
  });
}

module.exports = {
  tokenListGenerated,
  comboLookup,
  webhookCreated,
};
