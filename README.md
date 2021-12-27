# OPlonkBot
## Info
OPlonkbot was created by OPlonker in an effort to reduce the number of follow spam bot raids (Hoss Bots for example).
This expanded into removing all potentially harmful bots from chat, such as lurking bots and Advertising bots.
Commands were added for ease of use and for fun :p. 
## Chat Interaction
All messages are converted to lowercase before interpreting and looking for key words. This means none of teh functions are case sensitive. 
### Commands
All commands are preceded by two exclamation marks (**!!**)
#### Mod Commands
These commands are only useable by the channel broadcaster, channel mods and OPlonker.
##### isBanned
Arguments: ***Username***<br>
Action: Checks if the provided ***Username*** is on the watchlist used to ban follow spam bots. Replies in chat either *"**[Username]** is on the watchlist. **[NumberOfAltNames]** alts generated for this user."* or *"**[Username]** is not on the watchlist."* <br>
##### addBan
Arguments: ***Username*** <br>
Action: Adds the given ***Username*** along with generated alternate names to the watchlist used to ban follow spam bots. <br>
Usage: There are two method of creating alternate names implemented in the code. The first is less complex and more conservative, swapping each character in the given username with a specific set of other characters e.g. swapping the letter O for the number 0. <br>
The second method allows for more specific control over the alternate generation by allowing the name to be split into chunks and have one of three functions executed on those chunks. <br> 
These functions are: <br>
- Keeping certain chunks constant.
- Using the first method of alternate generation on the chunk.
- Swapping each character in a chunk with every other letter in the alphabet and each number 0-9. <br>
These three functions by surrounding the chosen chunk with the bracket corresponding to the function. <br>
Chunks surrounded by '{}' brackets will remain unchanged in the generated names. <br>
Chunks surrounded by '()' brackets will use the first method to change the characters. <br>
Chunks surrounded by '[]' brackets will be replaced by all other characters in the alphabet and numbers 0-9 in the alternate names. 
##### lsAlts
Arguments: ***Username***, Optional[ ***StartingIndex***, ***NumberToDisplay*** ] <br>
Action: Lists a small number of the alternate names generated for a username. <br>
##### rmBan
Arguments: ***Username*** <br>
Action: Removes an entire set of alternate names from the watchlist. <br> 
##### unban
Arguments: ***Username*** <br>
Action: Runs the Twitch unban command on the given ***Username***. <br>
##### raid
Action: *"TombRaid TombRaid Welcome Raiders!! TombRaid TombRaid"* message is sent into chat.
##### echo
Arguments: ***Phrase*** <br>
Action: Repeats the ***Phrase*** in chat, can be used by mods to execute commands as the bot. (Originally used to use Roulette command in TornadoPotato's chat) <br>
##### ban
Arguments: ***Username*** <br>
Action: Runs the Twitch ban command on the given ***Username***. <br>
#### Chatter Commands
##### steerassist
Response: *"Steer assist is on, no monkaSTEER for me!!"* <br>
##### ddreminder
Response: *"Remind yourself that overconfidence is a slow and insidious killer" - Darkest Dungeon"* <br>
##### aimassist
Response: *"My aim is usually better than this I swear, too much aim assist in this game! PepegaAim"* <br>
##### oplonkbot
Response: *"I am a bot created by OPlonker1. I add some fun commands GlitchCat, I am also trying to fight the bad bots!! MrDestructoid"* <br>
##### tentacles
Response: *"All the tentacles!!! Squid1 Squid2 Squid3 Squid2 Squid4"* <br>
##### crossword
Response: *"Crossword is love, Crossword is life. duDudu <3 "* <br>
##### commands
Response: Provides a list of all commands available to viewers. <br>
##### keywords
Response: Provides a list of all key words that trigger a response from the bot. <br>
##### children
Response: *"They're all mistakes, children. Filthy, nasty things. Glad I never was one." - Miss Trunchbull, Matilda"* <br>
##### nottoday
Response: *"Many Fall In The Face Of Chaos, But Not This One. Not Today." - Darkest Dungeon"* <br>
##### micdeath
Response: *"Mic murder in progress!!"* <br>
##### internet
Response: *"All the ether is leaking out of the ethernet cables!! panicBasket"* <br>
##### catjams
Arguments: Optional[ ***NumberOfEmotes*** ] <br>
Response: The bot will spam the catJAM emote ***NumberOfEmotes*** times in the same message with a minimum of 1 and a maximum of 60.<br>
Optional: The bot will use four emotes if there is no ***NumberOfEmotes*** given.
##### jammies
Arguments: Optional[ ***NumberOfEmotes*** ] <br>
Response: The bot will spam the Jammies emote ***NumberOfEmotes*** times in the same message with a minimum of 1 and a maximum of 60. <br>
Optional: The bot will use four emotes if there is no ***NumberOfEmotes*** given.
##### hydrate
Response: *"Drink cactus juice!! It'll quench ya!! Nothing's quenchier!! It's the quenchiest!! HSCheers"* <br>
##### driving
Response: *"Driving is easy!! monkaSTEER"* <br>
##### talking
Response: *"Don't Talking Chat!!"* <br>
##### screen
Response: *"I must keep my gameplay secret BrainSlug"* <br>
##### toxic
Response: *"Wait.... is that a ToxicSpud? PJSalt cvHazmat"* <br>
##### tunes
Response: *"PepoDance blobDance pepeJAM catJAM"* <br>
##### shoot
Arguments: Optional[ ***Username*** ] <br>
Response: *"@[**User**] has shot at @[**Username**]"*, if the ***Username*** is not in chat *", but they aren't there."* is added to the end of the message. <br>
Optional: If there is no ***Username*** entered a random viewer will be chosen. <br>
##### alexa
Response: *"I wasn't talking to you!"* <br>
##### hope
Response: *"A little hope, however desperate is never without worth." - Darkest Dungeon"* <br>
##### bonk
Arguments: Optional[ ***Username*** ] <br>
Response: *"@[ **Username** ] Bonk, to jail with you! FootYellow StinkyCheese"* <br>
Optional: If there is no ***Username*** entered the *"@[**Username**]"* is excluded from the message. <br>
##### mic
Response: *"Mic got tired. Have to wake it up. BOP"* <br>
##### docs
Response: Sends a link to this documentation into chat. <br>
### Message Replies List
##### chat blind?
Trigger: Message contains trigger phrase. <br>
Response: *"Chat blind confirmed! peepoLeave"* <br>
##### clue blind?
Trigger: Message contains trigger phrase. <br>
Response: *"Clue blind confirmed! PunOko"* <br>
##### badaboom?
Trigger: Message equals trigger word. <br>
Response: *"Big BadaBoom!!"* <br>
##### modcheck
Alternates: "modcheck?", "modcheck!" <br>
Trigger: Message equals trigger word. <br>
Response: *"@[ **User** ] modCheck? Do you really want to incur the wrath of the all powerful mods?"* <br>
##### stronk
Trigger: Message equals trigger word. <br>
Response: *"Got them big stronk muscles!"* <br>
##### smort
Trigger: Message equals trigger word. <br>
Response: *"That's a lot of brain cells! 5Head"* <br>
##### !twss
Trigger: Message equals trigger word. <br>
Response: *"That is definitely what she said! KEKW"* <br>
##### rip
Trigger: Message contains trigger word. <br>
Response: *"riPepperonis riPepperonis"* <br>
## Bot Detection
### Follow Spam Bots
A list of bots was created manually as they appeared.
Alternate names were then created algorithmically using this manual list to prevent users with small changes to their name from re-entering the channel.
Adding to the list can be done using the chat command and the alternates are generated automatically.
This list is global and affects all channels the bot is in. <br>
WARNING: Adding short names to the list is not recommended as the bot relies on finding the names in any part of the name. e.g If the word "plonk" is in the ban list, any user with **"plonk"** in their name such as O**Plonk**er and O**Plonk**bot will be banned. 
### Advertising Bots
These bots are identified by specific words in a message.
An example set of words may be [ *buy, followers, primes* ].
Regex is then used to identify specific links in the message.
These links have to be manually added to the code when a new one appears.
If all the words in the set are found and a specific link is identified the user is banned.
### Lurking & Other Bots
The bot is uses a list of bots obtained from here: [Twitch Insights](https://twitchinsights.net/bots) <br>
Any user that enters the channel with a username on this list who is seen in over 100 other channels is instantly banned with the message "Accused of being a bot".
So far this list has appeared to be reliable with only one confirmed case of a false ban. The user was flagged as a bot in over 10,000 channels, last seen in November of 2020.
Current theory is that the original account may have been banned and released back as an available username. 