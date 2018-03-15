$(document).ready(function() {
  // Getting references to the name input and user container, as well as the table body
  var firstNameInput = $("#user-first-name");
  var lastNameInput = $("#user-last-name");
  var emailInput = $("#user-email");
  var passwordInput = $("#user-password");
  var userList = $("tbody");
  var userContainer = $(".user-container");
  // Adding event listeners to the form to create a new object, and the button to delete
  // an Author
  $(document).on("submit", "#user-form", handleUserFormSubmit);
  $(document).on("click", ".delete-user", handleDeleteButtonPress);

  // Getting the intiial list of Authors
  getUsers();

  // A function to handle what happens when the form is submitted to create a new Author
  function handleUserFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if thefields hasn't been filled out
    if ((!firstNameInput.val().trim().trim()) || (!lastNameInput.val().trim().trim()) || (!emailInput.val().trim().trim()) || (!passwordInput.val().trim().trim()))  {
      return;
    }
    // Calling the upsertAuthor function and passing in the user data
    upsertUser({
      firstName: firstNameInput
        .val()
        .trim(),
      lastName: lastNameInput
        .val()
        .trim(),
      email: emailInput
        .val()
        .trim(),
      password: passwordInput
        .val()
        .trim()
    });
  }

  // A function for creating a user. Calls getUsers upon completion
  function upsertUser(userData) {
    $.post("/api/users", userData)
      .then(getUsers);
  }

  // Function for creating a new list row for users
  function createUserRow(userData) {
    var newTr = $("<tr>");
    newTr.data("user", userData);
    newTr.append("<td>" + userData.firstName + " " + userData.lastName + "</td>");
    newTr.append("<td> " + userData.Entries.length + "</td>");
    newTr.append("<td><a href='/diary?user_id=" + userData.userId + "'>Go to Entries</a></td>");
    newTr.append("<td><a href='/cms?user_id=" + userData.userId + "'>Create a New Diary Entry</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-user'>Delete User</a></td>");
    return newTr;
  }

  // Function for retrieving users and getting them ready to be rendered to the page
  function getUsers() {
    $.get("/api/users", function(data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createUserRow(data[i]));
      }
      renderUserList(rowsToAdd);
      firstNameInput.val("") + " " + lastNameInput.val("");
    });
  }

  // A function for rendering the list of users to the page
  function renderUserList(rows) {
    userList.children().not(":last").remove();
    userContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      userList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no users
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create a User before you can create a diary entry.");
    userContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("user");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/users/" + id
    })
    .then(getUsers);
  }
});
