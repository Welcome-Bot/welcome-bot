/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
const { Permissions } = require("discord.js");
const updateGuild = require("../../db/functions/guild/updateGuild");
const { Embed, Command } = require("../../classes");
module.exports = class CMD extends Command {
    constructor(client) {
        super(
            {
                name: "enable",
                memberPerms: [Permissions.FLAGS.MANAGE_GUILD],
                botPerms: [],
                requirements: {
                    args: true,
                    guildOnly: true,
                },
                usage: "[command name]",
                disabled: false,
                cooldown: 10,
                category: "Setup",
            },
            client
        );
    }

    async execute({ message, args, guildDB }, t) { //eslint-disable-line no-unused-vars
        args[0] = args[0] ? args[0] : "";
        let { disabled } = guildDB;
        const cmd = this.client.commands.enabled.find(
            (cmd) => cmd.name === args[0].toLowerCase()
        );
        if (!cmd) {
            return message.reply(t("errors:commandNotFound"));
        }
        const index = disabled.indexOf(cmd.name);
        if (index > -1) {
            disabled.splice(index, 1);
        } else {
            return message.reply(t("cmds:enable.notDisabled"));
        }
        updateGuild(message.guild.id, "disabled", disabled);
        return message.reply(t("cmds:enable.done"));
    }
};
