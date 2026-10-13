"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const winston_1 = __importDefault(require("winston"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const activity_1 = __importDefault(require("./routes/activity"));
const contact_1 = __importDefault(require("./routes/contact"));
const devjourney_1 = __importDefault(require("./routes/devjourney"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const BOT_TOKEN = process.env.BOT_TOKEN;
const API_PORT = 4000;
const USER_ID = "1240025366853193758";
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)),
    transports: [new winston_1.default.transports.Console(), new winston_1.default.transports.File({ filename: "app.log" })],
});
// Allow the production frontend and Vercel preview deployments; anything
// else is rejected. Previously `cors()` with no options allowed every
// origin unconditionally.
const allowedOrigins = [
    "https://upayan.dev",
    "http://localhost:3000", // local frontend dev
];
const vercelPreviewPattern = /^https:\/\/[a-z0-9-]+\.vercel\.app$/;
function corsOriginCheck(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || vercelPreviewPattern.test(origin)) {
        callback(null, true);
        return;
    }
    callback(new Error(`Origin not allowed: ${origin}`));
}
const client = new discord_js_1.Client({
    intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.GuildPresences],
    partials: [discord_js_1.Partials.GuildMember],
});
/**
 * The HTTP server no longer waits on Discord login. /contact and
 * /devjourney have nothing to do with Discord and were previously
 * unreachable whenever the bot failed or was slow to connect; /activity
 * degrades gracefully (empty array) until the bot is ready and starts
 * populating `guildStatus`.
 */
function startServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: corsOriginCheck }));
    app.use(express_1.default.json());
    app.use((0, morgan_1.default)("combined", {
        stream: { write: (message) => logger.info(message.trim()) },
    }));
    app.set("guildStatus", []);
    app.get("/", (_req, res) => {
        res.json({ status: "ok", message: "API is running", discordReady: client.isReady() });
    });
    app.use("/activity", (0, activity_1.default)(client, app, USER_ID));
    app.use("/contact", contact_1.default);
    app.use("/devjourney", devjourney_1.default);
    app.listen(API_PORT, () => {
        logger.info(`API is listening on port ${API_PORT}`);
        logger.info(`API URL: http://localhost:${API_PORT}`);
    });
}
client.once("ready", () => {
    logger.info(`Logged in as ${client.user?.tag}`);
});
client.login(BOT_TOKEN).catch((err) => {
    logger.error(`Failed to login to Discord: ${err.message} - /activity will report empty status`);
});
try {
    startServer();
}
catch (err) {
    logger.error(`Failed to start server: ${err instanceof Error ? err.message : "Unknown error"}`);
    process.exit(1);
}
