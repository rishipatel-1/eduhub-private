const mongoose = require("mongoose");

if (!process.env.db_conn) {
  console.error("please provide database_conn in config file...");
}

const initDB = () => {
  mongoose.connect(process.env.db_conn);
  mongoose.set("debug", true);
  console.log("Db Connected");
};

module.exports = {
  initDB,
};
