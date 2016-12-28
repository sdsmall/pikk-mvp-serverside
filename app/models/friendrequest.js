var mongoose = require('mongoose');  
var Schema = mongoose.Schema;
var User = require('./user');
var ObjectId = mongoose.Schema.Types.ObjectId;


var FriendRequestSchema  = new Schema({
    "requester" : { type : ObjectId, ref: 'User' },
    "requestee" : { type : ObjectId, ref: 'User' },
    "requesteeAlerted" : Boolean,
    "requestDate" : Date,
    //status (pending, denied)
    "status" : String
});

module.exports = mongoose.model('FriendRequest', FriendRequestSchema);