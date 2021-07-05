/**
 * Discord Welcome bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { Permissions } = require("discord.js");
module.exports = {
    name: "play",
    aliases: ["joue"],
    //description: "Play music",
    args: true,
    guildOnly: true,
    usage: "[name]",
    cooldown: 5,
    category: "Music",
    async execute(message, args, guildDB, t) {
        const name = args.join(" ");
        const client = message.client;
        if (!name)
            return message.reply(t("cmds:play.missingSongName"));
        const voice = message.member.voice.channel;
        if (!voice)
            return message.reply(t("cmds:play.voiceNotJoined"));

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
            return message.reply(t("cmds:play.voiceChanDiff"));

        const botPerms = voice.permissionsFor(message.client.user);
        if (!botPerms.has(Permissions.FLAGS.CONNECT) || !botPerms.has(Permissions.FLAGS.SPEAK))
            return message.reply(t("errors:musicNoPerms", {permissions:`${t("permissions:CONNECT")}, ${t("permissions:SPEAK")}`}));

        const queue = client.player.createQueue(message.guild, {
            metadata: message
        });
        const song = await client.player.search(name, {
            requestedBy: message.author
        });
        try {
            await queue.connect(message.member.voice.channel);
        } catch(e) {return;}
        queue.addTrack(song.tracks[0]);
        queue.play();
    },
};
