const languageSchema = require("../Models/Language.js");

const localisationGet = async function (guild, interaction) {
	var language = await languageSchema.findOne({
		Guild: guild.id,
	});
	if (!language) {
		await languageSchema.create({
			Guild: guild.id,
		});
		console.log(`🏳 Succesfully configured ${guild.name}'s language.`);
		var localisation = require(`../Data/localisation/english.json`);
		return localisation;
	}
	var localisation = require(`../Data/localisation/${language.Language}.json`);
	return localisation;
};

module.exports = { localisationGet };
