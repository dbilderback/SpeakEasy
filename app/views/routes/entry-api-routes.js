// *********************************************************************************
// entry-api-routes.js - this file offers a set of routes for displaying and saving diary entry data to the db
// *********************************************************************************

// Dependencies
// =============================================================

// Requiring our models
var db = require("../../models");
var authController = require('../controllers/authcontroller.js');

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts of a given user
  app.get("/api/entry", function(req, res) {
    var query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    console.log(query.UserId);
    console.log(req.query.user_id);
    // Join to include all of the Users to these diary entries
    console.log(db.User);
    db.Entry.findAll({
      include:[{
      model:db.User,
      attributes: ['userId'],
      through: { where: {userId: req.params.id}},
      }]
    }).then(function(dbEntry) {
      res.json(dbEntry);
    });
  });
 /* include: [{
    model: Project,
    through: {
      attributes: ['createdAt', 'startedAt', 'finishedAt'],
      where: {completed: true}
    }
  }]
*/
  // Get route for retrieving a single diary entry for a given user
  app.get("/api/entry/:id", function(req, res) {
    var url = window.location.search;
    var userId;
    if (url.indexOf("?user_id=") !== -1) {
      userId = url.split("=")[1];
    }
    // Join here to include the User who wrote the diary entry
    db.Entry.findAll({
      include:[{model:db.User}],
      where: {
        userId: userId
      }
    }).then(function(dbEntry) {
      console.log(dbEntry);
      res.json(dbEntry);
    });
  });

  // POST route for saving a new diary entry
  app.post("/api/entry", function(req, res) {
    console.log(req.body);
    db.Entry.create(req.body).then(function(dbEntry) {
      res.json(dbEntry);
    });
  });

  // DELETE route for deleting a single post for a given user
  app.delete("/api/entry/:id", function(req, res) {
    db.Entry.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbEntry) {
      res.json(dbEntry);
    });
  });

  // PUT route for updating posts
  app.put("/api/entry", function(req, res) {
    db.Entry.update(
      req.body,
      {
        where: {
          id: req.params.id
        }
      }).then(function(dbUser) {
        res.json(dbUser);
      });
  });
};