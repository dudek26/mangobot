const {
	SlashCommandBuilder
} = require("discord.js");

const {
	localisationGet
} = require("../../Functions/localisationGet.js")


module.exports = {
	data: new SlashCommandBuilder()
		.setName("experience")
		.setDescription("Minecraft experience calculator.")
		.addSubcommand(subcommand =>
			subcommand
			.setName('current')
			.setDescription('Calculate how much experience you have.')
			.addNumberOption(option => option
				.setName('current_level')
				.setDescription('Your current level.')
				.setRequired(true)))
				
		.addSubcommand(subcommand =>
			subcommand
			.setName('level')
			.setDescription('Calculate what level you have to get to have your target experience.')
			.addNumberOption(option => option
				.setName('target_experience')
				.setDescription('Your target experience.')
				.setRequired(true)))

		.addSubcommand(subcommand =>
			subcommand
			.setName('difference')
			.setDescription('Calculate how much experience is needed to get your target level.')
			.addNumberOption(option => option
				.setName('current_level')
				.setDescription('Your current level.')
				.setRequired(true))
			.addNumberOption(option => option
				.setName('target_level')
				.setDescription('Your target level.')
				.setRequired(true)))

		.addSubcommand(subcommand =>
			subcommand
			.setName('addition')
			.setDescription('Calculate how much experience is needed to get your target level.')
			.addNumberOption(option => option
				.setName('current_level')
				.setDescription('Your current level.')
				.setRequired(true))
			.addNumberOption(option => option
				.setName('additional_experience')
				.setDescription('Experience you want to add.')
				.setRequired(true))),

	async execute(interaction) {

		const localisation = await localisationGet(interaction.guild, interaction)
		if (localisation == "stop") return;


		var current_level = interaction.options.getNumber('current_level');

		switch (true) {
			case (current_level < 0):
				interaction.reply({
					content: "que",
					ephemeral: true
				})
				return;
			case (current_level <= 16):
				var current_experience = current_level * current_level + 6 * current_level
				break;
			case ((current_level <= 31) && (current_level > 16)):
				var current_experience = 2.5 * current_level * current_level - 40.5 * current_level + 361
				break;
			case (current_level > 31):
				var current_experience = 4.5 * current_level * current_level - 162.5 * current_level + 2221
				break;
			default:
				interaction.reply(localisation.error)
				return;
		}

		switch (interaction.options.getSubcommand()) {
			case 'current':
				const fin_experience_current = localisation.experience_current.replace('${current_experience}', `\`${current_experience}\``)
				interaction.reply(fin_experience_current)
				break;
			case 'level':
				var target_experience = interaction.options.getNumber('target_experience');
				switch (true) {
					case (target_experience < 0):
						interaction.reply({
							content: "que",
							ephemeral: true
						})
						return;
					case (target_experience <= 352):
						var target_level = Math.sqrt(target_experience + 9) - 3
						break;
					case ((target_experience <= 1507) && (target_experience > 352)):
						var target_level = 81 / 10 + Math.sqrt(2 / 5 * (target_experience - 7839 / 40))
						break;
					case (target_experience > 1507):
						var target_level = 325 / 18 + Math.sqrt(2 / 9 * (target_experience - 54215 / 72))
						break;
					default:
						interaction.reply(localisation.error)
						return;
				}
				const fin_experience_gettolvl = localisation.experience_gettolvl.replace('${target_level}', `\`${target_level.toFixed(2)}\``)
				interaction.reply(fin_experience_gettolvl)
				break;
			case `difference`:
				var target_level = interaction.options.getNumber('target_level');
				switch (true) {

					case (target_level < 0):
						interaction.reply({
							content: "que",
							ephemeral: true
						})
						return;
					case (target_level <= 16):
						var target_experience = target_level * target_level + 6 * target_level
						break;
					case ((current_level <= 31) && (target_level > 16)):
						var target_experience = 2.5 * target_level * target_level - 40.5 * target_level + 361
						break;
					case (current_level > 31):
						var target_experience = 4.5 * target_level * target_level - 162.5 * target_level + 2221
						break;
					default:
						interaction.reply(localisation.error)
						return;
				}

				const experience_difference = target_experience - current_experience

				switch (true) {
					case (experience_difference == 0):
						interaction.reply(localisation.experience_nodifference)
						break;
					case (experience_difference > 0):
						const fin_experience_difference_more = localisation.experience_difference_more.replace('${experience_difference}', `\`${experience_difference}\``)
						interaction.reply(fin_experience_difference_more)
						break;
					case (experience_difference < 0):
						const fin_experience_difference_less = localisation.experience_difference_less.replace('${experience_difference}', `\`${experience_difference*(-1)}\``)
						interaction.reply(fin_experience_difference_less)
						break;
				}
				break;
			case "addition":

				var additional_experience = interaction.options.getNumber('additional_experience');
				var target_experience = current_experience + additional_experience

				switch (true) {
					case (additional_experience < 0):
						interaction.reply({
							content: "que",
							ephemeral: true
						})
						return;
					case (target_experience <= 352):
						var target_level = Math.sqrt(target_experience + 9) - 3
						break;
					case ((target_experience <= 1507) && (target_experience > 352)):
						var target_level = 81 / 10 + Math.sqrt(2 / 5 * (target_experience - 7839 / 40))
						break;
					case (target_experience > 1507):
						var target_level = 325 / 18 + Math.sqrt(2 / 9 * (target_experience - 54215 / 72))
						break;
					default:
						interaction.reply(localisation.error)
						return;
				}
				const fin_experience_sum = localisation.experience_sum.replace('${target_level}', `\`${target_level.toFixed(2)}\``)
				interaction.reply(fin_experience_sum)
				break;




		}
	}
}