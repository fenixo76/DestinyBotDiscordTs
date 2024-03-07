import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { getUrl, DestinyComponentType, bungie } from "../Bungie/Api";
import manifest from "../Bungie/Manifest";

export const command: SlashCommand = {
    name: "stats",
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Permet de voir les statistiques de ta dernière partie. (SOLO)")
        .addSubcommand(subcommand => subcommand.setName("titan").setDescription("Permet de voir toute les statistiques de ta dernière partie avec le Titan."))
        .addSubcommand(subcommand => subcommand.setName("chasseur").setDescription("Permet de voir toute les statistiques de ta dernière partie avec le chasseur."))
        .addSubcommand(subcommand => subcommand.setName("arcaniste").setDescription("Permet de voir toute les statistiques de ta dernière partie avec le arcaniste.")),

    execute: async (interaction) => {
        
        await interaction.deferReply({ ephemeral: false  });

        let characteriD:any
        
        const nameCommande = interaction.options.data[0].name

        if(nameCommande === "titan"){
            characteriD = 0
        }else if(nameCommande === "chasseur"){
            characteriD = 1
        }else if(nameCommande === "arcaniste"){
            characteriD = 2
        }

        const activityUrl = await getUrl(interaction.user.id, DestinyComponentType.ActivityUrl, interaction, characteriD);

        if(activityUrl) {
            const activity = activityUrl.activities[0]
            const checkActivity = activity.activityDetails.modes[0]

            const manifestActivity = await manifest.t(activity.activityDetails.directorActivityHash)

            const nameActivity = manifestActivity.displayProperties.name
            const descriptionActivity = manifestActivity.displayProperties.description

            let icon = ""

            if(manifestActivity.displayProperties.hasIcon === false) {
                icon = `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
            } else if (manifestActivity.displayProperties.hasIcon === true) {
                icon = `https://www.bungie.net/${manifestActivity.displayProperties.icon}`
            }

            let standings = ""
            let score = ""

            const embed = new EmbedBuilder()
            .setTitle(nameActivity + " \n" + `Temps : ${activity.values.activityDurationSeconds.basic.displayValue}`)
            .setDescription(`${descriptionActivity} \n\n ${standings}\n󠀠󠀠\n`)
            .setThumbnail(icon)
            .setColor("#FF00D8")

            if(!activity.values.standing){
                embed.setDescription(`${descriptionActivity}\n\n`)
            }

            if(checkActivity === 7) { // All Pve
                if(activity.values.standing){
                    if(activity.values.standing.basic.value === 1) {
                        standings = "☠️ Vous avez perdu ☠️"
                    } else if (activity.values.standing.basic.value === 0) {
                        standings = "🏆 Vous avez gagné. 🏆"
                    }
                } else {
                    standings = ""
                }

                if(manifestActivity.activityTypeHash === 3497767639) {
                    embed.setDescription(`Exploration sur ${nameActivity} `)
                }
            
                score = ""

                embed.setFields(
                    {name: "Stats de l'activiter :", value: `Assist : ${activity.values.assists.basic.displayValue}\nKills : ${activity.values.kills.basic.displayValue}\nAdversaires vaincue : ${activity.values.opponentsDefeated.basic.displayValue}\n Morts : ${activity.values.deaths.basic.displayValue}\nRatio : ${activity.values.killsDeathsRatio.basic.displayValue}` , inline: true}
                    )

            } else if (checkActivity === 64) { // Gambit

                if(activity.values.standing){
                    if(activity.values.standing.basic.value === 1) {
                        standings = "☠️ Vous avez perdu ☠️"
                    } else if (activity.values.standing.basic.value === 0) {
                        standings = "🏆 Vous avez gagné. 🏆"
                    }
                } else {
                    standings = ""
                }
            
                score = `**Particule déposée : ** ${activity.values.score.basic.displayValue}`
            
                embed.setFields(
                    {name: "Stats de l'activiter :", value: `${score}\nAssist : ${activity.values.assists.basic.displayValue}\nKills : ${activity.values.kills.basic.displayValue}\nAdversaires vaincue : ${activity.values.opponentsDefeated.basic.displayValue}\n Morts : ${activity.values.deaths.basic.displayValue}\nRatio : ${activity.values.killsDeathsRatio.basic.displayValue}` , inline: true}
                    )

            } else if (checkActivity === 5) { // Pvp

                if(activity.values.standing){
                    if(activity.values.standing.basic.value === 1) {
                        standings = "☠️ Vous avez perdu ☠️"
                    } else if (activity.values.standing.basic.value === 0) {
                        standings = "🏆 Vous avez gagné. 🏆"
                    }
                } else {
                    standings = ""
                }

                embed.setFields(
                    {name: "Stats de l'activiter :", value: `Assist : ${activity.values.assists.basic.displayValue}\nKills : ${activity.values.kills.basic.displayValue}\nAdversaires vaincue : ${activity.values.opponentsDefeated.basic.displayValue}\n Morts : ${activity.values.deaths.basic.displayValue}\nRatio : ${activity.values.killsDeathsRatio.basic.displayValue}` , inline: true}
                    )
            }

            interaction.editReply({embeds: [embed]})

            }
            
        }
}