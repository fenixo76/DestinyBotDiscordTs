# Bot Discord Destiny 2 Ts

Un bot Discord communiquant avec l'API de Bungie pour Destiny 2. Vous n'avez qu'à entrer les paramètres demandés. (TOKKEN,CLIENT_ID ect...) dans le fichier `.env` et c'est parti. 
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
   git clone https://github.com/fenixo76/DestinyBotDiscordTs.git
   
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
Personnellement j'utilise un vps où j'héberge mon site et mon bot pour que les deux communiques ensemble modifier les fichiers suivants :

Chemin d'accès : etc/apache2/site-enbled

1. **default-ssl.conf**
```apache
<VirtualHost _default_:443>
    ServerAdmin webmaster@localhost
    ServerName NOM_DE_VOTRE_SITE
    DocumentRoot /var/www/html

    SSLEngine on
    SSLCertificateFile /var/www/html/pem/VOTRE_CERTIFICAT.cer
    SSLCertificateKeyFile /var/www/html/pem/VOTRE_CERTIFICAT_KEY.key
    SSLCertificateChainFile /var/www/html/pem/VOTRE_CERTIFICAT_INTERMEDIAIRE.cer

    SSLProtocol all -SSLv2 -SSLv3
    SSLCipherSuite HIGH:!aNULL:!MD5

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```
2. **000-default.conf**
```apache
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    ServerName NOM_DE_VOTRE_SITE
    DocumentRoot /var/www/html

    RewriteEngine On
    RewriteRule ^/Pages/Succes.html$ http://VOTRE_IP_VPS:3000/Pages/Succes.html [P,L]
</VirtualHost>

<VirtualHost *:443>
    ServerAdmin webmaster@localhost
    ServerName NOM_DE_VOTRE_SITE
    DocumentRoot /var/www/html

    SSLEngine on
    SSLCertificateFile /var/www/html/pem/VOTRE_CERTIFICAT.cer
    SSLCertificateKeyFile /var/www/html/pem/VOTRE_CERTIFICAT_KEY.key
    SSLCertificateChainFile /var/www/html/pem/VOTRE_CERTIFICAT_INTERMEDIAIRE.cer

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    RewriteEngine On
    RewriteRule ^/Pages/Succes.html$ http://VOTRE_IP_VPS:3000/Pages/Succes.html [P,L]
</VirtualHost>
```
## Configuration fichier App.ts
Dans le fichier App.ts modifié juste ip : 0.0.0.0 par l'ip de votre vps.
```bash
    app.listen(PORT, 'VOTRE_IP_VPS', () => {
        console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
