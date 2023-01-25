## Changelog:

## __Bot update - 3.2.1 - Project Restructure - DeityDurg's Fork__

### New Stuff:

- Actual documentation!  Oh my guwully, its beauwuiful! @.@

### Important Changes:

- Folder structure of the repository has drastically changed to reflect docker folder schema, and more easily compartmentalize the project into its respective docker containers.

- Self-hosting the bot has been made more accesible by shared environment file and entrypoint scripts, rather than depending on passing everything into docker compose, the core bot configuration has been made easy with a shared environment file (shared.env) made available in ./``docker/shared.env``.

- Documentation has been cleaned up.  A lot.  The most important changes are to ``CONTRIBUTIONS.md``,  inclusion of ``FUNDING.md``, and improving of the repository's overall markdown appearence (in prep for an eventual Jekyll workflow that provides automated doc generation into a github-pages, this is done)

- Inclusion of an INSTALL document that provides detailed installation steps for self-hosters and local testers that wish to make contributions, or run their own version of the project locally, or in their own docker cloud images.

- De-uwuifying more important or need-to-be-readable parts of the project documentation.  As much as we love our uwu's, keeping this out of what you need to know is very important!  Thank you for your unduwustwanding!

- Definitely way more than you asked for, Phil.  You're welcome.  :-)

### Bugfixes:

- None at this time, just some HEAVY restructuring to help out.

### Working on:

- Continued from previous changelog

## __Bot update - 3.2.0 - FurAffinity auto-posting__

### New Stuff:

- You can now watch up to __10__ **FurAffinity Artists** through the bot and get new art directly to a discord channel with ``/faautopost``.  This feature is very useful for FurAffinity artists that have Discord communities, as well as their fans.

### Important Changes:

- Removed deprecated warning to now use slash-commands

### Boring Bugfixes:

- ``@everyone`` catch slipped through an update, while it cant be explioted, has been fixed anyway
- Updated code 

### Working on:

- Get pool handler for e621 back up and running, was disabled in the update procedure
- Add a button to rerun a command
...And alot more (too long for the update message)