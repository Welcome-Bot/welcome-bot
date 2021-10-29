/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { Embed } = require("../../classes");
module.exports = {
    name: "guildDelete",
    once: false,
    async execute(client, guild) {
        //Bot has been kicked or banned in a guild
        if (guild.available) await client.db.deleteGuild(guild.id);
        const bots = guild.available
            ? guild.members.cache.filter((m) => m.user.bot).size
            : null;
        const embed = new Embed({ color: "error", timestamp: true })
            .setTitle(`:x: Removed from "${guild?.name}"`)
            .setDescription(`${guild.id}`)
            .addField(
                "Info",
                guild.available
                    ? `Shard: ${guild?.shardId}\nOwner: <@${
                          guild?.ownerId
                      }>\nMembers: ${guild?.memberCount}\nHumams: ${Math.round(
                          (bots / guild?.memberCount) * 100
                      )}%`
                    : "No info available"
            );
        client.channels.cache
            .get(client.config.logsChannelId)
            .send({ embeds: [embed] });
        if (!guild.available) return;
        //For music
        const player = client.manager.players.get(guild.id);
        if (player && guild.id === player.guild) {
            player.destroy();
        }
        /*//Invite tracking
        if (client.invites.has(guild.id)) client.invites.delete(guild.id);*/
    },
};