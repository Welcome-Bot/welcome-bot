/**
 * Discord Welcome-Bot
 * Copyright (c) 2021 The Welcome-Bot Team and Contributors
 * Licensed under Lesser General Public License v2.1 (LGPl-2.1 - https://opensource.org/licenses/lgpl-2.1.php)
 */
require("dotenv").config();
const fs = require("fs");
const express = require("express");
const session = require("express-session");

module.exports = (client) => {
    const app = express();
    app.use(express.urlencoded({ extended: true }))
        .use(express.json())
        //Set engine to html for embedded js template
        .engine("html", require("ejs").renderFile)
        .set("view engine", "ejs")
        //Set express session
        .use(
            session({
                secret: process.env.SESS_PASS,
                resave: false,
                saveUninitialized: false,
            })
        )
        //Adding new shortcuts by extending like a plugin
        .use(async (req, res, next) => {
            req.user = req.session.user;
            req.userDB = client.userDbFuncs.getUser(req.user.id);
        });

    const routesFolder = "./routes";
    const routesFiles = fs
        .readdirSync(routesFolder)
        .filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
        let f = file.replace(".js", "");
        if (f.indexOf("index") > -1) f = "/";
        else f = `/${f}`;
        try {
            app.use(f, require(`${routesFolder}/${f}`));
        } catch (e) {
            console.error(e);
        }
    }
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Running on port ${port}`);
    });
};
