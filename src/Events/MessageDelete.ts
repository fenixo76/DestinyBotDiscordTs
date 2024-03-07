import { MessageEvent } from "../types";
import { Events, Message } from "discord.js"
import { notificationDelete } from "../Modules/ComposantNotifications";

export let test: any = false

const messageDelete : MessageEvent = {
    name: Events.MessageDelete,
    once: false,

    async execute(message: Message) {
        notificationDelete(message)
    }
}

export default messageDelete