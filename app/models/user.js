var mongoose = require('mongoose');  
var Schema = mongoose.Schema;
var Friendship = require('./friendship');
var FriendRequest = require('./friendrequest');
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema  = new Schema({
    "userID" : String,
    "name" : String,
    "email" : String
});

module.exports = mongoose.model('User', UserSchema);