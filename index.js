const fs = require('fs'); // working with files (reading, writing, updating, renaming, deleting files)
const http = require('http'); // gives us the capability to build http servers
const url = require('url'); // routing utls

/////////////////////////
///// FILES

// // Synchronous -- blocking call
// const readText = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(readText)

// const text = `I like dick ${readText}`;
// fs.writeFileSync('./txt/output.txt', text);

// Asynchronous -- non-blocking call

// as soon as the readFile() function is ready, it will read the file and then will start the callback function
// the callback function has two arguments: error and data

// nodeJs will start reading the file in the background here and will not block the code,
// and then immediately will move on the next line of code
// Therefore, "will read file!" will be the first thing logged to the console.
// Onlt then when a file is completely read, the callback function will run

// the callback function has access to the error and the data that was read, such that the "data" parameter is just a name and can be named technically anything, for instance "text" (and remember the "data" parameter is the second argument, not the first)
// fs.readFile('./txt/startt.txt', 'utf-8', (err, data1) => {

//     // the return keyword will return the desired expression, and will effectively not run the following code below it which is what we want
//     if (err) return console.log("error!!!")

//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             // we are not reading data, so we only need the error argument and no need for the data argument
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log("Your file has been written!");
//             })
//         });
//     });
// });

// console.log('Will read file!');

/////////////////////////
///// SERVER

// TODO:
// - Create the server
// - Start the server so that we can listen to incoming requests

// NOTES:
// createServer will accept a callback function with two arguments: request and a response variable.
// createServer will be fired off once a new request hits our server.

// listen accepts parameters: port (sub-address on a certain host (communication endpoint); the port doesnt matter), local-host 
// ('127.0.0.1')
// To run the local-host on our computer -- 127.0.0.1:8000 (or any other port number, but in this case its 8000)


// Creating the server and passed in a callback function (a function passed into another function as an argument which is then invoked inside the outer function to complete some kind of routine or action.) that is executed each time a new request hits the server 
// const server = http.createServer((req, res) => {
//     // we can inspect the request variable object by console.log(req)
//     // we can send back a response to the client via res.end();
//     res.end('Hello from the server!');
// })



// // Listens for any incoming requests on the local host IP and on port 8000
// server.listen(8000, '127.0.0.1', () => {
//     console.log("listening to requests on port 8000")
// })

/////////////////////////
///// SERVER

// outside of the callback function -- we can use Synchronous version of readfile (ie. readFileSync)
// the top level code is only executed once right in the beginning of when the code executes, so blocking is not relevant for this context.

// while, the callback function is going to be executed every time for there is a new request
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);


// creating the server
/* 
    http.CreateServer(request, response)
    __dirname returns the directory name of the current module
*/
const server = http.createServer((req, res) => {
    // implementing the routing for HTTP requests.
    const pathName = req.url;

    // we can route to different URL's by using a series of if and else if statements (basically hard-coding the URL routes)
    if (pathName === '/' || pathName === "/overview") {
        res.end("this is the OVERVIEW!");
    } else if (pathName === '/product') {
        res.end('this is the PRODUCT');
    } else if (pathName === '/api') {

        // better convention using __dirname than ./
        // each time someone goes to the /api route, the file will have to be read and sent back; this is not 100% efficient
        // soln: we can just read the file once in the beginning such that every time someone goes to the /api route we can just simply send back the data without having to read the data each time the user requests (ie. every time user goes to /api route)
        // HTTP status code of 200 means everything is working and responding
        res.writeHead(200, {'Content-type': 'application/json'}); // telling the browser the data we're sending over is JSON
        res.end(data);

    } else {
        // writeHead can also send headers
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

// listening to HTTP requests on local host w/ port 8000
server.listen(8000, '127.0.0.1', () => {
    console.log("listening to requests on port 8000");
});