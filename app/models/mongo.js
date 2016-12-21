var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/pikk_data');

// create schema
var userSchema  = mongoose.Schema({
    "userID" : String,
    "name" : String,
    "email" : String
});

// create model if not exists.
var User = mongoose.model('User', userSchema)

module.exports = User;