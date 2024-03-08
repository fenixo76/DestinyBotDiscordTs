import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { getUrl, DestinyComponentType } from "../Bungie/Api";
import manifest from "../Bungie/Manifest";
import { embedPages, page, resetPage } from "../Modules/ComposantEmbedPages";
import { createButton } from "../Modules/ComposantdButton";

export const command: SlashCommand = {
    name: "ada_1",
    data: new SlashCommandBuilder()
        .setName("ada_1")
        .setDescription("Pour savoir ce que Ada_1 vend cette semaine, il vous suffit d'exécuter cette commande."),

    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const ada: any = await getUrl(interaction.user.id, DestinyComponentType.VendorsUrl, interaction);

        if (ada) {
            //Reset EmbedPages
            resetPage()

            //Ada_1
            const hash: any = DestinyComponentType.Ada
            const Ada_1 = ada.vendors.data[hash]
            const manifestXûr = await manifest.t(hash) // Tout le manifest de Ada_1

            const localisationHash = manifestXûr.locations[Ada_1.vendorLocationIndex].destinationHash
            const localisation = await manifest.t(localisationHash) //Localisation de Ada_1

            page.push(
                { title: "Ada_1", 
                 thumbnail: `https://www.bungie.net/${manifestXûr.displayProperties.icon}`, 
                 description: `Bonjour, je suis actuellement sur :\n__${localisation.displayProperties.name}__ `, 
                 image: `https://www.bungie.net/${manifestXûr.displayProperties.largeIcon}`, 
                 fields: { name: "Navigation:", value: "Pour voir mes articles, appuyez sur les boutons ci-dessous.", inline: true }, 
                 id: 1, },
            )

            let id = 2
            //Articles Ada_1
            const articleAda = ada.sales.data[hash].saleItems

            for (const key in articleAda) {

                const item = articleAda[key]
                const itemHash = item.itemHash
                const articles = await manifest.t(itemHash)
                const names = articles.displayProperties.name
                let description: string = ""
                const icons = `https://www.bungie.net/${articles.displayProperties.icon}`

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
                        description: description,
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
