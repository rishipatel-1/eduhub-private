const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  enrolled_students: [{ type: mongoose.Types.ObjectId, ref: "users" }],
  createdBy: { type: mongoose.Types.ObjectId, ref: "users" },
});

const Courses = mongoose.model("courses", courseSchema);

module.exports = { Courses };
