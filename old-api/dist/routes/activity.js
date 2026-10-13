"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const winston_1 = __importDefault(require("winston"));
exports.default = (client, app, USER_ID) => {
    const router = express_1.default.Router();
    const updateGuildStatus = async () => {
        try {
            const guildStatus = [];
            for (const guild of client.guilds.cache.values()) {
                try {
                    const member = await guild.members.fetch(USER_ID).catch((err) => {
                        winston_1.default.warn(`Failed to fetch member ${USER_ID} in guild ${guild.id}: ${err.message}`);
                        return null;
                    });
                    if (member) {
                        const activities = member.presence?.activities.map((activity) => ({
                            name: activity.name,
                            type: activity.type,
                            details: activity.details ?? null,
                            state: activity.state ?? null,
                            startTimestamp: activity.timestamps?.start?.getTime(),
                            endTimestamp: activity.timestamps?.end?.getTime(),
                            largeImageURL: activity.assets?.largeImageURL() ?? null,
                            largeText: activity.assets?.largeText ?? null,
                            smallImageURL: activity.assets?.smallImageURL() ?? null,
                            smallText: activity.assets?.smallText ?? null,
                            partyId: activity.party?.id ?? undefined,
                            partySize: activity.party?.size ?? undefined,
                            partyMax: Array.isArray(activity.party?.size)
                                ? activity.party?.size[1]
                                : undefined,
                            syncId: activity.syncId ?? undefined,
                            sessionId: activity.sessionId ?? undefined,
                            flags: activity.flags?.toArray() ?? [],
                        })) || [];
                        guildStatus.push({
                            guildId: guild.id,
                            discordstatus: member.presence?.status || "offline",
                            activities,
                        });
                    }
                }
                catch (err) {
                    if (err instanceof Error) {
                        winston_1.default.error(`Error processing guild ${guild.id}: ${err.message}`);
                    }
                    else {
                        winston_1.default.error("An unknown error occurred");
                    }
                }
            }
            app.set("guildStatus", guildStatus);
        }
        catch (err) {
            if (err instanceof Error) {
                winston_1.default.error(`Failed to update guild status: ${err.message}`);
            }
            else {
                winston_1.default.error("An unknown error occurred");
            }
        }
    };
    updateGuildStatus();
    setInterval(updateGuildStatus, 5 * 1000);
    router.get("/", async (req, res) => {
        try {
            res.json(app.get("guildStatus"));
        }
        catch (err) {
            if (err instanceof Error) {
                winston_1.default.error(`Error handling request to '/': ${err.message}`);
                res.status(500).json({ error: "Internal Server Error" });
            }
            else {
                winston_1.default.error("An unknown error occurred");
                res.status(500).json({ error: "Internal Server Error" });
            }
        }
    });
    client.on("presenceUpdate", (oldPresence, newPresence) => {
        (async () => {
            try {
                const member = newPresence.member;
                if (member && member.id === USER_ID) {
                    const activities = newPresence.activities?.map((activity) => ({
                        name: activity.name,
                        type: activity.type,
                        details: activity.details ?? null,
                        state: activity.state ?? null,
                        startTimestamp: activity.timestamps?.start?.getTime(),
                        endTimestamp: activity.timestamps?.end?.getTime(),
                        largeImageURL: activity.assets?.largeImageURL() ?? null,
                        largeText: activity.assets?.largeText ?? null,
                        smallImageURL: activity.assets?.smallImageURL() ?? null,
                        smallText: activity.assets?.smallText ?? null,
                        partyId: activity.party?.id ?? undefined,
                        partySize: activity.party?.size ?? undefined,
                        partyMax: Array.isArray(activity.party?.size)
                            ? activity.party?.size[1]
                            : undefined,
                        syncId: activity.syncId ?? undefined,
                        sessionId: activity.sessionId ?? undefined,
                        flags: activity.flags?.toArray() ?? [],
                    })) ?? [];
                    const guildStatusIndex = app
                        .get("guildStatus")
                        .findIndex((status) => status.guildId === newPresence.guild?.id);
                    if (guildStatusIndex === -1) {
                        app.set("guildStatus", [
                            ...app.get("guildStatus"),
                            {
                                guildId: newPresence.guild?.id,
                                discordstatus: newPresence.status || "offline",
                                activities,
                            },
                        ]);
                    }
                    else {
                        app.get("guildStatus")[guildStatusIndex] = {
                            guildId: newPresence.guild?.id,
                            discordstatus: newPresence.status || "offline",
                            activities,
                        };
                    }
                }
            }
            catch (err) {
                if (err instanceof Error) {
                    winston_1.default.error(`Error updating presence for user ${USER_ID}: ${err.message}`);
                }
                else {
                    winston_1.default.error("An unknown error occurred");
                }
            }
        })();
    });
    return router;
};
