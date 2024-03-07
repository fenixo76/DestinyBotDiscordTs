import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { getUrl, DestinyComponentType, tableauDegas } from "../Bungie/Api";
import manifest from "../Bungie/Manifest";
import { embedPages, page, resetPage } from "../Modules/ComposantEmbedPages";
import { createButton } from "../Modules/ComposantdButton";

export const command: SlashCommand = {
    name: "banshee_44",
    data: new SlashCommandBuilder()
        .setName("banshee_44")
        .setDescription("Pour savoir ce que banshee_44 vend cette semaine, il vous suffit d'exécuter cette commande."),

    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const banshee_44: any = await getUrl(interaction.user.id, DestinyComponentType.VendorsUrl, interaction);

        if (banshee_44) {
            //Reset EmbedPages
            resetPage()

            //Banshee_44
            const hash: any = DestinyComponentType.Banshee
            const Banshee_44 = banshee_44.vendors.data[hash]
            const manifestBanshee_44 = await manifest.t(hash) // Tout le manifest de Banshee_44

            const localisationHash = manifestBanshee_44.locations[Banshee_44.vendorLocationIndex].destinationHash
            const localisation = await manifest.t(localisationHash) //Localisation de Banshee_44

            page.push(
                { title: "Banshee_44", thumbnail: `https://www.bungie.net/${manifestBanshee_44.displayProperties.largeTransparentIcon}`, description: `Bonjour, je suis actuellement sur :\n__${localisation.displayProperties.name}__ `, image: `https://www.bungie.net/${manifestBanshee_44.displayProperties.largeIcon}`, fields: { name: "Navigation:", value: "Pour voir mes articles, appuyez sur les boutons ci-dessous.", inline: true }, id: 1, },
            )

            let id = 2

            //Articles Banshee_44
            const articleXur = banshee_44.sales.data[hash].saleItems

            for (const key in articleXur) {

                const item = articleXur[key]
                if (item.costs[0]) {
                    const itemHash = item.itemHash
                    const articles: any = await manifest.t(itemHash)
                    const names = articles.displayProperties.name
                    let description: string = ""
                    const icons = `https://www.bungie.net/${articles.displayProperties.icon}`
                    let degas: any = ""

                    if (articles.defaultDamageTypeHash) {
                        const hashDegat: any = articles.defaultDamageTypeHash.toString()
                        degas = "Type de dega : " + manifest.t(articles.defaultDamageTypeHash).displayProperties.name + ` ${tableauDegas[0][hashDegat]}`
                    }

                    const costs = item.costs;
                    const money: any[] = [];
                    const quantity: any = [];

                    if (articles.displayProperties.description === "") {
                        description = articles.flavorText
                    } else {
                        description = articles.displayProperties.description
                    }

                    if (costs) {
                        for (let i = 0; i < costs.length && i < 4; i++) {
                            money[i] = await manifest.t(costs[i].itemHash).displayProperties.name
                            quantity[i] = costs[i].quantity
                        }
                    }

                    let fieldsValue = '';

                    for (let i = 0; i < money.length; i++) {
                        if (money[i] === "Lumen") {
                            money[i] = DestinyComponentType.Lumen
                        } else if (money[i] === "Éclats légendaires") {
                            money[i] = DestinyComponentType.Legend
                        } else if (money[i] === "Cryptage exotique") {
                            money[i] = DestinyComponentType.Cryptage
                        } else if (money[i] === "Éclat ascendant") {
                            money[i] = DestinyComponentType.Eclat
                        } else if (money[i] === "Matrice d'amélioration") {
                            money[i] = DestinyComponentType.Matrice
                        }
                        fieldsValue += `${money[i]} ${quantity[i]}\n`;
                    }

                    page.push(
                        {
                            title: names,
                            thumbnail: icons,
                            description: description + `\n\n ${degas}`,
                            fields: { name: "Prix : ", value: fieldsValue },
                            id: id,
                        }
                    )
                    id++
                }
            }

            const button: any = await createButton([{
                CustomId: "Précédant",
                Label: "⏪ Précédant",
                Style: 1,
            }, {
                CustomId: "Suivant",
                Label: "Suivant ⏩",
                Style: 1,
            }])

            const result = await embedPages(page);

            await interaction.editReply({ embeds: [result.embed], components: [button] });
        }
    }
}