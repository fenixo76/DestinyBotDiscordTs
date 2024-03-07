import { AttachmentBuilder, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";
import { bungie } from "../Bungie/Api";
import manifest from "../Bungie/Manifest";
import { createCanvas, loadImage } from "@napi-rs/canvas";

export const command: SlashCommand = {
    name: "gm",
    data: new SlashCommandBuilder()
        .setName("gm")
        .setDescription("Permet de voir le GM de la semaine et c'est modificateur."),

        execute: async (interaction) => {
            await interaction.deferReply({ ephemeral: false });
            const response = await bungie.get("Platform/Destiny2/Milestones/", {
                timeout: 10000,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
        
            const grandMaster = response.data.Response[2029743966].activities[3]
            const manifestGM = await manifest.t(grandMaster.activityHash)
            const imageMapGM = manifestGM.pgcrImage
            const nameGM = manifestGM.displayProperties.description
            const GM = manifestGM.displayProperties.name
            const iconGM = `https://www.bungie.net/${manifestGM.displayProperties.icon}`
        
            let nameM:any = []
            let iconM = []
            let championBouclier = []
        
            for(const key in grandMaster.modifierHashes) {
                const modificateurHash = grandMaster.modifierHashes[key]
                const manifestHash = await manifest.t(modificateurHash)
                const name = manifestHash.displayProperties.name
                const icon = `https://www.bungie.net/${manifestHash.displayProperties.icon}`

                if(name === ""){
                    ""
                } else {
                    if(!nameM.includes(name)) {
                        nameM.push(name);
                        iconM.push(icon);
                    } else {
                        ""
                    }
                }
            }

            const canvas = createCanvas(1280, 2000);
            const context = canvas.getContext('2d');
            const backgrond = await loadImage("src/Img/FOND.png")

            const imageMap = await loadImage(`https://www.bungie.net/${imageMapGM}`);
            context.drawImage(imageMap, 0, 0);
            context.drawImage(backgrond, 0, 0, canvas.width, canvas.height)

            context.fillStyle = 'white';
            context.font = '50px Microsoft Sans Serif';

            context.save();

            context.fillStyle = 'white';
            context.font = 'bold 50px Microsoft Sans Serif';
            context.fillText(nameGM, 10, 650);

            const icone = await loadImage(iconGM)
            context.drawImage(icone, 1100, 50 , 150, 150 )

            context.fillStyle = "white"
            context.font = 'bold 70px Microsoft Sans Serif';
            context.fillText(GM , 45 , 150 )

            context.restore();

            const avatarPromises = iconM.map(async (icon, index) => {
                const img = await loadImage(icon);
                context.drawImage(img, 20, 760 -45 + 95* index, 80, 80); // Ajustez les coordonnées d'affichage de l'image selon vos besoins
            });
            await Promise.all(avatarPromises); // Attendez que toutes les images soient chargées

            // Affichez chaque élément du tableau sur une nouvelle ligne
            for (let i = 0; i < nameM.length; i++) {
                const description = nameM[i];
                context.fillText(description, 150, 760 + 15 + 95 * i); // Position x fixe à 120 pixels, ajustez selon vos besoins
            }
            const Image = new AttachmentBuilder(await canvas.encode('png'), { name: "img.png" })
        
            interaction.editReply({ files: [Image] })
        }
        
}