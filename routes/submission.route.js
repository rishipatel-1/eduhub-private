const express = require("express");
const {
  AddSubmission,
  updateSubmission,
  gradeSubmission,
  deleteSubmission,
  getSubmissionByStudentId,
  getAllSubmission,
  testgetSubmssision,
} = require("../controller/submission");

const router = express.Router();

router.post("/submitChapter/:chapterId", AddSubmission);

router.put("/updateSubmission/:submissionId", updateSubmission);

router.put("/gradeSubmission/:submissionId", gradeSubmission);

router.delete("/deleteSubmission/:submissionId", deleteSubmission);

router.get("/getSubmission", getSubmissionByStudentId);

router.get("/getAllSubmission", getAllSubmission);

router.get("/getAllSubmission2", testgetSubmssision);

module.exports = router;
