const fs = require('fs'); // file system -- allows us to modify files
const http = require('http'); // create server and listen for HTTP requests
const { Http2ServerRequest } = require('http2');
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

    if (err) return (console.log("ERROR. File not found."));

    fs.readFile(`${__dirname}/txt/${data}.txt`, 'utf-8', (err, data2) => {
        console.log(data2);

        fs.readFile(`${__dirname}/txt/append.txt`, 'utf-8', (err, data3) => {
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

// Read JSON data one time synchronously so that there is no need to read and send back the data every time the user goes to the api route. 
// Make sure the JSON reading is above the server itself (ie. http.createServer() function) as top level code is executed exactly once while the callback function is going to be executed for every request which is not what we want as we know synchronous code takes longer to process (blocking code).
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data); // JSON.parse() parses a JSON string, constructing the JS value/object described by the string.

const server = http.createServer((req, res) => {
    const pathName = req.url; // url name of the HTTP request

    if (pathName === '/' || pathName === "/overivew") {
        console.log("This is OVERVIEW");
    } else if (pathName === '/product') {
        console.log("This is PRODUCT");
    } else if (pathName === '/api') {

        // sends a response header to the request; doesn't relate to the content
        res.writeHead(200, {'content-type': 'application/json'}); // telling browser that the data being sent over is going to be JSON
        res.end(data); // printing out the API data on the browser
    } else {
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
