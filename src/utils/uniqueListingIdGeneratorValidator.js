const mongoose = require('mongoose');

// Helper function to generate a unique listing ID
const generateUniqueId = (brand, author, title) => {
    
    // Extract initials from brand and author names
    let brandLetters = brand.split(/(?!^[A-Z]+$)(?=[A-Z])|[\s-]+/).map(word => word.charAt(0)).join('');  // Split by camel case, spaces, or hyphens, but avoid splitting all-uppercase words & Avoid splitting if the whole word is uppercase
    let authorLetters = author.split(/(?!^[A-Z]+$)(?=[A-Z])|[\s-]+/).map(word => word.charAt(0)).join('');  // Split by camel case, spaces, or hyphens, but avoid splitting all-uppercase words & Avoid splitting if the whole word is uppercase

    // Define word replacements for abbreviations
    const exceptionalWords = {
        'FOREX': 'FX', 'LEVEL': 'LVL', 'ACTION': 'ACTN', 'OPTIONS': 'OPTN',
        'CRYPTO': 'CRYP', 'PAM': 'PAM', 'COURSE': 'CORS', 'COURSES': 'CORS'
    };

    // Process the title to extract meaningful letters
    let titleLetters = title
        .split(/(?!^[A-Z]+$)(?=[A-Z])|[\s-]+/) // Split by camel case, spaces, or hyphens, but avoid splitting all-uppercase words & Avoid splitting if the whole word is uppercase
        .map(word => exceptionalWords[word] || word.replace(/[^A-Z0-9]/g, '').slice(0, 2)) // Replace or extract first two letters
        .filter(word => word) // Remove empty strings
        .join('');

    // Special case handling
    if (title === 'CURRENCY STRENGTH METER') titleLetters = 'CSM';

    // Convert inputs to uppercase for consistency
    brandLetters = brandLetters.toUpperCase();
    authorLetters = authorLetters.toUpperCase();
    titleLetters = titleLetters.toUpperCase();

    // Construct the unique base ID
    return `${brandLetters}-${authorLetters}-${titleLetters}`;
};

// Ensure system uniqueId never becomes a type of mongodbId and if it becomes modify it
const preventObjectIdCollision = (listingId) => {
    let modifiedId = String(listingId) // Ensure it's a string before validation MongoDB might mistakenly consider it a valid ObjectId if converted into a hex string internally.
    
    if (mongoose.Types.ObjectId.isValid(modifiedId)){
        modifiedId = `${modifiedId}-sysid`;
    }
    return modifiedId //string value
}

// Function to ensure uniqueness in MongoDB
const getValidatedUniqueCourseId = async (listingId, brand, author, title) => {
    
    let uniqueId
    // if id doesn't already exist generate a new id
   if(!listingId){
        uniqueId = generateUniqueId(brand, author, title);  
    } else{
        uniqueId = listingId;
    }

    // Ensure system uniqueId never becomes a type of mongodbId and if it becomes modify it
    uniqueId = preventObjectIdCollision(uniqueId)
    const baseId = uniqueId;
    let count = 1;

    // Ensure uniqueness by checking in the database
    while (await mongoose.models.Listing.findOne({ listingId: uniqueId })) {
        uniqueId = `${baseId}-${count}`;
        count++;
    }

    return uniqueId;
};

module.exports = getValidatedUniqueCourseId;
