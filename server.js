const express = require("express");
const server = express();

server.all(`/`, (req, res) => {
	res.send(`Result: [OK].`);
});

function keepAlive() {
	server.listen(3000, () => {
		console.log(`\n✅ Serwer gotowy!\n`);
	});
}

module.exports = keepAlive;
