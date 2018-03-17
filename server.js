// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express    = require("express");
var passport   = require('passport');
var session    = require('express-session');
var bodyParser = require("body-parser");
var exphbs     = require('express-handlebars');
var fs         = require("fs");


// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 8080;


// Requiring our models for syncing
var db = require("./models");


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


// For Passport
app.use(session({ secret: 'speakeasy application',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// Static directory
app.use(express.static("public"));


//For Handlebars
app.set('views', './app/views')
app.engine('hbs', exphbs({
    extname: '.hbs',
    helpers: require("./app/helpers/handlebars.js").helpers,
    defaultLayout: __dirname + '/app/views/layouts/main', 
  layoutsDir: __dirname + '/app/views/layouts/',
  partialsDir: __dirname + '/app/views/partials/'
}));
app.set('view engine', '.hbs');


// Routes
// =============================================================
require("./app/routes/html-routes.js")(app, passport);
require("./routes/user-api-routes.js")(app);
require("./app/routes/entry-api-routes.js")(app);
var authRoute = require('./app/routes/auth-routes.js')(app,passport);

//load passport strategies
require('./config/passport/passport.js')(passport, db.User);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
}).catch(function(err) {
 
  console.log(err, "Something went wrong with the Database Update!")

});