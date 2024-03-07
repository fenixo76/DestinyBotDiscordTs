import { Collection, Client, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import * as fs from "fs"
import { readdirSync } from "fs";
import { join } from "path";
import { SlashCommand } from "./types";
import Manifest  from "./Bungie/Manifest";
import { createDataBase, dataBaseFile } from "./DB/DataBase";
import { createServeur } from "./Bungie/App";

dotenv.config();
createServeur()

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.MessageContent,
    ]
});

client.SlashCommands = new Collection<string, SlashCommand>();

const handlersDir = join(__dirname, "./Handlers");

readdirSync(handlersDir).forEach(file => {
    require(`${handlersDir}/${file}`)(client);
})

fs.access(dataBaseFile, fs.constants.F_OK, (err) => {
    if(err) {
        console.log("Le fichier de base de données n'existe pas. Création en cours...");
        createDataBase();
    }else {
        console.log("La DataBase est OK!");
    }
})


Manifest.fetchManifest()

client.login(process.env.TOKEN);