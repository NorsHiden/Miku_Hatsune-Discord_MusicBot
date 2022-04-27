const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("shuffle").setDescription("Shuffles the queue"),
	run: async ({ bot, interaction }) => {
		const queue = bot.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply({embeds: [
			new MessageEmbed().setDescription(`**There are no song in the queue**`).setColor(process.env.embedColor)
		]})

		queue.shuffle()
        await interaction.editReply(`The queue of ${queue.tracks.length} songs have been shuffled!`)
	}
}