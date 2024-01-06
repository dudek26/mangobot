const { model, Schema } = require("mongoose");

let languageSchema = new Schema({
	Guild: { type: String, require: true, unique: true },
	Language: { type: String, require: true, default: "english" },
});

module.exports = model("Language", languageSchema);
