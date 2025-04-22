const express = require("express");
const logger = require("winston");

module.exports = (client, app, USER_ID) => {
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
                        const activities =
                            member.presence?.activities.map((activity) => ({
                                name: activity.name,
                                type: activity.type,
                                details: activity.details,
                                state: activity.state,
                                startTimestamp: activity.timestamps?.start,
                                endTimestamp: activity.timestamps?.end,
                                largeImageURL: activity.assets?.largeImageURL(),
                                largeText: activity.assets?.largeText,
                                smallImageURL: activity.assets?.smallImageURL(),
                                smallText: activity.assets?.smallText,
                                partyId: activity.party?.id,
                                partySize: activity.party?.size,
                                partyMax: activity.party?.max,
                                syncId: activity.syncId,
                                sessionId: activity.sessionId,
                                flags: activity.flags?.toArray(),
                            })) || [];
                        guildStatus.push({
                            guildId: guild.id,
                            discordstatus: member.presence?.status || "offline",
                            activities,
                        });
                    }
                } catch (err) {
                    logger.error(`Error processing guild ${guild.id}: ${err.message}`);
                }
            }
            app.set("guildStatus", guildStatus);
        } catch (err) {
            logger.error(`Failed to update guild status: ${err.message}`);
        }
    };

    updateGuildStatus();
    setInterval(updateGuildStatus, 5 * 1000);

    router.get("/", async (req, res) => {
        try {
            res.json(app.get("guildStatus"));
        } catch (err) {
            logger.error(`Error handling request to '/': ${err.message}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    return router;
};
