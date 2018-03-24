$(document).ready(function() {
  // Getting jQuery references to the entry body, title, form, and user select
  var bodyInput = $("#textBox");
  var titleInput = $("#title");
  var entryForm = $("#entry");
  var userSelect = $("#user");
  var privacySelect = $("#privacy");
  // Adding an event listener for when the form is submitted
  $(entryForm).on("submit", handleFormSubmit);
  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  var url = this.location.pathname;
  var entryId;
  var userId;
  // Sets a flag for whether or not we're updating a post to be false initially
  var updating = false;
  // Looks for a query param in the url for user_id
  userId = getUserId();
  $("#viewDiaryButton").attr("href", "/diary/:user_id="+userId);
  $("#editProfileButton").attr("href", "/user/:user_id="+userId);
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
  // If we have this section in our url, we pull out the post id from the url
  // In '?post_id=1', postId is 1
  if (url.indexOf(":entry_id=") !== -1) {
    entryId = url.split("=")[1];
    getEntryData(entryId, "entry");
  } else if (url.indexOf(":user_id=") !== -1) {
    // Otherwise if we have an author_id in our url, preset the author select box to be our Author
    userId = url.split("=")[1];
  }

  // Getting the User's diary entries
  getUsers();
  renderPrivacyList();

  // A function for handling what happens when the form to create a new post is submitted
  function handleFormSubmit(event) {
    event.preventDefault();
    // Wont submit the post if we are missing a body, title, or author
    if (
      !titleInput.val().trim() ||
      !bodyInput.val().trim() ||
      !userSelect.val()
    ) {
      return;
    }
    // Constructing a newPost object to hand to the database
    var newEntry = {
      title: titleInput.val().trim(),
      body: bodyInput.val().trim(),
      userId: userSelect.val()
    };

    // If we're updating a post run updatePost to update a post
    // Otherwise run submitPost to create a whole new post
    if (updating) {
      newEntry.id = entryId;
      updateEntry(newEntry);
    } else {
      submitEntry(newEntry);
    }
  }

  // Submits a new post and brings user to blog page upon completion
  function submitEntry(entry) {
    console.log(userId);
    $.post("/api/entry/:user_id=" + userId, entry).then(
      (window.location.href = "/diary/:user_id=" + userId)
    );
  }

  // Gets post data for the current post if we're editing, or if we're adding to an author's existing posts
  function getEntryData(id, type) {
    var queryUrl;
    switch (type) {
      case "entry":
        queryUrl = "/api/entry/" + id;
        break;
      case "user":
        queryUrl = "/api/users/" + id;
        break;
      default:
        return;
    }
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data["0"].userId || data["0"].entryId);
        // If this post exists, prefill our cms forms with its data
        titleInput.val(data["0"].title);
        bodyInput.val(data["0"].body);
        userId = data["0"].userId;
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
      window.location.href = "signup";
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

  function renderPrivacyList() {
    var rowsToAdd = [];
    for (var x = 2; x > 1; x--) {
      rowsToAdd.push(createPrivayRows(x));
    }
    console.log(rowsToAdd);
    privacySelect.empty();
    privacySelect.append(rowsToAdd);
    privacySelect.val(0);
  }

  // Creates the author options in the dropdown
  function createUserRow(user) {
    var listOption = $("<option>");
    listOption.attr("value", user.userId);
    listOption.text(user.firstName + " " + user.lastName);
    return listOption;
  }

  // Creates the Private entry options in the dropdown
  function createPrivayRows(x, optionText) {
    var listOption = $("<option>");
    listOption.attr("value", x);
    listOption.text(optionText);
    return listOption;
  }

  // Update a given post, bring user to the blog page when done
  function updateEntry(entry) {
    entryId = url.split("=")[1];
    $.ajax({
      method: "PUT",
      url: "/api/entry/:entry_id=" + entryId,
      data: entry
    }).then(function() {
      window.location.href = "/diary/:user_id=" + userId;
    });
  }

  var debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
  var speakEasy = new Artyom();
  speakEasy.addCommands([
    {
      description:
        "Trigger the creation of a post with your voice ! Say the command and replace the * With the content of your note. <br> Example: <b>Make me a note call my mother this sunday</b>",
      indexes: [
        "Start Recording a new note *",
        "Create an entry *",
        "Remember me *",
        "Creare una nota *",
        "Crear nota *",
        "Notiz hinzufügen *",
        "créer la note *"
      ],
      smart: true,
      action: function(index, wildcard) {
        $("#title").focus();
        UserDictation.start();
      }
    }
  ]);
  function startArtyom() {
    speakEasy.initialize({
      lang: "en-GB",
      continuous: true,
      debug: true,
      listen: true
    });
  }
  function stopArtyom() {
    speakEasy.fatality();
  }

  var noteContent = [];
  var textToDisplay = [];
  var i = 0;
  var UserDictation = speakEasy.newDictation({
    continuous: true, // Enable continuous if HTTPS connection
    onResult: function(text) {
      noteContent.push(text);
      var latestResult = noteContent[noteContent.length - 1];
      console.log(latestResult);
      if (latestResult === "") {
        textToDisplay.push(noteContent[noteContent.length - 2]);
      }
      $("textarea#textBox").val(textToDisplay);
      console.log(noteContent);
      console.log(textToDisplay);
      console.log(i);
    },
    onStart: function() {
      speakEasy.say("Speak");
    },
    onEnd: function() {
      speakEasy.say("Note Recorded");
    }
  });

  $("#speech-start").on("click", function() {
    UserDictation.start();
  });

  $("#speech-stop").on("click", function() {
    UserDictation.stop();
    $("#textBox").text(textToDisplay);
  });
});
