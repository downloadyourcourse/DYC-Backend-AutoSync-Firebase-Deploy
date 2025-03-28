const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: { 
        type: String,
        required: true,
        minlength: [1, 'Comment must be at least 1 characters long'],
        maxlength: [280, 'Comment cannot exceed 280 characters'] },
    rating: {
        type: Number,
        required: true,
        default: 5,
        min: [1, 'Rating must be at least 1'],
        max: [5, 'Rating cannot exceed 5']
    },
    isAnonymous : { type: Boolean, default: false},
    postedAt: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // MongoDb reference to user who made the comment
    listingId: { type: String, required: true, immutable: true  },  // Internal system id displayed on website.
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true }, // MongoDb reference to Listing
});


// **Manual Indexing Logic** 
commentSchema.index({ 'user': 1 }); // Index the 'user' field for faster search 
commentSchema.index({ 'listingId': 1 }); // Index the 'listingId' field for faster search 
commentSchema.index({ 'listing': 1 }); // Index the 'listing' field for faster search 

module.exports = mongoose.model('Comment', commentSchema);
