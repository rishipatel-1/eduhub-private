const express = require("express");

const {
  addChapters,
  updateChapter,
  deleteChapter,
  getChapterByCourseId,
} = require("../controller/chapters");

const router = express.Router();

router.post("/addChapter/:courseId", addChapters); /** Add Chapters */

router.put("/updateChapter/:chapterId", updateChapter); /** update Chapter */

router.delete("/deleteChapter/:chapterId", deleteChapter); /** Delete Chapter */

router.get(
  "/getChaptersForCourse/:courseId",
  getChapterByCourseId
); /** get Chapter for the course */

module.exports = router;
