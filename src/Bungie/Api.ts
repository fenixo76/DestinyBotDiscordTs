import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { openDataBase, closeDataBase } from "../DB/DataBase";
import * as dotenv from "dotenv";
import { autorizationCode } from "./App";
import { string } from "../Modules/ComposantString";

dotenv.config();

const commandIgnore:any = [ // Ajouter ici le Nom des Commands a ignorer
    "ada_1",
    "banshee_44",
    "gm",
    "xur",
]

export const bungie = axios.create({
    baseURL: "https://www.bungie.net/",
    timeout: 10000,
    withCredentials: true,
    headers: {
        "X-API-Key": process.env.BUNGIE_KEY_API,
    }
})

export const getToken = async (code: any, userId: any, message: any) => {
    try {
        const responseToken = await bungie.post(
            "platform/app/oauth/token/",
            `client_id=${process.env.BUNGIE_OAUTH_CLIENT_ID}&client_secret=${process.env.BUNGIE_OAUTH_CLIENT_SECRET}&grant_type=authorization_code&code=${code}`,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

        const data = responseToken.data

        if (data) {

            const responseUser = await bungie.get(`Platform/User/GetMembershipsById/${data.membership_id}/-1/`, {
                headers: {
                    Authorization: `Bearer ${data.access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const memberInfo = responseUser.data.Response.destinyMemberships[0]

            if (memberInfo) {

                const responsePersonage = await bungie.get(`Platform/Destiny2/${memberInfo.membershipType}/Profile/${memberInfo.membershipId}/?components=${DestinyComponentType.Characters}`, {
                    timeout: 10000,
                    headers: {
                        Authorization: `Bearer ${data.access_token}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

                const charactersData = responsePersonage.data.Response.characters.data
                let firstCharacterId:any = {}
                
                for (const characterId in charactersData) {
                    const character = charactersData[characterId];
                    const classType = character.classType

                    if (classType === 0 || classType === 1 || classType === 2) {
                        firstCharacterId[classType] = characterId;
                    }

                }

                const userData = {
                    IdDiscord: userId,
                    Token: data.access_token,
                    TokenExpiresIn: data.expires_in,
                    RefreshToken: data.refresh_token,
                    RefreshExpiresIn: data.refresh_expires_in,
                    MembershipId: data.membership_id,
                    DestinyMembershipId: memberInfo.membershipId,
                    MembershipType: memberInfo.membershipType,
                    CharacterId: JSON.stringify(firstCharacterId)
                };

                const db = await openDataBase()
                    const query = `INSERT INTO users (IdDiscord, Token, TokenExpiresIn, RefreshToken, RefreshExpiresIn, MembershipId, DestinyMembershipId, MembershipType, CharacterId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

                    db.run(query, [userData.IdDiscord, userData.Token, userData.TokenExpiresIn, userData.RefreshToken, userData.RefreshExpiresIn, userData.MembershipId, userData.DestinyMembershipId, userData.MembershipType, userData.CharacterId], function (err) {
                        if (err) {
                            console.error('Erreur lors de l\'insertion des données', err.message);
                        } else {

                            console.log(`Données insérées avec succès. ID de la ligne insérée : ${this.lastID}`);

                            const embed = new EmbedBuilder()
                                .setColor("#57f287")
                                .setTitle("Connexion")
                                .setThumbnail(`https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}`)
                                .setDescription("Tout s'est bien passé, tu peux utiliser les commandes Destiny sur le serveur.")

                            message.editReply({ embeds: [embed] })
                        }
                    });
                    closeDataBase(db)
                

            } else {
                return console.log("Imposible de recuperer les info des personages")
            }

        } else {
            return console.log("Imposible de recuperer les info User")
        }


    } catch (err) {
        console.error("Erreur lors de la récupération des jetons : ", err);

        const embed = new EmbedBuilder()
            .setColor("#ed4245")
            .setTitle("Connexion")
            .setThumbnail(`https://cdn.discordapp.com/avatars/${message.user.id}/${message.user.avatar}`)
            .setDescription("Délai écoulé. Tu as été trop lent. Tu peux réessayer si tu veux.")

        message.editReply({ embeds: [embed] })
        return null;
    }
}

export const refreshAccessToken = async (userId: any) => {
    try {
        const db = await openDataBase()

        if (!userId){
            throw new Error('L\'ID utilisateur est invalide.');
        }
        const query = `SELECT RefreshToken FROM users WHERE IdDiscord = ?`;

        const refreshToken = await new Promise((resolve, reject) => {
            db.get(query, [userId], (error:any, row:any) => {
                if (error) {
                    reject(new Error('Erreur lors de la récupération du RefreshToken : ' + error.message));
                } else {
                    if (row && row.RefreshToken) {
                        resolve(row.RefreshToken);
                    } else {
                        reject(new Error('Aucun RefreshToken trouvé pour l\'utilisateur avec l\'ID Discord : ' + userId));
                    }
                }
            });
        });

        const response = await bungie.post("platform/app/oauth/token/",
        `client_id=${process.env.BUNGIE_OAUTH_CLIENT_ID}&client_secret=${process.env.BUNGIE_OAUTH_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });

        const newToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token;

        const update = `UPDATE users SET Token = ?, RefreshToken = ? WHERE IdDiscord = ?`;

        await new Promise<void>((resolve, reject) => {
            db.run(update, [newToken, newRefreshToken, userId], (error) => {
                if (error) {
                    reject(new Error('Erreur lors de la mise à jour des tokens : ' + error.message));
                } else {
                    console.log('Tokens mis à jour avec succès pour l\'utilisateur', userId);
                    resolve();
                }
            });
        });
        closeDataBase(db)

    } catch (error) {
        console.error("Erreur lors de la récupération des jetons : ", error);
        throw error;
    }
}

//Pour modifier l'url : $DestinyMembershipId$, $MembershipType$, $CharacterId$
export const getUrl:any = async (userId: any, url: any, interaction: any, number:number) => {
    try {
        const db = await openDataBase();

        if (!userId) {
            throw new Error('L\'ID utilisateur est invalide.');
        }

        let Token: any
        let MembershipId: any
        let DestinyMembershipId: any
        let MembershipType: any
        let CharacterId: any

        const query = `SELECT Token, MembershipId, DestinyMembershipId, MembershipType, CharacterId FROM users WHERE IdDiscord = ?`;

        await new Promise<void>((resolve, reject) => {
            db.get(query, [userId], (error, row: { Token: string, MembershipId: string, DestinyMembershipId: string, MembershipType: string, CharacterId: string }) => {
                if (error) {
                    console.error('Erreur lors de la récupération des INFO', error.message);
                    reject(error);
                    closeDataBase(db);
                } else {
                    if (row) {
                        const Class = JSON.parse(row.CharacterId)
                        Token = row.Token
                        MembershipId = row.MembershipId
                        DestinyMembershipId = row.DestinyMembershipId
                        MembershipType = row.MembershipType
                        if (commandIgnore.includes(interaction.commandName)){
                            CharacterId = Class[0] || Class[1] || Class[2];
                        } else {
                           CharacterId = Class[number] 
                        }
                        resolve()
                    } else {
                        console.log('Aucun utilisateur trouvé avec cet ID Discord');
                        reject(new Error('Utilisateur introuvable'));

                        const embed = new EmbedBuilder()
                        .setColor("#FF00D8")
                        .setTitle("Connexion")
                        .setThumbnail(`https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`)
                        .setDescription(`Il semble que tu ne t'es pas connecté.\n\nConnecte-toi au site : [Orphidia](https://www.bungie.net/en/OAuth/Authorize?response_type=code&client_id=${process.env.BUNGIE_OAUTH_CLIENT_ID}) Pour avoir accès aux commandes Destiny du serveur.\n\nVous avez 20 Seconde pour vous connecté`)
                        
                        interaction.editReply({embeds: [embed]})

                        setTimeout( () => {
                            getToken(autorizationCode,userId, interaction)
                        },20000)

                        closeDataBase(db);
                    }
                }
            })
        })

        try{
            const newUrl = url.replace("$MembershipType$", `${MembershipType}`).replace("$DestinyMembershipId$", `${DestinyMembershipId}`).replace("$CharacterId$", `${CharacterId}`);

            const response = await bungie.get(newUrl, {
                timeout: 10000,
                headers: {
                    Authorization: `Bearer ${Token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            })
            closeDataBase(db);
            return response.data.Response
        } catch (error:any) {
            console.error("Erreur lors de la récupération de L'url", error);
            if (error.response && error.response.status === 401) {
                await refreshAccessToken(userId);
                closeDataBase(db);
                return await getUrl(userId, url, interaction);
            } else {
                closeDataBase(db);
                throw error; 
            }
        }
    } catch (error: any) {
            console.error("Imposible de recuperer les information de la base de donnée", error);
            interaction.editReply({content: string[3]})
            setTimeout(() => {
                interaction.deleteReply().catch(console.error);
            },5000)
    }
}


export const getManifest = () => bungie.get("Platform/Destiny2/Manifest/")

export enum DestinyComponentType {
    None = 0,
    Profiles = 100,
    VendorReceipts = 101,
    ProfileInventories = 102,
    ProfileCurrencies = 103,
    ProfileProgression = 104,
    PlatformSilver = 105,
    Characters = 200,
    CharacterInventories = 201,
    CharacterProgressions = 202,
    CharacterRenderData = 203,
    CharacterActivities = 204,
    CharacterEquipment = 205,
    ItemInstances = 300,
    ItemObjectives = 301,
    ItemPerks = 302,
    ItemRenderData = 303,
    ItemStats = 304,
    ItemSockets = 305,
    ItemTalentGrids = 306,
    ItemCommonData = 307,
    ItemPlugStates = 308,
    ItemPlugObjectives = 309,
    ItemReusablePlugs = 310,
    Vendors = 400,
    VendorCategories = 401,
    VendorSales = 402,
    Kiosks = 500,
    CurrencyLookups = 600,
    PresentationNodes = 700,
    Collectibles = 800,
    Records = 900,
    Transitory = 1000,
    Metrics = 1100,
    StringVariables = 1200,
    Craftables = 1300,
    //Hashs Vendeurs
    Xur = 2190858386,
    Ada = 350061650,
    Banshee = 672118013,
    //Url
    VendorsUrl = `Platform/Destiny2/$MembershipType$/Profile/$DestinyMembershipId$/Character/$CharacterId$/Vendors/?components=${VendorSales},${Vendors}`,
    ActivityUrl =  `Platform/Destiny2/$MembershipType$/Account/$DestinyMembershipId$/Character/$CharacterId$/Stats/Activities/`,
    Jalons = "Plateforme/Destiny2/Jalons/",
    //Emojis
    Lumen = "<:Lumen:1206538897316651058>",
    Legend = "<:Legend:1206538958733975582>",
    Cryptage = "<:cryptage:1209100430106165288>",
    Eclat = "<:Eclat:1209100390109552681>",
    Matrice = "<:Matrice:1209100362082943058>"
}

export const tableauDegas:any = [{
    151347233 : "<:151347233:1209100518031360030>",
    1847026933: "<:1847026933:1209100487450828810>",
    2303181850: "<:2303181850:1209100503263477760>",
    3373582085: "<:3373582085:1209100532627542076>",
    3454344768: "<:3454344768:1209100570523344916>",
    3949783978: "<:3949783978:1209100551770607616>",
}]

export const tableauGM: any = [{
    "Perforation de bouclier" : "https://www.bungie.net/common/destiny2_content/icons/eb04e3267eee527d64d85af3f0a3ec6a.png",
    "Perturbation" : "https://www.bungie.net/common/destiny2_content/icons/f089fa44124cb8fe585acc5794653098.png",
    "Chancellement": "https://www.bungie.net/common/destiny2_content/icons/9caeb47c43fbe011607af18409d8162f.png",
    "Cryo-électrique": "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_092d066688b879c807c3b460afdd61e6.png",
    "Solaire" : "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png",
    "Abyssal" : "https://www.bungie.net/common/destiny2_content/icons/DestinyDamageTypeDefinition_ceb2f6197dccf3958bb31cc783eb97a0.png"
}]
