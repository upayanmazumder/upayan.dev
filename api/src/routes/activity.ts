import express, { Application, Request, Response } from "express";
import { Client, Presence } from "discord.js";
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
                partyMax: Array.isArray(activity.party?.size)
                  ? activity.party?.size[1]
                  : undefined,
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
        } catch (err: unknown) {
          if (err instanceof Error) {
            logger.error(`Error processing guild ${guild.id}: ${err.message}`);
          } else {
            logger.error("An unknown error occurred");
          }
        }
      }
      app.set("guildStatus", guildStatus);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`Failed to update guild status: ${err.message}`);
      } else {
        logger.error("An unknown error occurred");
      }
    }
  };

  updateGuildStatus();
  setInterval(updateGuildStatus, 5 * 1000);

  router.get("/", async (req: Request, res: Response) => {
    try {
      res.json(app.get("guildStatus"));
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(`Error handling request to '/': ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        logger.error("An unknown error occurred");
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });

  client.on("presenceUpdate", (oldPresence, newPresence) => {
    (async () => {
      try {
        const member = newPresence.member;
        if (member && member.id === USER_ID) {
          const activities: ActivityInfo[] =
            newPresence.activities?.map((activity) => ({
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
              sessionId: (activity as any).sessionId ?? undefined,
              flags: activity.flags?.toArray() ?? [],
            })) ?? [];

          const guildStatusIndex = app
            .get("guildStatus")
            .findIndex(
              (status: { guildId: string | undefined }) =>
                status.guildId === newPresence.guild?.id
            );
          if (guildStatusIndex === -1) {
            app.set("guildStatus", [
              ...app.get("guildStatus"),
              {
                guildId: newPresence.guild?.id,
                discordstatus: newPresence.status || "offline",
                activities,
              },
            ]);
          } else {
            app.get("guildStatus")[guildStatusIndex] = {
              guildId: newPresence.guild?.id,
              discordstatus: newPresence.status || "offline",
              activities,
            };
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          logger.error(
            `Error updating presence for user ${USER_ID}: ${err.message}`
          );
        } else {
          logger.error("An unknown error occurred");
        }
      }
    })();
  });

  return router;
};
