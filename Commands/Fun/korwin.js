const {
	ActionRowBuilder,
	StringSelectMenuBuilder,
	StringSelectMenuOptionBuilder,
	SlashCommandBuilder,
	ComponentType,
	PermissionFlagsBits
} = require("discord.js");

const korwin = require("../../Data/korwin/korwin.json");

function getRandomInt(max) {
	max = Math.floor(max) - 1;
	return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("korwin")
		.setDescription("Utwórz wypowiedź Janusza Korwina-Mikkego.")
		.addBooleanOption(option => option
			.setName('random')
			.setDescription('Losowe generowanie wypowiedzi.')),
	async execute(interaction) {

		var part1, part2, part3, part4, part5, part6;
		var selection1, selection2, selection3, selection4, selection5, selection6;

		if (interaction.options.getBoolean('random') == true) {
			part1 = (korwin.part1[getRandomInt(korwin.part1.length)]);
			part2 = (korwin.part2[getRandomInt(korwin.part2.length)]);
			part3 = (korwin.part3[getRandomInt(korwin.part3.length)]);
			part4 = (korwin.part4[getRandomInt(korwin.part4.length)]);
			part5 = (korwin.part5[getRandomInt(korwin.part5.length)]);
			part6 = (korwin.part6[getRandomInt(korwin.part6.length)]);
			return interaction.reply(`${part1} ${part2} ${part3} ${part4}, ${part5}, ${part6}`);
		}


		await interaction.deferReply()
		// 1
		const select1 = new StringSelectMenuBuilder()
			.setCustomId('select1')
			.setPlaceholder('Wybierz początek swojej wypowiedzi.')

		korwin.part1.forEach((x) => {
			select1.addOptions(
				new StringSelectMenuOptionBuilder()
				.setLabel(x)
				.setValue(x),
			)
		})

		const row1 = new ActionRowBuilder()
			.addComponents(select1);


		// 2
		const select2 = new StringSelectMenuBuilder()
			.setCustomId('select2')
			.setPlaceholder('Wybierz kontynuację swojej wypowiedzi.')

		korwin.part2.forEach((x) => {
			select2.addOptions(
				new StringSelectMenuOptionBuilder()
				.setLabel(x)
				.setValue(x),
			)
		})

		const row2 = new ActionRowBuilder()
			.addComponents(select2);

		// 3
		const select3 = new StringSelectMenuBuilder()
			.setCustomId('select3')
			.setPlaceholder('Wybierz kontynuację swojej wypowiedzi.')
			
		korwin.part3.forEach((x) => {
			select3.addOptions(
				new StringSelectMenuOptionBuilder()
				.setLabel(x)
				.setValue(x),
			)
		})

		const row3 = new ActionRowBuilder()
			.addComponents(select3);

		// 4
		const select4 = new StringSelectMenuBuilder()
			.setCustomId('select4')
			.setPlaceholder('Wybierz kontynuację swojej wypowiedzi.')
			
		korwin.part4.forEach((x) => {
			select4.addOptions(
				new StringSelectMenuOptionBuilder()
				.setLabel(x)
				.setValue(x),
			)
		})

		const row4 = new ActionRowBuilder()
			.addComponents(select4);

		// 5
		const select5 = new StringSelectMenuBuilder()
			.setCustomId('select5')
			.setPlaceholder('Wybierz kontynuację swojej wypowiedzi.')
			
		korwin.part5.forEach((x) => {	
			select5.addOptions(
				new StringSelectMenuOptionBuilder()
				.setLabel(x)
				.setValue(x),
			)
		})
		
		const row5 = new ActionRowBuilder()
			.addComponents(select5);

		// 6
		const select6 = new StringSelectMenuBuilder()
			.setCustomId('select6')
			.setPlaceholder('Wybierz zakończenie swojej wypowiedzi.')
			
		korwin.part6.forEach((x) => {
			select6.addOptions(
				new StringSelectMenuOptionBuilder()
				.setLabel(x)
				.setValue(x),
			)
		})
		
		const row6 = new ActionRowBuilder()
			.addComponents(select6);



		const response = await interaction.editReply({content: `_ _`, components: [row1]});
		///////////////////////////////////////////////////////////
		/////////////////////////part1/////////////////////////////
		///////////////////////////////////////////////////////////


		const collector1 = response.createMessageComponentCollector({
			componentType: ComponentType.StringSelect,
			filter: i => i.user.id === interaction.user.id,
			time: 3600000
		});

		collector1.on('collect', async i => {
			selection1 = i.values[0];
			await interaction.editReply({content: `${selection1}`, components: [row2]});
			collector1.stop();
			i.reply({content: `Wybrano początek: \`${selection1}\``, ephemeral: true})

			///////////////////////////////////////////////////////////
			/////////////////////////part2/////////////////////////////
			///////////////////////////////////////////////////////////

			const collector2 = response.createMessageComponentCollector({
				componentType: ComponentType.StringSelect,
				filter: i => i.user.id === interaction.user.id,
				time: 3600000
			});

			collector2.on('collect', async i => {
				selection2 = i.values[0];
				await interaction.editReply({content: `${selection1} ${selection2}`, components: [row3]});
				collector2.stop();
				i.reply({content: `Wybrano kontynuację: \`${selection2}\``, ephemeral: true})

				///////////////////////////////////////////////////////////
				/////////////////////////part3/////////////////////////////
				///////////////////////////////////////////////////////////

				const collector3 = response.createMessageComponentCollector({
					componentType: ComponentType.StringSelect,
					filter: i => i.user.id === interaction.user.id,
					time: 3600000
				});
	
				collector3.on('collect', async i => {
					selection3 = i.values[0];
					await interaction.editReply({content: `${selection1} ${selection2} ${selection3}`, components: [row4]});
					collector3.stop();
					i.reply({content: `Wybrano kontynuację: \`${selection3}\``, ephemeral: true})
	
					///////////////////////////////////////////////////////////
					/////////////////////////part4/////////////////////////////
					///////////////////////////////////////////////////////////

					const collector4 = response.createMessageComponentCollector({
						componentType: ComponentType.StringSelect,
						filter: i => i.user.id === interaction.user.id,
						time: 3600000
					});
		
					collector4.on('collect', async i => {
						selection4 = i.values[0];
						await interaction.editReply({content: `${selection1} ${selection2} ${selection3} ${selection4},`, components: [row5]});
						collector4.stop();
						i.reply({content: `Wybrano kontynuację: \`${selection4}\``, ephemeral: true})
		
						///////////////////////////////////////////////////////////
						/////////////////////////part5/////////////////////////////
						///////////////////////////////////////////////////////////

						const collector5 = response.createMessageComponentCollector({
							componentType: ComponentType.StringSelect,
							filter: i => i.user.id === interaction.user.id,
							time: 3600000
						});

						collector5.on('collect', async i => {
							selection5 = i.values[0];
							await interaction.editReply({content: `${selection1} ${selection2} ${selection3} ${selection4}, ${selection5},`, components: [row6]});
							collector5.stop();
							i.reply({content: `Wybrano kontynuację: \`${selection5}\``, ephemeral: true})
			
							///////////////////////////////////////////////////////////
							/////////////////////////part6/////////////////////////////
							///////////////////////////////////////////////////////////

							const collector6 = response.createMessageComponentCollector({
								componentType: ComponentType.StringSelect,
								filter: i => i.user.id === interaction.user.id,
								time: 3600000
							});

							collector6.on('collect', async i => {
								selection6 = i.values[0];
								await interaction.editReply({content: `${selection1} ${selection2} ${selection3} ${selection4}, ${selection5}, ${selection6}`, components: []});
								collector6.stop();
								i.reply({content: `Wybrano zakończenie: \`${selection6}\``, ephemeral: true})
				
								
							});
						});
					});
				});
			});
		});
	}
}