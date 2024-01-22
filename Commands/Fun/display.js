const {
	SlashCommandBuilder,
	CommandInteraction,
	PermissionFlagsBits,
	EmbedBuilder,
	AttachmentBuilder,
} = require("discord.js");
const Canvas = require("@napi-rs/canvas");
const { localisationGet } = require("../../Functions/localisationGet.js");

function getStyle(color) {
	switch (color) {
		case "yellow":
			return "#FFB400";
		case "red":
			return "#FF0000";
		case "white":
			return "#FFFFFF";
		case "green":
			return "#00FF00";
		case "purple":
			return "#CB00FF";
		case "blue":
			return "#007AFF";
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName("display")
		.setDescription("Display generator")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("single_line")
				.setDescription("Single line destination display")
				.addStringOption((option) =>
					option.setName("line").setDescription("Line number").setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName("destination")
						.setDescription("Destination")
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("width")
						.setDescription("Width of display, default: 1200")
						.setMinValue(400)
				)
				.addStringOption((option) =>
					option.setName("extra").setDescription("Extra info").addChoices(
						{
							name: "Kurs skrócony",
							value: "KURS SKRÓCONY",
						},
						{
							name: "Trasa zmieniona",
							value: "TRASA ZMIENIONA",
						}
					)
				)
				.addStringOption((option) =>
					option.setName("style").setDescription("Text color").addChoices(
						{
							name: "Red",
							value: "red",
						},
						{
							name: "Yellow",
							value: "yellow",
						},
						{
							name: "White",
							value: "white",
						},
						{
							name: "Green",
							value: "green",
						},
						{
							name: "Purple",
							value: "purple",
						},
						{
							name: "Blue",
							value: "blue",
						}
					)
				)
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("multi_line")
				.setDescription("Two-line destination display")
				.addStringOption((option) =>
					option.setName("line").setDescription("e").setRequired(true)
				)
				.addStringOption((option) =>
					option.setName("destination1").setDescription("e").setRequired(true)
				)
				.addStringOption((option) =>
					option.setName("destination2").setDescription("e").setRequired(true)
				)
				.addIntegerOption((option) =>
					option
						.setName("width")
						.setDescription("Width of display, default: 1200")
						.setMinValue(400)
				)
				.addStringOption((option) =>
					option.setName("style").setDescription("Text color").addChoices(
						{
							name: "Red",
							value: "red",
						},
						{
							name: "Yellow",
							value: "yellow",
						},
						{
							name: "White",
							value: "white",
						},
						{
							name: "Green",
							value: "green",
						},
						{
							name: "Purple",
							value: "purple",
						},
						{
							name: "Blue",
							value: "blue",
						}
					)
				)
		),

	async execute(interaction, client) {
		const localisation = await localisationGet(interaction.guild, interaction);

		let textColor;
		if (!interaction.options.getString("style")) {
			textColor = "#FFFFFF";
		} else textColor = getStyle(interaction.options.getString("style"));

		Canvas.GlobalFonts.registerFromPath(
			"./Data/display/FSEX300.ttf",
			"FSEX300"
		);

		const fontStyle = "FSEX300";

		let width;
		if (interaction.options.getInteger("width")) {
			width = interaction.options.getInteger("width");
		} else if (!interaction.options.getInteger("width")) {
			width = 1200;
		}

		const canvas = Canvas.createCanvas(width, 160);
		const context = canvas.getContext("2d");

		const background = await Canvas.loadImage(
			// `../../Data/display/display_background.jpg`
			`./Data/display/display_background.jpg`
		);

		// This uses the canvas dimensions to stretch the image onto the entire canvas
		context.drawImage(background, 0, 0, canvas.width, canvas.height);

		context.textBaseline = "middle";

		const line = interaction.options.getString("line");

		context.font = `220px ${fontStyle}`;
		context.fillStyle = textColor;
		context.fillText(line, 15, canvas.height / 2 - 6);
		let lineLength = context.measureText(line).width;
		let x, y;
		switch (interaction.options.getSubcommand()) {
			case "single_line":
				const destination = interaction.options.getString("destination");
				context.textBaseline = "middle";
				const applyText = (canvas, text, font) => {
					const context = canvas.getContext("2d");

					// Declare a base size of the font
					let fontSize;
					if (interaction.options.getString("extra")) {
						fontSize = 100;

						context.textBaseline = "alphabetic";
					} else fontSize = 160;

					do {
						// Assign the font to the context and decrement it so it can be measured again
						context.font = `${(fontSize -= 2)}px ${font}`;
						// Compare pixel width of the text to the canvas minus the approximate avatar size
					} while (
						context.measureText(text).width >
						canvas.width - 60 - lineLength
					);

					// Return the result to use in the actual canvas
					return { font: context.font, fontSize: fontSize };
				};

				context.textAlign = "center";

				textMeasure = applyText(canvas, destination, fontStyle);
				context.font = textMeasure.font;

				x = 10 + (lineLength + canvas.width) / 2;
				y = 75;

				if (interaction.options.getString("extra")) {
					y = 70;
					context.fillStyle = textColor;
					context.fillRect(
						x - context.measureText(destination).width / 2 - 5,
						80,
						context.measureText(destination).width + 10,
						-textMeasure.fontSize + 1
					);
					context.fillStyle = "#000000";
				}

				// context.fillText(destination, textMeasure.fontSize / 2 + 640, 75);
				context.fillText(destination, x, y);

				context.fillStyle = textColor;
				if (interaction.options.getString("extra")) {
					context.textBaseline = "top";
					context.font = `80px ${fontStyle}`;
					context.fillText(interaction.options.getString("extra"), x, y + 20);
				}

				// context.fillText(
				// 	destination,
				// 	280,
				// 	context.height -
				// 		(context.height - context.measureText(destination).height / 2)
				// );

				// context.font = "80px FSEX3000";
				// context.fillText("NOWY DWÓR MAZ.", 280, canvas.height - 100);
				// context.fillText("URZĄD MIASTA", 280, canvas.height - 40);
				break;
			case "multi_line":
				const destination1 = interaction.options.getString("destination1");
				const destination2 = interaction.options.getString("destination2");
				const applyDoubleText = (canvas, text1, text2, font) => {
					const context = canvas.getContext("2d");

					// Declare a base size of the font
					let fontSize = 100;

					do {
						// Assign the font to the context and decrement it so it can be measured again
						context.font = `${(fontSize -= 2)}px ${font}`;
						// Compare pixel width of the text to the canvas minus the approximate avatar size
					} while (
						context.measureText(text1).width >
						canvas.width - 60 - lineLength
					);

					do {
						// Assign the font to the context and decrement it so it can be measured again
						context.font = `${(fontSize -= 2)}px ${font}`;
						// Compare pixel width of the text to the canvas minus the approximate avatar size
					} while (
						context.measureText(text2).width >
						canvas.width - 60 - lineLength
					);

					// Return the result to use in the actual canvas
					return { font: context.font, fontSize: fontSize };
				};

				context.textAlign = "center";

				textMeasure = applyDoubleText(
					canvas,
					destination1,
					destination2,
					fontStyle
				);
				context.font = textMeasure.font;

				x = 10 + (lineLength + canvas.width) / 2;
				y = 75;

				context.textBaseline = "alphabetic";
				context.fillText(destination1, x, y - 7);

				context.textBaseline = "top";
				context.fillText(destination2, x, y + 7);

				break;
		}
		const attachment = new AttachmentBuilder(await canvas.encode("png"), {
			name: "display-image.png",
		});
		interaction.reply({
			files: [attachment],
		});
	},
};
