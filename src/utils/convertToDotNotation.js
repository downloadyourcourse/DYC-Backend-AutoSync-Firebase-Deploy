/**
 * Recursively converts a nested object into a flat object with dot notation keys.
 * 
 * @param {Object} obj - The object to convert.
 * @param {Object} dotNotationObj - The resulting flat object (used during recursion).
 * @param {string} prefix - The current key prefix for dot notation (used during recursion).
 * @returns {Object} The flat object with dot notation keys.
 */


const converToDotNotation = ( obj, dotNotationObj = {}, prefix = '') => {
     // Iterate over each property in the object
    for (const key in obj){

        // Ensure the property is the object's own property, not inherited from prototype of Objects
        if(Object.prototype.hasOwnProperty.call(obj, key)){

            const value = obj[key];  // Get the value of the current property

            // Check if the value is a nested object (not null or an array)
            if(typeof value === "object" && value !== null && !Array.isArray(value)){

                // Recursive call to handle nested objects
                // Update the prefix to include the current key
                // we do not need to assign the returned value because in Js objects are passed by reference and
                // thus by default the parent dotNotationObj is being appended in every recursive call.
                converToDotNotation(value, dotNotationObj, prefix + key + '.')
            } else{
                // Base case: assign the value to the dot notation key
                dotNotationObj[prefix + key] = obj[key];
            }
        }
    }
     // Return the resulting flat object
    return dotNotationObj
}


module.exports = converToDotNotation;
