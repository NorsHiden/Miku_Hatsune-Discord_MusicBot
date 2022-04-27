const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder().setName("leave").setDescription("Stops the bot and clears the queue"),
	run: async ({ bot, interaction }) => {
		const queue = bot.player.getQueue(interaction.guildId)
		if (!queue) return await interaction.editReply({embeds: [
			new MessageEmbed().setDescription(`**There are no song in the queue**`).setColor(process.env.embedColor)
		]})

		let embed = 

		queue.destroy()
        await interaction.editReply({embeds: [
			new MessageEmbed().setDescription(`**The queue has been cleared, Bye!**`).setColor(process.env.embedColor)
		]})
	}
}