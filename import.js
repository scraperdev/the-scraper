// some random script i wrote to import bby hits into the database

const fs = require("fs");

const path = "../pass/";

const files = fs.readdirSync(path);

var count = 0;

// mysql
const con = require("./db.js");

files.forEach((file) => {
  if (file.startsWith("passwords")) {
    console.log("Found: " + file);
    const text = fs.readFileSync(path + "/" + file, "utf8");
    const lines = text.split("\n");
    lines.forEach((line) => {
      var username = line.match(/(?<= \| USERNAME: )(.*)(?= \| PASSWORD: )/gm);
      var password = line.match(/(?<= \| PASSWORD: )(.*)/gm);
      var domain = line.match(/(?<=URL: )(.*)(?= \| USERNAME)/gm);
      // if the line isnt empty
      if (username && password && domain) {
        console.log(username[0] + ":" + password[0] + ":" + domain[0]);
        con.query(
          "INSERT INTO `combos` (`domain`, `username`, `password`) VALUES (?, ?, ?)",
          [domain[0], username[0], password[0]],
          (err, result) => {
            (err, result) => {
              // ignore dup entry
              if (err && err.code == "ER_DUP_ENTRY") {
                console.log(
                  "Duplicate entry: " + username + ":" + password + ":" + domain
                );
                return;
              }
              console.log("Inserted combo: " + username + ":" + password);
            };
          }
        );
        count++;
      }
    });
  }
});

console.log("Found " + count + " passwords");
