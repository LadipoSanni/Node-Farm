
// If we wanted to use this function in multiple files, we can create a new module, export that function and import it back to this file if need be.
// Note: In node.js every file is treated as a module.

// Assigning an anonomous function to the export property of the module object which we have access to in each and every node.js module.
module.exports = (temp, product) => {
    // Use RegExp / /g which means all instances of the same placeholders will get replaced, and not just the first one that occurs (so using single quotes '' would only target the first placeholder)

    // Not good practice to directly manipulate the arguments, so a new variable is created which can be manipulated going forward for future/different placeholders. 
    
    // Replacing the placeholders in our template code with the data from the JSON file
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName); 
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);
    
    // The placeholder is located as a class so when the product is not organic, the placeholder will be replaced with the .not-organic class and whatever CSS styling may be applied.
    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');

    return output; // This is a function. Don't forget to return the output variable. 
}