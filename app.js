const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const chapterRoute = require("./routes/chapter.route");
const courseRoute = require("./routes/course.route");
const submissionRoute = require("./routes/submission.route");

const app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Max-Age", 1728000);
  next();
});

app.use("/", userRoute);
app.use("/", chapterRoute);
app.use("/", courseRoute);
app.use("/", submissionRoute);

module.exports = app;
