// // const mongoose = require("mongoose");

// // const customerSchema = new mongoose.Schema({
// //   name: { type: String, required: true },
// //   email: { type: String, required: true, unique: true },
// //   age: { type: Number, required: true }
// // }, { timestamps: true });

// // module.exports = mongoose.model("customer_test_data", customerSchema);




// const mongoose = require("mongoose");
// const mongoDbcollectionName = 'listing'

// // Helper function to generate the unique ID
// function generateUniqueId(brand, author, title) {
//   // Extract the first letter of each part
//   const brandLetter = brand.toUpperCase().split(' ').map(word => word.charAt(0)).join('');  // First letter of each word of brand
//   const authorLetter = author.toUpperCase().split(' ').map(word => word.charAt(0)).join('');  // First letter of each word of author

//   // Split the title into words and process
//   let titleLetters = title
//       .split(' ')  // Split the title into words
//       .map(word => {
//           const specialLetters = ['THE', ':', '-', '&', '(', ')', '*', "'", '"', '_'];
//           const exceptionalWords = {
//               'FOREX': 'FX',
//               'LEVEL': 'LVL',
//               'ACTION': 'ACTN',
//               'OPTIONS': 'OPTN',
//               'CRYPTO': 'CRYP',
//               'PAM': 'PAM',
//               'COURSE': 'CORS',
//               'COURSES': 'CORS',
//           };
//           startIndex = 0; // first two letters, index becomes 1 if first char is in special letters.

//           // Convert word to uppercase to handle case-insensitive matching
//           word = word.toUpperCase();

//           // Skip special words
//           if (specialLetters.includes(word)) return '';

//           // If the word exists in exceptionalWords, use the shortened version
//           if (exceptionalWords[word]) {
//               return exceptionalWords[word];
//           }

//           if (specialLetters.includes(word.charAt(0))){          // if the word starts with special char like ", ', (), * etc.
//             startIndex = 1
//           }

//           // If the word is not in exceptionalWords, take the first two letters of the word
//           return word.charAt(startIndex) + word.charAt(startIndex + 1); // by default start index = 0
//       })
//       .filter(word => word !== '')  // Remove empty strings (for skipped words)
//       .join('');  // Join the letters with a hyphen

//   // Handle a special case for "CURRENCY STRENGTH METER"
//   if (title.toUpperCase() === 'CURRENCY STRENGTH METER') {
//       titleLetters = 'CSM';
//   }

//   // Combine them to form the ID
//   let uniqueId = `${brandLetter}-${authorLetter}-${titleLetters}`;

//   return uniqueId;
// }


// // Function to check if an ID already exists and ensure uniqueness
// async function getUniqueCourseId(brand, author, title) {
//     let baseId = generateUniqueId(brand, author, title);
//     let uniqueId = baseId;
//     let count = 1;

//     // Check if the ID already exists in the database
//     while (await mongoose.models.listingTemp.findOne({ id: uniqueId })) {
//         uniqueId = `${baseId}-${count}`;
//         count++;
//     }

//     return uniqueId;
// }

// // Mongoose Schema
// const listingTempSchema = new mongoose.Schema({
//   title: { type: String, required: true }, 
//   brand: { type: String, required: true }, 
//   author: { type: String, required: true },
//   id: { type: String, unique: true },  // New field for unique ID
// }, { timestamps: true });

// // Pre-save hook to generate a unique ID before saving
// listingTempSchema.pre('save', async function(next) {
//     if (!this.id) {  // Only generate an ID if one doesn't exist
//         try {
//             const uniqueId = await getUniqueCourseId(this.brand, this.author, this.title);
//             this.id = uniqueId;  // Assign the unique ID to the course
//             next();  // Continue saving
//         } catch (error) {
//             next(error);  // Pass the error to the next middleware
//         }
//     } else {
//         next();  // If ID already exists, continue saving
//     }
// });

// module.exports = mongoose.model("listingTemp", listingTempSchema);
