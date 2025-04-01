/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const app = require("./src/server")


// Deploy functions in different regions
exports.api_dyc_us_central1_lowa = onRequest({ region: "us-central1" }, app);
exports.api_dyc_europe_west1_belgium = onRequest({ region: "europe-west1" }, app); // Belgium
exports.api_dyc_asia_east1_taiwan = onRequest({ region: "asia-east1" }, app); // Taiwan



// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
