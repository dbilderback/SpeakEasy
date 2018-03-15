$(document).ready(function() {
  // Getting jQuery references to the post body, title, form, and author select
  var bodyInput = $("#body");
  var titleInput = $("#title");
  var cmsForm = $("#cms");
  var userSelect = $("#user");
  // Adding an event listener for when the form is submitted
  $(cmsForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  var url = window.location.search;
  var entryId;
  var userId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;

  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  if (url.indexOf("?entry_id=") !== -1) {
    entryId = url.split("=")[1];
    getEntryData(entryId, "entry");
  }
  // Otherwise if we have an author_id in our url, preset the author select box to be our Author
  else if (url.indexOf("?user_id=") !== -1) {
    userId = url.split("=")[1];
  }

  // Getting the authors, and their posts
  getUsers();

  // A function for handling what happens when the form to create a new post is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body, title, or author
    if (!titleInput.val().trim() || !bodyInput.val().trim() || !userSelect.val()) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newEntry = {
      title: titleInput
        .val()
        .trim(),
      body: bodyInput
        .val()
        .trim(),
      userId: userSelect.val()
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newEntry.id = entryId;
      updateEntry(newEntry);
    }
    else {
      submitEntry(newEntry);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitEntry(entry) {
    $.post("/api/entries", entry, function() {
      window.location.href = "/diary";
    });
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getEntryData(id, type) {
    var queryUrl;
    switch (type) {
      case "entry":
        queryUrl = "/api/entries/" + id;
        break;
      case "user":
        queryUrl = "/api/users/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.UserId || data.id)
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data.title);
        bodyInput.val(data.body);
        userId = data.UserId || data.id;
        // If we have a post with this id, set a flag for us to know to update the post
        // when we hit submit
        updating = true;
      }
    });
  }

  // A function to get Authors and then render our list of Authors
  function getUsers() {
    $.get("/api/users", renderUserList);
  }
  // Function to either render a list of authors, or if there are none, direct the user to the page
  // to create an author first
  function renderUserList(data) {
    if (!data.length) {
      window.location.href = "/users";
    }
    $(".hidden").removeClass("hidden");
    var rowsToAdd = [];
    for (var i = 0; i < data.length; i++) {
      rowsToAdd.push(createUserRow(data[i]));
    }
    userSelect.empty();
    console.log(rowsToAdd);
    console.log(userSelect);
    userSelect.append(rowsToAdd);
    userSelect.val(userId);
  }

  // Creates the author options in the dropdown
  function createUserRow(user) {
    var listOption = $("<option>");
    listOption.attr("value", user.userId);
    listOption.text(user.firstName + " " + user.lastName);
    return listOption;
  }

  // Update a given post, bring user to the blog page when done
  function updateEntry(entry) {
    $.ajax({
      method: "PUT",
      url: "/api/entries",
      data: entry
    })
    .then(function() {
      window.location.href = "/diary";
    });
  }
});
