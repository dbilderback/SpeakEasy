// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require('path');
var htmlController = require('../controllers/htmlcontroller.js');

// Routes
// =============================================================
module.exports = function(app, passport) {

    app.get('/', isLoggedIn, htmlController.root);

    app.get('/main', isLoggedIn, htmlController.main);

    /*app.get('/diary', isLoggedIn, htmlController.diary, function(req, res) {
        res.redirect('diary/:user_id'+req.user.userId);
    });*/

    app.get('/diary/:user_id', isLoggedIn, htmlController.diary, function(req, res) {
        console.log('Test' + req.params.user_id);
        res.render('diary/:user_id='+req.query);
    });

    app.get('/dashboard', isLoggedIn, htmlController.dashboard);

    app.get('/entry/:userId', isLoggedIn, htmlController.entry, function(req, res) {
        res.send(req.params.userId);
    });

    app.get('/profile', isLoggedIn, htmlController.profile);

    app.get('/logout', htmlController.logout);


    // cms route loads cms.html
    app.get("/cms", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/cms.html"));
    });

    // authors route loads author-manager.html
    app.get("/users", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/user-manager.html"));
    });

    app.get("/voice", function(req, res) {
        res.sendFile(path.join(__dirname, "../public/voice.html"));
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/signin');
    }
};


exports.diary = function(req, res) {
    res.render('diary');
  }
  
  
  exports.main = function(req, res) {
    res.render('index');
  }