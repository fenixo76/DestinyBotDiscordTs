import { EmbedBuilder } from "discord.js";

export let number = 0
export let page: any = []

export const resetPage = () => {
    page = []
    number = 0
}

export const embedPages = async (page: any = [{}]) => {
    const embed = new EmbedBuilder()
        .setColor("#FF00D8")
        .setTitle(page[number].title)
        .setFooter({ text: `Page ${page[number].id} sur ${page.length}` })

    if (page[number].description)
        embed.setDescription(page[number].description);
    if (page[number].thumbnail)
        embed.setThumbnail(page[number].thumbnail);
    if (page[number].fields)
        embed.setFields(page[number].fields);
    if (page[number].image)
        embed.setImage(page[number].image);

    return { embed }
}

export const ActionButtonNext = async (interaction:any) => {
    if (interaction.customId === "Suivant") {
        try {
            number++
            const result = await embedPages(page);
            interaction.update({ embeds: [result.embed] })
        } catch (err) {
            number = 0
            const result = await embedPages(page);
            interaction.update({ embeds: [result.embed] })
        }
    }
}

export const ActionButtonPrevious = async (interaction:any) => {
    if (interaction.customId === "Précédant") {
        number--
        if (number === -1) {
            number = 0
        }
        const result = await embedPages(page);
        interaction.update({ embeds: [result.embed] })
    }
}