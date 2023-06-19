const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema({
  title: String,
  description: String,
  practical: String,
  image: String,
  course: { type: mongoose.Types.ObjectId, ref: "courses" },
  createdBy: { type: mongoose.Types.ObjectId, ref: "users" },
});

const Chapters = mongoose.model("chapters", chapterSchema);

module.exports = { Chapters };
