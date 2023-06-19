const express = require("express");

const {
  getToken,
  signup,
  validateTokenExistToken,
  verifyEmail,
  getAllUsers,
  getAllStudents,
} = require("../controller/user");

const router = express.Router();

router.post("/login", getToken);

router.post("/signup", signup);

router.get("/validate", validateTokenExistToken);

router.get("/verify-email/:token", verifyEmail);

router.get("/all-users", getAllUsers);

router.get("/all-students", getAllStudents);

module.exports = router;
