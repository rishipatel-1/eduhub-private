const express = require("express");

const {
  getToken,
  signup,
  validateToken,
  verifyEmail,
  getAllUsers,
} = require("../controller/user");

const router = express.Router();

router.post("/login", getToken);

router.post("/signup", signup);

router.get("/validate", validateToken);

router.get("/verify-email/:token", verifyEmail);

router.get("/all-users", getAllUsers);

module.exports = router;
