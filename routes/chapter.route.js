const express = require("express");

const {
  addChapters,
  updateChapter,
  deleteChapter,
  getChapterByCourseId,
} = require("../controller/chapters");

const router = express.Router();

router.post("/addChapter/:courseId", addChapters);

router.put("/updateChapter/:chapterId", updateChapter);

router.delete("/deleteChapter/:chapterId", deleteChapter);

router.get("/getChaptersForCourse/:courseId", getChapterByCourseId);

module.exports = router;
