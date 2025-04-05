const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const dotenv = require("dotenv");
const winston = require("winston");
const morgan = require("morgan");

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;
const API_PORT = 3000;
const USER_ID = "1240025366853193758";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
        )
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "app.log" }),
    ],
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ],
    partials: [Partials.GuildMember],
});

client.once("ready", async () => {
    logger.info(`Logged in as ${client.user?.tag}`);

    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(
        morgan("combined", {
            stream: { write: (message) => logger.info(message.trim()) },
        })
    );

    app.set("guildStatus", []);

    app.use("/", require("./routes/main")(client, app, USER_ID));
    app.use("/contact", require("./routes/contact"));

    app.listen(API_PORT, () => {
        logger.info(`API is listening on port ${API_PORT}`);
    });
});

client.login(BOT_TOKEN).catch((err) => {
    logger.error(`Failed to login: ${err.message}`);
});
