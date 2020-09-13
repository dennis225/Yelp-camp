v2 RESTful routes

name         url             verb            desc
==========================================================
INDEX	 /campground        GET	  shows all camp info
NEW      /campgroun/new     GET   Dispalys the form
CREATE	 /campground        POST	Add new camps to db 
SHOW     /campground/:id    GET    show info when clicked
==========================================================
# Refactor mongoose code
1.Create a models dir
2.creata file models/campground.js and use module.exports 
3.use require to include the model
=====================================================
creating a seeds file to populate it with dummy comments
1. Add a seeds.js file
2. Run the seeds file every time the server starts
by exporting seedDB from seeds.js and calling the method to start it.

Also create a comment model and export it and require it in app.js

we are using .populate("comments").exec to get the comments for specific posts
 
 change it in the SHOW route and show.ejs page
 
 Camp_model.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(err){
==========================================================
Comment New/Create
1.Discuss nested routes.
2.Add the comment new and create routes.
3.Add a new comment form.

Our end goal is to have comments button in every show post page to push the comments we can use the same campground route but it has to be nested 

NEW        campgrounds/:id/comments/new   GET
CREATE     campgrounds/:id/comments       POST


now make nested routes and make two folders inside the views - campground and comment. Drag the previous files into campground and create new for commnets

Also use ../ infront of header and footer as the files are moved inside campgrounds and comments folders 

make get request for making new template page
==========================================================
Styling the comments page

Add a side bar to show page
display comments nicely
==========================================================
for custom style sheets make public directory in app.js folder

1.touch public/stylesheets/main.css
2.Add something in css file
3.//link css file in app.js
app.use(express.static(__dirname+"/public"));
==========================================================
Authentication
1. Install all packages need for Authentication
npm install passport passport-local passport-local-mongoose express-session --save
2. add these in app.js
passport = require("passport"),
LocalStrategy = require("passport-local"),
User = require("./models/user");

3. create user.js - create a model and incluce passport plugin
------
4. Register
config passport
add register routes
add register template

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

4. create login form and make method POST
5. add this in app.js

///===================
//AUTH ROUTES
///===================

//show register forms
app.get("/register", function(req, res){
	res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			res.redirect("/campground");
		});
	});
});

6. Now make changes allow only logged in users to comment
we need to add middleware for this- implement a function 

function isLoggedIn(res, req, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
use this function whenever we need to only when logged in

7. show only login and sigup before login and only logout after sign in

we can pass req.user to see if user is logged  or not qqq
=========================================================
1. Refactor the code
split campground routes, comment, authentication routes into 3 files and require them 
mkdir routes
touch routes/campground.js comments.js index.js

copy the routes sepcific to the names
1. var express = require("express");
   var router = express.Router();
   and replace app. with router.

2. module.exports = router;

3. In app.js 
	var commentRoute = require("./routes/comments");
	app.use(commentRoute);
	
4. place middleware before app.use(ROUTES); 
//middleware
app.use(function(req, res, next){
	//whatever we put in locals will be available in 
	res.locals.currentUser = req.user;
	//next to move on to other code 
	next()
	
});


//Connect app with routes
app.use(commentsRoute);
app.use(campgroundsRoute);
app.use(indexRoute);
========================================================
Now Users+comments
1. Save author's name automatically by using the name and modify the User Model

//Schema setup
var comment_schema = mongoose.Schema({
	text:String,
	author:{
		id:{
			type:mongoose.Schema.Types.ObjectId,
			ref:"User"
		},
		username:String
	}
});

//look at readme 
comment.author.id = req.user._id;
comment.author.username = req.user.username;
comment.save();
2.make changes in show.ejs as well
========================================================
1. Only signed in can create and comment
2. Add owner name and id to the post 
YelpCamp: Cleaning Up
for adding middleware and displaying author names and comment names automatically
=========================================================
EDITING campground

Add Method-Override
Add Edit Route for Campgrounds
Add Link to Edit Page
Add Update Route

1. npm install method-override --save
2. In app.js methodOverride = require("method-override");
3. app.use(methodOverride("_method"));
 //EDIT campground route
router.get("/campground/:id/edit", function(req, res){
	Camp_model.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/edit",{campground:foundCamp});
		}
	});
	
});

and make edit.ejs file and form line should contain this
<form action= "/campground/<%=campground._id%>/?_method=PUT" method="POST">

2. to show the previous name and text replace placeholder with value.

3. //UPDATE campground route and refer to edit.ejs
router.put("/campground/:id", function(req, res){
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

4. <a class="btn btn-warning"href="/campground/<%=campground._id%>/edit">Edit</a>
end
=========================================================
1 DELETE route

2. //DESTROY campground router
router.delete("/campground/:id", function(req, res){
	Camp_model.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/campground");
		}else{
			res.redirect("/campground");
		}
	});
});

3. <form action="/campground/<%=campground._id%>?_method=DELETE" method="POST">
						<button class="btn btn-danger">
							Delete
						</button>
					</form>

4. to make form inline- include in public/stylesheets/main.css
	 #delete-form{
		display:inline;
	 }
aa
=========================================================
#Authorization Part 1: Campgrounds

1. //User can only edit his/her campgrounds
 
function checkOwnership(req, res, next){
	if(req.isAuthenticated()){
		Camp_model.findById(req.params.id, function(err, foundCamp){
			if(err){
				res.redirect("back");
			}else{
				if(foundCamp.author.id.equals(req.user._id)){
					return next()
				}else{
					res.redirect("back");
				}
				
			}
		});
	}else{
		res.redirect("back")
	}
}

2. //EDIT campground route
router.get("/campground/:id/edit", checkOwnership ,function(req, res){
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

User can only delete his/her campgrounds
Hide/Show edit and delete buttons
<!-- only owner of campground can see edit/delete -->
					<%if(currentUser && campground.author.id.equals(currentUser._id)){%>
						<a class="btn btn-warning"href="/campground/<%=campground._id%>/edit">Edit</a>
						<form id="delete-form" action="/campground/<%=campground._id%>?_method=DELETE" method="POST">
							<button class="btn btn-danger">
								Delete
							</button>
						</form>
					<%}%>
end
=========================================================
#Editing Comments

Add Edit route for comments
Add Edit button
Add Update route

we need to use nested routes
refer to comments.js and edit.js for comments
=========================================================
Campground Edit Route: Comment Edit Route:

#Deleting Comments

Add Destroy route
Add Delete button
=========================================================
Middleware refactor
touch middleware/index.js


1. function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
2. isLogged is moved from comments.js and
   index.js will have

middlewareObj.isLoggedIn = function(req, res, next){
		if(req.isAuthenticated()){
			return next();
		}
		res.redirect("/login");
}


module.exports = middlewareObj;
3. inlcude the files in campgrounds.js and comments.js
   var middleware = require("../middleware/index.js");
   and do middleware.isLogged as second argument
   
   and include these in middleware/index.js  
   var Camp_model = require("../models/campground");
   var Comment = require("../models/comment");
end	
=========================================================
For flash message alerts
1. npm install connect-flash --save
2. flash = require("connect-flash);
3. app.use(flash());

//middleware
app.use(function(req, res, next){
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	
4. <div class="container">
			<%if(error && error.length>0){%>
				<div class="alert alert-danger" role="alert">
					<%=error%>
				</div>
			<%}%>
			<%if(success && success.length>0){%>
				<div class="alert alert-success" role="alert">
					<%=success%>
				</div>
			<%}%>
		</div>
	
	
	