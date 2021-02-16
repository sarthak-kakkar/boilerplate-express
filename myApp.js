
var express = require('express');
var app = express();
let bodyParser = require('body-parser');

// --> 7)  Mount the Logger middleware here

let logger = (req, res, next) => {
  console.log(req.method + " " + req.path + " - " + req.ip);
  next();
}

app.use(logger);

// --> 11)  Mount the body-parser middleware  here
// As the middleware must be mounted before all the routes which need it.

app.use(bodyParser.urlencoded({extended: false}));

/** 1) Meet the node console. */

console.log("Hello World");

/** 2) A first working Express Server 
 * 
 * https://www.freecodecamp.org/learn/apis-and-microservices/basic-node-and-express/start-a-working-express-server

In the first two lines of the file myApp.js, you can see how easy it is to create an Express app object. This object has several methods, and you will learn many of them in these challenges. One fundamental method is app.listen(port). It tells your server to listen on a given port, putting it in running state. For testing reasons, we need the app to be running in the background so we added this method in the `server.js` file for you.

Let’s serve our first string! In Express, routes takes the following structure: app.METHOD(PATH, HANDLER). METHOD is an http method in lowercase. PATH is a relative path on the server (it can be a string, or even a regular expression). HANDLER is a function that Express calls when the route is matched. Handlers take the form function(req, res) {...}, where req is the request object, and res is the response object. For example, the handler

function(req, res) {
  res.send('Response String');
}
will serve the string 'Response String'.
 * 
*/

//app.get("/", (req, res) => res.send("Hello Express"));

/** 3) Serve an HTML file 
 * Note -> Keep in mind that Express evaluates routes from top to bottom, and executes the handler for the first match. You have to comment out the preceding solution, or the server will keep responding with a string.
 * https://www.freecodecamp.org/learn/apis-and-microservices/basic-node-and-express/serve-an-html-file
 * You can respond to requests with a file using the res.sendFile(path) method. You can put it inside the app.get('/', ...) route handler. Behind the scenes, this method will set the appropriate headers to instruct your browser on how to handle the file you want to send, according to its type. Then it will read and send the file. This method needs an absolute file path. We recommend you to use the Node global variable __dirname to calculate the path like this:

absolutePath = __dirname + relativePath/file.ext
 * 
*/

app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

/** 4) Serve static assets  
 * 
 * https://www.freecodecamp.org/learn/apis-and-microservices/basic-node-and-express/serve-static-assets
 * An HTML server usually has one or more directories that are accessible by the user. You can place there the static assets needed by your application (stylesheets, scripts, images). In Express, you can put in place this functionality using the middleware express.static(path), where the path parameter is the absolute path of the folder containing the assets. If you don’t know what middleware is... don’t worry, we will discuss in detail later. Basically, middleware are functions that intercept route handlers, adding some kind of information. A middleware needs to be mounted using the method app.use(path, middlewareFunction). The first path argument is optional. If you don’t pass it, the middleware will be executed for all requests.
 * 
*/

app.use(express.static(__dirname + "/public"));

/** 5) serve JSON on a specific route 
 * https://www.freecodecamp.org/learn/apis-and-microservices/basic-node-and-express/serve-json-on-a-specific-route
 * 
 * Let's create a simple API by creating a route that responds with JSON at the path /json. You can do it as usual, with the app.get() method. Inside the route handler, use the method res.json(), passing in an object as an argument. This method closes the request-response loop, returning the data. Behind the scenes, it converts a valid JavaScript object into a string, then sets the appropriate headers to tell your browser that you are serving JSON, and sends the data back. A valid object has the usual structure {key: data}. data can be a number, a string, a nested object or an array. data can also be a variable or the result of a function call, in which case it will be evaluated before being converted into a string.
 * 
*/

//app.get("/json", (req, res) => res.json({message: Hello json}))

/** 6) Use the .env file to configure the app 
 * 
 * 
 * https://www.freecodecamp.org/learn/apis-and-microservices/basic-node-and-express/use-the--env-file

The .env file is a hidden file that is used to pass environment variables to your application. This file is secret, no one but you can access it, and it can be used to store data that you want to keep private or hidden. For example, you can store API keys from external services or your database URI. You can also use it to store configuration options. By setting configuration options, you can change the behavior of your application, without the need to rewrite some code.

The environment variables are accessible from the app as process.env.VAR_NAME. The process.env object is a global Node object, and variables are passed as strings. By convention, the variable names are all uppercase, with words separated by an underscore. The .env is a shell file, so you don’t need to wrap names or values in quotes. It is also important to note that there cannot be space around the equals sign when you are assigning values to your variables, e.g. VAR_NAME=value. Usually, you will put each variable definition on a separate line.
 * 
*/

let message = "Hello json";

app.get("/json", (req, res) => res.json({message: (process.env.MESSAGE_STYLE === 'uppercase' ? message.toUpperCase() : message)}));

/** 7) Root-level Middleware - A logger 
 * 
 * Earlier, you were introduced to the express.static() middleware function. Now it’s time to see what middleware is, in more detail. Middleware functions are functions that take 3 arguments: the request object, the response object, and the next function in the application’s request-response cycle. These functions execute some code that can have side effects on the app, and usually add information to the request or response objects. They can also end the cycle by sending a response when some condition is met. If they don’t send the response when they are done, they start the execution of the next function in the stack. This triggers calling the 3rd argument, next().

Look at the following example:

function(req, res, next) {
  console.log("I'm a middleware...");
  next();
}
Let’s suppose you mounted this function on a route. When a request matches the route, it displays the string “I’m a middleware…”, then it executes the next function in the stack. In this exercise, you are going to build root-level middleware. As you have seen in challenge 4, to mount a middleware function at root level, you can use the app.use(<mware-function>) method. In this case, the function will be executed for all the requests, but you can also set more specific conditions. For example, if you want a function to be executed only for POST requests, you could use app.post(<mware-function>). Analogous methods exist for all the HTTP verbs (GET, DELETE, PUT, …).
 * 
 * Note: Express evaluates functions in the order they appear in the code. This is true for middleware too. If you want it to work for all the routes, it should be mounted before them.
 * 
*/
//  place it before all the routes !

/** 8) Chaining middleware. A Time server 
 * 
 * https://www.freecodecamp.org/learn/apis-and-microservices/basic-node-and-express/chain-middleware-to-create-a-time-server
 * 
 * Middleware can be mounted at a specific route using app.METHOD(path, middlewareFunction). Middleware can also be chained inside route definition.

Look at the following example:

app.get('/user', function(req, res, next) {
  req.user = getTheUserSync();  // Hypothetical synchronous operation
  next();
}, function(req, res) {
  res.send(req.user);
});
This approach is useful to split the server operations into smaller units. That leads to a better app structure, and the possibility to reuse code in different places. This approach can also be used to perform some validation on the data. At each point of the middleware stack you can block the execution of the current chain and pass control to functions specifically designed to handle errors. Or you can pass control to the next matching route, to handle special cases. We will see how in the advanced Express section.

Notice how the json supplied is not using strings.
*/

app.get("/now", (req, res, next) => {
  req.time = new Date().toString();
  next();
}, (req, res) => {
  res.json({time: req.time})
})


/** 9)  Get input from client - Route parameters 
 * 
 * route_path: '/user/:userId/book/:bookId'
actual_request_URL: '/user/546/book/6754'
req.params: {userId: '546', bookId: '6754'}
 * 
*/

app.get("/:word/echo", (req,res) => res.json({echo: req.params.word}));

/** 10) Get input from client - Query parameters 
 * 
 * Some characters, like the percent (%), cannot be in URLs and have to be encoded in a different format before you can send them. If you use the API from JavaScript, you can use specific methods to encode/decode these characters.
 * 
 * route_path: '/library'
actual_request_URL: '/library?userId=546&bookId=6754'
req.query: {userId: '546', bookId: '6754'}
 * 
*/
// /name?first=<firstname>&last=<lastname>

let handler = (req,res) => res.json({name: req.query.first + ' ' + req.query.last})

app.route("/name").get(handler)//.post(handler);
  
/** 11) Get ready for POST Requests - the `body-parser`
 * 
 * extended=false is a configuration option that tells the parser to use the classic encoding. When using it, values can be only strings or arrays. The extended version allows more data flexibility, but it is outmatched by JSON.
 * 
 */
// place it before all the routes !


/** 12) Get data form POST  
 * 
 * route: POST '/library'
urlencoded_body: userId=546&bookId=6754
req.body: {userId: '546', bookId: '6754'}
*/

app.post("/name", (req,res) => res.json({name: req.body.first + ' ' + req.body.last}));

// This would be part of the basic setup of an Express app
// but to allow FCC to run tests, the server is already active
/** app.listen(process.env.PORT || 3000 ); */

//---------- DO NOT EDIT BELOW THIS LINE --------------------

 module.exports = app;
