//Source: https://codeburst.io/build-a-weather-website-in-30-minutes-with-node-js-express-openweather-a317f904897b

// Express is a minimalist web framework for NodeJS - it allows one to create and run a web server with Node
// An instance named app is created by invoking Express
// The request package is required to make HTTP calls
const express = require('express');
const app = express()
const request = require('request');


// body-parser is a middleware (functions that have access to both the req and res bodies) package
// More specifically, it allows use of the key-value pairs stored on the req-body object
// In this project, it allows access to the city name input the user typed in
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Sets up a template engine
// Note: A template engine will replace placeholder variables in a template file with actual values at runtime
app.set('view engine', 'ejs')

// Allows our instance of Express to access all of the static files within the 'public' folder
// Note: Express by default will not allow access to other files (like CSS files), so you need to first expose it with this code
app.use(express.static('public'));

// The code here tells Express to render "index" when visiting the root URL (given by '/')
// Use res.render when working with a templating language like EJS - it'll render the file and send an equivalent HTML to the client
app.get('/', function(req, res)
{
    res.render('index');
});


// Set up the route for the post request (as specified in the form tag of the index.ejs file)
let apiKey = `c14c8f06124adcb6d64fdf6aff291861`;


// To break this code down into steps...
// 1. When the post request is received, store the city input from req.body.city into a variable
// 2. Create a URL string using the city and apiKey to access the OpenWeatherAPI with
// 3. Call the API with request
// 4. If there's an error, render the index page
/// Note: res.render has a second option that takes in an object where we can specify properties to be handled by our view (index.ejs)
// 5. If there's no error, use JSON.parse(body) to parse the JSON into a usable JavaScript object
// 6. Check if the user input a string that isn't a city - if so, render the index page and return an error
// 7. If not an error, create a string with the results and send it back to client with the index view

app.post('/', function(req, res)
{
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apiKey}&units=metric`;

    request (url, function (err, response, body)
    {
        if (err)
        {
            res.render('index', {weather: null, error: 'Error, please try again'});
        }
        else
        {
            let weather = JSON.parse(body);
            if (weather.main == undefined)
            {
                res.render('index', {weather: null, error: 'Error, please try again'});
            }
            else
            {
                let weatherText = `Hi friends, it's ${weather.main.temp} degrees Celcius in ${weather.name}`;
                res.render('index', {weather: weatherText, error: null});
            }
        }
    });
});


// The code here creates a server that is 'listening on port 3000 for connections'
app.listen(3000, function()
{
    console.log('Example app listening on port 3000');
});



