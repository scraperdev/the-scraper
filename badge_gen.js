// flags and their definitions
const Discord_Employee = 1; // 1 << 0
const Partnered_Server_Owner = 2; // 1 << 1
const HypeSquad_Events = 4; // 1 << 2
const Bug_Hunter_Level_1 = 8; // 1 << 3
const House_Bravery = 64; // 1 << 6
const House_Brilliance = 128; // 1 << 7
const House_Balance = 256; // 1 << 8
const Early_Supporter = 512; // 1 << 9
const Bug_Hunter_Level_2 = 16384; // 1 << 14
const Verified_Bot_Developer = 131072; // 1 << 17
const Certified_Moderator = 262144; // 1 << 18
const Active_Deveoper = 4194304; // 1 << 22
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
  if (flags & Certified_Moderator) {
    badges += emojis.Certified_Moderator;
  }
  if (flags & Active_Developer) {
    badges += emojis.Active_Developer;
  }
  if (badges == "" || flags == 32 || flags == 16) {
    badges = 0;
  }

  return badges;
}

module.exports = { getEmojis };
