const { CommandInteraction } = require("discord.js");

module.exports = {
	name: "interactionCreate",

	async execute(interaction, client) {
		if (!interaction.guild)
			return interaction.reply(
				"Sorry, I don't use DMs. Please use my commands on a server."
			);
		const { customId, values, guild, member } = interaction; // you need to destructure values from interaction first to use it below
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) {
				return interaction.reply({ content: "outdated command" });
			}
			var currentdate = new Date();
			var datetime =
				currentdate.getDate() +
				"/" +
				(currentdate.getMonth() + 1) +
				"/" +
				currentdate.getFullYear() +
				" " +
				currentdate.getHours() +
				":" +
				currentdate.getMinutes() +
				":" +
				currentdate.getSeconds();
			console.log(
				`  ❕ (${datetime}) ${interaction.user.tag} (ID: ${interaction.user.id}) used a "${interaction.commandName}" slash command on "${interaction.guild.name}" server (channel ID: ${interaction.channel.id}, server ID: ${interaction.guild.id})`
			);
			command.execute(interaction, client).catch((err) => console.log(err));
		} else if (interaction.isButton()) {
			if (customId == "verify") {
				const role = interaction.guild.roles.cache.get("1011041531114815579");
				return interaction.member.roles.add(role).then((member) =>
					interaction.reply({
						content: `${role} has been assigned to you.`,
						ephemeral: true,
					})
				);
			}
		} else if (interaction.isStringSelectMenu()) {
			if (customId == "reaction-roles") {
				for (let i = 0; i < values.length; i++) {
					const roleId = values[i];

					const role = guild.roles.cache.get(roleId);
					const hasRole = member.roles.cache.has(roleId);

					switch (hasRole) {
						case true:
							member.roles.remove(roleId);
							break;
						case false:
							member.roles.add(roleId);
							break;
					}
				}

				interaction.reply({ content: "Roles updated.", ephemeral: true });
			}
		} else {
			return;
		}
	},
};
