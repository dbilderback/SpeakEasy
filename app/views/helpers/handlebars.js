var register = function(Handlebars) {
    var helpers = {
    setChecked: function(value, currentValue) {
        if ( value == currentValue ) {
            return "checked"
         } else {
            return "";
         }
    },
    userIdAppend: function(userId) {
        return '/:user_id="'+ userId;    
    } 
};

if (Handlebars && typeof Handlebars.registerHelper === "function") {
    for (var prop in helpers) {
        Handlebars.registerHelper(prop, helpers[prop]);
    }
} else {
    return helpers;
}

};

module.exports.register = register;
module.exports.helpers = register(null); 
