var express = require("express");
var router = express.Router();
var Camp_model = require("../models/campground");
var middleware = require("../middleware/index.js");


//INDEX	 /campground        GET	  shows all camp info
router.get("/campground", function(req, res){
	// res.render("campground",{campgrounds:campgrounds});
	// render from db using .find
	Camp_model.find({}, function(err, allCamp){
		if(err){
			console.log("error occured");
		}else{
			res.render("campgrounds/index", {campgrounds:allCamp, currentUser: req.user});
		}
	});
});


//CREATE  /campground        POST	Add new camps to db 
router.post("/campground", middleware.isLoggedIn, function(req, res){
	// get data and add it to campgrounds array
	//redirect to campgrounds page
	//use postman if post route is working or not
	//npm install body-parser
	var name= req.body.name;
	var image = req.body.image;
	var description = req.body.description;
	//newly added author
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCamp = {name:name, image: image, description:description, author:author};
	// console.log(req.user);
	
	// campgrounds.push(newCamp);
	//add to db using create
	Camp_model.create(newCamp, function(err, camp){
		if(err){
			console.log("error adding new camp");
		}else{
			console.log("success added a new camp");
			// console.log(camp);
		}
	});
	req.flash("success", "Sucessfully added a Campground!")
	res.redirect("/campground");
});


//NEW  /campground/new     GET   Dispalys the form to create new
router.get("/campground/new", middleware.isLoggedIn,function(req, res){
	res.render("campgrounds/new");
});


//SHOW /campground/:id    GET    show info when clicked
//possible bug campground/:id should be decleared after all the methods
router.get("/campground/:id", function(req, res){
	//find the campground id - req.params.id
	Camp_model.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
			console.log("error in show route");
		}else{
			res.render("campgrounds/show", {campground:foundCamp});
		}
	});
	
});


//EDIT campground route
router.get("/campground/:id/edit", middleware.checkCampOwnership ,function(req, res){
	//Is the user logged in
		//if user owns the post edit
		//otherwise redirect
	//if not logged in redirect somewhere
	if(req.isAuthenticated()){
		Camp_model.findById(req.params.id, function(err, foundCamp){
			res.render("campgrounds/edit",{campground:foundCamp});

		});
	}
});

//UPDATE campground route
router.put("/campground/:id", middleware.checkCampOwnership ,function(req, res){
	//find camp with id and update
	//redirect to the campground
	Camp_model.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCamp){
		if(err){
			console.log("error");
			// res.redirect("/campground");
		}else{
			res.redirect("/campground/"+req.params.id);
		}
	});
});

//DESTROY campground router
router.delete("/campground/:id", middleware.checkCampOwnership,function(req, res){
	Camp_model.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campground");
		}else{
			res.redirect("/campground");
		}
	});
});


// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }


// function checkCampOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 		Camp_model.findById(req.params.id, function(err, foundCamp){
// 			if(err){
// 				res.redirect("back");
// 			}else{
// 				if(foundCamp.author.id.equals(req.user._id)){
// 					return next()
// 				}else{
// 					res.redirect("back");
// 				}
				
// 			}
// 		});
// 	}else{
// 		res.redirect("back")
// 	}
// }


module.exports = router;