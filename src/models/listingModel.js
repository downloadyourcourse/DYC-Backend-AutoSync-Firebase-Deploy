const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    // Basic details of the listing
    listingId: { type: String, unique: true, immutable: true  },  // Internal system id apart from mongoDb id to uniquely identify a listing. will be displayed on website.
    listingTitle: { type: String, required: true, unique: true }, // Name of the listing
    slug: { type: String, required: true, unique: true }, // Slug for URL structure - This listing will be retrieved from the db using slug when a user visits website.
    
    // metaData is purely for seo purposes, author, title and other info can be different from the actual value
    metaData: {
        seoTitle: { type: String, required: true},  // The Title value that will come in the search results of the search engine.
        seoDescription: { type: String, required: true }, // the description of the page and will be showed in the search results under the title
        seoAuthor: { type: String, required: true }, // Author of the page as per your seo requirements
        seoRobots: { type: String }, // noindex, no follow, index , follow for the search enginge robots crawlers and based on this tag they will crawl
        CanonicalUrl: { type: String }, // Tells search engines what the official URL of this content is, which helps prevent duplicate indexing. If this is the real content leave it blank or store your website url. Helpful when there are multiple domains pointing to the same content. Avoid Duplicate URLs Even your own site can serve the same content under multiple URLs accidentally:  https://downloadyourcourses.com/page, https://www.downloadyourcourses.com/page, https://downloadyourcourses.com/page?ref=abc. All technically show the same thing. Canonical URL tells Google: “Treat this one as the main version.” so the google only ranks the canonical url on search results and leave others. Use the full, clean, final URL: 'https://downloadyourcourses.com/currency-strength-meter'
        SocialMediaShareImageUrl: { type: String } // link of the url that will be visible when the link of the post, website will be shared on whatsapp, twitter, insta, fb wtc
    },

    // HTML body and CSS styles for the webpage related to the item
    pageMarkupAndStyles: { 
        htmlBody: { type: String, required: true },    // HTML body content of the page
        cssStyle: { type: String, required: true }     // CSS styles for the page
    },
    
    // Type of digital product - only valid from one of the enums mentioned.
    itemType: { 
        type: String, 
        enum: ["course", "tool", "ebook & notes", "video", "template", "other"], 
        required: true
    },

      // Tags for searching, filtering, and sorting the listing. Some of these to be displayed on website and others to be hidden.
      tags: [{ 
        tagValue: { type: String, required: true, set: val => val.toLowerCase()}, // Converts value to lowercase in create & update
        isHidden: { type: Boolean, default: false } 
    }],
    

     // Official details of the creator or the brand of the listing
    OfficialAuthorName: { type: String, required: true },    // Author's name
    officialBrandName: { type: String, required: true },     // Brand's name
    officialWebsitePageUrl: { 
        type: String,
        required: true, 
        match: [/^https?:\/\/(www\.)?[\w-]+\.[a-z]{2,}(\/[^\s]*)?$/, 'Please provide a valid URL'] // Regex pattern for URL to validate the url.
    },  // URL of the official website page

    
    pricing: { type: mongoose.Schema.Types.ObjectId, ref: 'Pricing' }, // Reference to another Model/ collection for Pricing details of the product
    // promotions: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion' }, // Reference to another Model/ collection for current and past Promotional sales event
    // sales: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }], // Reference to another Model/ collection for all the previous sales of the product
    // comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // // Reference to another Model/ collection for all the comments and feedback present on the listing product

}, { timestamps: true }); // stores created on and last updated on field in the document automatically.



// **Manual Indexing Logic** 
//Other than unique: true, mongodb also indexes where unique is set to true like in title, sys id and slug

// Index the 'tags.tagValue' field for faster search and filtering by tags
listingSchema.index({ 'tags.tagValue': 1 });

// Additional compound index example for advanced queries (optional):
// listingSchema.index({ 'tags.tagValue': 1, 'itemType': 1 });


module.exports = mongoose.model('Listing', listingSchema);   // Export the model.