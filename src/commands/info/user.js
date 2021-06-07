/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
module.exports = {
    name: "user",
    aliases: ["whois"],
    description:
        "Get information about a user. It will show your info if no user was mentioned",
    args: false,
    usage: "(@mention)",
    execute(message, args) {
        const { MessageEmbed } = require("discord.js");
        const getUserFromMention = require("../../functions/getUserFromMention.js");
        const getUserFlags = require("../../functions/getUserFlags.js");
        const user = getUserFromMention(
            args[0] || `${message.author}`,
            message.client
        );
        let badges;
        getUserFlags(user).then(b => { badges = b; }).catch(err => { console.log(err) });
        //Covert badges to images markdown
        let badgesMD = [];
        for (var i = 0; i < badges.length; i++) {
            badgesMD.push(`![${badges[i].id}](${badges[i].url}`);
        }
        let msg = new MessageEmbed();
        msg.setTitle(`${user.tag}`);
        msg.setDescription(`Information about ${args[0] || message.author}`);
        msg.setThumbnail(`${user.avatarURL()}`);
        msg.addField("ID:", `\`\`\`\n${user.id}\n\`\`\``);
        msg.addField("Avatar URL:", `[url](${user.avatarURL()})`);
        msg.addField("Badges:", badgesMD.join(" "));
        msg.addField(
            "Joined:",
            `Joined discord at *${user.createdAt}*\n\nJoined **${message.guild.name}** server at *${message.member.joinedAt}*`
        );
        //https://discord.js.org/#/docs/main/stable/class/User?scrollTo=presence
        msg.addField("Presence:", `${user.presence.status}`);
        message.channel.send(msg);
    },
};
