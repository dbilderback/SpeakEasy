$(document).ready(function() {
    var url = this.location.pathname;
    var entryId;
    var userId;
    getURLPath();
    function getURLPath() {
        if (url.indexOf("/signup") !==-1) {
            $("#diaryLink").hide();
            $("#entryLink").hide();
            $("#userLink").hide();
            $("#logoutLink").hide();
        }
        else if ((url.indexOf("/diary") !==-1)) {
            $("#diaryLink").hide();
            getUserId();
        }
        else if (url.indexOf("/entry") !==-1) {
            $("#entryLink").hide();
            getUserId();
        }
        else if (url.indexOf("/user") !==-1) {
            $("#userLink").hide();
            getUserId();
        }
        else {

        }
    }
    
    function getUserId() {
        if (url.indexOf(":user_id=") !== -1) {
            userId = url.split("=")[1];
            $("#entryLink").attr("href", "/entry/:user_id="+userId);
            $("#userLink").attr("href", "/user/:user_id="+userId);
            $("#diaryLink").attr("href", "/diary/:user_id="+userId);
        }
        else {
        userId = "";
        return userId;
        }
    }
});