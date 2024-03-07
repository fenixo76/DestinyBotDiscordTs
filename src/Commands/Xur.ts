import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { getUrl, DestinyComponentType, tableauDegas } from "../Bungie/Api";
import manifest from "../Bungie/Manifest";
import { embedPages, resetPage, page } from "../Modules/ComposantEmbedPages";
import { createButton } from "../Modules/ComposantdButton";

export const command: SlashCommand = {
    name: "xur",
    data: new SlashCommandBuilder()
        .setName("xur")
        .setDescription("Ne cherchez pas où se trouve Xur, exécutez simplement cette commande."),

    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const xur: any = await getUrl(interaction.user.id, DestinyComponentType.VendorsUrl, interaction);

        if (xur) {
            //Reset EmbedPages
            resetPage()
            //Xûr
            const hash: any = DestinyComponentType.Xur
            const Xûr = xur.vendors.data[hash]
            const manifestXûr = await manifest.t(hash) // Tout le manifest de Xûr

            if (Xûr === undefined) {
                // Si Xûr n'est pas la
                const embed = new EmbedBuilder()
                    .setTitle("Ou est Xûr")
                    .setThumbnail(`https://www.bungie.net/${manifestXûr.displayProperties.icon}`)
                    .setDescription("Bonjour, je suis actuellement en pénurie d'articles. Revenez __Vendredi__ pour découvrir mes nouveaux articles")
                    .setImage(`https://www.bungie.net/${manifestXûr.displayProperties.largeIcon}`)

                interaction.editReply({ embeds: [embed] })

            } else {
                // Si Xûr est la
                const localisationHash = manifestXûr.locations[Xûr.vendorLocationIndex].destinationHash
                const localisation = await manifest.t(localisationHash) //Localisation de Xûr

                page.push(
                    { title: "Ou est Xûr", thumbnail: `https://www.bungie.net/${manifestXûr.displayProperties.icon}`, description: `Bonjour, je suis actuellement sur :\n__${localisation.displayProperties.name}__ `, image: `https://www.bungie.net/${manifestXûr.displayProperties.largeIcon}`, fields: { name: "Navigation:", value: "Pour voir mes articles, appuyez sur les boutons ci-dessous.", inline: true }, id: 1, },
                )

                let id = 2
                //Articles Xûr
                const articleXur = xur.sales.data[hash].saleItems

                for (const key in articleXur) {

                    const item = articleXur[key]
                    const itemHash = item.itemHash
                    const articles = await manifest.t(itemHash)
                    const names = articles.displayProperties.name
                    let description: string = ""
                    const icons = `https://www.bungie.net/${articles.displayProperties.icon}`
                    let degas: string = ""

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
}