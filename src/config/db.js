const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // console.log(process.env.MONGO_URI)
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Database Connection established successfully...");
  } catch (err) {
    console.error("MongoDB Database Connection Error: ", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;


