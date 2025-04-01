// MONGO URIs will be added here as a hardcoded values during auto deployment from github.
// These values will be later used in the below code. This is done for security reasons to avoid URIs exposure to others.
// Naming convention of URIs: const MONGO_URI_US_CENTRAL1_LOWA, const MONGO_URI_EUROPE_WEST1_BELGIUM, const MONGO_URI_ASIA_EAST1_TAIWAN


// when we create a firebase function like: exports.api_dyc_us_central1_lowa = onRequest({ region: "us-central1" }, app);
// the firebase internally converts it to api-dyc-us-central1-lowa when we get it using process.env.k_service
const getRegion = (firebase_function_server_name) => { 
if (firebase_function_server_name.includes("us_central1_lowa") || firebase_function_server_name.includes("us-central1-lowa")){
    return "us_central1_lowa";
}
if (firebase_function_server_name.includes("europe_west1_belgium") || firebase_function_server_name.includes("europe-west1-belgium")){
    return "europe_west1_belgium";
}
if (firebase_function_server_name.includes("asia_east1_taiwan") || firebase_function_server_name.includes("asia-east1-taiwan")){
    return "asia_east1_taiwan";
}
return undefined
}

const getMongoUri = ( region ) => {
if (region === "us_central1_lowa") return MONGO_URI_US_CENTRAL1_LOWA;
if (region === "europe_west1_belgium") return MONGO_URI_EUROPE_WEST1_BELGIUM;
if (region === "asia_east1_taiwan") return MONGO_URI_ASIA_EAST1_TAIWAN;
}

const getMongoUriForWrite = () => {
    return this.MONGO_URI_US_CENTRAL1_LOWA;
}

module.exports = {getRegion, getMongoUri, getMongoUriForWrite}