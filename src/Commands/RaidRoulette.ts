import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { nameRaids, imageRaids } from "../Modules/ComposantString";
import { createButton } from "../Modules/ComposantdButton";

export const command: SlashCommand = {
    name: "roulette",
    data: new SlashCommandBuilder()
        .setName("roulette")
        .setDescription("Sélectionne un raid au hasard"),

    execute: async (interaction) => {

            const roulette = Math.floor(Math.random()* 8)

            const result = nameRaids[roulette]
            const image = imageRaids[roulette]

            const embed = new EmbedBuilder()
            .setColor("#FF00D8")
            .setTitle(`Le Raid tiré au sort est :\n__${result}__`)
            .setDescription(`<@${interaction.user.id}> à lancer la roulette des raids`)
            .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`)
            .setImage(`${image}`)

                const button:any = await createButton([{
                    CustomId: "refresh",
                    Label: "🔄 Relancer 🔄",
                    Style: 2,
                },{
                    CustomId: "delete",
                    Label: "🗑 Supprimez la roulette 🗑",
                    Style: 4,
                }])

            interaction.reply({embeds: [embed], components:[button], fetchReply:true})
    }
}