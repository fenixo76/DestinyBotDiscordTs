import { ActivityType, Client, Events, PresenceStatusData } from "discord.js"
import { BotEvent } from "../types";

const event: BotEvent = {
    name: Events.ClientReady,
    once: true,
    execute(client: Client) {
        console.log(`${client.user?.tag} Connecté !`);
        client.user?.setPresence({
            activities: [{
                type: ActivityType.Listening,
                name: "L'API Destiny 2",
                state: "Je communique avec l'API de Destiny 2",
            }],
            status: "online" as PresenceStatusData
        });
    }
}

export default event;