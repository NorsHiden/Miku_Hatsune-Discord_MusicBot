const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
			.setName("skip")
			.setDescription("Skips the current song"),
	run: async ({ bot, interaction }) => {
		const queue = bot.player.getQueue(interaction.guildId)

		if (!queue) return await interaction.editReply({embeds: [
			new MessageEmbed().setDescription(`**There are no song in the queue**`).setColor(process.env.embedColor)
		]})

        const currentSong = queue.current

		queue.skip()
        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(`${currentSong.title} has been skipped!`).setThumbnail(currentSong.thumbnail)
            ]
        })
	}
}