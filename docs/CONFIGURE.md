# Configuration

This document contains information on configuration settings you can use to customize the bot.  Use it alongside the [INSTALL](INSTALL.md) document to set up your environment prior to running the bot for the first time, or reference it when you need to make changes.

## Discord Token Configuration Instructions

The value ``TOKEN_DISCORD`` in ``FurExplicitBot/shared.env`` should be set to the bot's discord token.  You can obtain a token by creating a new Application via [Discord Developer Applications Dashboard](https://discord.com/developers/applications), and then creating a bot with the apporpriate permissions set, and oath2 configured correctly.  Please follow [Getting Started](https://discord.com/developers/docs/getting-started) instructions on how to accomplish this, and recieve your shiny new token.

## Kuma Uptime Configuration Instructions

In order to accomplish successful configuration of Kuma uptime api and enable the ``/status`` command, you need to self-host uptime kuma locally, on docker, or put it on your VPS.  Here's the [github repository](https://github.com/louislam/uptime-kuma) for it.

We don't provide installation instructions for uptime kuma, because they do!

Follow the instructions provided by uptime kuma developers to setup a heartbeat endpoint for the bot. 

> ❌ If you **do not wish** to set up the uptime kuma api feature and disable the ``/status`` command, you can skip configuration and leave what's been provided to you as default.  The bot is able to determine if you have or haven't filled out these values, and react appropriately to attempts to run the ``/status`` command, as well as to send/recieve uptime heartbeats.

The value ``TOKEN_UPTIME`` in ``FurExplicitBot/shared.env`` should be set to the uptime kuma API token you have configured in uptime kuma's settings.

The relevant part of ``FurExplicitBot/feb-app/config.json`` is under the ``heartbeat`` settings, nested inside the ``functions``configurations:

```json
            "uptime": {
                "interval": 50000,
                "endpoint": "https://example.com/api/push/"
            },
```


Changing the ``interval`` property (in milleseconds) will allow uptime heartbeats to happen faster/slower against uptime kuma.  We have set this to a recommended value of 50000 by default.

Updating the ``endpoint`` property is nessecary.  Here is that table of examples:

| Value | Environment | Description        |
| ----- | ----------- | ------------------ | 
| ``https://localhost:port/api/push`` | local | localhost:port combination with the api push endpoint on a specific ``port`` on localhost in your self-hosting environment. |
| ``https://kuma-proxy:port/api/push`` | local (docker) | docker:port combination with the api push endpoint on a specific ``port`` on docker, configured with https reverse proxy on top of ngrix or apache running in docker on your host, this one should reference the webserver container that's configured as the reverse proxy. |
| ``https://example.com/api/push`` | remote | Your website, with the API configured to be publically accessible.  As you'd installed kuma on your VPS. |

## Discord bot listing Configuration Instructions

These values in ``FurExplicitBot/shared.env`` are for discord bot listing services:

```conf
TOKEN_BOTSONDISCORD=""
TOKEN_DISCORDBOTLIST=""
TOKEN_DISCORDS=""
TOKEN_DISCORDBOTS=""
TOKEN_MOTIONDEVELOPMENT=""
```

Filling them out causes the bot to send heartbeats to the respective Discord Bot listing service via ``listing.js``, a special module that has been installed into the  ``FurExplicitBot/feb-app/functions/HEARTBEAT`` folder.  Periodically sending these heartbeats allows the bot to appear online on the listing service, as well as display reliable uptime statistics.

You'll need to work with the listing provider to recieve an API token for your bot for each of the respective services mentioned here.  We have provided direct links to them to help you out during setup.

| Service       | Token               | Link                        |
| ------------- | ------------------- | --------------------------- |
| BotsOnDiscord | ``TOKEN_BOTSONDISCORD`` | https://bots.ondiscord.xyz/info/api |
| DiscordBotList | ``TOKEN_DISCORDBOTLIST`` | https://ads.discordbotlist.com/ |
| Discords | ``TOKEN_DISCORDS`` | https://discords.com/bots/bot/add |
| DiscordBots | ``TOKEN_DISCORDBOTS`` | https://discord.bots.gg/about |
| MotionDevelopment | ``TOKEN_MOTIONDEVELOPMENT`` | https://motiondevelopment.top/bot/add |

> ⚠️ Please note that some services may have additional application requirements, prereq uptime and quality, and community requirements...  You should be mindful of these requirements when deciding to list the bot with ``lister.js``, a tool we provide to do so that is included integrated into this project, that listens for these configuration values on the environment and reacts accordingly.

As well, in ``FurExplicitBot/feb-app/config.json``, there are a few things you can modify under the ``functions`` section, within the ``heartbeats`` configuration section:

```json
            "discordbotlist": {
                "interval": 600000,
                "endpoint": "https://discordbotlist.com/api/v1/bots/"
            },
            "motiondevelopment": {
                "interval": 600000,
                "endpoint": "https://www.motiondevelopment.top/api/v1.2/bots/"
            },
            "discordbots": {
                "interval": 600000,
                "endpoint": "https://discord.bots.gg/api/v1/bots/"
            },
            "botsondiscord": {
                "interval": 600000,
                "endpoint": "https://bots.ondiscord.xyz/bot-api/bots/"
            },
            "discords": {
                "interval": 600000,
                "endpoint": "https://discords.com/bots/api/bot/"
            }
```

Changing the ``interval`` property (in milleseconds) will allow heartbeats to happen faster.  Please  be mindful of api ratelimits with the providers when adjusting this setting.

Updating the ``endpoint`` property may happen as a result of provider updates.  You shouldn't have to do this for now, but you may if the provider makes changes to the way the api is called.

## SauceNao API Configuration Instructions

[SauceNao](https://saucenao.com/) is an api-driven reverse image service specifically designed to help people cross-reference citations on internet artwork.  It indexes all supported platforms used by this bot, and is a reliable way to display cross-reference links between uploads on image boards, and fact-check sources to their relevant social media platforms.

Configuring the ``TOKEN_SAUCENAO`` property in ``FurExplicitBot/shared.env`` with an api token requires an account, so [create one](https://saucenao.com/user.php), and then visit your [search api page](https://saucenao.com/user.php?page=search-api)

As well, in ``FurExplicitBot/feb-app/config.json``, there are a few things you can modify under the ``commands`` section, within the ``source`` configuration section for saucenao:

```json
        "source": {
            "uri": "https://saucenao.com/search.php",
            "params": {
                "db": 999,
                "output_type": 2,
                "numres": 10
            },
            "minSimilarity": 85,
            "e621Index": 29,
            "allowedFiletypes": ["png", "jpg", "gif"],
            "searcherLogo": "https://cdn.discordapp.com/attachments/569187592919056389/956733059863052358/saucenao.png"
        },
```

The ``params`` section defines api parameters actually passed into saucenao api calls.  For an explanation of those, you'll need to visit your [search api page](https://saucenao.com/user.php?page=search-api)

For the rest, we provide a table

| Configuration value | Type    | Description |
| ------------------- | ------- | ----------- |
| minSimilarity | Integer | How similar a search result should be to be listed as an acceptable citation.
| e621Index | Integer | The e621 accuracy index - this additional percentage value  instructions the bot to weigh the minSimilarity value with this one on determining if a cross-reference result is actually furry-related.  This helps improve 'furry related' search results coming from saucenao as reliable sources, but may not always, as an artist may not share their work on e621, but the weight helps out significantly. |
| allowedFiletypes | JSON array of Strings | Whether the search should consider the given list of filetypes, or not. |
| searcherLogo | You can customize the searcher logo that appears when your users run the ``/source`` command, here, by specifying a direct link to an image that has been uploaded on Discord, such as in a private channel on your bot's support server dedicated to hosting local image resources, emotes, or stickers your bot uses. |


> ❌ If you **do not wish** to set up the saucenao feature and disable the extended "More Info" citation info from saucenao that provides cross-references, as well as the ``/source`` command, you can skip configuration and leave what's been provided to you as default.  The bot is able to determine if you have or haven't filled out these values, and react appropriately.

## MySQL Database Configuration Instructions

These MySQL configuration parameters in  ``FurExplicitBot/shared.env`` control the function of the MySQL database and its connection.

```
DB_DIALECT="mysql"
DB_HOST="feb-db"
MARIADB_DATABASE="furExplicitBot"
MARIADB_USERNAME="furExplicitBot"
MARIADB_PASSWORD=""
MARIADB_PASSWORD_ROOT=""
MARIADB_ALLOW_EMPTY_ROOT_PASSWORD="false"
MARIADB_AUTO_UPGRADE="true"
MARIADB_PORT="3306"
```

You can use this table as a guide while filling out your database settings:

| Parameter | Description           |
| --------- | --------------------- |
| ``DB_DIALECT`` | The dialect spoken by the database, this is always ``mysql``. |
| ``DB_HOST`` | The name of the docker container where the database is located.  This should match the same from ``docker-compose.yml``.
| ``MARIADB_DATABASE`` | The name of the database where information about FurExplicitBot wil be stored. |
| ``MARIADB_USERNAME`` | The username that is used to access the FurExplicitBot database. |
| ``MARIADB_PASSWORD`` | You need to create a password for your database user, fill that in here. |
| ``MARIADB_PASSWORD_ROOT`` | You need to create a root password for your database user, fill that in here. |
| ``MARIADB_ALLOW_EMPTY_ROOT_PASSWORD`` | We have set this to ``false`` for security reasons.  We do not recommend changing it to ``true`` and setting up your root password. |
| ``MARIADB_AUTO_UPGRADE`` | For convenience sake, we automatically upgrade the database within the container when it needs to be done.  A backup is also created when an upgrade happens for safety.  We don't recommend changing this from its default of ``true``. |
| ``MARIADB_PORT`` | The port at which MySQL is listening on the host, not the docker guest, this is forwarded in ``docker-compose.yml`` for other docker containers to access.

We customized the image from [here](https://github.com/MariaDB/mariadb-docker) to fit this project's needs to lock the MariaDB/MySQL version to 10.10 with our customizations.