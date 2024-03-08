# Bot Discord Destiny 2 Ts

Un bot Discord comuniquant avec l'api de bungie pour Destiny 2. Vous n'avez qu'à rentrer les paramete demander (TOKKEN,CLIENT_ID ect...) dans le fichier `.env` et c'est parti. 
Pour créer d'autres commandes ajoutez des fichiers dans le dossier `Commands`. Laissez libre cours à votre imagination !

## Table des matières

- [Installation](#installation)
- [Configuration Application Discord](#configuration-application-discord)
- [Configuration des fichiers Apache 2](#Configuration-des-fichiers-Apache-2)
- [Configuration fichier App.ts](#Configuration-fichier-App.ts)


## Installation

Pour installer ce projet sur votre machine locale, suivez les étapes ci-dessous :

1. Cloner ce dépôt :
   ```bash
   git clone https://github.com/fenixo76/BotDiscordTs.git
   
2. Installer les dépendances :
   ```bash
    npm i

3. Modifiez le fichier .env :
   ```bash
   CLIENT_ID=CLIENT_ID_DISCORD
   TOKEN=TOKEN_DISCORD

   CHANNEL_CHAT=ID_CHANNEL_CHAT
   CHANNEL_COMMANDS=ID_CHANNEL_COMMANDS

   BUNGIE_KEY_API=API_KEY_BUNGIE
   BUNGIE_OAUTH_URL=https://www.bungie.net/fr/OAuth/Authorize
   BUNGIE_OAUTH_CLIENT_ID=CLIENT_ID_BUNGIE
   BUNGIE_OAUTH_CLIENT_SECRET=CLIENT_SECRET_BUNGIE

4. Compiler le code :
   ```bash
   npm run build
   
## Configuration Application Discord

Sur la page de configuration de votre application Discord, vérifiez bien si les éléments suivants sont cochés dans l'onglet Bot.

- PRESENCE INTENT
- SERVER MEMBERS INTENT
- MESSAGE CONTENT INTENT

![Nom_de_votre_image](https://github.com/fenixo76/BotDiscordTs/blob/main/Sans%20titre-1.png)

## Configuration des fichiers Apache 2

## Configuration fichier App.ts
