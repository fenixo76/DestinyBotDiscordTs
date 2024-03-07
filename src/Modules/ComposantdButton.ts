import { ActionRowBuilder, ButtonBuilder } from "discord.js";
import { ButtonData } from "../types";
import { imageRaids, nameRaids, string } from "./ComposantString";
import { ActionButtonNext, ActionButtonPrevious } from "./ComposantEmbedPages";

export const createButton = async (buttonData: ButtonData | ButtonData[]): Promise<ActionRowBuilder> => {
    const buttons = [];

    if (Array.isArray(buttonData)) {
        for (const data of buttonData) {
            const { CustomId, Label, Style } = data;

            const button = new ButtonBuilder()
                .setCustomId(CustomId)
                .setLabel(Label)
                .setStyle(Style);

            buttons.push(button);
        }
    } else {
        const { CustomId, Label, Style } = buttonData;

        const button = new ButtonBuilder()
            .setCustomId(CustomId)
            .setLabel(Label)
            .setStyle(Style);

        buttons.push(button);
    }

    const row = new ActionRowBuilder().addComponents(...buttons);

    return row;
};

export const buttonInteraction = async (interaction: any) => {

    if (interaction.customId === "delete") {
        if (interaction.message.interaction?.user.id === interaction.member?.user.id) {
            interaction.message.delete()
        } else {
            interaction.message.channel.send({ content: string[0] })
        }
    }

    if (interaction.customId === "refresh") {
        const roulette = Math.floor(Math.random() * 8)

        const result = nameRaids[roulette]
        const image = imageRaids[roulette]

        const embed = interaction.message.embeds[0].data
        embed.title = `Le Raid tiré au sort est :\n${result}`
        embed.description = `<@${interaction.user.id}> à relancer la roulette des raids`
        embed.image.url = image

        interaction.update({ embeds: [embed] })
    }

    if (interaction.customId === "Suivant"){
        ActionButtonNext(interaction)
    }
    
    if (interaction.customId === "Précédant"){
        ActionButtonPrevious(interaction)
    }
}