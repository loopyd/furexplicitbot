# Installation Instructions

So I see you want to self-host!  Well, you're in luck, we've provided a detailed guide on how you can accomplish that.

## Important things to know

As someone on your quest to begin hosting your very own copy of this bot, we recommend that you have that knowledge in place.  We don't teach you how to self host discord bots, just to configure this one to work within that environment.

This bot is configured to work-out-of-the-box in as **few steps as possible**.  We have done our best to reduce that configuration to working with a very small number of files to make it easier.  However, without these files containing the information for the bot to work correctly, simply spinning up the container after a fresh clone of the repository won't work.

We **do not** include these files filled out in full, because they contain credentials, and thus, you'll have to fill in / create those files yourself, register as a developer with the appropriate platform / access permissions the bot uses, and insert those credentials into the appropriate area of the configuration files.

## Recommended IDE configuration

We recommend the vscode integrated development environment for working with the bots source.  You should have [Visual Studio Code](https://code.visualstudio.com/) installed.  Visual Studio Code is a Cross platform, plugin extendable lightweight IDE by Microsoft.

If you open the repository the first time in vscode with ``code .`` in the root of the repository folder from your terminal after following Step 1, you'll get recommendations from us to install extensions that will make working with this bot much eaiser within vscode from official sources.

All of these extensions are free, and speed up docker workflow within vscode quite significantly.  We do **highly recommend** that you say 'yes' to confirm your installation of the recommended extensions as they will make your life easier!

A ``.vscode`` folder is included in the repository as a boilerplate for you to expand on, as our IDE of choice for working with this bot.

## Prerequisites

You are going to need on the host:

- [docker](https://www.docker.com/get-started/) - We recommend choosing "Docker Desktop" if you wish to self-host easily with an accessable UI to monitor bot status, some professionals may choose to use the headless environment for docker on servers, as well.  
- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## 1.  Clone the repository

The first thing you will need to do after installing the required prerequisates is clone the repository by opening your shell and typing:

```cmd
git clone 'https://github.com/loopyd/furexplicitbot.git'
```

and then ``cd`` into the directory where the source code has been downloaded:

```cmd
cd furexplicitbot
```

## 2.  Create shared environment configuration

To configure your docker environment, create a file in ``FurExplicitBot/`` called ``shared.env`` from the root of the repository source code, with the following content:

```conf
TOKEN_DISCORD=""
TOKEN_UPTIME=""
TOKEN_BOTSONDISCORD=""
TOKEN_DISCORDBOTLIST=""
TOKEN_DISCORDS=""
TOKEN_DISCORDBOTS=""
TOKEN_MOTIONDEVELOPMENT=""
TOKEN_SAUCENAO=""
LOGIN_FA_COOKIE_A=""
LOGIN_FA_COOKIE_B=""
LOGIN_E621_USER=""
TOKEN_E621=""
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

This file will be used by docker compose to configure the core of the bot. You'll need it to continue to follow along.

## 3.  Configure your bot

You now need to follow the configuration instructions in [CONFIGURE](CONFIGURE.md) here in our docuemntation.  You can always go back to this and reference it if you need to make changes in the future.

## 4.  Run your bot

This can be accomplished in many ways.  Our recommended method is using the recommended plugin "Docker Compose" we provide inside of visual studio for testing, especially if this is your first time.

### Visual studio (with "Docker Compose" plugin)

Right click on "docker-compose.yml" in the file inspector and select "Up"

### Terminal

Go ahead and run:

```cmd
docker compose -f "docker-compose.yml" up -d --build 
```

and you should see everything finish succesfully.  Your bot is now running in the background!

## 5.  View your logs, fix any problems

You'll have to view your logs using a text editor, or Docker Desktop.

When you run this bot your first time, you'll probably not get everything set up correctly.  If you run ``docker ps --all`` and you see that your containers are restarting, you need to run:

```cmd
docker compose -f "docker-compose.yml" down
```

to stop your containers, and fix the problems.  This will be a loop of doing so until you setup and configure the bot correctly until its working.

Have a coffee, this part's the tricky one.

You can use the Docker Desktop client to monitor the output of the containers by clicking on the Container name under the "Containers" tab on right, and then clicking on the container name you wish to see the log for.  The "Logs" tab will display a rolling log of output for you to diagnose any problems with your configuratrion.

We recommend using Docker Desktop instead of a text editor.  However, if you're on a server, you can just tail log file within your docker installation directory, where the container will reside. during testing.

## 6.  Invite to your server and test

Invite the bot to your server and test it out!  It should be online as long as your containers are not restarting constantly.  You can view the logs alongside it to also continue to diagnose any problems.

## 7.  Move to production

This varies, sometimes you may need to install headless docker on your VPS, use redshift or what ever you like to use to host bots.  We don't provide instructions for making the installation permenant somewhere online.  Here is where we release you to figure that out, as this would fall beyond the scope of our documentation, and into supporting you on production hosting service configurations!  Follow the instructions for your providers to get this working.