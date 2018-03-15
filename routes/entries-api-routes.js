// *********************************************************************************
// api-routes.js - this file offers a set of routes for displaying and saving data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/entries", function(req, res) {
    var query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    // Join to include all of the Users to these diary entries
    db.Post.findAll({
      include:[{model:db.User}],
      where: query
    }).then(function(dbEntry) {
      res.json(dbEntry);
    });
  });

  // Get rotue for retrieving a single post
  app.get("/api/entries/:id", function(req, res) {
    // Join here to include the User who wrote the diary entry
    db.Post.findOne({
      include:[{model:db.User}],
      where: {
        id: req.params.id
      }
    }).then(function(dbEntry) {
      console.log(dbEntry);
      res.json(dbEntry);
    });
  });

  // POST route for saving a new post
  app.post("/api/entries", function(req, res) {
    db.Entry.create(req.body).then(function(dbEntry) {
      res.json(dbEntry);
    });
  });

  // DELETE route for deleting posts
  app.delete("/api/entries/:id", function(req, res) {
    db.Entry.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbEntry) {
      res.json(dbEntry);
    });
  });

  // PUT route for updating posts
  app.put("/api/entries", function(req, res) {
    db.Entry.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbUser) {
        res.json(dbUser);
      });
  });
};
