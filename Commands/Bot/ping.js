const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Checks the ping of the bot."),
	async execute(interaction, client) {

		await interaction.deferReply();

    	const reply = await interaction.fetchReply();

    	const botPing = reply.createdTimestamp - interaction.createdTimestamp;

		const embed = new EmbedBuilder()
			.setTitle("Ping")
			.setDescription("Pong!")
			.addFields(
				{ name: "API", value: client.ws.ping + "ms", inline: true },
				{ name: "Bot", value: botPing + "ms", inline: true },
			)
			.setTimestamp()

		await interaction.editReply({ embeds: [embed] })
		return;
	}

};