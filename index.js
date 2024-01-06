const {
	Client,
	GatewayIntentBits,
	Partials,
	Collection,
} = require("discord.js");
require("dotenv").config();

const keepAlive = require("./server");

const client = new Client({
	intents: [Object.keys(GatewayIntentBits)],
	partials: [Object.keys(Partials)],
});

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

client.commands = new Collection();

client.login(process.env.TOKEN).then(() => {
	loadEvents(client);
	loadCommands(client);
});

keepAlive();
