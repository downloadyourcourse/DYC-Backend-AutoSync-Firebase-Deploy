const mongoose = require('mongoose');

const pricingSchema = new mongoose.Schema({
    listingId: { type: String, required: true, unique: true, immutable: true },  // Internal system id apart from mongoDb id to uniquely identify a listing.
    listingTitle: { type: String, required: true, unique: true }, // Name of the listing for which its pricing and discounts are. Its's only for reference for pricing collection and might mismatch exact string value from the actual listing
    OfficialWebsiteMaxRetailPrice: { type: Number, required: true }, // MRP at the official website of the course
    OfficialWebsiteSellingPrice: { type: Number, required: true }, // Selling price of the course at the official website
    baseSellingPrice: { type: Number, required: true }, // Our selling price prior to any discounts.
    
    discounts: {
        highPayingCountryDiscountPercentage: { type: Number, required: true }, // Discounts applicable on the base selling price of high paying countries  
        midPayingCountryDiscountPercentage: { type: Number, required: true }, // Discounts applicable on the base selling price of mid paying countries  
        lowPayingCountryDiscountPercentage: { type: Number, required: true }, // Discounts applicable on the base selling price of low paying countries  
    }
}, { timestamps: true });

// **Manual Indexing Logic** 
//not required for listing and listingId as they are mentioned as unique and mongodb automatically indexes them.

module.exports = mongoose.model('Pricing', pricingSchema);
