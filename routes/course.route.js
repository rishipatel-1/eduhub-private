const express = require("express");

const {
  addCourse,
  updateCourse,
  deleteCourse,
  AddStudentstoCourse,
  getAllCourse,
  getStudentCourse,
  AddStudentstoCourses,
  removeEnrollment,
  getCourseById,
  getCourseProgress,
} = require("../controller/courses");

const router = express.Router();

router.post("/addCourse", addCourse);

router.put("/updateCourse/:courseId", updateCourse);

router.delete("/deleteCourse/:courseId", deleteCourse);

router.post("/enroll_student/:courseId", AddStudentstoCourse);

router.post("/enroll_multiple_students/", AddStudentstoCourses);

router.put("/removeEnrollment", removeEnrollment);

router.get("/getAllCourses", getAllCourse);

router.get("/getCourses", getStudentCourse);

router.get("/getCourseById/:courseId", getCourseById);

router.get("/getCourseProgress/:courseId", getCourseProgress);

module.exports = router;
