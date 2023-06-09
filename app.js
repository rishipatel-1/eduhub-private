const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/user.route");
const chapterRoute = require("./routes/chapter.route");
const courseRoute = require("./routes/course.route");
const submissionRoute = require("./routes/submission.route");

//const taskRoute = require("./routes/task.route");
//const statRoute = require("./routes/taskcompleted.route");
/* import Routes  */

const app = express();

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Max-Age", 1728000);
  next();
});

/* add routes here app.use('',routes) */

app.use("/", userRoute);
app.use("/", chapterRoute);
app.use("/", courseRoute);
app.use("/", submissionRoute);

// var route,
//   routes = [];

// app._router.stack.forEach(function (middleware) {
//   if (middleware.route) {
//     // routes registered directly on the app
//     routes.push(middleware.route);
//   } else if (middleware.name === "router") {
//     // router middleware
//     middleware.handle.stack.forEach(function (handler) {
//       route = handler.route;
//       route && routes.push(route);
//     });
//   }
// });
// console.log("Routes:", routes);

module.exports = app;
