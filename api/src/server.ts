import express from "express";
import cors from "cors";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";
import winston from "winston";
import morgan from "morgan";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const BOT_TOKEN = process.env.BOT_TOKEN!;
const API_PORT = 4000;
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

  const activityRoute = await import("./routes/activity");
  const contactRoute = await import("./routes/contact");

  app.get("/", (_req, res) => {
    res.json({ status: "ok", message: "API is running" });
  });

  app.use("/activity", activityRoute.default(client, app, USER_ID));
  app.use("/contact", contactRoute.default);

  app.listen(API_PORT, () => {
    logger.info(`API is listening on port ${API_PORT}`);
    logger.info(`API URL: http://localhost:${API_PORT}`);
  });
});

client.login(BOT_TOKEN).catch((err) => {
  logger.error(`Failed to login: ${err.message}`);
});
