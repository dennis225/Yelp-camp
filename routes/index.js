var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/", function(req, res){
	res.render("landing");
});


///===================
//AUTH ROUTES
///===================

//show register forms
router.get("/register", function(req, res){
	res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Yelp Camp"+user.username);
			res.redirect("/campground");
		});
	});
});

//show login form
router.get("/login", function(req, res){
	res.render("login");
});

// handling login logic
router.post("/login", passport.authenticate("local", {
	successRedirect:"/campground",
	failureRedirect: "/login"
}),function(req, res){
	
});

//logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!!");
	res.redirect("/campground");
});


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;