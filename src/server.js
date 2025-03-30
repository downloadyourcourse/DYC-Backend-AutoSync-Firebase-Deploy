const express = require('express');
const connectDB = require('./config/db')
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = process.env.PORT || 5000;                   //importing port value from .env file and if fails falls to a default value.
const listingRoutes = require("./routes/listingRoutes");
const serverHealthRoutes = require("./routes/serverHealth");


// app.listen(port, () => console.log(`Server is running on port ${port}`));

console.log('Server Initializing...')


// Connect to the database first
connectDB().then(() => {
    // Start the server only after DB connection is successful
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  }).catch(err => {
    console.error("Server failed to start due to DB connection error", err);
  });



// Apply security middleware
app.use(helmet());  // Protects against common security vulnerabilities
app.use(cors());    // Enables Cross-Origin Resource Sharing

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
