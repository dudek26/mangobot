const { EmbedBuilder } = require("discord.js");

const languageSchema = require("../../Models/Language.js")

module.exports = {
	name: "guildCreate",

	async execute(guild, client) {

		const channel = client.guilds.cache.get("933393135881555978").channels.cache.get("1096555726622703837")
		const embed = new EmbedBuilder()
			.setTitle("New Guild!")
			.setThumbnail(guild.iconURL({ dynamic: true }))
			.addFields(
					{ name: "Name", value: `${guild.name}` },
					{ name: "ID", value: `${guild.id}` },
					{ name: "Members", value: `${guild.memberCount}` },
					{ name: "Owner", value: `${guild.ownerId}` },
					{ name: "Region", value: `${guild.region}` },
					{ name: "Created At", value: `${guild.createdAt}` },
					{ name: "Boosts", value: `${guild.premiumSubscriptionCount}` },
			)
			.setColor("Green")
			.setTimestamp()

		console.log(`\n ➕ Joined ${guild.name} (${guild.id}).`)
		var selectedLanguage = await languageSchema.findOne({
			Guild: guild.id
		})
		if (!selectedLanguage) {
			await languageSchema.create({
				Guild: guild.id
			})
			selectedLanguage = "english"
			console.log(` 🏳  Succesfully configured ${guild.name}'s language (${guild.id}).`)
		}
		channel.send({ embeds: [embed] })

	},
};