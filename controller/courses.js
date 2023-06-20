const { Chapters } = require("../models/chapters");
const { Courses } = require("../models/courses");
const { Submissions } = require("../models/submission");
const { User } = require("../models/user");

const { validateToken } = require("../utils/validatetoken");

const addCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const val_result = await await validateToken(req.headers.authorization);
    console.log("Val_result: ", val_result);
    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    console.log("Val_result: ", val_result);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const course = await Courses.create({
      title,
      description,
      createdBy: val_result.user,
      enrolled_students: [],
    });

    if (!course) {
      res.status(500).json({ message: "Error While updating Course" });
      return;
    }

    res.status(200).json({
      message: "course created successfully",
      course,
    });
  } catch (err) {
    console.log("Error While Creating Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Creating Course", error: err });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description } = req.body;

    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const result = await Courses.findOneAndUpdate(
      { _id: req.params.courseId },
      {
        $set: {
          title,
          description,
        },
      },
      { new: true }
    );

    if (!result) {
      res.status(500).json({ message: "Error While updating Course" });
      return;
    }
    res
      .status(200)
      .json({ message: "Course Updated Successfully", course: result });
  } catch (err) {
    console.log("Error While Updating Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Updating Course", error: err });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const dcourse = await Courses.findOneAndDelete({
      _id: req.params.courseId,
    });

    if (!dcourse) {
      res
        .status(500)
        .json({ message: "Error While Deleting Course", course: dcourse });
      return;
    }
    res.status(200).json({ message: "Course Deleted Successfully" });
  } catch (err) {
    console.log("Error While Deleting Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Deleting Course", error: err });
  }
};

const AddStudentstoCourse = async (req, res) => {
  try {
    const { studentEmail, stack } = req.body;

    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const course = await Courses.findOne({ _id: req.params.courseId });

    if (!course) {
      res.status(500).json({ message: "Error Course does not exist" });
      return;
    }

    const student = await User.findOneAndUpdate(
      { email: studentEmail },
      {
        $set: {
          stack: stack,
        },
        $addToSet: { courses: req.params.courseId },
      },
      { new: true }
    );

    if (!student) {
      res.status(500).json({ message: "Email should be verified" });
      return;
    }

    const uCourse = await Courses.findByIdAndUpdate(
      req.params.courseId,
      { $addToSet: { enrolled_students: student._id } },
      { new: true }
    );

    if (!uCourse) {
      res
        .status(500)
        .json({ message: "Error While Enrolling Student for Course" });
      return;
    }
    res
      .status(200)
      .json({ message: "Student Enrollment Successfull", course: uCourse });
  } catch (err) {
    console.log("Error While Enrolling Student for Course:\n", err);
    res.status(500).json({
      message: "Error While Enrolling Student for Course",
      error: err,
    });
  }
};

const AddStudentstoCourses = async (req, res) => {
  try {
    const { studentEmail, stack, courseList } = req.body;

    console.log("Student Enrollment: ", req.body);
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const course = await Courses.findOne({ _id: { $in: courseList } });

    if (!course) {
      res.status(500).json({ message: "Error Course does not exist" });
      return;
    }

    // const student = await User.findOneAndUpdate(
    //   { email: studentEmail },
    //   {
    //     $set: {
    //       stack: stack,
    //     },
    //     $addToSet: { courses: { $each: courseList } },
    //   },
    //   { new: true }
    // );

    // const student = await User.findOne({
    //   email: studentEmail,
    // });

    const student = await User.findOneAndUpdate(
      { email: studentEmail },
      {
        $set: {
          stack: stack,
        },
      },
      {
        new: true,
      }
    );
    console.log("Students: ", student);

    if (!student) {
      res.status(500).json({ message: "Error While updating Student Stack" });
      return;
    }

    // const uCourse = await Courses.findByIdAndUpdate(
    //   req.params.courseId,
    //   { $addToSet: { enrolled_students: student._id } },
    //   { new: true }
    // );
    console.log("works till here");

    const ucourses = await Courses.updateMany(
      { _id: { $in: courseList } },
      {
        $addToSet: { enrolled_students: student._id },
      }
    );

    if (!ucourses) {
      res
        .status(500)
        .json({ message: "Error While Enrolling Student for Course" });
      return;
    }
    res
      .status(200)
      .json({ message: "Student Enrollment Successfull", course: ucourses });
  } catch (err) {
    console.log("Error While Enrolling Student for Course:\n", err);
    res.status(500).json({
      message: "Error While Enrolling Student for Course",
      error: err,
    });
  }
};

const updateStudentsEnrollment = async (req, res) => {
  try {
    const { studentEmail, stack, courseList } = req.body;

    console.log("Student Enrollment: ", req.body);
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const course = await Courses.findOne({ _id: { $in: courseList } });

    if (!course) {
      res.status(500).json({ message: "Error Course does not exist" });
      return;
    }
    const student = await User.findOneAndUpdate(
      { email: studentEmail },
      {
        $set: {
          stack: stack,
        },
      },
      {
        new: true,
      }
    );

    if (!student) {
      res.status(500).json({ message: "Error While updating Student Stack" });
      return;
    }
    const denrollStudent = await Courses.updateMany(
      {},
      { $pull: { enrolled_students: student._id } }
    );

    if (!denrollStudent) {
      console.log("Error While Updating student Enrollment: ");
      res
        .status(500)
        .json({ message: "Error While Updating Student Enrollment" });
      return;
    }

    const ucourses = await Courses.updateMany(
      { _id: { $in: courseList } },
      {
        $addToSet: { enrolled_students: student._id },
      }
    );

    if (!ucourses) {
      res
        .status(500)
        .json({ message: "Error While Enrolling Student for Course" });
      return;
    }
    res
      .status(200)
      .json({ message: "Student Enrollment Successfull", course: ucourses });
  } catch (err) {
    console.log("Error While Enrolling Student for Course:\n", err);
    res.status(500).json({
      message: "Error While Enrolling Student for Course",
      error: err,
    });
  }
};

const deleteStudentsEnrollments = async (req, res) => {
  try {
    const { studentId, courseList } = req.body;

    console.log("Student Enrollment: ", req.body);
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    // const student = await User.findOneAndUpdate(
    //   { email: studentEmail },
    //   {
    //     $set: {
    //       stack: stack,
    //     },
    //     $addToSet: { courses: { $each: courseList } },
    //   },
    //   { new: true }
    // );

    const student = await User.findOne({
      _id: studentId,
    });

    // console.log("student: ", student);

    // const uCourse = await Courses.findByIdAndUpdate(
    //   req.params.courseId,
    //   { $addToSet: { enrolled_students: student._id } },
    //   { new: true }
    // );

    const denrollStudent = await Courses.updateMany(
      {},
      { $pull: { enrolled_students: studentId } }
    );

    if (!denrollStudent) {
      console.log("Error While Deleting student Enrollments: ");
      res
        .status(500)
        .json({ message: "Error While Deleting Student Enrollments" });
      return;
    }

    res.status(200).json({ message: "Student Enrollment Deleted Successfull" });
  } catch (err) {
    console.log(
      "Error While deleting Enrollment for  Student for Course:\n",
      err
    );
    res.status(500).json({
      message: "Error While deleting Students Enrollment for Course",
      error: err,
    });
  }
};

const removeEnrollment = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;

    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    // const student = await User.updateOne(
    //   { _id: studentId },
    //   { $pull: { enrolled_courses: courseId } }
    // );

    // if (!student) {
    //   res.status(500).json({ message: "Error While deleting Student Stack" });
    //   return;
    // }

    const ucourses = await Courses.updateOne(
      { _id: courseId },
      {
        $pull: { enrolled_students: studentId },
      }
    );

    if (!ucourses) {
      res
        .status(500)
        .json({ message: "Error While deleting Student for Course" });
      return;
    }
    res.status(200).json({
      message: "Student Enrollment deleted Successfull",
      course: ucourses,
    });
  } catch (err) {
    console.log("Error While Deleting Enrollment", err);
    res.status(500).json({ message: "Error WHile Deleting Enrollment" });
  }
};

const getAllCourse = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Need to Login to Access Course List ",
      });
      return;
    }

    const AllCourses = await Courses.find({}).populate("enrolled_students");

    if (!AllCourses) {
      res.status(500).json({ message: "Error While Fetching All Courses" });
      return;
    }

    const studentCount = await User.countDocuments({ user_role: "student" });

    res.status(200).json({
      message: "All Courses",
      courses: AllCourses,
      totalStudents: studentCount,
    });
  } catch (err) {
    console.log("Error While Fetching Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Fetching Course", error: err });
  }
};

const getAllCourse2 = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Need to Login to Access Course List ",
      });
      return;
    }

    const enroll_data = await User.aggregate([
      {
        $match: {
          user_role: "student",
        },
      },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "enrolled_students",
          as: "enrolled_courses",
        },
      },
      // {
      //   $match: {
      //     enrolled_courses: { $ne: [] },
      //   },
      // },
      {
        $project: {
          _id: 1,
          username: 1,
          email: 1,
          user_role: 1,
          stack: 1,
          enrolled_courses: 1,
        },
      },
    ]);

    if (!enroll_data) {
      res.status(500).json({ message: "Error While Fetching All Courses" });
      return;
    }

    const studentCount = await User.countDocuments({ user_role: "student" });

    res.status(200).json({
      message: "All Courses",
      enroll_data: enroll_data,
      totalStudents: studentCount,
    });
  } catch (err) {
    console.log("Error While Fetching Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Fetching Course", error: err });
  }
};

const getStudentCourse = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const StudCourses = await Courses.find({
      enrolled_students: val_result.user,
    })
      .populate({
        path: "createdBy",
        select: { username: 1, email: 1 },
      })
      .select({
        _id: 1,
        title: 1,
        description: 1,
        createdBy: 1,
      });

    if (!StudCourses) {
      res.status(500).json({ message: "Error While Fetching All Courses" });
      return;
    }
    res.status(200).json({ message: "All Courses", courses: StudCourses });
  } catch (err) {
    console.log("Error While Creating Course:\n", err);
    res
      .status(500)
      .json({ message: "Error While Creating Course", error: err });
  }
};

const getCourseById = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const course = await Courses.findOne({ _id: req.params.courseId })
      .populate("enrolled_students")
      .populate("createdBy");
    if (!course) {
      res.status(500).json({ message: "Error While Fetching  Course" });
      return;
    }
    res.status(200).json({ message: "Course", course: course });
  } catch (err) {
    console.log("Error While Fetching COurse By Id : ", err);
    res.status(500).json({ message: "Error While Fetching Course By Id" });
  }
};

const getCourseProgress = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const course = await Courses.findOne({
      _id: req.params.courseId,
      enrolled_students: val_result.user,
    })
      .populate("enrolled_students")
      .populate("createdBy");
    if (!course) {
      res.status(500).json({ message: "Error While Fetching  Course" });
      return;
    }

    const chapters = await Chapters.find({ course: req.params.courseId });

    if (!chapters) {
      res.status(500).json({ message: "Error While Fetching  Chapters" });
      return;
    }

    const chapterIds = chapters.map((chap) => chap._id);
    const grades = await Submissions.find({
      student: val_result.user,
      chapter: { $in: chapterIds },
    }).populate("chapter");

    res.status(200).json({
      message: "Course",
      course: course,
      chapters: chapters,
      submission: grades,
    });
  } catch (err) {
    console.log("Error While Fetching COurse By Id : ", err);
    res.status(500).json({ message: "Error While Fetching Course By Id" });
  }
};

module.exports = {
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
};
