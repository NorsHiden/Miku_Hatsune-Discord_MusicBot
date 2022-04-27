const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")
const { QueryType } = require("discord-player")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("play")
		.setDescription("play music from any platform")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("song")
				.setDescription("play a song from any platform")
				.addStringOption((option) => option.setName("url").setDescription("the song's url").setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("playlist")
				.setDescription("Loads a playlist of songs from a url")
				.addStringOption((option) => option.setName("url").setDescription("the playlist's url").setRequired(true))
		),
	run: async ({ bot, interaction }) => {
		if (!interaction.member.voice.channel) return await interaction.editReply({embeds: [
			new MessageEmbed().setDescription(`**You need to be in a VC to use this command**`).setColor(process.env.embedColor)
		]})

		const queue = await bot.player.createQueue(interaction.guild)
		if (!queue.connection) await queue.connect(interaction.member.voice.channel)

		let embed = new MessageEmbed().setColor(process.env.embedColor)

		if (interaction.options.getSubcommand() === "song") {
            let url = interaction.options.getString("url")
            const result = await bot.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const song = result.tracks[0]
            await queue.addTrack(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** has been added to the Queue`)
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}`})

		} else if (interaction.options.getSubcommand() === "playlist") {
            let url = interaction.options.getString("url")
            const result = await bot.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })

            if (result.tracks.length === 0)
                return interaction.editReply("No results")
            
            const playlist = result.playlist
            await queue.addTracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** have been added to the Queue`)
                .setThumbnail(playlist.thumbnail)
		}
        if (!queue.playing) await queue.play()
        await interaction.editReply({
            embeds: [embed]
        })
	}
}