const { validateToken } = require("../utils/validatetoken");
const { Submissions } = require("../models/submission");
const { User } = require("../models/user");
const { Chapters } = require("../models/chapters");
const { Courses } = require("../models/courses");

const AddSubmission = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const alreadySubmitted = await Submissions.findOne({
      student: val_result.user,
      chapter: req.params.chapterId,
    });

    console.log("Submission: ", alreadySubmitted);

    if (alreadySubmitted) {
      const uSubmission = await Submissions.findOneAndUpdate(
        {
          student: val_result.user,
          chapter: req.params.chapterId,
        },
        {
          $set: {
            status: "Re Submitted",
          },
        },
        { new: true }
      );

      if (!uSubmission) {
        console.log(
          "Error While Updating ALready existing Submission: ",
          uSubmission
        );
        res.status(500).json({
          message: "Error While Updatind Already Existing Submission",
        });
        return;
      }
      res
        .status(200)
        .json({ message: "Submission Updated Successfully", uSubmission });
      return;
    }

    const student = await User.find({ _id: val_result.user });

    if (!student) {
      res.status(500).json({ message: "User Account does not Exist" });
      return;
    }

    const chapter = await Chapters.find({ _id: req.params.chapterId });

    if (!chapter) {
      res.status(500).json({ message: "Chapter does not Exist" });
      return;
    }

    const submission = await Submissions.create({
      student: val_result.user,
      chapter: req.params.chapterId,
      // status,
    });

    if (!submission) {
      res.status(500).json({ message: "Error While Submitting Chapter" });
      return;
    }
    res
      .status(200)
      .json({ message: "Chapter Submitted Successfully", submission });
  } catch (err) {
    console.log("Error While Submitting Chapter: ", err);
    res.status(500).json({ message: "Error While Submitting Chapter" });
  }
};

const updateSubmission = async (req, res) => {
  try {
    const { status } = req.body;

    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    // const student = await User.find({ _id: val_result.user });

    // if (!student) {
    //   res.status(500).json({ message: "User Account does not Exist" });
    //   return;
    // }

    // // const chapter = await Chapters.find({ _id: req.params.chapterId });

    // if (!chapter) {
    //   res.status(500).json({ message: "Chapter does not Exist" });
    //   return;
    // }

    const submission = await Submissions.findByIdAndUpdate(
      req.params.submissionId,
      {
        $set: {
          student: val_result.user,
          status,
        },
      },
      { new: true }
    );

    if (!submission) {
      res.status(500).json({ message: "Error While updating Submission" });
      return;
    }
    res
      .status(200)
      .json({ message: "Submission Updated Successfully", submission });
  } catch (err) {
    console.log("Error While updating Submission: ", err);
    res.status(500).json({ message: "Error While updating Submission" });
  }
};

const gradeSubmission = async (req, res) => {
  try {
    const { grade, status } = req.body;

    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const gradedSubmission = await Submissions.findByIdAndUpdate(
      req.params.submissionId,
      {
        $set: {
          grade,
          status,
          gradedBy: val_result.user,
        },
      },
      { new: true }
    );

    if (!gradedSubmission) {
      res.status(500).json({ message: "Error While grading Submission" });
      return;
    }
    res
      .status(200)
      .json({ message: "Submission Graded", submission: gradedSubmission });
  } catch (err) {
    console.log("Error While grading Submission: ", err);
    res.status(500).json({ message: "Error While grading Submission" });
  }
};

const deleteSubmission = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const dSubmission = await Submissions.findByIdAndDelete(
      req.params.submissionId
    );

    if (!dSubmission) {
      res.status(500).json({ message: "Error While Deleting Submission" });
      return;
    }
    res.status(200).json({ message: "Submission Deleted" });
  } catch (err) {
    console.log("Error While deleting Submission: ", err);
    res.status(500).json({ message: "Error While deleting Submission" });
  }
};

const getSubmissionByStudentId = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const Submissions = await Submissions.find({
      student: val_result.user,
    })
      .populate("chapter")
      .populate("gradedBy");

    if (!Submissions) {
      res.status(500).json({ message: "Error While Fetching Submission" });
      return;
    }
    res
      .status(200)
      .json({ message: "Submission Fetched", submissions: Submissions });
  } catch (err) {
    console.log("Error While Fetching Submission: ", err);
    res.status(500).json({ message: "Error While Fetching Submission" });
  }
};

const getAllSubmission = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const Submissions = await Submissions.find({})
      .populate("chapter")
      .populate("student");

    if (!Submissions) {
      res.status(500).json({ message: "Error While Fetching Submission" });
      return;
    }
    res
      .status(200)
      .json({ message: "Submission Fetched", submissions: Submissions });
  } catch (err) {
    console.log("Error While Fetching Submission: ", err);
    res.status(500).json({ message: "Error While Fetching Submission" });
  }
};

const testgetSubmssision = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    console.log("Result of val_result: ", val_result);
    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    let userData = await User.find({ user_role: "student" });

    userData = await Promise.all(
      userData.map(async (user) => {
        const Allcourses = await Courses.find({ enrolled_students: user._id });
        const courses_ids = Allcourses.map((course) => course._id);
        const submittedPracticals = await Submissions.find({
          student: user._id,
        }).populate("chapter");
        const totalTasks = await Chapters.countDocuments({
          course: { $in: courses_ids },
        });

        return {
          ...user,
          courses: Allcourses,
          tasksCompleted: submittedPracticals.length,
          totalTasks: totalTasks,
          submittedPracticals: submittedPracticals,
        };
      })
    );

    const stacks = await User.distinct("stack", {
      $and: [{ stack: { $ne: null } }, { stack: { $exists: true, $ne: "" } }],
    });

    if (!userData) {
      console.log("error  While fetching submissions: ", userData);
      res.status(500).json({ message: "Error while fetching submissions" });
    }

    res.status(200).json({
      message: "Submissions Fetched",
      allsubmission: userData,
      stacks,
    });
  } catch (err) {
    console.log("Error  while Fetching submission: ", err);
    res.status(500).json({ message: "Error While Fetching SUbmissions" });
  }
};

module.exports = {
  AddSubmission,
  updateSubmission,
  gradeSubmission,
  deleteSubmission,
  getSubmissionByStudentId,
  getAllSubmission,
  testgetSubmssision,
};
