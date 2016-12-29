var mongoose = require('mongoose');  
var Schema = mongoose.Schema;
var User = require('./user');
var ObjectId = mongoose.Schema.Types.ObjectId;

var FriendshipSchema  = new Schema({
	"requester" : { type : ObjectId, ref: 'User' },
    "requestee" : { type : ObjectId, ref: 'User' },
    "requestDate" : Date,
    "acceptDate" : Date
});

module.exports = mongoose.model('Friendship', FriendshipSchema);