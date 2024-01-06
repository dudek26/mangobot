const { Client } = require("discord.js");
const mongoose = require("mongoose");
require("dotenv").config();

module.exports = {
	name: "ready",
	once: true,
	async execute(client) {
		await console.log(`\n 🔂 Connecting to MongoDB...`);
		await mongoose
			.connect(process.env.MONGODB)
			.then(() => {
				console.log("\n ✅ Succesfully connected to MongoDB!\n ");
			})
			.catch((err) => {
				console.log(err);
			});
		await console.log(` ✅ ${client.user.username} is online!`);

		const beAlive = () => {
			const srv = client.guilds.cache.get("933393135881555978");
			const chann = srv.channels.cache.get("1043862631053807657");
			const time = new Date().toLocaleString("pl-PL");
			chann.send(`Still working! \`${time}\``);
		};
		setInterval(beAlive, 300000);
	},
};
