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

router.route('/users/:user_object_id')
	
	.get(function(req, res){
		var response = {};

		User.find({_id : req.params.user_object_id}, function(err, data){
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
					"message" : data[0]
				};
			}
			res.json(response);
		});});

router.route('/users/google/:user_id')
	
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
					"message" : data[0]
				};
			}
			res.json(response);
		});});
	//todo delete
	//todo put


router.route('/friendrequest')
	//create a friendrequest
	.post(function(req, res){
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
		});
	});

//get friendrequest by the objectid
router.route('/friendrequest/id/:request_id')
	.get(function(req, res){
		console.log('friendrequest/id called');
		var response = {};
		FriendRequest.find({_id: req.params.request_id}, function(err, data){
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
	})
	//action : reject/rescind (delete)/accept
	//requester: id
	//requestee: id
	//requestdate: date
	//requestid
	.put(function(req, res){
		console.log('put friendrequest called');
		var response = {};
		if(req.body.action === 'deny'){
			console.log('deny');
			FriendRequest.findByIdAndUpdate(req.params.request_id, {status: 'denied'}, function(err, data){
				if(err){
					response = {
						"error" : true,
						"message" : err
					};
				} else{
					response = {
						"error" : false,
						"message" : data
					};
				}
				res.json(response);
			});
		} else{
			console.log('accept or delete');
			FriendRequest.remove({_id: req.params.request_id}, function(err, data){
			if(err){
				response = {
					"error" : true,
					"message" : "Error fetching data"
				};
				res.json(response);
			} else{
				if(req.body.action === 'accept'){
					var friendship = new Friendship();
					friendship.requester = req.body.requester;
					friendship.requestee = req.body.requestee;
					friendship.requestDate = req.body.requestDate;
					friendship.acceptDate = Date.now();

					friendship.save(function(error, request) {
						if(error){
							response = {"error" : true,"message" : err};
						} else{
							response = {"error" : false,"message" : request};
						}
						res.json(response);
					});
				} else{

				}
			}
		});
		}
		
		
	});

//get all incoming or outgoing requests for a user
router.route('/friendrequest/:direction/:user_object_id')
	.get(function(req, res){
		var response = {};

		if(req.params.direction === 'incoming'){
			FriendRequest
			.find({requestee : req.params.user_object_id})
			.populate('requester')
			.exec(function(err, data){
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

//find request where the 'viewer' and 'viewee' of a user profile are the participants
router.route('/friendrequest/participants/:viewer_user_object_id/:viewee_user_object_id')
	.get(function(req, res){
		console.log('get friend request by participants');
		console.log('viewer = '+req.params.viewer_user_object_id);
		console.log('viewee = '+req.params.viewee_user_object_id);
		var response = {};

		FriendRequest.find( { 
		    $and : [
		        { $or:[ {'requester':req.params.viewer_user_object_id}, {'requestee':req.params.viewer_user_object_id}]},
		        { $or:[ {'requester':req.params.viewee_user_object_id}, {'requestee':req.params.viewee_user_object_id}]}
		    ]
		}, function(err, data){
    		if(err){
				response = {
					"error" : true,
					"message" : err
				};
			} else if(data.length ===  0){
				response = {
					"error" : false,
					"found" : false,
					"message" : "No data"
				};
			}
			else{
				console.log(data);
				response = {
					"error" : false,
					"found" : true,
					"message" : data
				};
			}
			res.json(response);
		});
		
	});


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