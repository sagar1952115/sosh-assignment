const mongoose = require("mongoose");
const postSchema = mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	createdBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "bloguser",
		required: true,
	},
	createdOn: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("blogpost", postSchema);
