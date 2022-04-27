const { SlashCommandBuilder } = require("@discordjs/builders")

module.exports = {
	data: new SlashCommandBuilder().setName("pause").setDescription("Pauses the music"),
	run: async ({ bot, interaction }) => {
		const queue = bot.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply({embeds: [
			new MessageEmbed().setDescription(`**There are no song in the queue**`).setColor(process.env.embedColor)
		]})

		queue.setPaused(true)
        await interaction.editReply("Music has been paused! Use `/resume` to resume the music")
	}
}