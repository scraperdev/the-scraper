const fs = require("node:fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { token } = require("./config.json");
const config = require("./config.json");

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(`Loaded command: ${command.data.name}`);
  commands.push(command.data.toJSON());
}
const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationCommands(config.clientId), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
