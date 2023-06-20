const jwt = require("jsonwebtoken");
const emailValidator = require("email-validator");

const { ObjectId } = require("mongodb");
const { User } = require("../models/user");
const crypto = require("crypto");
const {
  getPasswordHash,
  validatePassword,
  validatePassHash,
} = require("../utils/passwords");
const { SendMail } = require("../utils/email");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { validateToken } = require("../utils/validatetoken");

const getToken = async (req, res) => {
  const { email, password, code } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email or Password is Empty" });
    return;
  }

  const user = await User.findOne({ email });
  console.log("After Finding Users:", user);
  if (!user) {
    res.status(401).json({ message: "user does not exists" });
    return;
  }

  if (!(await validatePassHash(password, user.password))) {
    console.log("Invalid Password");
    res.status(401).json({ message: "invalid password" });
    return;
  }

  if (!user.is_verified) {
    res.status(403).json({
      message: "Please Verify Your email Address to proceed",
    });
    return;
  }

  if (user.Enable_2FactAuth) {
    const verified = await speakeasy.totp.verify({
      secret: user.twoFactSecret,
      encoding: "base32",
      token: code,
    });
    if (!verified) {
      res.status(405).json({ message: "InValid Authenticator Code" });
      return;
    }
  }
  console.log("Reached Here sending response: ");
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.user_role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  console.log("Reponse sending : ", accessToken);
  res.json({ token: accessToken });
};

const signup = async (req, res) => {
  const { email, password, role, Enable_2FactAuth, username } = req.body;

  if (!email || !password || !role) {
    res.status(400).json("Empty or UnSelected Fields Not Accepted");
    return;
  }

  if (
    !emailValidator.validate(email) ||
    !validatePassword(password) ||
    !(role === "student" || role === "admin")
  ) {
    res.status(400).json({
      message: "Need to Enter Proper Data",
    });
    return;
  }

  const findUser = await User.findOne({ email });
  if (findUser) {
    res.status(400).json({
      message: "User already Exist, Please try again",
    });
    return;
  }

  const verificationToken = await crypto.randomBytes(32).toString("hex");
  const passHash = await getPasswordHash(password);
  const verificationLink = `${process.env.base_url}/verify-email/${verificationToken}`;

  const htmlmsg = `<p>Dear User,
  </p>
  <p>Please verify your email address by clicking on the following link: <a href="${verificationLink}">Click Here</a></p>`;
  console.log("Verification LInk:", verificationLink);

  const sendEmail = await SendMail(email, "Verify your Email Address", htmlmsg);
  console.log("Send Email:", sendEmail);
  if (sendEmail !== 200) {
    res.status(500).json({ error: "Error while Sending Email" });
    return;
  }
  const user = await User.create({
    //userId: new ObjectId().toString(),
    username: username,
    email: email,
    password: passHash,
    user_role: role,
    verificationToken: verificationToken,
    is_verified: false,
    Enable_2FactAuth: Enable_2FactAuth,
    courses: [],
  });

  if (!user) {
    res.status(500).json({ message: "Error While Creating User" });
    return;
  }

  res.status(200).json({ message: "User Created Verify Email to Proceed" });
};

const validateTokenExistToken = async (req, res) => {
  if (!req.query.token) {
    res.status(400).json({ message: "InValid Url" });
  }

  const { token } = req.query;

  jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
    if (err) {
      res.status(401).json({ valid: false, message: "Invalid Token" });
      return;
    }
    console;

    const user = await User.findOne({ _id: data.id });

    if (!user) {
      res.status(404).json({ message: "InValid Token" });
    }
    console.log(user);
    res.status(200).json({ valid: true, role: user.user_role, user: user._id });
  });
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      res.status(404).json({ message: "InValid Token" });
      return;
    }
    let QrCodeUrl = null;
    user.verificationToken = null;
    user.is_verified = true;
    if (user.Enable_2FactAuth) {
      const secret = speakeasy.generateSecret({ length: 20 });

      user.twoFactSecret = secret.base32;
      user.otpauth_url = secret.otpauth_url;
      QrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
    }
    await user.save();

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.user_role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    if (user.Enable_2FactAuth) {
      res.cookie("QrCodeUrl", QrCodeUrl, {
        httpOnly: false,
        expires: new Date(Date.now() + 900000),
      });
    }
    res.cookie("token", accessToken, {
      httpOnly: false,
      expires: new Date(Date.now() + 900000),
    });
    console.log("Email Verified");
    res.redirect(
      `${process.env.FRONT_PORT}/email-verified?token=${accessToken}`
    );
  } catch (err) {
    console.log("Error While Verifying email Addres", err);
    res.status(500).json({ message: "Error While REgistering User" });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find({
    user_role: "student",
    $expr: { $gte: [{ $size: "$enrolled_courses" }, 1] },
  }).populate("enrolled_courses");
  // .select({
  //   _id: 1,
  //   //userId: 1,
  //   username: 1,
  //   email: 1,
  //   user_role: 1,
  //   stack: 1,
  //   courses: 1,
  // });

  console.log("user.log: ", users.enrolled_courses);

  if (!users) {
    res.status(500).json({ message: "Error While Fetching Users" });
    return;
  }

  console.log("SEnding: ", users);

  res.status(200).json({ users });
};

const updateStack = async (uEmail, stack) => {
  try {
    const user = await User.findOne({ email: uEmail });

    if (!user) {
      return false;
    }

    user.stack = stack;

    await user.save();

    return true;
  } catch (err) {
    console.log("Error While Updating User Stack");
    return false;
  }
};

const getAllStudents = async (req, res) => {
  try {
    const val_result = await validateToken(req.headers.authorization);
    console.log("Val_result: ", val_result);
    if (!val_result.valid || val_result.role !== "admin") {
      res.status(401).json({
        message: "Access Denied ",
      });
      return;
    }

    const users = await User.find({ user_role: "student" });

    if (!users) {
      console.log("Error While Reteriving Students ");
      res.status(500).json({ message: "Error While Retreiving Students" });
      return;
    }
    res.status(200).json({ message: "All Students", students: users });
  } catch (err) {
    console.log("Error While Fetching All Students: ", err);
    res
      .status(500)
      .json({ message: "Error WHile Reteriving Students", error: err });
  }
};

module.exports = {
  getToken,
  signup,
  validateTokenExistToken,
  verifyEmail,
  getAllUsers,
  updateStack,
  getAllStudents,
};
