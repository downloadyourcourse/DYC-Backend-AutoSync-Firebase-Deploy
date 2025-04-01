const mongoose = require("mongoose");
const { getRegion, getMongoUri, getMongoUriForWrite } = require("./serverDbUtils")

const connectDB = async () => {
  try {
    // Get the current function region
    const firebase_function_server_name = process.env.K_SERVICE || 'unknown_server';  // process.env.K_SERVICE returns the name of the firebase function that we have set when creating
    // console.log('1. Inside db - server_name: ', firebase_function_server_name)
    const region = getRegion(firebase_function_server_name) || "us_central1_lowa";
    // console.log('2. Inside db - region_name: ', region)

    // Select the correct MongoDB URI for only reading operations
    const mongoURI_read = getMongoUri(region);

    // Select the correct MongoDB URI
    const mongoURI_write = getMongoUriForWrite();

    console.log(`Function Name: ${firebase_function_server_name} Connecting to MongoDB for region: ${region}, for read operations.`);

    await mongoose.connect(mongoURI_read);
    console.log("MongoDB Database Connection established successfully...");
  } catch (err) {
    console.error("MongoDB Database Connection Error: ", err);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;


