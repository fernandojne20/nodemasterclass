/*
* Primary file for the API
*
*/

//Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

//The server should respond to all request with a string
var server = http.createServer((req, res) => {
  
  //Get the URL and parse it
  var parsedUrl = url.parse(req.url, true);

  //Get the path
  var path = parsedUrl.pathname;
  var trimmedPath = path.replace(/^\/+|\/+$/g, '');

  // Get the query string as an object
  var queryStringObject = parsedUrl.query;
  // Get the HTTP method
  var method = req.method.toLowerCase();

  // Get the Headers as an object
  var headers = req.headers;

  // Get the payload, if any
  var decoder = new StringDecoder('utf8');
  var buffer = ''; 

  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construct the data object to send to the handler
    var data = {
      'trimmedPath' : trimmedPath,
      'queryStringObject' : queryStringObject,
      'method' : method,
      'headers' : headers,
      'payload' : buffer
    };

    // Route the request to the handler specified in the router
    chosenHandler(data, (statusCode, payload) => {

      // Use the status code returned from the handler, or set the default status code to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

      // Use the payload returned from the handler, or set the default payload to an empty object
      payload = typeof(payload) == 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);

      // Return the response
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log('Returning this response: ', statusCode, payloadString);

    });

  });

});

//Start the server, and have it listen to port 3000
server.listen(3000, () => {
  console.log('The server is listening on port 3000 now');
});

// Define the handlers
var handlers = {};

// Sample Handlers
handlers.sample = (data, callback) => {
  callback(406, {'name': 'Sample Handler'});
}

// Not Found Handler
handlers.notFound = (data, callback) => {
  callback(404);
}

// Define a request router
var router = {
  'sample': handlers.sample
}

