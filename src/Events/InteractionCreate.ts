import { Events, Interaction } from "discord.js"
import { BotEvent } from "../types";
import { buttonInteraction } from "../Modules/ComposantdButton";
import { userInteractionCommand, userSelectMenuInteraction } from "../Modules/ComposantSelectMenu";
import { getToken } from "../Bungie/Api";
import { autorizationCode } from "../Bungie/App";

const event: BotEvent = {
    name: Events.InteractionCreate,
    once: false,
    async execute(interaction: Interaction) {

        if (interaction.isChatInputCommand()) {
            if (interaction.commandName === "activité") {
                await userInteractionCommand(interaction);
            }
            if (interaction.commandName === "connexion") {
                const message = interaction
                const userId = interaction.user.id
                setTimeout(() => {
                    getToken(autorizationCode, userId, message)
                }, 30000)
            }
        }

        if (interaction.isStringSelectMenu()) {
            await userSelectMenuInteraction(interaction)
        }

        if (interaction.isButton()) {
            await buttonInteraction(interaction)
        }

        // ! IMPORTANT !
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.SlashCommands.get(interaction.commandName);

        if (!command) return;

        await command.execute(interaction);
        // ! IMPORTANT !
    }
}

export default event;