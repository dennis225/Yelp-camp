var Camp_model = require("../models/campground");
var Comment = require("../models/comment");


var middlewareObj = {};

middlewareObj.checkCampOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Camp_model.findById(req.params.id, function(err, foundCamp){
			if(err){
				req.flash("error", "Campground not found!!");
				res.redirect("back");
			}else{
				if(foundCamp.author.id.equals(req.user._id)){
					return next()
				}else{
					req.flash("error", "Permission Denied!!");
					res.redirect("back");
				}
				
			}
		});
	}else{
		req.flash("error", "You Need to Login First!!");
		res.redirect("back")
	}
}


middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			}else{
				if(foundComment.author.id.equals(req.user._id)){
					return next()
				}else{
					req.flash("error", "Permission Denied!!");
					res.redirect("back");
				}
				
			}
		});
	}else{
		req.flash("error", "You Need to Login First!!");
		res.redirect("back")
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		req.flash("error", "Please Login First!");
		res.redirect("/login");
}


module.exports = middlewareObj;