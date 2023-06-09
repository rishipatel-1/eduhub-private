const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { User } = require("../models/user");

const verifyJwt = promisify(jwt.verify);

const validateToken = async (token) => {
  // jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
  //   if (err) {
  //     return { valid: false, message: "Invalid Token" };
  //   }
  //   console.log("validate token data:", data);

  //   const user = await User.findOne({ _id: data.id });

  //   if (!user) {
  //     return { message: "InValid Token No user Found", valid: false };
  //   }
  //   console.log(user);
  //   console.log("Sending:", {
  //     valid: true,
  //     role: user.user_role,
  //     user: user._id,
  //   });
  //   return { valid: true, role: user.user_role, user: user._id };
  // });
  try {
    const data = await verifyJwt(token, process.env.JWT_SECRET);
    console.log("validate token data:", data);

    const user = await User.findOne({ _id: data.id });

    if (!user) {
      return { message: "Invalid Token: No user found", valid: false };
    }

    console.log(user);
    console.log("Sending:", {
      valid: true,
      role: user.user_role,
      user: user._id,
    });

    return { valid: true, role: user.user_role, user: user._id };
  } catch (err) {
    console.error("Error while validating token:", err);
    return { valid: false, message: "Invalid Token" };
  }
};

module.exports = { validateToken };
