import express, { Application, Request, Response } from "express";
import { Client } from "discord.js";
import logger from "winston";
import { ActivityInfo } from "../types";

export default (client: Client, app: Application, USER_ID: string) => {
    const router = express.Router();

    const updateGuildStatus = async () => {
        try {
            const guildStatus = [];
            for (const guild of client.guilds.cache.values()) {
                try {
                    const member = await guild.members.fetch(USER_ID).catch((err) => {
                        logger.warn(
                            `Failed to fetch member ${USER_ID} in guild ${guild.id}: ${err.message}`
                        );
                        return null;
                    });
                    if (member) {
                        const activities: ActivityInfo[] =
                            member.presence?.activities.map((activity) => ({
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
                                partyMax: Array.isArray(activity.party?.size) ? activity.party?.size[1] : undefined,
                                syncId: activity.syncId ?? undefined,
                                sessionId: (activity as any).sessionId ?? undefined,
                                flags: activity.flags?.toArray() ?? [],
                            })) || [];

                        guildStatus.push({
                            guildId: guild.id,
                            discordstatus: member.presence?.status || "offline",
                            activities,
                        });
                    }
                } catch (err: any) {
                    logger.error(`Error processing guild ${guild.id}: ${err.message}`);
                }
            }
            app.set("guildStatus", guildStatus);
        } catch (err: any) {
            logger.error(`Failed to update guild status: ${err.message}`);
        }
    };

    updateGuildStatus();
    setInterval(updateGuildStatus, 5 * 1000);

    router.get("/", async (req: Request, res: Response) => {
        try {
            res.json(app.get("guildStatus"));
        } catch (err: any) {
            logger.error(`Error handling request to '/': ${err.message}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    return router;
};
