import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { getUrl, DestinyComponentType, bungie } from "../Bungie/Api";
import manifest from "../Bungie/Manifest";

export const command: SlashCommand = {
    name: "game",
    data: new SlashCommandBuilder()
        .setName("game")
        .setDescription("Permet de voir les statistiques de ta dernière partie.")
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

            let defeteEquipe:any = []
            let victoireEquipe:any = []

            const response = await bungie.get(`Platform/Destiny2/Stats/PostGameCarnageReport/${activity.activityDetails.instanceId}/`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })

            const statsActivity = response.data.Response

            let standings = ""
            let score = ""

            for(let num = 0; num < statsActivity.entries.length; num++){

                const players = statsActivity.entries[num]

                const playersName = players.player.destinyUserInfo.bungieGlobalDisplayName

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

                    
                    victoireEquipe.push(`󠀠\n__**${playersName}**__\n**Asisst : ** ${players.values.assists.basic.displayValue}\n**Kills : ** ${players.values.kills.basic.displayValue}\n**Adversaires vaincue : ** ${players.values.opponentsDefeated.basic.displayValue}\n**Morts : ** ${players.values.deaths.basic.displayValue}\n**Ratio : ** ${players.values.killsDeathsRatio.basic.displayValue}`)
                    
                    score = ""
    
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

                    score = `**Particule déposée : ** ${players.score.basic.displayValue}`

                    if (players.standing === 1) {
                        defeteEquipe.push(`󠀠\n__**${playersName}**__\n${score}\n**Assist : ** ${players.values.assists.basic.displayValue}\n**Kills : ** ${players.values.kills.basic.displayValue}\n**Adversaires vaincue : ** ${players.values.opponentsDefeated.basic.displayValue}\n**Morts : ** ${players.values.deaths.basic.displayValue}\n**Ratio : ** ${players.values.killsDeathsRatio.basic.displayValue}`)
                    } else if (players.standing === 0) {
                        victoireEquipe.push(`󠀠\n__**${playersName}**__\n${score}\n**Assist : ** ${players.values.assists.basic.displayValue}\n**Kills : ** ${players.values.kills.basic.displayValue}\n**Adversaires vaincue : ** ${players.values.opponentsDefeated.basic.displayValue}\n**Morts : ** ${players.values.deaths.basic.displayValue}\n**Ratio : ** ${players.values.killsDeathsRatio.basic.displayValue}`)
                    }
    
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

                    if (players.standing === 1) {
                        defeteEquipe.push(`󠀠\n__**${playersName}**__\n**Asisst : ** ${players.values.assists.basic.displayValue}\n**Kills : ** ${players.values.kills.basic.displayValue}\n**Adversaires vaincue : ** ${players.values.opponentsDefeated.basic.displayValue}\n**Morts : ** ${players.values.deaths.basic.displayValue}\n**Ratio : ** ${players.values.killsDeathsRatio.basic.displayValue}`)
                    } else if (players.standing === 0) {
                        victoireEquipe.push(`󠀠\n__**${playersName}**__\n**Asisst : ** ${players.values.assists.basic.displayValue}\n**Kills : ** ${players.values.kills.basic.displayValue}\n**Adversaires vaincue : ** ${players.values.opponentsDefeated.basic.displayValue}\n**Morts : ** ${players.values.deaths.basic.displayValue}\n**Ratio : ** ${players.values.killsDeathsRatio.basic.displayValue}`)
                    }
    
                }

            }

            const embed = new EmbedBuilder()
            .setTitle(nameActivity + " \n" + `Temps : ${activity.values.activityDurationSeconds.basic.displayValue}`)
            .setDescription(`${descriptionActivity} \n\n ${standings}\n󠀠󠀠\n`)
            .setThumbnail(icon)
            .setColor("#FF00D8")
            if(checkActivity === 7) { // All Pve

                embed.setFields(
                    {name: "Stats de l'activiter :", value: victoireEquipe.join('\n'), inline: true}
                    )
                embed.setDescription(`${descriptionActivity} \n`)

            } else if (checkActivity === 64) { // Gambit
                embed.setFields(
                    {name: "🏆  Équipe Gagnante  🏆", value: victoireEquipe.join("\n"), inline: true},
                    {name: "☠️  Équipe Perdante  ☠️", value: defeteEquipe.join("\n"), inline: true}
                    )

            } else if (checkActivity === 5) { // Pvp
                embed.setFields(
                    {name: "🏆  Équipe Gagnante  🏆", value: victoireEquipe.join("\n"), inline: true},
                    {name: "☠️  Équipe Perdante  ☠️", value: defeteEquipe.join("\n"), inline: true}
                    )
            }

            interaction.editReply({embeds: [embed]})
            
        }
    }
}