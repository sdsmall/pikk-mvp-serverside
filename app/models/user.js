var mongoose = require('mongoose');  
var Schema = mongoose.Schema;

var UserSchema  = new Schema({
    "userID" : String,
    "name" : String,
    "email" : String,
    "friends" : [],
    "outgoingFriendRequests" : [],
    "incomingFriendRequests" : []
});

module.exports = mongoose.model('User', UserSchema);