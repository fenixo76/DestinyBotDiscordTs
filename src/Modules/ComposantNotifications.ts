import { EmbedBuilder } from "discord.js"
import * as dotenv from "dotenv";
import { string } from "./ComposantString";

dotenv.config();


const nameCommand: any = [ // Ajouter ici le Nom des Commands
    "activité",
    "sondage"
]

const TableauMessage: any = []
const TableauMessageCommands: any = []

export async function notificationCreate(message: any) {
    if (message.channelId === process.env.CHANNEL_COMMANDS) {
        if (nameCommand.includes(message.interaction?.commandName)) {
            const channelMessageId = process.env.CHANNEL_CHAT
            const sendMessage: any = message.guild?.channels.cache.get(channelMessageId)
            const embed = new EmbedBuilder()
                .setTitle("N'oubliez pas de vous inscrire pour l'activité.")
                .setDescription(`<@${message.interaction?.user.id}> **A créé un sondage ICI **: \n` + " " + " \n " + `https://discord.com/channels/${sendMessage.guildId}/${message.channelId}/${message.id}\n` + " " + " \n " + "Pour voter au sondage, cliquez sur les emojis.")
                .setColor("#FF8700")
                .setThumbnail("https://i.imgur.com/lxqK6Vf.png")

            const interval = setInterval(() => {
                sendMessage.send({ content: "<@&804813354493280276>", embeds: [embed] })
                TableauMessageCommands[message.id].count++
                if (TableauMessageCommands[message.id].count >= 3) {
                    clearInterval(TableauMessageCommands[message.id].interval)
                    delete TableauMessageCommands[message.id]
                }
            }, 10800000)
            TableauMessageCommands[message.id] = { count: 0, interval: interval }
            sendMessage.send({ content: "<@&804813354493280276>", embeds: [embed] })
        }

        if (message.interaction !== null) return

        if (message.author.id !== process.env.CLIENT_ID) {
            await message.delete()
            await message.channel.send({ content: string[2] })
        } 
    } 

    if (message.channelId === process.env.CHANNEL_CHAT) {
        
        if (nameCommand.includes(message.interaction?.commandName)){
            await message.delete()
            await message.channel.send({ content: string[1] })
         }

        if (message.author.id === process.env.CLIENT_ID) {
            if (message.embeds[0]?.data.title === "N'oubliez pas de vous inscrire pour l'activité.") {
                if (TableauMessage[0]) {
                    message.channel.messages.delete(TableauMessage[0])
                    delete TableauMessage[0]
                    TableauMessage[0] = message.id

                } else {
                    TableauMessage[0] = message.id
                }
            }
        }
    }
}

export function notificationDelete(message: any) {
    if (message.channelId === process.env.CHANNEL_COMMANDS) {
        if (TableauMessageCommands[message.id]) {
            clearInterval(TableauMessageCommands[message.id].interval)
            delete TableauMessageCommands[message.id]
        }
    }
}
