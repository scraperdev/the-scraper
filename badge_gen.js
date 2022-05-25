// flags and their definitions
const Discord_Employee = 1;
const Partnered_Server_Owner = 2;
const HypeSquad_Events = 4;
const Bug_Hunter_Level_1 = 8;
const House_Bravery = 64;
const House_Brilliance = 128;
const House_Balance = 256;
const Early_Supporter = 512;
const Bug_Hunter_Level_2 = 16384;
const Verified_Bot_Developer = 131072;
// emojis to represent flags
const { emojis } = require("./emojis.js");

function getEmojis(flags) {
  // calculate the flags
  let badges = "";
  // there is 100% a better way to do this, but I'm too lazy to figure it out
  if (flags & Discord_Employee) {
    badges += emojis.Discord_Employee_Emoji;
  }
  if (flags & Partnered_Server_Owner) {
    badges += emojis.Partnered_Server_Owner_Emoji;
  }
  if (flags & HypeSquad_Events) {
    badges += emojis.HypeSquad_Events_Emoji;
  }
  if (flags & Bug_Hunter_Level_1) {
    badges += emojis.Bug_Hunter_Level_1_Emoji;
  }
  if (flags & House_Bravery) {
    badges += emojis.House_Bravery_Emoji;
  }
  if (flags & House_Brilliance) {
    badges += emojis.House_Brilliance_Emoji;
  }
  if (flags & House_Balance) {
    badges += emojis.House_Balance_Emoji;
  }
  if (flags & Early_Supporter) {
    badges += emojis.Early_Supporter_Emoji;
  }
  if (flags & Bug_Hunter_Level_2) {
    badges += emojis.Bug_Hunter_Level_2_Emoji;
  }
  if (flags & Verified_Bot_Developer) {
    badges += emojis.Verified_Bot_Developer_Emoji;
  }
  if (badges == "" || flags == 32 || flags == 16) {
    badges = 0;
  }

  return badges;
}

module.exports = { getEmojis };
