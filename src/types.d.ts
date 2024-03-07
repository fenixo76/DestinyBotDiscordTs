import { Collection, CommandInteraction, SlashCommandBuilder, Events } from "discord.js"

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            CLIENT_ID: string,
            TOKEN: string,
            CHANNEL_CHAT: string,
            CHANNEL_COMMANDS: string,
            BUNGIE_KEY_API: string,
            BUNGIE_OAUTH_URL: string,
            BUNGIE_OAUTH_CLIENT_ID: string,
            BUNGIE_OAUTH_CLIENT_SECRET: string,
            // Veuillez ajouter les variables d'environnement si nécessaire. dans (.env)
        }
    }
}

declare module "discord.js" {
    export interface Client {
        SlashCommands: Collection<string, SlashCommand>
    }
}

export interface BotEvent {
    name: string ,
    once?: boolean | false,
    execute: (...args) => void
}

export interface BotReact {
    name: string,
    once?: boolean | false,
    execute: (...arg: any[]) => void
}

export interface SlashCommand {
    name: string,
    data: SlashCommandBuilder | any,
    async execute: (interaction: CommandInteraction) => Promise<void>
}

export interface MessageEvent {
    name: string,
    once: boolean | false
    execute: (...args) => void
}

export interface ButtonData {
    CustomId: string,
    Label: string,
    Style: number, //Primary = 1, Secondary = 2, Success = 3, Danger = 4, Link = 5
}

export {}