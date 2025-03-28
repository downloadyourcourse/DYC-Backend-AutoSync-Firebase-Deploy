const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const getUniqueCourseId = require('../utils/uniqueIdGenerator')

const uniqueToggle = true;
const requiredToggle = true;

const listingSchema = new Schema({
    // Basic details of the item
    listingId: { type: String, required: false, unique: uniqueToggle },  // New field for unique ID
    listingTitle: { type: String, required: requiredToggle, unique: uniqueToggle }, // Name of the item
    
    slug: { type: String, required: requiredToggle, unique: uniqueToggle }, // Slug for URL structure
    
    // HTML body and CSS styles for the webpage related to the item
    pageMarkupAndStyles: { 
        htmlBody: { type: String, required: requiredToggle }, // HTML body content of the page
        cssStyle: { type: String, required: requiredToggle }  // CSS styles for the page
    },
    
     // Type of digital product - only valid from one of the enums mentioned.
    itemType: { 
        type: String, 
        enum: ["course", "tool", "ebook & notes", "video", "template", "other"], 
        required: requiredToggle
    },

    // Tags for searching, filtering, and sorting the listing. Some of these to be displayed on website and others to be hidden.
    tags: [{ 
        tagValue: { type: String, required: true }, 
        isHidden: { type: Boolean, default: false } 
    }],
    
    // Official details of the creator or the brand of the listing
    OfficialAuthorName: { type: String, required: requiredToggle }, // Author's name
    
    officialBrandName: { type: String, required: requiredToggle }, // Brand's name
    
    officialWebsitePageUrl: { 
        type: String,
        required: requiredToggle, 
        match: [/^https?:\/\/(www\.)?[\w-]+\.[a-z]{2,}(\/[^\s]*)?$/, 'Please provide a valid URL'] // Regex pattern for URL
     }, // URL of the official website page
    
    // Pricing details for the product
    pricing: {
        OfficialWebsiteMaxRetailPrice: { type: Number, required: requiredToggle }, // MRP on the official website
        OfficialWebsiteSellingPrice: { type: Number, required: requiredToggle }, // Selling price on the official website
        baseSellingPrice: { type: Number, required: requiredToggle } // Base price at which our website sells the product before applying any discounts
    },

    // Discount details for different categories
    discounts: {
        highPayingCountryDiscountPercentage: { type: Number, required: requiredToggle }, // Discount percentage for high-paying countries
        midPayingCountryDiscountPercentage: { type: Number, required: requiredToggle }, // Discount percentage for mid-paying countries
        lowPayingCountryDiscountPercentage: { type: Number, required: requiredToggle }, // Discount percentage for low-paying countries

        // Sale discount details. Sale discounts will be added on top of other discounts like low paying country discounts
        promotionSaleEventDiscount:{ type: {
            currentPromotionSaleEvent: { 
                saleTitle: { type: String, required: requiredToggle }, // Title of the current sale
                discountPercentage: { type: Number, required: requiredToggle }, // Discount percentage for the current sale
                startDate: { type: Date, required: requiredToggle }, // Start date of the sale
                endDate: { type: Date, required: requiredToggle } // End date of the sale
            },
        default: {}},

            // Collection of all previous sales
            previousPromotionSaleEvents: { type: [{
                saleTitle: { type: String, required: requiredToggle }, // Sale title
                discountPercentage: { type: Number, required: requiredToggle }, // Discount percentage for the previous sale
                startDate: { type: Date, required: requiredToggle }, // Start date of the previous sale
                endDate: { type: Date, required: requiredToggle } // End date of the previous sale
            }],
        default : []}
        }
    },

    // Previous selling details of the item
    previousSales: {
        type: [{
            user: {
                name: { type: String, required: requiredToggle },          // User's name
                email: { type: String, required: requiredToggle },        // User's email
                telegramId: { type: String, required: requiredToggle }   // Optional Telegram ID of the user
            },
            purchaseDate: { type: Date, required: requiredToggle },      // Date of the purchase
            purchasedForPrice: { type: Number, required: requiredToggle }, // Price paid during purchase
            partOfCombo: { type: Boolean, default: requiredToggle },  // Was the purchase part of a combo/package
            comboDetails: { type: String, required: requiredToggle }, // Details of the combo if applicable
            isRefunded: { type: Boolean, default: requiredToggle },   // Whether the item was refunded
            refundDetails: { type: String, required: requiredToggle } // Reason or details of the refund
        }],
        default: []  // Default value if nothing is passed
    }
}, { timestamps: true }); // Automatically add timestamps (createdAt, updatedAt)






// // Pre-save hook to generate a unique ID before saving
// listingSchema.pre('save', async function(next) {
//     if (!this.listingId) {  // Only generate an ID if one doesn't exist
//         try {
//             const uniqueId = await getUniqueCourseId(this.officialBrandName, this.OfficialAuthorName, this.listingTitle);
//             this.listingId = uniqueId;  // Assign the unique ID to the course
//             next();  // Continue saving
//         } catch (error) {
//             next(error);  // Pass the error to the next middleware
//         }
//     } else {
//         next();  // If ID already exists, continue saving
//     }
// });



module.exports = mongoose.model('Listing', listingSchema); // Export the model
