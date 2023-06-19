const express = require('express');

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
  deleteStudentsEnrollments,
  updateStudentsEnrollment,
  getAllCourse2,
} = require('../controller/courses');

const router = express.Router();

router.post('/addCourse', addCourse); /** Add Course */

router.put('/updateCourse/:courseId', updateCourse); /** Update Course */

router.delete('/deleteCourse/:courseId', deleteCourse); /** Delete Course */

router.post('/enroll_student/:courseId', AddStudentstoCourse);

router.post(
  '/enroll_multiple_students/',
  AddStudentstoCourses
); /** Enroll Student for Courses (multiple) */

router.put(
  '/updateEnrollments',
  updateStudentsEnrollment
); /** update the courses Enrollments */

router.put(
  '/deleteEnrollments',
  deleteStudentsEnrollments
); /** Delete Enrollments */

router.put('/removeEnrollment', removeEnrollment);

router.get('/getAllCourses', getAllCourse); /** get All Courses */

router.get('/getCourses', getStudentCourse); /** get Course For Student */

router.get('/getCourseById/:courseId', getCourseById); /** fetch Course By Id */

router.get(
  '/getCourseProgress/:courseId',
  getCourseProgress
); /** get progress for that course of that student for the student */

router.get('/getAllStudentAndCourses', getAllCourse2);

module.exports = router;
