const Discord = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require ('discord-api-types/v9')
const fs = require('fs')
const { Player } = require('discord-player')

const TOKEN = process.env.TOKEN

const CLIENT_ID = process.env.CLIENT_ID
const GUILD_ID = process.env.GUILD_ID

const bot = new Discord.Client({
	intents: [
		'GUILDS',
		'GUILD_VOICE_STATES'
	]
})


bot.slashcommands = new Discord.Collection()
bot.player = new Player(bot, {
	ytdlOptions: {
		quality: "highestaudio",
		highWaterMark: 1 << 25
	}
})

let commands = []

const slashFiles = fs.readdirSync('./slashcommands').filter(file => file.endsWith('.js'))

for (const file of slashFiles){
	const slashcmd = require(`./slashcommands/${file}`)
	bot.slashcommands.set(slashcmd.data.name, slashcmd)
	commands.push(slashcmd.data.toJSON())
}

(async () => {
	const rest = new REST({version: '9'}).setToken(TOKEN)
	const response = await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {body: commands})
	// console.log(response);
})();

bot.on("ready", () => {
	bot.user.setActivity("Music", {type: "LISTENING"})
	console.log(`Logged in as ${bot.user.tag}`)
})

bot.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return

	const slashcmd = bot.slashcommands.get(interaction.commandName)
	if (!slashcmd) interaction.reply('Not a valid slash command')
	await interaction.deferReply()
	await slashcmd.run({bot, interaction})
})

bot.login(TOKEN)
