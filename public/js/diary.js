$(document).ready(function() {
  /* global moment */

  // Entry Container holds all of our posts
  var userContainer = $(".user-container");
  var entryContainer = $(".entry-container");
  var entryCategorySelect = $("#category");
  // Click events for the edit and delete buttons
  $(document).on("click", "button.delete", handleEntryDelete);
  $(document).on("click", "button.edit", handleEntryEdit);
  // Variable to hold our posts
  var entries;
  // The code below handles the case where we want to get diary entries for a specific user
  // Looks for a query param in the url for user_id
  var url = this.location.pathname;
  var userId;
  userId = getUserId();
  $("#newEntryButton").attr("href", "/entry/:user_id="+userId);
  $("#editUserButton").attr("href", "/user/:user_id="+userId);
  getEntries(userId);
  
function getUserId() {
  if (url.indexOf(":user_id=") !== -1) {
    userId = url.split("=")[1];
    return userId;
  }
  else {
  userId = "";
  return userId;
  }
}

  // This function grabs posts from the database and updates the view
  function getEntries(user) {
    userId = getUserId();
    userId = "/:user_id=" + userId;
    
    $.get("/api/entry" + userId, function(data) {
      entries = data;
      if (!entries || !entries.length) {
        displayEmpty(user);
      }
      else {
        initializeRows();
      }
    });
  }

  // This function does an API call to delete posts
  function deleteEntry(id) {
    $.ajax({
      method: "DELETE",
      url: "/api/entry/:entry_id=" + id
    })
    .then(function() {
      getEntries(entryCategorySelect.val());
    });
  }

  // InitializeRows handles appending all of our constructed post HTML inside blogContainer
  function initializeRows() {
    entryContainer.empty();
    var entriesToAdd = [];
    for (var i = 0; i < entries.length; i++) {
      entriesToAdd.push(createNewRow(entries[i]));
    }
    entryContainer.append(entriesToAdd);
  }

  // This function constructs a post's HTML
  function createNewRow(entry) {
    var formattedDate = new Date(entry.createdAt);
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newEntryPanel = $("<div>");
    newEntryPanel.addClass("panel panel-default");
    var newEntryPanelHeading = $("<div>");
    newEntryPanelHeading.addClass("panel-heading");
    var deleteBtn = $("<button>");
    deleteBtn.text("x");
    deleteBtn.addClass("delete btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.addClass("edit btn btn-info");
    var newEntryTitle = $("<h2>");
    var newEntryDate = $("<small>");
    var newEntryUser = $("<h5>");
    newEntryUser.text("Written by: " + entry.User.firstName + " " + entry.User.lastName);
    newEntryUser.css({
      float: "right",
      color: "blue",
      "margin-top":
      "-10px"
    });
    var newEntryPanelBody = $("<div>");
    newEntryPanelBody.addClass("panel-body");
    var newEntryBody = $("<p>");
    newEntryTitle.text(entry.title + " ");
    newEntryBody.text(entry.body);
    newEntryDate.text(formattedDate);
    newEntryTitle.append(newEntryDate);
    newEntryPanelHeading.append(deleteBtn);
    newEntryPanelHeading.append(editBtn);
    newEntryPanelHeading.append(newEntryTitle);
    newEntryPanelHeading.append(newEntryUser);
    newEntryPanelBody.append(newEntryBody);
    newEntryPanel.append(newEntryPanelHeading);
    newEntryPanel.append(newEntryPanelBody);
    newEntryPanel.data("entry", entry);
    return newEntryPanel;
  }

  // This function figures out which post we want to delete and then calls deletePost
  function handleEntryDelete() {
    var currentEntry = $(this)
      .parent()
      .parent()
      .data("entry");
    deleteEntry(currentEntry.entryId);
  }

  // This function figures out which post we want to edit and takes it to the appropriate url
  function handleEntryEdit() {
    var currentEntry = $(this)
      .parent()
      .parent()
      .data("entry");
    window.location.href = "/entry/:entry_id=" + currentEntry.entryId;
  }

  // This function displays a messgae when there are no posts
  function displayEmpty(id) {
    var query = window.location.search;
    var partial = "";
    if (id) {
      partial = " for Usr #" + id;
    }
    entryContainer.empty();
    var messageh2 = $("<h2>");
    messageh2.css({ "text-align": "center", "margin-top": "50px" });
    messageh2.html("No diary entries yet please click the link Journal Entry to begin");
    entryContainer.append(messageh2);
  }

});
