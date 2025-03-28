const express = require('express');
const router = express.Router();
const {
    getListings,
    getListing,
    createListing,
    deleteListing,
    updateListing
} = require('../controllers/listingControllers')




// Route to get all the listings or sorted and filtered listings
router.get('/', getListings );

// Route to get a single listing based on the slug
router.get('/:identifier', getListing );

// Route to create listing which also creates pricing document in a separate pricing collection
router.post('/', createListing );

// Route to delete a listing along with its pricing document
router.delete('/:identifier', deleteListing );

// Route to update a listing along with its pricing document
router.patch('/:identifier', updateListing);



module.exports = router;
