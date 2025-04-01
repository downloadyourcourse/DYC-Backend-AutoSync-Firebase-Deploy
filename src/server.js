const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const listingRoutes = require("./routes/listingRoutes");
const serverHealthRoutes = require("./routes/serverHealth");


// starting server.
console.log('Server Initializing...')


// Apply security middleware
app.use(helmet());  // Protects against common security vulnerabilities
app.use(cors());    // Enables Cross-Origin Resource Sharing


// Connect to the database before handling requests
// Only connect if running inside Firebase Cloud Functions. Do not run during deployment.
// in local environment or during deployment process.env.K_service returns undefined.
// Its a firebase function (GCP) environment variable which is available once function is deployed and returns functions name.
if (process.env.K_SERVICE) {   
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("DB Connection Error:", err);
  });
}  else {
  console.log("Skipping DB connection during local deployment.");
}



//Body Parser Middlewares
app.use(express.json());  // for raw jsons
app.use(express.urlencoded({ extended: false})); // for form data


//routes
app.get('/', (req, res) => {
    res.status(200).json({msg: 'wecome to Download Your Course'})
})

//routes related to posts route file
app.use('/api/listing', listingRoutes);


//routes related to health of the server for load-balancing.
app.use('/api/health', serverHealthRoutes);

app.get('/test', (req, res) => {
  res.json({msg: 'welcome to DYC-API' ,serverName: process.env.K_SERVICE})
})


// Export the express app for import in Functions/index.js import. ONLY RELVANT TO FIREBASE/ FIREBASE FUNCTIONS and Normal Express app won't run because of no presence of app.listen()
module.exports = app;