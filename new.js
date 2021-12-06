const fs = require('fs'); // file system -- allows us to modify files
const http = require('http'); // create server and listen for HTTP requests
const {Http2ServerRequest} = require('http2'); 
const url = require('url'); // routing URL's based on the HTTP request

////////////////
/// FILES

// Synchronous -- blocking code
//      - Code is executed in sequence, so in order for further operations to be called, the thread (ie. the sequential order at which code is executed) needs to wait for the previous call to be fully completed. This results in slower processing times for HTTP requests, resulting in longer loading times across multiple concurrent users since Node.js is single-threaded, and that only one user can be fully processed at any given time.

const textInput = fs.readFileSync(`${__dirname}/txt/input.txt`, 'utf-8');
const textAppend = fs.readFileSync(`${__dirname}/txt/append.txt`, 'utf-8');

const text = "Hello World!";
fs.writeFileSync(`${__dirname}/txt/output.txt`, text);
console.log(`Text written!`);

fs.writeFileSync("final.txt", `${textInput}\n${textAppend}`);
console.log("Final text written!");

// Asynchronous -- non-blocking 
//      - Requests can be handled without having any dependency on one another. This means HTTP requests can be processed faster, resulting in faster loading times. 

fs.readFile(`${__dirname}/txt/start.txt`, 'utf-8', (err, data) => {

    if (err) return (console.log("error!"));

    fs.readFile(`${__dirname}/txt/${data}.txt`, 'utf-8', (err, data2) => {

        if (err) return (console.log("error!"));

        console.log(data2);

        fs.readFile(`${__dirname}/txt/append.txt`, 'utf-8', (err, data3) => {

            if (err) return (console.log("error!"));
            
            console.log(data3);

            // No need for `data` parameter => data not being read
            fs.writeFile(`${__dirname}/txt/output.txt`, `${data2}\n${data3}`, 'utf-8', (err) => {
                console.log("File written!");
            });
        });
    });
});

////////////////
/// SERVER

const replaceTemplate = (temp, product) => {

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
// Reading template HTML code synchronously. The code is top-level code so is read once at the start of the application and not repeated since the code is not within the callback function. 
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

// Read JSON data one time synchronously so that there is no need to read and send back the data every time the user goes to the api route. 
// Make sure the JSON reading is above the http.createServer (ie. http.createServer() function) as top level code is executed exactly once while the callback function is going to be executed for every request which is not what we want as we know synchronous code takes longer to process (blocking code).
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // Array of all the objects in data.json

const server = http.createServer((req, res) => {
    const pathName = req.url; // url name of the HTTP request

    // Overview page
    if (pathName === '/' || pathName === "/overview") {
        // Whenever the URL goes to '127.0.0.1:8000/' or '127.0.0.1:8000/overview', we need to read the template overview.
        // Reading the file every time there is a new request is pretty inefficient, so we should read the code once synchronously when the application starts up. We can do this by reading it outside of the callback function as top-level code, such that whenever we need the file we can just simply call it. 

        // dataObj contains an array of all the objects within data.json 
        // Loop through the dataObj array, such that for each object we can replace the placeholders in the template with the data from data.json.

        // The map() method creates a new array populated with the results of calling a provided function on every element in the calling array. 

        // We loop over the data object which holds all of the products, and in each iteration we will replace the placeholders in the templateCard with the current product
        // In an arrow function, if we don't have curly braces replaceTemplate() will get automatically returned (the arrow implicity states the 'return' statement)
        // Logging cardsHtml to the console returns a series of strings that aren't necessarily joined together as one big collective string, which is what we want.
        // We can achieve this by rather than having a series of smaller strings, we can join them up using the .join('') function at the end of everything for the variable cardsHtml. 
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');

        // Replaces the placeholder in the overview template with the one giant string of HTML code w/ placeholders replaced.
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        // Also, don't forget to specify the file-type via res.writeHead(status_code (could be 200 if working properly or 404 if not), {'content-type': text/html});
        // Or in complicated-lingo: "Set the response HTTP header with HTTP status and content type"
        res.writeHead(200, {'content-type': 'text/html'});

        // Send the response body the HTML code w/ the placeholders replaced.
        res.end(output);
    
    // Product page
    } else if (pathName === '/product') {
        res.end("This is PRODUCT");

    // API
    } else if (pathName === '/api') {

        // sends a response header to the request; doesn't relate to the content
        res.writeHead(200, {'content-type': 'application/json'}); // telling browser that the data being sent over is going to be JSON
        res.end(data); // printing out the API data on the browser
    } 
    
    // Not Found (404 error)
    else {
        res.writeHead(404, {
            'content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }
});


// To run local host in broswer -- '127.0.0.1:8000'
// Listens for HTTP requests on port 8000
server.listen(8000, '127.0.0.1', () => {
    console.log("Listening to local host...");
});
