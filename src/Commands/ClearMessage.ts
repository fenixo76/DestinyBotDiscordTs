import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

export const command: SlashCommand = {
    name: "clear",
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Suprimer touts les messages (Admin Uniquement)")
        .addIntegerOption((option) => {
            return option
                .setName("nombre")
                .setDescription("nombre de message")
                .setRequired(true)
        })
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    execute: async (interaction) => {
        const count: any = interaction.options.data[0].value

        if (isNaN(count) || count <= 0 || count > 100) {
            interaction.reply({ content: "le nombre doit etre entre 1 et 100", fetchReply: true, ephemeral: true })
        } else {
            const messages = await interaction.channel?.messages.fetch({ limit: count + 1 })
            messages?.forEach(async (message) => {
                message.delete();
            })
            interaction.reply({ content: "Message en cour de supresion", fetchReply: true, ephemeral: true })
        }

    }
}