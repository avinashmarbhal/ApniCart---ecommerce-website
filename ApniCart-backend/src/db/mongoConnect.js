const { MONGO_URI } = require("../envConfig.js");
const mongoose = require("mongoose");

const mongoConnect = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected!!");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); //forces the app to terminate immediately with an exit code 1 (which means failure)
  }
};

module.exports = mongoConnect;
