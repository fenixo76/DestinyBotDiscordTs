import { Client, REST, Routes } from "discord.js"
import { readdirSync } from "fs";
import { join } from "path"
import { SlashCommand } from "../types";

export const COMMANDE_NAME:string[] = []

module.exports = async (client: Client) => {
    const body:any = [];
    const SlashCommandDir = join(__dirname, "../Commands")

    readdirSync(SlashCommandDir).forEach(file => {
        if(!file.endsWith(".js")) return;

        const command: SlashCommand = require(`${SlashCommandDir}/${file}`).command;

        body.push(command.data.toJSON());
        client.SlashCommands.set(command.name, command);
    })
    
    const rest = new REST ({version: "10"}).setToken(process.env.TOKEN);

    try{
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID),{ body: body });
    } catch (error) {
        console.log(error)
    }
}