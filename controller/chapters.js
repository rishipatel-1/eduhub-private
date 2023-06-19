const { Chapters } = require("../models/chapters");
const { Courses } = require("../models/courses");
const { User } = require("../models/user");
const { validateToken } = require("../utils/validatetoken");

const addChapters = async (req, res) => {
  try {
    const { title, description, practical, image } = req.body;

    console.log("Images: ", image);
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const course = await Courses.findOne({ _id: req.params.courseId });

    if (!course) {
      res.status(500).json({ message: "No Course Found" });
      return;
    }

    const user = await User.findOne({ _id: val_result.user });

    if (!user) {
      res.status(500).json({ message: "No user Found" });
      return;
    }

    console.log("User: ", user);
    console.log("Course: ", course);

    const chapter = await Chapters.create({
      title,
      description,
      practical,
      course: course._id,
      createdBy: user._id,
      image,
    });

    if (!chapter) {
      res
        .status(500)
        .json({ message: "Error While Adding Chapters for Course" });
      return;
    }

    res.status(200).json({
      message: "Chapter Added successfully",
      chapter,
    });
  } catch (err) {
    console.log("Error While Creating Chatpers for Course", err);
    res.status(500).json({ message: "Error While Creating Chapters" });
  }
};

const updateChapter = async (req, res) => {
  try {
    const { title, description, practical, image } = req.body;
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const uChapter = await Chapters.findOneAndUpdate(
      {
        _id: req.params.chapterId,
      },
      {
        $set: {
          title,
          description,
          practical,
          image,
        },
      },
      { new: true }
    );

    if (!uChapter) {
      res.status(500).json({ message: "Error While Updating Chapter" });
      return;
    }

    res
      .status(200)
      .json({ message: "Chapted Updated Successfully", chapter: uChapter });
  } catch (err) {
    console.log("Error While Updating Chapter");
    res.status(500).json({ message: "Error While Updating Chapter" });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const dChapter = await Chapters.findOneAndDelete({
      _id: req.params.chapterId,
    });

    if (!dChapter) {
      res.status(500).json({ message: "Error While Deleting Chapter" });
      return;
    }
    res.status(200).json({ message: "Chapter Deleted Successfully" });
  } catch (err) {
    console.log("Error While Deleting Chapter");
    res.status(500).json({ message: "Error While Deleting Chapter" });
  }
};

const getChapterByCourseId = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);

    if (!val_result.valid) {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const AllChapters = await Chapters.find({ course: req.params.courseId });

    if (!AllChapters) {
      res.status(500).json({ message: "Error While Fetching Chapters" });
      return;
    }
    res
      .status(200)
      .json({ message: "Chapters Fetched", chapters: AllChapters });
  } catch (err) {
    console.log("Error While Fecthing Chapters");
    res.status(500).json({ message: "Error While Fetching Chapters" });
  }
};

module.exports = {
  addChapters,
  updateChapter,
  deleteChapter,
  getChapterByCourseId,
};
