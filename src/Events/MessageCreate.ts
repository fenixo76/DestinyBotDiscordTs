import { MessageEvent } from "../types";
import { Events, Message } from "discord.js"
import { string } from "../Modules/ComposantString";
import { notificationCreate } from "../Modules/ComposantNotifications";

const message : MessageEvent = {
    name: Events.MessageCreate,
    once: false,

    async execute(message: Message) {

        notificationCreate(message)

        if(string.includes(message.content)){
            setTimeout(async () => {
                await message.delete()
            },5000)
        }

    }
}

export default message