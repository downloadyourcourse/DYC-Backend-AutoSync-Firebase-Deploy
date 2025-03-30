const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 5000;                   //importing port value from .env file and if fails falls to a default value.
const listingRoutes = require("./routes/listingRoutes");
const serverHealthRoutes = require("./routes/serverHealth");


// starting server
console.log('Server Initializing...')


// Apply security middleware
app.use(helmet());  // Protects against common security vulnerabilities
app.use(cors());    // Enables Cross-Origin Resource Sharing


// Connect to the database before handling requests
connectDB()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("DB Connection Error:", err);
  });


//Body Parser Middlewares
app.use(express.json());  // for raw jsons
app.use(express.urlencoded({ extended: false})); // for form data


//routes
app.get('/', (req, res) => {
    res.status(200).json({msg: 'wecome to Download Your Course'})
})

//routes related to posts route file
app.use('/api/listing', listingRoutes);


//routes related to health of the server for load-balancing
app.use('/api/health', serverHealthRoutes);


// Export the express app for import in Functions/index.js import. ONLY RELVANT TO FIREBASE/ FIREBASE FUNCTIONS and Normal Express app won't run because of no presence of app.listen()
module.exports = app;