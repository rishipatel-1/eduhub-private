const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  student: { type: mongoose.Types.ObjectId, ref: "users" },
  chapter: { type: mongoose.Types.ObjectId, ref: "chapters" },
  status: {
    type: String,
    enum: ["PENDING", "Not Submitted", "Submitted", "Graded", "Re Submitted"],
    default: "Not Submitted",
  },
  grade: { type: Number },
  gradedBy: { type: mongoose.Types.ObjectId, ref: "users" },
});

const Submissions = mongoose.model("submissions", submissionSchema);

module.exports = { Submissions };
