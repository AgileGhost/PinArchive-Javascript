This is a recode of the Pin-Archiver bot and is extremely experimental and isn't recommended for usage! Please visit the original repo at [Here](https://github.com/HaiderZaidiDev/Discord-Pin-Archiver-Bot)



### Prerequisites: 
> NodeJs v16.10.x or above  [Download](https://nodejs.org/en/download/current/)

> MongoDB Community Edition v5.0 or above   [Download](https://docs.mongodb.com/manual/installation/)

> Discord Bot Token   [Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)

> Git (optional can download from github instead)	  [Download](https://git-scm.com/downloads)



### Downloading the bot: 
Open up a terminal, CMD will do on windows. Navigate to a folder using “cd” to a folder, preferably to the desktop (“cd Desktop”) and use the following commands. 

1. `git clone https://github.com/AgileGhost/PinArchive-Javascript.git`
2. `cd PinArchive-Javascript`

^^ PinArchive-Javascript is your main folder. 
For manual download GitHub Link: [Here](https://github.com/AgileGhost/PinArchive-Javascript)



### Configuration: 
To even start the bot you will need to first configure the bot. Inside the main folder for the bot there will be:
`config_EXAMPLE.json` to rename the file so it says `config.json`

```json
{
  "TOKEN": "PLACE YOUR TOKEN HERE!!!",
  "MONGOOSE_LOGIN": "mongodb://localhost:27017/PinArchive"
}
```

Only replace the token value with the token of your bot. **DO NOT** touch the `mongoose_login` value unless you know what you’re doing.  



### Installing more dependencies:
To install dependencies open the main folder (should contain `index.js`) of the bot inside of terminal, powershell or CMD depending on your operating system, type the following into your terminal.

 * `npm install`

**Note:** If you get errors upon installing, try to delete `package-lock.json` and try again. 

Upon completion it should look something like this:
```
added 51 packages, and audited 52 packages in 4s

8 packages are looking for funding
  run `npm fund` for details
```


### Starting

#### Without PM2:
To start the bot you will need to return or open the main folder of the bot in your apporatire terminal; and enter the following.

  `node index.js`
	
This should start the bot, and if successful it should look something like this:

```
Loading Interaction: ping.js in Test
Loading Interaction: settings.js in Test
Loading Msg CMD: ping.js in Test
Loading Msg CMD: settings.js in Test
#Audit: channelPinsUpdate.js has been loaded
#Audit: messsageReactionAdd.js has been loaded
Successsfully connected to the database
Connected! Logged in as Dummy#0805
```

#### With PM2:
**NOTE:** This part is assuming you already have PM2 installed on your system. 

Starting with PM2 has more advantages that starting normally as the bot will recover if there is an unfortunate crash as PM2 attaches itself to the process and monitors if it's running, if it's not running then it will try to start it up again depending on the settings. **To start with PM2** naivate to your main folder of the bot, inside of a terminal and type the following:

* `pm2 start index.js`
	
If you wish you can add ` --name “Put name here”` to attach a name for the process within pm2 and/or ` --log “Log File DIR”` to log all console activity of the process into that file. However It needs to be like this `pm2 start index.js --name "Dummy" --log logs.txt`For more information please take a look at this [guide](https://pm2.keymetrics.io/docs/usage/quick-start/)

	

### Inviting the bot:
To invite the bot please follow the steps on this [guide.](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links) 


### Using the bot:
Upon joining the server the bot *should* automatically set itself up by creating its own channel, if it has permission. If it doesn’t have permission then the channel will have to be mainly made using the create channel button when right clicking the side bar containing channels. You will **have** to name this channel `pin-archive`

To **archive a message** you will have to manually pin by hovering over the message, and clicking the 3 dots to the right. A small menu should pop up and you will need to press `Pin Message.` It will ask if you wish to pin the message by clicking the large blue button. 

This should automatically archive the message into the pin-archive channel, and will look like the following. The “Original” blue text will take you to the original message. If the message was deleted it will just take you to the area it was originally.

**Note:** When a channel reaches its maximum pin of 50 pins, it will automatically remove the oldest pin. However this can be disabled within the settings. 

### Commands:
Using the interaction commands, you just type `/` in the chat area and it will automatically pop up all the commands available, there should be `ping` and `settings.` The ping command will simply ping the bot and show how long it takes the bot to notice the message and respond. The settings commands are simply used to see the current settings and is the only way you can view them unlike the other message commands.


Using message commands you will need to type the prefix of the bot; the default is “m!” there is also just “ping” and “settings.” The ping command is the same as before, just using the message command format. However the settings command is the only way to change the settings of the bot. (NOT TO VIEW.) This will hopefully be changed later on in future versions. To change the settings you will need to type the following, 
“m!settings [autoremove | archiveall | reactions] [true | false]”



**Autoremove** is the feature that will remove the oldest pin when the 50 pin limit for a channel is reached.

**Archiveall** is experimental and **isn’t recommended for use**. As it will archive all pins that aren't stored within the database, which means that it hasn’t been archived. This is only around if the bot was introduced to the server the first time and there are already pins within the channels, but is to be disabled right after its use! It triggers when a message is pinned.

**Reactions** is a feature that when 7 reactions of the emoji, `📌` is used on a message it will automatically archive that message, which allows members who don’t have permission to pin a message is able to through voting. 

**Note:** The other settings shown within the settings interaction command aren't available at the moment. But will be possibly changed in a future update. 
