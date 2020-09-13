var express = require("express");
var router = express.Router();
var Camp_model = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");


//====================
//COMMENT ROUTES
//====================
router.get("/campground/:id/comments/new", middleware.isLoggedIn,function(req, res){
	Camp_model.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:campground});
		}
	});
});

//COMMENT CREATE
router.post("/campground/:id/comments", middleware.isLoggedIn,function(req, res){
	//lookup campground using ID
	Camp_model.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", "Something went wrong!!");
			res.redirect("/campground");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				}else{
					//look at readme 
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment!");
					res.redirect("/campground/"+campground._id);
				}
			})
		}
	});
	//create a new comments
	//connect new comment to campground
	//redirect to campground show page
});


//EDIT route for comments
router.get("/campground/:id/comments/:comment_id/edit", function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{campground_id:req.params.id, comment: foundComment});
		}
	});
	
});


//UPDATE COMMENT
router.put("/campground/:id/comments/:comment_id", middleware.checkCommentOwnership,function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		}else{
			res.redirect("/campground/"+ req.params.id);
		}
	});
});

//COMMENT DESTROY ROUTE
router.delete("/campground/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
	//findByIdAndRemove
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("back");
		}else{
			req.flash("success", "Comment Deleted!");
			res.redirect("/campground/"+req.params.id);
		}
	});
});

// function checkCommentOwnership(req, res, next){
// 	if(req.isAuthenticated()){
// 		Comment.findById(req.params.comment_id, function(err, foundComment){
// 			if(err){
// 				res.redirect("back");
// 			}else{
// 				if(foundComment.author.id.equals(req.user._id)){
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

// function isLoggedIn(req, res, next){
// 	if(req.isAuthenticated()){
// 		return next();
// 	}
// 	res.redirect("/login");
// }

module.exports = router;