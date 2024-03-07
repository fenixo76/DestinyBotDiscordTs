import { Events, MessageReaction } from "discord.js"
import { BotReact } from "../types";
import { ignoreUsers, nameCommandIgniore, translateEmojiToText } from "../Modules/ComposantsReact";

const emojisReactRemove: BotReact = {
    name: Events.MessageReactionRemove,
    once: false,

    async execute(reaction: MessageReaction) {

        // Fonction pour ignorer le Bot
        ignoreUsers()

        // Vérification si la commande est dans la liste des commandes ignorées

        if(nameCommandIgniore.includes(reaction.message.interaction?.commandName)) {
            return 
        }

        const embed: any = reaction.message.embeds[0];
        const descriptionOriginal = embed?.description?.split("\n")[0] || "";

        // Récupération des réactions et des utilisateurs associés
        const usersAndReactions = await Promise.all(reaction.message.reactions.cache.map(async (mr) => {
            const users = await mr.users.fetch();
            const emoji = translateEmojiToText(mr.emoji.name || "No emoji", reaction);
            const filteredUsers = users.filter(u => !ignoreUsers().includes(u.username));
            return { emoji, users: filteredUsers, emojiName: mr.emoji };
        }));

        // Construction de la description avec les utilisateurs ayant réagi
        const descriptionReactions = usersAndReactions
            .filter(data => data.users.size > 0)
            .map(data => {
                const usersList = Array.from(data.users.values()).map(u => `<@${u.id}>`).join("\n\n");
                return `\n\u200B**Joueurs qui ont voté pour ** ${data.emojiName} (${data.emoji}) :\n${usersList}\n\n`;
            })
            .join("");

        // Mise à jour de la description de l'embed et envoi du message mis à jour
        if (descriptionReactions) {
            const newDescription = `${descriptionOriginal}\n${descriptionReactions}`;
            embed.data.description = newDescription;
            const message = await reaction.message.fetch();
            message.edit({ embeds: [embed] });
        }
    }
};

export default emojisReactRemove