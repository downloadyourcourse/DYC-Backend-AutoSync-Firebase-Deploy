const mongoose = require('mongoose');
const Listing = require('../models/listingModel');
const Pricing = require('../models/pricingModel');
const uniqueListingIdGeneratorValidator = require('../utils/uniqueListingIdGeneratorValidator');
const converToDotNotation = require('../utils/convertToDotNotation')


// get all listings
const getListings = async (req, res) => {
    try {
        const listings = await Listing.find({}).sort({ createdAt: -1 })
        return res.status(200).json({ success: true, message: "Listings found.", listings: listings })
    } catch (error) {
        console.error('Unable to fetch listings: ', error);
        return res.status(500).json({ success: false, message: "Internal Server Error - Unable to fetch listings.", error: error.message });
    }
}


// get a single listing
const getListing = async (req, res) => {
    try {
        const { identifier } = req.params; // inside the url route. It can be either mongoDb Id, ListingId (system id) or the slug
        const { searchBy } = req.query; // ?searchBy=id --> query sent by client to searchBy id (mongoDb id), listingId and if nothing then defaults to slug

        let query; // will be sent to the db server for querying

        switch (searchBy) {   // query on the basis of client request
            case 'id':
                if (!mongoose.Types.ObjectId.isValid(identifier)) { // checks if the id is a valid mongodb object id
                    return res.status(400).json({ success: false, message: "Invalid ObjectId." });
                }
                query = { _id: identifier };
                break;

            case 'listingId':
                query = { listingId: identifier };
                break;

            case 'slug':                       // if nothing is present in the query it defaults to slug
            default:
                query = { slug: identifier };
        }

        const listing = await Listing.findOne(query)    // sending request to server with appropriate query
        if (!listing) {
            return res.status(404).json({ success: false, message: "Listing not found." })
        }
        res.status(200).json({ success: true, message: "Listing found.", listing: listing })
    } catch (error) {
        console.error('Unable to fetch listings: ', error);
        return res.status(500).json({ success: false, message: "Internal Server Error - Unable to fetch listings.", error: error.message });
    }
}


// create a new listing
const createListing = async (req, res) => {
    // MongoDb atomicity update in all the related collections or none because listing and pricing docs are created together
    const session = await mongoose.startSession();
    session.startTransaction(); // Start a Transaction

    try {
        // Destructure the request body
        const {
            listingTitle,
            listingId,
            pricing,
            OfficialAuthorName,
            officialBrandName,
            isPurchasableProduct
        } = req.body;


        try {
            // Only generate an ID if one doesn't exist and if it exists verify it & modify it if needed and then return the same id
            const uniqueId = await uniqueListingIdGeneratorValidator(listingId, officialBrandName, OfficialAuthorName, listingTitle);
            req.body.listingId = uniqueId; // Assign the unique ID to the req object
        } catch (uniqueIdGenerateError) {
            console.error("Failure: Could not generate a unique id for the listing.", uniqueIdGenerateError);
            return res.status(500).json({ success: false, message: "Internal Server Error - Error generating unique listing ID", error: error.message });
        }

        // 1️ Create Pricing Document if isPurchasableProduct is true. Otherwise no Pricing document is created and no reference is added
        // to the listing document. Applicable for blogs etc.
        let newPricingModelData; // created outside if block so that they are available in the complete code not just inside the if because let and const are block scoped.
        let createdPricingDocument;

        // strict checking isPurchasableProduct === false because there are chances, isProductPurchasable is even not added to the
        // request body and this way it will be undefined but still the user might want to create a pricing document because
        // in mongoose its default value is set to true.
        if(isPurchasableProduct === false){
            console.log('Pricing document will not be created and no reference will be given in listing document. isPurchasableProduct flag set to false.')
        }
        else{
            newPricingModelData = { listingId: req.body.listingId, listingTitle: listingTitle, ...pricing };  // only send the required data to pricing model and not the complete req body
            createdPricingDocument = await Pricing.create([newPricingModelData], { session });  // atomicity syntax
        }

        // 2️ Create Listing Document and add reference to the Pricing Document if createdPricingDocument is available or isPurchasableProduct is not false.
        let newListing; // created outside if block so that they are available in the complete code not just inside the if because let and const are block scoped.
        if(createdPricingDocument){
            const newListingData = { ...req.body, pricing: createdPricingDocument[0]._id }; // adding reference to Pricing document in the form of its id
            newListing = await Listing.create([newListingData], { session }); // atomicity syntax
        }
        else{ // if else block runs, this means isProductPurchasable was false and hence we do not have pricingDocument and thus pricing reference will not be added. Applicable when it is a blog or related listing. Pricing is not set to required: true in mongoose listing schema. so its optional.
            newListing = await Listing.create([ { ...req.body } ], { session }); // atomicity syntax
        }
        

        // Commit the Transaction
        await session.commitTransaction();

        // Send response
        return res.status(201).json({
            success: true,
            message: 'Listing created successfully',
            listing: newListing
        });

    } catch (error) {
        console.error('Transaction Error:', error);

        try {
            // Transaction Rollback (Prevent Orphaned Data)
            await session.abortTransaction();
            console.log("Transaction rollback successful.");
        } catch (criticalError) {
            console.error("Critical Failure: Even rollback attempt failed - Possible orphaned data.", criticalError);
        }

        // Handle Duplicate Key Error (Code 11000)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Duplicate entry error - conflict.",
                error: `Duplicate key error: The value '${Object.values(error.keyValue)[0]}' for '${Object.keys(error.keyValue)[0]}' already exists.`
            });
        }
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error - Unable to create listing.',
            error: error.message
        });
    } finally {
        // Ensure session is closed to release memory and connection of the session created for transaction
        session.endSession();
    }
};



// delete a listing
const deleteListing = async (req, res) => {

    // MongoDb atomicity delete in all the related collections or none because listing and pricing docs are deleted together
    const session = await mongoose.startSession();
    session.startTransaction(); // Start a Transaction

    try {
        const { identifier } = req.params; // inside the url route. It can be either mongoDb Id, ListingId (system id)

        let query; // will be sent to the db server for querying and deleting

        if (mongoose.Types.ObjectId.isValid(identifier)) {
            query = { _id: identifier }
        } else {
            query = { listingId: identifier }
        }
        const deletedListingDoc = await Listing.findOneAndDelete(query, { session }); // atomicity syntax
        if (!deletedListingDoc) {
            return res.status(404).json({ success: false, message: "Listing not found." })
        }

        let deletedRefPricingDoc;

        // if pricing document does not exist inside the listing document (in case of a blog listing, it will not contain reference of pricing document). So avoiding findOneAndDelete for pricing document.
        if(deletedListingDoc.pricing){
            deletedRefPricingDoc = await Pricing.findOneAndDelete({_id: deletedListingDoc.pricing}, { session }); // atomicity syntax
        }

        // Commit the Transaction
        await session.commitTransaction();

        // send response
        res.status(200).json({
            success: true,
            message: 'Listing and pricing details deleted successfully.',
            listing: deletedListingDoc,
            pricing: deletedRefPricingDoc || 'Pricing document in database did not exist for the deleted listing. Possibly it was non sellable. e.g. a blog.'
        });


    } catch (error) {
        console.error('Transaction failed - Unable to delete listings: ', error)
        try {
            // Transaction Rollback (Prevent Orphaned Data)
            await session.abortTransaction();
            console.log("Transaction rollback successful.");
        } catch (criticalError) {
            console.error("Critical Failure: Even rollback attempt failed - Possible orphaned data.", criticalError);
        }
        return res.status(500).json({ success: false, message: "Unable to delete listing", error: error.message })
    } finally {
        // release memory and connection of the session created for transaction
        session.endSession();
    }
}


// update a listing
const updateListing = async (req, res) => {
    // MongoDb atomicity update in all the related collections or none because listing and pricing docs are updated together
    const session = await mongoose.startSession();
    session.startTransaction(); // Start a Transaction

    try {

        // listingId is immutable to avoid inconsistency in database
        if ('listingId' in req.body) {
            return res.status(400).json({
              success: false,
              message: "Updating 'listingId' is not allowed."
            });
          }

        const { pricing, ...listingUpdateFields } = req.body; // Extract pricing and listing fields separately
        const pricingUpdateFields = pricing // for better readibility and maintainibility of code
        const { identifier } = req.params; // inside the url route. It can be either mongoDb Id, ListingId (system id)


        // Updating 'listingTitle' directly in Pricing is not allowed to avoid data inconsistency. Update at listing level and it 
        // will automatically update in pricing
        if ('listingTitle' in pricingUpdateFields) {
            return res.status(400).json({
              success: false,
              message: "Updating 'listingTitle' directly in Pricing is not allowed."
            });
          }

        // query will be sent to the db server for querying and updating.
        // Will contain the id of listing/ pricing document and dot notation paths of fields to be updated with { $exists: true } to avoid
        // creating a field if it already does not exist in the document
        let queryListing;
        let queryPricing;

        // adding the document id to the queryListing based on the condition and value received in the param.
        if (mongoose.Types.ObjectId.isValid(identifier)) {
            queryListing = { _id: identifier }
        } else {
            queryListing = { listingId: identifier }
        }

        // the raw json object is converted to flattened dot notation paths with value to target invidual field instead of replacing the
        // complete field in nested documents.
        const dotNotationedListingUpdateFields = converToDotNotation(listingUpdateFields);


        // updating/ patching all the individual fields of the raw json object. $set targets the individual fields for updates and do not replace the complete field in replacing based on the dot notation paths.
        const updatedListingDoc = await Listing.findOneAndUpdate(queryListing, { $set: dotNotationedListingUpdateFields }, { session, new: true, runValidators: true }); // atomicity syntax and 'new: true' ensures the updated document is returned instead of the original.

        if(!updatedListingDoc){
            return res.status(404).json({ success: false, message: "Listing not found." })
        }

        let updatedPricingDoc;

        // additional check for updatedListingDoc.isPurchasableProduct, because if it was false then definitely its a blog or similar no sellable listing and it will not contain a pricing reference or document created for it. So avoiding the below code for unexpected behaviour.
        if( (pricingUpdateFields && (Object.keys(pricingUpdateFields).length > 0) && updatedListingDoc.isPurchasableProduct ) || listingUpdateFields.listingTitle && updatedListingDoc.isPurchasableProduct ){
            
            // assigning pricing doc id which is stored in the listing doc.
            queryPricing = { _id: updatedListingDoc.pricing }

            // the raw json object is converted to flattened dot notation paths with value to target invidual field instead of replacing the
            // complete field in nested documents.
            const dotNotationedPricingUpdateFields = converToDotNotation({ listingTitle: updatedListingDoc.listingTitle, ...pricingUpdateFields});
            
            
            // upading the pricing document. $set targets the individual fields for updates and do not replace the complete field in replacing based on the dot notation paths.
            updatedPricingDoc = await Pricing.findOneAndUpdate(
                queryPricing,
                { $set: dotNotationedPricingUpdateFields },
                { session, new: true, runValidators: true }) // atomicity syntax and 'new: true' ensures the updated document is returned instead of the original.
            } else{
                // check if updatedListingDoc.isPurchasableProduct is true, if it is false then no pricing document exists.
                if( updatedListingDoc.isPurchasableProduct ) updatedPricingDoc = await Pricing.findOne({ _id: updatedListingDoc.pricing }, null, { session });
            }

            // if the pricing doc is empty but the listing doc is found, it means something did not work as expected. But with a condition
            // updatedListingDoc.isPurchasableProduct is true. That is the listing should have a pricing document as expected. because if its
            // false, it is expected the pricing document was not created and hence will not be returned.
            if(!updatedPricingDoc && updatedListingDoc.isPurchasableProduct){
                throw new Error("Internal Server Error. Something went wrong. Aborting changes!");
            }

        // Commit the Transaction
        await session.commitTransaction();

         // send response
        res.status(200).json({
            success: true,
            message: 'Listing and pricing details updated successfully.',
            listing: updatedListingDoc,
            pricing: updatedPricingDoc || 'Pricing Document was not tried be updated or found because isPurchasableProduct flag was set to false. Possibly the listing is a blog or something unsellable.'
        });


    } catch (error) {
        console.error('Transaction failed - Unable to update listing:', error)
        try {
            // Transaction Rollback (Prevent Orphaned Data)
            await session.abortTransaction();
            console.log("Transaction rollback successful.");
        } catch (criticalError) {
            console.error("Critical Failure: Even rollback attempt failed - Possible orphaned data.", criticalError);
        }
        return res.status(500).json({ success: false, message: "Unable to update listing", error: error.message })
    } finally {
        // release memory and connection of the session created for transaction
        session.endSession();
    }
}


module.exports = { createListing, getListings, getListing, deleteListing, updateListing }