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

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
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
		});
	});
	//todo delete
	//todo put

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
					console.log('inner response: '+response);
					res.json(response);
				});

			} else {
				response = {
					"error" : false,
					"newUser" : false,
					"message" : "Existing user"
				};
				console.log(data[0]);
				res.json(response);
			}
			console.log('response: '+response);
			
		});
	});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
//app.use('/api', router);
app.use('/',router);

// START THE SERVER
// =============================================================================
app.listen(3000);