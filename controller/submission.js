const { validateToken } = require("../utils/validatetoken");
const { Submissions } = require("../models/submission");
const { User } = require("../models/user");
const { Chapters } = require("../models/chapters");
const { Courses } = require("../models/courses");
const {
  uploadFileToFirebase,
  deleteFromFirebase,
} = require("../utils/uploadToFireBase");
const { ObjectId } = require("mongodb");

const AddSubmission = async (req, res) => {
  try {
    const { fileUrl } = req.body;
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
            submission: fileUrl,
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
      submission: fileUrl,
      status: "Submitted",
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
          status: "Graded",
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

const uploadSubmission = async (req, res) => {
  try {
    const { chapterId } = req.body;

    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const chapter = await Chapters.findOne({ _id: chapterId });

    if (!chapter) {
      console.log("Chapter Does not Exists for Sumission: ", chapter);
      res.status(500).json({
        message: "Error While uploading Submission for Chatper: ",
        err: chapter,
      });
    }

    const uploadedSubmission = await uploadFileToFirebase(
      req.file,
      chapterId,
      val_result.user
    );

    console.log("UPlaoded File Result : ", uploadedSubmission);
    if (uploadedSubmission && uploadedSubmission.Location) {
      console.log("In Here to send status");
      res.status(200).json({
        message: "file uploaded successfull ",
        upload_location: uploadedSubmission.Location,
      });
      return;
    }
    res.status(500).json({ message: "Error While Uploading Submission " });
  } catch (err) {
    console.log("Eror While Uploading Submission: ", err);
    res.status(500).status({
      message: "Error While Uploading Submission: ",
      err,
    });
    return;
  }
};

const deleteSubmissionFile = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    const resp = await deleteFromFirebase(fileUrl);

    console.log("Delete File After Submission: ");
    res.status(200).json({ message: "File Deleted Successfully" });
  } catch (err) {
    console.log("Error While Deleting File: ", err);
    res.status(500).json({ message: "Error While Deleting Files", error: err });
  }
};

const getAllSubmissions3 = async (req, res) => {
  console.log("req.params.studentId: ", req.params.studentId);
  try {
    const allsumbissions = await User.aggregate([
      {
        $match: {
          user_role: "student",
          _id: new ObjectId(req.params.studentId),
        },
      },
      {
        $lookup: {
          from: "submissions",
          let: {
            studentId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$student", "$$studentId"],
                },
              },
            },
            {
              $lookup: {
                from: "chapters",
                localField: "chapter",
                foreignField: "_id",
                as: "chapter",
              },
            },
            {
              $lookup: {
                from: "courses",
                localField: "chapter.course",
                foreignField: "_id",
                as: "course",
              },
            },
            {
              $project: {
                _id: 1,
                chapter: {
                  $arrayElemAt: ["$chapter", 0],
                },
                course: {
                  $arrayElemAt: ["$course", 0],
                },
                status: 1,
                submission: 1,
                grade: 1,
                gradedBy: 1,
              },
            },
          ],
          as: "submissions",
        },
      },
      {
        $match: {
          submissions: {
            $ne: [],
          },
        },
      },
    ]);
    if (!allsumbissions) {
      console.log("Error While Fetching All Submissions ");
      res.status(500).json({ message: "Error While Fetching the submissions" });
      return;
    }

    res
      .status(200)
      .json({ message: "All Submissions", submissions: allsumbissions });
  } catch (err) {
    console.log("Error While Fetching the Submissions: ", err);
    res
      .status(500)
      .json({ message: "Error WHile fetching the sumbissions", error: err });
  }
};

const getAllSubmissions4 = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const allSubmissions = await Courses.aggregate([
      {
        $match: {
          enrolled_students: new ObjectId(studentId),
        },
      },
      {
        $lookup: {
          from: "chapters",
          localField: "_id",
          foreignField: "course",
          as: "chapters",
        },
      },
      {
        $lookup: {
          from: "submissions",
          let: {
            chapterIds: "$chapters._id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$student", new ObjectId(studentId)],
                    },
                    {
                      $in: ["$chapter", "$$chapterIds"],
                    },
                  ],
                },
              },
            },
          ],
          as: "submissions",
        },
      },
      {
        $addFields: {
          chapters: {
            $map: {
              input: "$chapters",
              as: "chapter",
              in: {
                $mergeObjects: [
                  "$$chapter",
                  {
                    submissions: {
                      $filter: {
                        input: "$submissions",
                        as: "submission",
                        cond: {
                          $eq: ["$$submission.chapter", "$$chapter._id"],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          submissions: 0,
          enrolled_students: 0,
        },
      },
    ]);

    const studentdetail = await User.findOne({ _id: studentId });

    if (!allSubmissions) {
      console.log("Error WHile FEtching Submissions: ");
      res.status(500).json({ message: "Error While Fetching Submissions" });
      return;
    }
    console.log("Data: ", allSubmissions);
    res
      .status(200)
      .json({ submissions: allSubmissions, student: studentdetail });
  } catch (err) {
    console.log("Error While Fetching Submissions: ", err);
    res
      .status(500)
      .json({ message: "Error While Fetching Submissions", error: err });
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
  uploadSubmission,
  deleteSubmissionFile,
  getAllSubmissions3,
  getAllSubmissions4,
};
