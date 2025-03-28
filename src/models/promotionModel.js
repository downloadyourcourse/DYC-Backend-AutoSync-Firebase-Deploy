const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promotionSchema = new Schema({
        promotionTitle: { type: String, required: true },       // Sale Title
        discountPercentage: { type: Number, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        listingId: { type: String, immutable: true  },  // Internal system id displayed on website.
        listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }, // MongoDb reference to Listing
    
}, { timestamps: true });

// **Manual Indexing Logic** 
promotionSchema.index({ 'listingId': 1 }); // Index the 'listingId' field for faster search 
promotionSchema.index({ 'listing': 1 }); // Index the 'listing' field for faster search 


module.exports = mongoose.model('Promotion', promotionSchema);

