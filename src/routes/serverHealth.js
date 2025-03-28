const express = require("express");
const router = express.Router();
const  getHealth = require("../controllers/serverHealthControllers");


// Route to get health data of the server for load-balancing
router.get('/', getHealth );


module.exports = router;