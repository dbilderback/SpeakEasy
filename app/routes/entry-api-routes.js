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
    
    /*db.Entry.findAll({
      include:[{
      model:db.User,
      attributes: ['userId'],
      through: { where: {userId: req.params.id}},
      }]
    })*/
    db.Entry.findAll({
      include:[{
        model:db.User,
        attributes: ['userId', 'firstName', 'lastName'],
        through: { where: {userId: req.user.userId}},
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
  app.get("/api/entry/:user_id", function(req, res) {
    // Join here to include the User who wrote the diary entry
    db.Entry.findAll({
      include:[{model:db.User}],
      where: {
        userId: req.user.userId
      }
    })
    /*db.Entry.findAll({
      where: {
        userId: req.user.userId
      }
    })*/.then(function(dbEntry) {
      res.json(dbEntry);
    });
  });

  // POST route for saving a new diary entry
  app.post("/api/entry/:user_id", function(req, res) {
    db.Entry.create(req.body).then(function(dbEntry) {
      res.json(dbEntry);
      //res.redirect('diary/:user_id='+req.user.userId);
    });
  });

  // DELETE route for deleting a single post for a given user
  app.delete("/api/entry/:entry_id", function(req, res) {
    console.log("Fell INTO THE DELETE ROUTE")
    var entryId = req.params.entry_id.split("=")[1];
    console.log(entryId);
    db.Entry.destroy({
      where: {
        entryId: entryId
      }
    }).then(function(dbEntry) {
      res.json(dbEntry);
    });
  });
  
  // PUT route for updating posts
  app.put("/api/entry/:entry_id", function(req, res) {
    var entryId = req.params.entry_id.split("=")[1];
    db.Entry.update(
      req.body,
      {
        where: {
          entryId: entryId
        }
      }).then(function(dbUser) {
        res.json(dbUser);
      });
  });
};