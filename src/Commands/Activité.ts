import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../types";

export const command: SlashCommand = {
    name: "activité",
    data: new SlashCommandBuilder()
        .setName("activité")
        .setDescription("Envoie une demande d'activité")
        .addStringOption((option_1) => {
            return option_1
            .setName("date")
            .setDescription("Date de activité")
            .setRequired(true)
        })
        .addIntegerOption((option_2) => {
            return option_2
            .setName("heure")
            .setDescription("heur de activité")
            .setRequired(true)
        })
        .addIntegerOption((option_3) => {
            return option_3
            .setName("minute")
            .setDescription("Minute de activité")
            .setRequired(true)
        }),
        
    execute: async (interaction) => {
        
        const selectMenu = {
            type: 3,
            custom_id: "activité_select",
            placeholder: "Sélectionnez une activité",
            options: [
                {
                    emoji: ":Raid:1152912662901035018",
                    label: "| Raid | Un Raid",
                    value: "__Un Raid__",
                },
                {
                    emoji: ":Raid:1152912662901035018",
                    label: "| Raid | Jardin du salut",
                    value: "__Jardin du salut__",
                },
                {
                    emoji: ":Raid:1152912662901035018",
                    label: "| Raid | Dernier voeux",
                    value: "__Dernier voeux__",
                },
                {
                    emoji: ":Raid:1152912662901035018",
                    label: "| Raid | Crypte de la pierre",
                    value: "__Crypte de la pierre__",
                },             
                {
                    emoji: ":Raid:1152912662901035018",
                    label: "| Raid | Serment du disciple",
                    value: "__Serment du disciple__",
                },
                {
                    emoji: ":Raid:1152912662901035018",
                    label: "| Raid | Caveau de verre",
                    value: "__Caveau de verre__",
                },
                {
                    emoji: ":Raid:1152912662901035018",
                    label: "| Raid | La chute du roi (Oryx)",
                    value: "__La chute du roi (Oryx)__",
                },
                {
                    emoji: ":Raid:1152912662901035018",
                    label: "| Raid | Origine des Cauchemars",
                    value: "__Origine des Cauchemars__",
                },
                {
                    emoji: ":Raid:1152912662901035018",
                    label: "| Raid | La Chute de Cropta",
                    value: "__La Chute de Cropta__",
                },
                {
                    emoji: ":Donjon:1152923354546831450",
                    label: "| Donjon | Dualité",
                    value: "__Dualité__",
                },
                {
                    emoji: ":Donjon:1152923354546831450",
                    label: "| Donjon | Fosse de l'hérésie",
                    value: "__Fosse de l'hérésie__",
                },
                {
                    emoji: ":Donjon:1152923354546831450",
                    label: "| Donjon | Le trône brisé",
                    value: "__Le trône brisé__",
                },
                {
                    emoji: ":Donjon:1152923354546831450",
                    label: "| Donjon | Étreinte de l'avarice",
                    value: "__Étreinte de l'avarice__",
                },
                {
                    emoji: ":Donjon:1152923354546831450",
                    label: "| Donjon | Prophétie",
                    value: "__Prophétie__",
                },
                {
                    emoji: ":Donjon:1152923354546831450",
                    label: "| Donjon | Flèche de la Vigie",
                    value: "__Flèche de la Vigie__",
                },
                {
                    emoji: ":Gm:1152925605067751454",
                    label: "| Nuit Noire | Grand Maitre",
                    value: "__Des Nuit Noire Grand Maitre__",
                },
                {
                    emoji: ":Gm:1152925605067751454",
                    label: "| Nuit Noire | Normale",
                    value: "__Des Nuit Noire__",
                },
                {
                    emoji: ":Assaut:1152925713922523138",
                    label: "| Assaut | Assaut",
                    value: "__Des Assauts__",
                },
                {
                    emoji: ":Pvp:1152923477070852107",
                    label: "| Pvp | Pvp",
                    value: "__Du Pvp__",
                },
                {
                    emoji: ":Osiris:1152923411526471700",
                    label: "| Osiris | Osiris",
                    value: "__De L'Osiris__",
                },
                {
                    emoji: ":Gambit:1152925653352583188",
                    label: "| Gambit | Gambit",
                    value: "__Du Gambit__",
                },
            ],
        };

       await interaction.reply({content:"Sélectionnez une activité",components: [{type: 1, components: [selectMenu]}], fetchReply:true})

    }
}