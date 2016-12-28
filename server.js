// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/pikk_data');

var User = require('./app/models/user');
var Friendship = require('./app/models/friendship');
var FriendRequest = require('./app/models/friendrequest');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); });


router.route('/login')
	
	.put(function(req, res){
		var response = {};

		User.find({userID : req.body.userID}, function(err, data){
			if(err){
				response = {
					"error" : true,
					"message" : "Error fetching data"
				};
				res.json(response);
			} else if(data.length === 0){
				
				var user = new User();
				user.userID = req.body.userID;
				user.name = req.body.name;
				user.email = req.body.email;

				user.save(function(err) {
					console.log('saving '+user);
					if(err){
						response = {"error" : true,"message" : err};
					} else{
						console.log('SAVE SUCCESS');
						response = {
							"error" : false,
							"newUser" : true,
							"message" : "New user"
						};
					}
					res.json(response);
				});

			} else {
				response = {
					"error" : false,
					"newUser" : false,
					"message" : "Existing user"
				};
				res.json(response);
			}
		});
	});


router.route('/users')
	//create a user
	.post(function(req, res){
		var response = {};

		var user = new User();
		user.userID = req.body.userID;
		user.name = req.body.name;
		user.email = req.body.email;

		user.save(function(err) {
			if(err){
				response = {"error" : true,"message" : err};
			} else{
				response = {"error" : false,"message" : "data posted!"};
			}
			res.json(response);
		});
	})
	//get all users
	.get(function(req, res){
		console.log('get all users');
		var response = {};
		User.find({},function(err, users){
			if(err){
				response = {"error" : true,"message" : "Error fetching data"};
			} else{
				response = {"error" : false,"message" : users};
			}
			res.json(response);
		});
	});

router.route('/users/:user_id')
	
	.get(function(req, res){
		var response = {};

		User.find({userID : req.params.user_id}, function(err, data){
			if(err){
				response = {
					"error" : true,
					"message" : "Error fetching data"
				};
			} else if(data.length === 0){
				response = {
					"error" : false,
					"found" : false,
					"message" : "no data"
				};
			} else{
				response = {
					"error" : false,
					"found" : true,
					"message" : data
				};
			}
			res.json(response);
		});});
	//todo delete
	//todo put


router.route('/friendrequest')
	//create a friendrequest
	.post(function(req, res){
		console.log('made it to friendrequest post');
		var response = {};

		var friendReq = new FriendRequest();
		friendReq.requester = req.body.requester;
		friendReq.requestee = req.body.requestee;
		friendReq.requestDate = Date.now();
		friendReq.requesteeAlerted = false;
		friendReq.status = "pending";

		friendReq.save(function(err, request) {
			if(err){
				response = {"error" : true,"message" : err};
			} else{
				response = {"error" : false,"message" : request.id};
			}
			res.json(response);
		});});

router.route('/friendrequest/:direction/:user_object_id')
	.get(function(req, res){
		var response = {};

		if(req.params.direction === 'incoming'){
			FriendRequest.find({requestee : req.params.user_object_id}, function(err, data){
				if(err){
					response = {
						"error" : true,
						"message" : "Error fetching data"
					};
				} else if(data.length === 0){
					response = {
						"error" : false,
						"found" : false,
						"message" : "no data"
					};
				} else{
					response = {
						"error" : false,
						"found" : true,
						"message" : data
					};
				}
				res.json(response);
			});
		}

		else{
			FriendRequest.find({requester : req.params.user_object_id}, function(err, data){
				if(err){
					response = {
						"error" : true,
						"message" : "Error fetching data"
					};
				} else if(data.length === 0){
					response = {
						"error" : false,
						"found" : false,
						"message" : "no data"
					};
				} else{
					response = {
						"error" : false,
						"found" : true,
						"message" : data
					};
				}
				res.json(response);
			});
		}});


router.route('/friendship')
	//create a friendship
	.post(function(req, res){
		var response = {};

		var friendReq = new FriendRequest();
		friendReq.requester = req.body.requester;
		friendReq.requestee = req.body.requestee;
		friendReq.requestDate = Date.now;
		friendReq.status = "pending";

		friendReq.save(function(err) {
			if(err){
				response = {"error" : true,"message" : err};
			} else{
				response = {"error" : false,"message" : "data posted!"};
			}
			res.json(response);
		});
	});

router.route('/friendship/:user_object_id')
	.get(function(req, res){
		var response = {};

		Friendship.find( { $or:[ {'requester':req.params.user_id}, {'requestee':req.params.user_id}]}, function(err, data){
    		if(err){
				response = {
					"error" : true,
					"message" : "Error fetching data"
				};
			} else{
				response = {
					"error" : false,
					"found" : true,
					"message" : data
				};
			}
			res.json(response);
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /
//app.use('/', router);
app.use('/',router);

// START THE SERVER
// =============================================================================
app.listen(3000);