import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

export const command: SlashCommand = {
    name: "avatar",
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Changez L'avatar du Bot en GIF animé")
        .addAttachmentOption(option => option.setName('avatar').setDescription("change d'avatar").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    execute: async (interaction) => {

        interaction.deferReply({ ephemeral: true })

        const avatar: any = interaction.options.data[0]

        async function sendMessage(message: string) {
            const embed = new EmbedBuilder()
                .setColor("#FF00D8")
                .setDescription(message)

            await interaction.editReply({ embeds: [embed] })
        }

        if (avatar.attachment?.contentType !== "image/gif") return await sendMessage("⚠️ Utilisez un GIF dont la taille ne dépasse pas 10 Mo et qui a un format ne dépassant pas 1024px sur 1024px")

        var error

        await interaction.client.user.setAvatar(avatar.attachment?.url).catch(async err => {
            error = true
            console.log(err)
            return await sendMessage(`⚠️ Erreur : ${err.toString()}`)
        })

        if (error) return

        await sendMessage("👍 Avatar changé avec succès !")
    }
}