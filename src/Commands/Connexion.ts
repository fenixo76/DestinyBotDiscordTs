import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

export const command: SlashCommand = {
    name: "connexion",
    data: new SlashCommandBuilder()
        .setName("connexion")
        .setDescription("Connecte-toi au site Orphidia.fr pour avoir accès aux commandes Destiny du serveur."),

    execute: async (interaction) => {
        const embed = new EmbedBuilder()
            .setColor("#FF00D8")
            .setTitle("Connexion")
            .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`)
            .setDescription(`Connecte-toi au site : [Orphidia](https://www.bungie.net/en/OAuth/Authorize?response_type=code&client_id=${process.env.BUNGIE_OAUTH_CLIENT_ID}) Pour avoir accès aux commandes Destiny du serveur.\n\nVous avez 30 Seconde pour vous connecté`)

        interaction.reply({ embeds: [embed], fetchReply: true, ephemeral: true })
    }
}