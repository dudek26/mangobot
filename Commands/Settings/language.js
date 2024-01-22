const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const languageSchema = require("../../Models/Language.js");
const { localisationGet } = require("../../Functions/localisationGet.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("language")
		.setDescription("Set the language of the bot.")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addStringOption((option) =>
			option
				.setName("language")
				.setDescription("Choose your language.")
				.addChoices(
					{
						name: "English",
						value: "english",
					},
					{
						name: "Polish",
						value: "polish",
						// }, {
						// 	name: "Spanish",
						// 	value: "spanish"
					}
				)
				.setRequired(true)
		),
	async execute(interaction) {
		const localisation = await localisationGet(interaction.guild, interaction);
		if (localisation == "stop") return;

		const language = interaction.options.getString("language");

		languageSchema.findOne(
			{
				Guild: interaction.guild.id,
			},
			async (err, data) => {
				if (!data) {
					await languageSchema.create({
						Guild: interaction.guild.id,
						Language: language,
					});
				}
				const fin_language_change_alreadyset =
					localisation.language_change_alreadyset.replace(
						"${language}",
						`\`${language}\``
					);
				if (data.Language == language)
					return interaction.reply(fin_language_change_alreadyset);

				data.Language = language;
				await data.save();

				const fin_language_changeconfirm =
					localisation.language_changeconfirm.replace(
						"${language}",
						`\`${language}\``
					);
				interaction.reply(fin_language_changeconfirm);
			}
		);
	},
};
