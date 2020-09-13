var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Camp_model = require("./models/campground");
var Comment = require("./models/comment");
var methodOverride = require("method-override");
var seedDB = require("./seeds"),
	passport = require("passport"),
	flash = require("connect-flash"),
	LocalStrategy = require("passport-local"),
	User = require("./models/user");


var commentsRoute  = require("./routes/comments"),
	campgroundsRoute = require("./routes/campgrounds"),
	indexRoute = require("./routes/index");	

 // seedDB();
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.use(flash());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//link css file
app.use(express.static(__dirname+"/public"));
//--mongodb setup
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

//PASSPORT CONFIG
app.use(require("express-session")({
	secret: "This the password protector",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());


//Responsible for reading the session and taking data from the session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware
app.use(function(req, res, next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	//whatever we put in locals will be available in 
	res.locals.currentUser = req.user;
	//next to move on to other code 
	next()

	
});


//Connect app with routes
app.use(commentsRoute);
app.use(campgroundsRoute);
app.use(indexRoute);

//--SCHEMA SETUP in models/campgrounds.js

//----create a model and add to db
// Camp_model.create({ name: "camp ground", image: "https://images.unsplash.com/photo-1487088678257-3a541e6e3922?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=967&q=80",description: "This is the first picture of the campgrounds" }, function(err, camp){
// 		if(err){
// 			console.log("error");
// 		}else{
// 			console.log("success");
// 			console.log(camp);
// 		}
// });


     
app.listen(3000, function(){
	console.log("Server has started at port 3000");
});