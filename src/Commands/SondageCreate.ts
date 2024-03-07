import { EmbedBuilder, Message, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { matches } from "../Modules/ComposantString";
import { createButton } from "../Modules/ComposantdButton";

export const command: SlashCommand = {
    name: "sondage",
    data: new SlashCommandBuilder()
        .setName("sondage")
        .setDescription("Crée ton propre sondage")
        .addStringOption((option_1) => {
            return option_1
                .setName("titre")
                .setDescription("Crée un titre pour ton sondage")
                .setRequired(true)
        })
        .addStringOption((option_4) => {
            return option_4
                .setName("reponse01")
                .setDescription("Ajoutez une valeur pour votre emoji, par exemple : Oui / Raid / Non")
                .setRequired(true)
        })
        .addStringOption((option_5) => {
            return option_5
                .setName("reponse02")
                .setDescription("Ajoutez une valeur pour votre emoji, par exemple : Oui / Raid / Non")
                .setRequired(true)
        })
        .addStringOption((option_6) => {
            return option_6
                .setName("reponse03")
                .setDescription("Ajoutez une valeur pour votre emoji, par exemple : Oui / Raid / Non")
                .setRequired(false)
        }),

    execute: async (interaction) => {

        const datas = interaction.options.data

        const embed = new EmbedBuilder()
            .setColor("#FF00D8")
            .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`)
            .setDescription("<@&804813354493280276> Pour voter, veuillez appuyer sur les emojis.")
            .addFields(
                { name: "Votez avec 🟢", value: `Pour (${datas[1].value})`, inline: true },
                { name: "Votez avec 🔴", value: `Pour (${datas[2].value})`, inline: true }
            )
        if (datas[3]) {
            embed.addFields(
                { name: "Votez avec 🟣", value: `Pour (${datas[3].value})`, inline: false }
            )
        }

        if (typeof datas[0].value === "string") {
            const valueLower = datas[0].value.toLowerCase();
            for (const match of matches) {
                if (match.keywords.some(keyword => valueLower.includes(keyword))) {
                    embed.setImage(match.image);
                    break;
                }
            }
            embed.setTitle(`${valueLower.charAt(0).toUpperCase() + valueLower.slice(1)}`);
        } else {
            embed.setTitle(`${datas[0].value}`);
        }

        const button: any = await createButton([
            {
                CustomId: "delete",
                Label: "🗑 Supprimez le sondage 🗑",
                Style: 4,
            }
        ])

        try {
            const message: Message = await interaction.reply({ embeds: [embed], components: [button], fetchReply: true });
            await message.react("🟢");
            await message.react("🔴");
        
            if (datas[3]) {
                await message.react("🟣");
            }
        } catch {
           return
        }
        
    }
}