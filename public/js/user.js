$(document).ready(function() {
  // Getting jQuery references to the user input fields and form
  var firstNameInput = $("#firstName");
  var lastNameInput = $("#lastName");
  var emailInput = $("#email");
  var password1Input = $("#password1");
  var password2Input = $("#password2");
  var languageInput = $("#language");
  var voiceInput = $("#voice");
  var timeZoneInput = $("#timeZone");
  var userForm = $("#user");

  // Adding an event listener for when the form is submitted
  $(userForm).on("submit", handleFormSubmit);

  // Gets the part of the url that comes after the "?" (which we have if we're updating a post)
  // Looks for a query param in the url for user_id
  var url = this.location.pathname;
  var userId;
  userId = getUserId();
  $("#viewDiaryButton").attr("href", "/diary/:user_id=" + userId);
  getUser(userId);

  function getUserId() {
    if (url.indexOf(":user_id=") !== -1) {
      userId = url.split("=")[1];
      return userId;
    } else {
      userId = "";
      return userId;
    }
  }

  //function handles the event when the submit event is fired
  function handleFormSubmit(event) {
    event.preventDefault();
    // Check for a password update
    if (!password1Input.val().trim() || !password2Input.val().trim()) {
      if (password1Input.val().trim() == password2Input.val().trim()) {
        //update the password
      }
    }
    //Cancel submit if the any of the fields are blank
    if (
      !firstNameInput.val().trim() ||
      !lastNameInput.val().trim() ||
      !emailInput.val().trim()
    ) {
      return;
    }

    // Build the user object
    var newUser = {
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      email: emailInput.val().trim()
    };
    updateUser(newUser);
  }

  function getUser(id) {
    var queryUrl = "/api/user/:user_id=" + id;
    $.get(queryUrl, function(data) {
      if (data) {
        console.log(data.userId);
        // If this post exists, prefill our cms forms with its data
        firstNameInput.val(data.firstName);
        lastNameInput.val(data.lastName);
        emailInput.val(data.email);
      }
    });
  }

  function displayUser() {
    userId = url.split("=")[1];
    console.log(userId);
  }

  //Call the ajaz method to update the user data
  function updateUser(user) {
    userId = url.split("=")[1];
    console.log(userId);
    $.ajax({
      method: "PUT",
      url: "/api/user/:user_id=" + userId,
      data: user
    }).then(function() {
      window.location.href = "/user/:user_id=" + userId;
    });
  }
  var speakEasy = new Artyom();
  var commands = [
    {
      description: "Go to specified page ",
      indexes: ["Take me to the * Page", "Go to the * Page"],
      smart: true,
      action: function(i, wildcard) {
        switch (wildcard) {
          case "diary":
            window.location.href = "/diary/:user_id=" + userId;
            break;
          case "user":
            window.location.href = "/user/:user_id=" + userId;
            break;
          case "sign in":
            window.location.href = "/signin";
            break;
          case "entry":
            window.location.href = "/entry/:user_id=" + userId;
            break;
        }
      }
    }
  ];

  function startArtyom() {
    speakEasy.initialize({
      lang: "en-GB",
      continuous: false,
      debug: true,
      listen: true
    });
  }
  function stopArtyom() {
    speakEasy.fatality();
  }

  speakEasy.addCommands(commands);

  function RenderCommands() {
    var comandi = speakEasy.getAvailableCommands();

    for (var i = 0; i < comandi.length; i++) {
      var com = comandi[i];
      var list = "";
      for (var q = 0; q < com.indexes.length; q++) {
        list += "<br>" + com.indexes[q];
      }

      var row =
        "<tr>\n\
                        <td>" +
        list +
        "</td>\n\
                        <td>" +
        com.description +
        "</td>\n\
                        </tr>";
      $("#table-commands tbody").append(row);
    }
  }

  startArtyom();
  RenderCommands();
});
