const {
	ComponentType,
	EmbedBuilder,
	SlashCommandBuilder,
	ActionRowBuilder,
	StringSelectMenuBuilder,
} = require("discord.js");
const fs = require("fs");
const path = require("path");
const languageSchema = require("../../Models/Language.js");
const { localisationGet } = require("../../Functions/localisationGet.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("help")
		.setDescription("Get a list of all the commands from the discord bot."),
	async execute(interaction) {
		var language = await languageSchema.findOne({
			Guild: interaction.guild.id,
		});
		if (!language) {
			await languageSchema.create({
				Guild: interaction.guild.id,
			});
			language = "english";
			console.log(
				`🏳 Succesfully configured ${interaction.guild.name}'s language.`
			);
			interaction.reply({
				content: "Bot succesfully configured! Please type your command again.",
				ephemeral: true,
			});
			const brek = "stop";
			return brek;
		}
		const filePath = path.join(
			__dirname,
			`../../Data/localisation/descriptions/${language.Language}.json`
		);
		const descLocalisationData = fs.readFileSync(filePath);

		const descLocalisation = JSON.parse(descLocalisationData);

		const localisation = await localisationGet(interaction.guild, interaction);

		const { client } = interaction;

		const emojis = {
			bot: "🤖",
			settings: "🛠",
			minecraft: "⛏",
		};

		function getCommand(name) {
			const getCommandID = client.application.commands.cache
				.filter((cmd) => cmd.name === name) // Filter by command name
				.map((cmd) => cmd.id); // Map to just the ID property

			return getCommandID;
		}

		const directories = [...new Set(client.commands.map((cmd) => cmd.folder))];

		const formatString = (str) =>
			`${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

		const categories = directories.map((dir) => {
			const getCommands = client.commands
				.filter((cmd) => cmd.folder === dir)
				.map((cmd) => {
					return {
						name: cmd.data.name,
						description:
							cmd.data.description || localisation.help.noDescription,
					};
				});

			return {
				directory: formatString(dir),
				commands: getCommands,
			};
		});

		const embed = new EmbedBuilder()
			.setDescription(localisation.help_selectcategory)
			.setColor("#235ee7")
			.setAuthor({
				name: `Komendy mangobota:`,
				iconURL: client.user.avatarURL(),
			});

		const components = (state) => [
			new ActionRowBuilder().addComponents(
				new StringSelectMenuBuilder()
					.setCustomId("help-menu")
					.setPlaceholder(localisation.help_buttonplaceholder)
					.setDisabled(state)
					.addOptions(
						categories.map((cmd) => {
							return {
								label: cmd.directory,
								value: cmd.directory.toLowerCase(),
								description: `Commands from ${cmd.directory} category.`,
								emoji: emojis[cmd.directory.toLowerCase() || null],
							};
						})
					)
			),
		];

		const initialMessage = await interaction.reply({
			embeds: [embed],
			components: components(false),
		});

		const filter = (interaction) =>
			interaction.user.id === interaction.member.id;

		const collector = interaction.channel.createMessageComponentCollector({
			filter,
			componentType: ComponentType.StringSelect,
		});

		collector.on("collect", (interaction) => {
			const [directory] = interaction.values;
			const category = categories.find(
				(x) => x.directory.toLowerCase() === directory
			);

			const categoryEmbed = new EmbedBuilder()
				.setTitle(
					`${emojis[directory.toLowerCase() || null]}  ${formatString(
						directory
					)} commands`
				)
				.setDescription(
					`A list of all the commands categorized under ${directory}.`
				)
				.setColor("#235ee7")
				.addFields(
					category.commands.map((cmd) => {
						return {
							name: `</${cmd.name}:${getCommand(cmd.name)}>`,
							value: `\`${descLocalisation[cmd.name]}\``,
							inline: true,
						};
					})
				);

			interaction.update({ embeds: [categoryEmbed] });
		});

		collector.on("end", () => {
			initialMessage.edit({ components: components(true) });
		});
	},
};
