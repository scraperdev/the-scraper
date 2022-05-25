function getPerms(perms) {
  var permsArray = [];
  if (perms & 0x0000000000000008) {
    permsArray.push("administrator");
  }
  if (perms & 0x0000000000000010) {
    permsArray.push("manage_channels");
  }
  if (perms & 0x0000000000000020) {
    permsArray.push("manage_guild");
  }
  if (perms & 0x0000000000002000) {
    permsArray.push("manage_messages");
  }
  if (perms & 0x0000000000000002) {
    permsArray.push("kick_members");
  }
  if (perms & 0x0000000000000004) {
    permsArray.push("ban_members");
  }
  if (perms & 0x0000000010000000) {
    permsArray.push("manage_roles");
  }

  if (permsArray.length == 0) {
    return false;
  }
  return permsArray;
}

module.exports = { getPerms };
