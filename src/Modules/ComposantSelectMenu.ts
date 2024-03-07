import { EmbedBuilder, Message } from "discord.js";
import { imagesUrls } from "./ComposantString";
import { createButton } from "./ComposantdButton";

const userMessage: any[] = [];

export function userInteractionCommand(interaction: any) {
    if (userMessage.length <= 2) {
        userMessage.length = 0;
    }
    const optionDate = interaction.options.data[0].value;
    const optionHeur = interaction.options.data[0].value;
    const optionMinute = interaction.options.data[0].value;

    userMessage.push({ optionDate, optionHeur, optionMinute });
}

export async function userSelectMenuInteraction(interaction: any) {
    if (userMessage[0]?.optionDate) {
        const embed = new EmbedBuilder()
            .setColor("#FF00D8")
            .setTitle(`Qui veut faire  ${interaction.values[0]}` + `\n🗓 ${userMessage[0].optionDate.charAt(0).toUpperCase() + userMessage[0].optionDate.slice(1, 999).toLowerCase()} a ${userMessage[0].optionHeur} Heure ${userMessage[0].optionMinute}`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`)
            .setDescription("<@&804813354493280276> Pour voter, veuillez appuyer sur les emojis.")
            .setFields(
                { name: "Votez avec 👍", value: "Pour (oui)", inline: true },
                { name: "Votez avec 👎", value: "Pour (Non)", inline: true }
            )

        if (interaction.user.avatar === null) {
            embed.setAuthor({ name: `${interaction.user.globalName}`, iconURL: "https://discord.com/assets/3c6ccb83716d1e4fb91d3082f6b21d77.png" })
        } else {
            embed.setAuthor({ name: `${interaction.user.globalName}`, iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}` })
        }

        userMessage.length = 0

        for (const optionName in imagesUrls) {
            if (interaction.values[0] === `__${optionName}__`) {
                embed.setImage(imagesUrls[optionName]);
                break;
            }
        }

        if (interaction.user.id != interaction.message.interaction?.user.id) {
            await interaction.reply({ content: "⚠️ Tu n'es pas l'auteur de ce sondage ⚠️", fetchReply: true, ephemeral: true })
        } else {

            const button:any = await createButton([
                {
                CustomId: "delete",
                Label:"🗑 Supprimez le sondage 🗑",
                Style: 4,
            }
        ])

            const message: Message = await interaction.update({ content: "", embeds: [embed], components: [button], fetchReply: true });
            message.react("👍")
            message.react("👎")
        }
    } else {
        interaction.message.delete();
    }
}