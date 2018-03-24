$(document).ready(function() {
    var url = this.location.pathname;
    var entryId;
    var userId;
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
});