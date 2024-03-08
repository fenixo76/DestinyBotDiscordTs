import { APIEmbedField } from "discord.js";

export const nameCommandIgniore:any = [ // Ajouter ici le Nom des Commands a ignorer
    "roulette",
    "game",
    "game titan",
    "game chasseur",
    "game arcaniste",
    "titan",
    "chasseur",
    "arcaniste",
    "stats",
    "stats titan",
    "stats chasseur",
    "stats arcaniste",
    "gm"
]

export const ignoreUsers = () => {
    return (/** "Nom du Bot" */).split(",");
};

const emojiTable: EmojiItem[] = [
    { emoji: "👍", value: "Oui" },
    { emoji: "👎", value: "Non" }
];

interface EmojiItem {
    emoji: string;
    value: string;
}

export const translateEmojiToText = (emoji: string, reactions: any): string | undefined => {
    const commandName = reactions.message.interaction?.commandName;
    const embedFields = reactions.message.embeds[0]?.data.fields as APIEmbedField[];

    if (commandName === "sondage" && embedFields) {
        const emojiTableSondage: EmojiItem[] = embedFields
            .slice(0, 3) // Limite à 3 champs pour les réponses possibles
            .map((field, index) => ({
                emoji: index === 0 ? "🟢" : index === 1 ? "🔴" : "🟣",
                value: field.value.replace("Pour ", "").replace("(", "").replace(")", "")
            }));

        return emojiTableSondage.find(emojiItem => emojiItem.emoji === emoji)?.value;
    }

    return emojiTable.find(emojiItem => emojiItem.emoji === emoji)?.value;
};
